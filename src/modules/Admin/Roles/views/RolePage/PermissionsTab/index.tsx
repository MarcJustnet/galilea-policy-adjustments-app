import Loader from "@/components/layouts/Loader"
import type { Permission } from "@/core/types/models/permission.model"
import Message from "@/core/ui-components/Message"
import { PermissionsService } from "@/modules/Admin/Permissions/service"
import { Icons } from "@justnetsystems/ui-icons"
import { toast } from "@justnetsystems/ui-toast"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { RolesService } from "../../../service"

interface PermissionsTabProps {
    roleId: number
}

type FeatureWithPermissions = PermissionsService.GetListToAssign.Response['data'][0]

interface PendingChanges {
    toAdd: Set<number>
    toRemove: Set<number>
}

const PermissionsTab: React.FC<PermissionsTabProps> = ({ roleId }) => {
    const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(new Set())
    const [pendingChanges, setPendingChanges] = useState<PendingChanges>({ toAdd: new Set(), toRemove: new Set() })
    const [searchTerm, setSearchTerm] = useState('')
    const [hoveredFeature, setHoveredFeature] = useState<FeatureWithPermissions | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    // Obtener todos los features con permisos
    const { data: featuresData, isLoading: isLoadingFeatures } = useQuery({
        queryKey: ['permissions', 'features'],
        queryFn: async () => {
            const response = await PermissionsService.GetListToAssign()
            return response.data.data
        }
    })

    // Obtener permisos asignados al rol
    const { data: assignedData, isLoading: isLoadingAssigned, refetch } = useQuery({
        queryKey: ['roles', roleId, 'permissions'],
        queryFn: async () => {
            const response = await RolesService.GetPermissions(roleId)
            return response.data.permissions
        },
        enabled: roleId > 0
    })

    useEffect(() => {
        if (assignedData) {
            setSelectedPermissions(new Set(assignedData.map(p => p.id)))
            // Limpiar cambios pendientes cuando se actualizan los datos
            setPendingChanges({ toAdd: new Set(), toRemove: new Set() })
        }
    }, [assignedData])

    // Función recursiva para obtener todos los features (incluyendo hijos)
    const getAllFeatures = (features: FeatureWithPermissions[]): FeatureWithPermissions[] => {
        const result: FeatureWithPermissions[] = []
        features.forEach(feature => {
            result.push(feature)
            if (feature.children && feature.children.length > 0) {
                result.push(...getAllFeatures(feature.children))
            }
        })
        return result
    }

    // Función para determinar el estado de un permiso
    const getPermissionStatus = (permissionId: number): 'assigned' | 'to-add' | 'to-remove' | 'unassigned' => {
        const isCurrentlyAssigned = selectedPermissions.has(permissionId)
        const isPendingAdd = pendingChanges.toAdd.has(permissionId)
        const isPendingRemove = pendingChanges.toRemove.has(permissionId)

        if (isPendingAdd) return 'to-add'
        if (isPendingRemove) return 'to-remove'
        if (isCurrentlyAssigned) return 'assigned'
        return 'unassigned'
    }

    // Función para obtener el estado efectivo (con cambios pendientes aplicados)
    const isEffectivelyAssigned = (permissionId: number): boolean => {
        const status = getPermissionStatus(permissionId)
        return status === 'assigned' || status === 'to-add'
    }

    // Filtrar features por término de búsqueda
    const filteredFeatures = featuresData ? getAllFeatures(featuresData).filter(feature =>
        feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.permissions.some(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.code.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ) : []

    // Calcular total de permisos
    const totalPermissions = filteredFeatures.reduce((acc, feature) => acc + feature.permissions.length, 0)

    const handleTogglePermission = (permissionId: number) => {
        const isCurrentlyAssigned = selectedPermissions.has(permissionId)
        const isPendingAdd = pendingChanges.toAdd.has(permissionId)
        const isPendingRemove = pendingChanges.toRemove.has(permissionId)

        setPendingChanges(prev => {
            const newToAdd = new Set(prev.toAdd)
            const newToRemove = new Set(prev.toRemove)

            if (isPendingAdd) {
                // Si estaba pendiente de añadir, cancelamos ese cambio
                newToAdd.delete(permissionId)
            } else if (isPendingRemove) {
                // Si estaba pendiente de quitar, cancelamos ese cambio
                newToRemove.delete(permissionId)
            } else if (isCurrentlyAssigned) {
                // Si está asignado, lo marcamos para quitar
                newToRemove.add(permissionId)
            } else {
                // Si no está asignado, lo marcamos para añadir
                newToAdd.add(permissionId)
            }

            return { toAdd: newToAdd, toRemove: newToRemove }
        })
    }

    const handleToggleAllFeaturePermissions = (feature: FeatureWithPermissions) => {
        const featurePermissionIds = feature.permissions.map(p => p.id)
        // Verificar si todos estarían asignados después de aplicar cambios pendientes
        const allEffectivelyAssigned = featurePermissionIds.every(id => isEffectivelyAssigned(id))

        setPendingChanges(prev => {
            const newToAdd = new Set(prev.toAdd)
            const newToRemove = new Set(prev.toRemove)

            featurePermissionIds.forEach(id => {
                const isCurrentlyAssigned = selectedPermissions.has(id)

                // Primero, limpiamos cualquier cambio pendiente para este permiso
                newToAdd.delete(id)
                newToRemove.delete(id)

                if (allEffectivelyAssigned) {
                    // Si todos están efectivamente asignados, marcar para quitar
                    if (isCurrentlyAssigned) {
                        newToRemove.add(id)
                    }
                    // Si no está asignado, no hacemos nada (ya no está en pendientes)
                } else {
                    // Si no todos están asignados, marcar para añadir los que no lo están
                    if (!isCurrentlyAssigned) {
                        newToAdd.add(id)
                    }
                    // Si ya está asignado, no hacemos nada
                }
            })

            return { toAdd: newToAdd, toRemove: newToRemove }
        })
    }

    const handleConfirmChanges = async () => {
        const idsToAdd = Array.from(pendingChanges.toAdd)
        const idsToRemove = Array.from(pendingChanges.toRemove)

        if (idsToAdd.length === 0 && idsToRemove.length === 0) {
            toast.error('No hay cambios pendientes')
            return
        }

        setIsSaving(true)
        try {
            const promises: Promise<any>[] = []

            if (idsToAdd.length > 0) {
                promises.push(RolesService.AddPermissions(roleId, idsToAdd))
            }

            if (idsToRemove.length > 0) {
                promises.push(RolesService.RemovePermissions(roleId, idsToRemove))
            }

            await Promise.all(promises)
            await refetch()

            toast.success(`Cambios aplicados: ${idsToAdd.length} añadidos, ${idsToRemove.length} eliminados`)
        } catch (error) {
            console.error('Error applying changes:', error)
            toast.error('Error al aplicar los cambios')
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancelChanges = () => {
        setPendingChanges({ toAdd: new Set(), toRemove: new Set() })
    }

    if (isLoadingFeatures || isLoadingAssigned) {
        return (
            <div className="assignment assignment--loading">
                <Loader />
            </div>
        )
    }

    if (!featuresData) {
        return (
            <div className="assignment__error">
                <Message type="warning" message="No se pudieron cargar los permisos" />
            </div>
        )
    }

    return (
        <div className="assignment">
            {/* Barra de búsqueda */}
            <div className="assignment__search">
                <input
                    type="text"
                    className="form__input"
                    placeholder="Buscar features o permisos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Layout de dos columnas */}
            <div className="assignment__layout">
                {/* Columna izquierda - Lista de Features */}
                <div className="assignment__list">
                    <h3 className="assignment__list-header">
                        Módulos ({filteredFeatures.length})
                    </h3>

                    <div className="assignment__list-items">

                        {filteredFeatures.map((feature) => {
                            const featurePermissionIds = feature.permissions.map(p => p.id)
                            const totalCount = featurePermissionIds.length

                            // Contar por estado
                            const effectivelyAssignedCount = featurePermissionIds.filter(id => isEffectivelyAssigned(id)).length
                            const toAddCount = featurePermissionIds.filter(id => pendingChanges.toAdd.has(id)).length
                            const toRemoveCount = featurePermissionIds.filter(id => pendingChanges.toRemove.has(id)).length

                            const allEffectivelyAssigned = totalCount > 0 && effectivelyAssignedCount === totalCount
                            const someEffectivelyAssigned = effectivelyAssignedCount > 0 && effectivelyAssignedCount < totalCount
                            const hasPendingChanges = toAddCount > 0 || toRemoveCount > 0
                            const isHovered = hoveredFeature?.id === feature.id

                            // Determinar clase de estado
                            let stateClass = ''
                            let IconComponent = null

                            if (hasPendingChanges) {
                                if (toAddCount > 0 && toRemoveCount === 0) {
                                    stateClass = 'assignment__list-item--pending-add'
                                    IconComponent = Icons.Plus
                                } else if (toRemoveCount > 0 && toAddCount === 0) {
                                    stateClass = 'assignment__list-item--pending-remove'
                                    IconComponent = Icons.Minus
                                } else {
                                    stateClass = 'assignment__list-item--pending-mixed'
                                    IconComponent = Icons.Pencil
                                }
                            } else if (allEffectivelyAssigned) {
                                stateClass = 'assignment__list-item--assigned'
                                IconComponent = Icons.Check
                            } else if (someEffectivelyAssigned) {
                                stateClass = 'assignment__list-item--partial'
                                IconComponent = Icons.Minus
                            }

                            const hoveredClass = isHovered ? 'assignment__list-item--hovered' : ''

                            return (
                                <div
                                    key={feature.id}
                                    className={`assignment__list-item ${stateClass} ${hoveredClass}`}
                                    onMouseEnter={() => setHoveredFeature(feature)}
                                    onClick={() => totalCount > 0 && handleToggleAllFeaturePermissions(feature)}
                                >
                                    <div className="assignment__list-item__content">
                                        <div className="assignment__list-item__title">
                                            {feature.name}
                                        </div>
                                        {totalCount > 0 && (
                                            <div className="assignment__list-item__subtitle">
                                                {effectivelyAssignedCount} / {totalCount} permisos
                                                {hasPendingChanges && (
                                                    <span className="assignment__list-item__counter">
                                                        ({toAddCount > 0 && `+${toAddCount}`}{toAddCount > 0 && toRemoveCount > 0 && ' '}{toRemoveCount > 0 && `-${toRemoveCount}`})
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {IconComponent && (
                                        <IconComponent className="assignment__list-item__icon" />
                                    )}
                                </div>
                            )
                        })}

                        {filteredFeatures.length === 0 && (
                            <div className="assignment__list-empty">
                                No se encontraron features
                            </div>
                        )}
                    </div>
                </div>

                {/* Columna derecha - Permisos del Feature Seleccionado */}
                <div className="assignment__details">
                    {hoveredFeature ? (
                        <>
                            <h3 className="assignment__details-header">
                                {hoveredFeature.name} - Permisos ({hoveredFeature.permissions.length})
                            </h3>

                            <div className="assignment__details-items">
                                {hoveredFeature.permissions.map((permission: Permission) => {
                                    const status = getPermissionStatus(permission.id)
                                    const isEffectivelyChecked = status === 'assigned' || status === 'to-add'

                                    // Determinar clase de estado
                                    let stateClass = ''
                                    let IconComponent = null

                                    switch (status) {
                                        case 'assigned':
                                            stateClass = 'assignment__details-item--assigned'
                                            IconComponent = Icons.Check
                                            break
                                        case 'to-add':
                                            stateClass = 'assignment__details-item--pending-add'
                                            IconComponent = Icons.Plus
                                            break
                                        case 'to-remove':
                                            stateClass = 'assignment__details-item--pending-remove'
                                            IconComponent = Icons.Minus
                                            break
                                    }

                                    return (
                                        <div
                                            key={permission.id}
                                            className={`assignment__details-item ${stateClass}`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleTogglePermission(permission.id)
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isEffectivelyChecked}
                                                onChange={() => handleTogglePermission(permission.id)}
                                                className="assignment__details-item__checkbox"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <div className="assignment__details-item__content">
                                                <div className="assignment__details-item__title">
                                                    {permission.name}
                                                </div>
                                                <div className="assignment__details-item__code">
                                                    {permission.code}
                                                </div>
                                                {permission.description && (
                                                    <div className="assignment__details-item__description">
                                                        {permission.description}
                                                    </div>
                                                )}
                                            </div>
                                            {IconComponent && (
                                                <IconComponent className="assignment__details-item__icon" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {hoveredFeature.permissions.length === 0 && (
                                <div className="assignment__details-empty">
                                    Este feature no tiene permisos
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="assignment__details-empty">
                            Pasa el ratón sobre un feature para ver sus permisos
                        </div>
                    )}
                </div>
            </div>

            {/* Resumen y Cambios Pendientes */}
            <div className="assignment__summary">
                {/* Resumen básico */}
                <div className="assignment__summary-info">
                    <div className="assignment__summary-info__text">
                        <strong>{selectedPermissions.size}</strong> de <strong>{totalPermissions}</strong> permisos asignados actualmente
                    </div>
                </div>

                {/* Listado de cambios pendientes */}
                {(pendingChanges.toAdd.size > 0 || pendingChanges.toRemove.size > 0) && (
                    <div className="assignment__changes">
                        <h4 className="assignment__changes-header">
                            <Icons.TriangleExclamation className="assignment__changes-header__icon" />
                            Cambios Pendientes
                        </h4>

                        <div className="assignment__changes-grid">
                            {/* Permisos a añadir */}
                            {pendingChanges.toAdd.size > 0 && (
                                <div className="assignment__changes-column">
                                    <div className="assignment__changes-column__header assignment__changes-column__header--add">
                                        <Icons.Plus className="assignment__changes-column__header__icon" />
                                        A Añadir ({pendingChanges.toAdd.size})
                                    </div>
                                    <div className="assignment__changes-list assignment__changes-list--add">
                                        {Array.from(pendingChanges.toAdd).map(permId => {
                                            const permission = featuresData
                                                ?.flatMap(f => getAllFeatures([f]))
                                                .flatMap(f => f.permissions)
                                                .find(p => p.id === permId)
                                            return permission ? (
                                                <div key={permId} className="assignment__changes-item assignment__changes-item--add">
                                                    <div className="assignment__changes-item__title">{permission.name}</div>
                                                    <div className="assignment__changes-item__code">{permission.code}</div>
                                                </div>
                                            ) : null
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Permisos a quitar */}
                            {pendingChanges.toRemove.size > 0 && (
                                <div className="assignment__changes-column">
                                    <div className="assignment__changes-column__header assignment__changes-column__header--remove">
                                        <Icons.Minus className="assignment__changes-column__header__icon" />
                                        A Quitar ({pendingChanges.toRemove.size})
                                    </div>
                                    <div className="assignment__changes-list assignment__changes-list--remove">
                                        {Array.from(pendingChanges.toRemove).map(permId => {
                                            const permission = featuresData
                                                ?.flatMap(f => getAllFeatures([f]))
                                                .flatMap(f => f.permissions)
                                                .find(p => p.id === permId)
                                            return permission ? (
                                                <div key={permId} className="assignment__changes-item assignment__changes-item--remove">
                                                    <div className="assignment__changes-item__title">{permission.name}</div>
                                                    <div className="assignment__changes-item__code">{permission.code}</div>
                                                </div>
                                            ) : null
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botones de acción */}
                        <div className="assignment__actions">
                            <button
                                onClick={handleCancelChanges}
                                disabled={isSaving}
                                className="button button--secondary"
                            >
                                Cancelar Cambios
                            </button>
                            <button
                                onClick={handleConfirmChanges}
                                disabled={isSaving}
                                className="button button--primary"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader />
                                        Aplicando...
                                    </>
                                ) : (
                                    <>
                                        <Icons.Check />
                                        Confirmar Cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Mensaje cuando no hay cambios pendientes */}
                {pendingChanges.toAdd.size === 0 && pendingChanges.toRemove.size === 0 && (
                    <div className="assignment__summary-empty">
                        No hay cambios pendientes. Selecciona permisos para añadir o quitar.
                    </div>
                )}
            </div>
        </div>
    )
}

export default PermissionsTab
