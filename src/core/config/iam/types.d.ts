// === types.ts ===

export interface FeaturesTree { [key: string]: symbol | FeaturesTree }
export interface PermissionsTree { [key: string]: string | PermissionsTree }

// Nuevo tipo para permisos
export interface InitPermission<C extends string = string> {
    code: C
    name: string
    errorCode: number
}

export interface InitFeatureConfig<
    K extends string,
    P extends readonly InitPermission[] = readonly InitPermission[]
> {
    code: K
    name: string
    description: string | null
    show: boolean
    permissions?: P
    children?: FeaturesMap
}

export type FeaturesMap = {
    [K in string]: InitFeatureConfig<K, readonly InitPermission[]>
}

export interface InitAppConfig<
    M extends string,
    P extends readonly InitPermission[],
    F extends FeaturesMap
> {
    code: M
    name: string
    description: string | null
    url: string
    isPublished: boolean
    permissions: P
    features: F
}

// --- Conversiones tipadas para autocompletado de permisos ---

type ExtractPermissionCodes<P extends readonly InitPermission[]> = P[number]['code']

type FeatureToTree<F extends InitFeatureConfig<string, readonly InitPermission[]>> =
    F extends InitFeatureConfig<string, infer Perms> ?
    F extends { children: infer Children } ?
    Children extends Record<string, InitFeatureConfig<string, readonly InitPermission[]>> ?
    // Si tiene children Y permisos
    { [P in ExtractPermissionCodes<Perms>]: symbol } &
    { [K in keyof Children]: FeatureToTree<Children[K]> }
    : // Si tiene children pero no es del tipo correcto (no debería pasar)
    { [P in ExtractPermissionCodes<Perms>]: symbol }
    : // Si NO tiene children, solo permisos
    { [P in ExtractPermissionCodes<Perms>]: symbol }
    : never

export type AppConfigToTree<
    P extends readonly InitPermission[],
    F extends FeaturesMap
> =
    // Permisos del nivel raíz de la app (usando solo el código)
    { [K in ExtractPermissionCodes<P>]: symbol } &
    // Procesar cada feature
    { [K in keyof F]: F[K] extends InitFeatureConfig<string, readonly InitPermission[]>
        ? FeatureToTree<F[K]>
        : never
    }

// Roles
export interface InitRole {
    code: string
    name: string
    description: string | null
    featureCode: string | null
    permissions: globalThis.IPermission[]
}