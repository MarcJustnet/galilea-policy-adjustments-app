import type { NewFormStoreProps, NewListStoreProps, NewTableStoreProps } from "./stores"
import { newFormSimpleStore, newFormStore, newListStore, newNavigationStore, newTableStore } from "./stores"

export interface BaseCrudStoreOptions<T extends { id: number }> {
    Table: NewTableStoreProps<T>
    List: NewListStoreProps<T>
    Form: NewFormStoreProps<T>
}

export const BaseCrudStore = <T extends { id: number }>(Options: Partial<BaseCrudStoreOptions<T>> = {}) => {
    class BaseCrudStoreClass {
        static Table = newTableStore<T>(Options.Table ?? {})
        static List = newListStore<T>(Options.List ?? {})
        static Form = newFormStore<T>(Options.Form ?? {})
        static FormSimple = newFormSimpleStore<T>(Options.Form ?? {})
        static Navigation = newNavigationStore<T>()
    }
    return BaseCrudStoreClass
}

export * from './stores'
export * from './auth'
export * from './types'