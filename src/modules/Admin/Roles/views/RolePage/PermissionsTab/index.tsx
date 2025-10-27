import Loader from "@/components/layouts/Loader"
import type { Permission } from "@/core/types/models/permission.model"
import Message from "@/core/ui-components/Message"
import { PermissionsService } from "@/modules/Admin/Permissions/service"
import { Icons } from "@justnetsystems/ui-icons"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { RolesService } from "../../../service"

interface PermissionsTabProps {
    roleId: number
}

type FeatureWithPermissions = PermissionsService.GetListToAssign.Response['data'][0]

const PermissionsTab: React.FC<PermissionsTabProps> = ({ roleId }) => {
    const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(new Set())
    const [searchTerm, setSearchTerm] = useState('')
    const [hoveredFeature, setHoveredFeature] = useState<FeatureWithPermissions | null>(null)

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

    const handleTogglePermission = async (permissionId: number) => {
        const isCurrentlyAssigned = selectedPermissions.has(permissionId)

        try {
            if (isCurrentlyAssigned) {
                await RolesService.RemovePermission(roleId, permissionId)
            } else {
                await RolesService.AddPermission(roleId, permissionId)
            }
            await refetch()
        } catch (error) {
            console.error('Error toggling permission:', error)
        }
    }

    const handleToggleAllFeaturePermissions = async (feature: FeatureWithPermissions) => {
        const featurePermissionIds = feature.permissions.map(p => p.id)
        const allAssigned = featurePermissionIds.every(id => selectedPermissions.has(id))

        try {
            if (allAssigned) {
                // Remover todos los permisos del feature
                await Promise.all(featurePermissionIds.map(id => RolesService.RemovePermission(roleId, id)))
            } else {
                // Añadir todos los permisos del feature
                await Promise.all(featurePermissionIds.map(id => RolesService.AddPermission(roleId, id)))
            }
            await refetch()
        } catch (error) {
            console.error('Error toggling feature permissions:', error)
        }
    }

    if (isLoadingFeatures || isLoadingAssigned) {
        return (
            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                <Loader />
            </div>
        )
    }

    if (!featuresData) {
        return (
            <div style={{ padding: '2rem' }}>
                <Message type="warning" message="No se pudieron cargar los permisos" />
            </div>
        )
    }

    return (
        <div className="permissions-tab" style={{ padding: '1.5rem' }}>
            {/* Barra de búsqueda */}
            <div style={{ marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    className="form__input"
                    placeholder="Buscar features o permisos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Layout de dos columnas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', minHeight: '400px' }}>
                {/* Columna izquierda - Lista de Features */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        maxHeight: '500px',
                        overflowY: 'auto',
                        paddingRight: '0.5rem'
                    }}
                >
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>
                        Features ({filteredFeatures.length})
                    </h3>

                    {filteredFeatures.map((feature) => {
                        const featurePermissionIds = feature.permissions.map(p => p.id)
                        const assignedCount = featurePermissionIds.filter(id => selectedPermissions.has(id)).length
                        const totalCount = featurePermissionIds.length
                        const allAssigned = totalCount > 0 && assignedCount === totalCount
                        const someAssigned = assignedCount > 0 && assignedCount < totalCount
                        const isHovered = hoveredFeature?.id === feature.id

                        return (
                            <div
                                key={feature.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.875rem',
                                    backgroundColor: isHovered ? '#f0f9ff' : allAssigned ? '#f0fdf4' : someAssigned ? '#fef3c7' : '#f9fafb',
                                    border: `1px solid ${isHovered ? '#3b82f6' : allAssigned ? '#86efac' : someAssigned ? '#fcd34d' : '#e5e7eb'}`,
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={() => setHoveredFeature(feature)}
                                onClick={() => totalCount > 0 && handleToggleAllFeaturePermissions(feature)}
                            >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        color: isHovered ? '#3b82f6' : '#1f2937',
                                        marginBottom: totalCount > 0 ? '0.25rem' : 0,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {feature.name}
                                    </div>
                                    {totalCount > 0 && (
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                            {assignedCount} / {totalCount} permisos
                                        </div>
                                    )}
                                </div>
                                {allAssigned && (
                                    <Icons.Check style={{ color: '#22c55e', fontSize: '1.25rem', flexShrink: 0 }} />
                                )}
                                {someAssigned && !allAssigned && (
                                    <Icons.Minus style={{ color: '#f59e0b', fontSize: '1.25rem', flexShrink: 0 }} />
                                )}
                            </div>
                        )
                    })}

                    {filteredFeatures.length === 0 && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                            No se encontraron features
                        </div>
                    )}
                </div>

                {/* Columna derecha - Permisos del Feature Seleccionado */}
                <div
                    style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.375rem',
                        padding: '1rem',
                        backgroundColor: '#fafafa',
                        maxHeight: '500px',
                        overflowY: 'auto'
                    }}
                >
                    {hoveredFeature ? (
                        <>
                            <h3 style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#1f2937',
                                marginBottom: '1rem',
                                paddingBottom: '0.75rem',
                                borderBottom: '1px solid #e5e7eb'
                            }}>
                                {hoveredFeature.name} - Permisos ({hoveredFeature.permissions.length})
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {hoveredFeature.permissions.map((permission: Permission) => {
                                    const isAssigned = selectedPermissions.has(permission.id)

                                    return (
                                        <div
                                            key={permission.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                padding: '0.75rem',
                                                backgroundColor: isAssigned ? '#f0fdf4' : '#ffffff',
                                                border: `1px solid ${isAssigned ? '#86efac' : '#e5e7eb'}`,
                                                borderRadius: '0.375rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleTogglePermission(permission.id)
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isAssigned}
                                                onChange={() => handleTogglePermission(permission.id)}
                                                style={{ marginRight: '0.75rem', marginTop: '0.125rem', flexShrink: 0 }}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                                    {permission.name}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
                                                    {permission.code}
                                                </div>
                                                {permission.description && (
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                                                        {permission.description}
                                                    </div>
                                                )}
                                            </div>
                                            {isAssigned && (
                                                <Icons.Check style={{ color: '#22c55e', fontSize: '1rem', flexShrink: 0, marginLeft: '0.5rem' }} />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {hoveredFeature.permissions.length === 0 && (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                                    Este feature no tiene permisos
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            color: '#94a3b8',
                            fontSize: '0.875rem',
                            textAlign: 'center',
                            padding: '2rem'
                        }}>
                            Pasa el ratón sobre un feature para ver sus permisos
                        </div>
                    )}
                </div>
            </div>

            {/* Resumen */}
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.375rem', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                    <strong>{selectedPermissions.size}</strong> de <strong>{totalPermissions}</strong> permisos asignados
                </div>
            </div>
        </div>
    )
}

export default PermissionsTab
