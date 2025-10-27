import type { PermissionPaths, ReplaceSymbolsWithStrings } from './permissions/lib'
import type {
    FeaturesMap,
    AppConfigToTree,
    InitAppConfig,
    InitFeatureConfig,
    InitPermission,
    FeaturesTree,
    PermissionsTree
} from './types'

export class IAM<
    M extends string,
    P extends readonly InitPermission<string>[],
    F extends FeaturesMap
> {
    private tree: AppConfigToTree<P, F>
    private appConfig: InitAppConfig<M, P, F>
    public permissions: ReplaceSymbolsWithStrings<Record<M, AppConfigToTree<P, F>>>
    public allPermissions: PermissionPaths<typeof this.permissions>[] = []

    constructor(appConfig: InitAppConfig<M, P, F>) {
        this.appConfig = appConfig
        this.tree = this.buildPermissionsTree() as AppConfigToTree<P, F>

        this.permissions = Object.freeze(
            this.getPermissions({ [this.appConfig.code]: this.tree })
        ) as ReplaceSymbolsWithStrings<Record<M, AppConfigToTree<P, F>>>

        this.allPermissions = this.getAllPermissions<typeof this.permissions>(this.permissions as PermissionsTree)
    }

    getPermissions(obj: FeaturesTree, path: string[] = []) {
        const permissions: PermissionsTree = {}
        for (const key in obj) {
            const value = obj[key]
            if (typeof value === 'object') permissions[key] = this.getPermissions(value, [...path, key])
            else permissions[key] = [...path, key].join('.')
        }
        return permissions
    }

    getAllPermissions<T>(obj: PermissionsTree, path: string[] = []) {
        const permissions: PermissionPaths<T>[] = []
        for (const key in obj) {
            const value = obj[key]
            if (typeof value === 'object') permissions.push(...this.getAllPermissions(value, [...path, key]))
            else permissions.push([...path, key].join('.') as PermissionPaths<T>)
        }
        return permissions
    }

    private buildPermissionsTree(): FeaturesTree {
        const tree: FeaturesTree = {}

        // App-level permissions
        if (this.appConfig.permissions) {
            for (const permission of this.appConfig.permissions) {
                tree[permission.code] = Symbol()
            }
        }

        // Recursive feature processing
        function processFeature<
            K extends string,
            P extends readonly InitPermission<string>[]
        >(feature: InitFeatureConfig<K, P>) {
            const featureNode: FeaturesTree = {}

            if (feature.permissions) {
                for (const permission of feature.permissions) {
                    featureNode[permission.code] = Symbol()
                }
            }

            if (feature.children) {
                for (const [childKey, childFeature] of Object.entries(feature.children)) {
                    featureNode[childKey] = processFeature(childFeature)
                }
            }

            return featureNode
        }

        for (const [featureKey, feature] of Object.entries(this.appConfig.features)) {
            tree[featureKey] = processFeature(feature)
        }

        return tree
    }
}

export function defineAppConfig<
    const M extends string,
    const P extends readonly InitPermission<string>[],
    const F extends FeaturesMap
>(config: InitAppConfig<M, P, F>) {
    return config
}
