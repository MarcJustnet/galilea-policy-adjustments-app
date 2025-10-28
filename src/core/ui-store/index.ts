import type { KeyOfType } from "../types"

import type { NewFormStoreProps, NewListStoreProps, NewTableStoreProps } from "./stores"
import { newFormSimpleStore, newFormStore, newListStore, newNavigationStore, newTableStore } from "./stores"

export interface BaseCrudStoreOptions<T extends Record<K, number>, K extends KeyOfType<T, number> = KeyOfType<T, number>> {
    Table?: Omit<NewTableStoreProps<T, K>, 'idKey'>
    List?: Omit<NewListStoreProps<T, K>, 'idKey'>
    Form?: Omit<NewFormStoreProps<T, K>, 'idKey'>
    idKey?: K
}

export const BaseCrudStore = <T extends Record<K, number>, K extends KeyOfType<T, number> = KeyOfType<T, number>>(
    Options: BaseCrudStoreOptions<T, K> = {} as BaseCrudStoreOptions<T, K>
) => {
    class BaseCrudStoreClass {
        static Table = newTableStore<T, K>({ ...(Options.Table ?? {}), idKey: Options.idKey })
        static List = newListStore<T, K>({ ...(Options.List ?? {}), idKey: Options.idKey })
        static Form = newFormStore<T, K>({ ...(Options.Form ?? {}), idKey: Options.idKey })
        static FormSimple = newFormSimpleStore<T, K>({ ...(Options.Form ?? {}), idKey: Options.idKey })
        static Navigation = newNavigationStore<T, K>(Options.idKey)
    }
    return BaseCrudStoreClass
}

export * from './stores'
export * from './auth'
export * from './types'