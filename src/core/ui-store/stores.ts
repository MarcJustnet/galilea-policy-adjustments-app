import type { StateCreator } from "zustand"
import { create } from "zustand"
import type { PersistOptions } from 'zustand/middleware'
import { persist } from 'zustand/middleware'

import type { Orders } from "../types"

import { defaultOrder } from "./constants"
import { BaseStoreInitializers } from "./initializers"
import type { CrudStore, StoreError } from "./types"

export interface NewTableStoreProps<T> {
    baseOrder?: Orders<T>
}

export interface NewFormStoreProps<T> {
    rules?: Array<CrudStore.KeyRules<T>>
    initialData?: T
}

export interface NewTableInputsStoreProps<T> {
    baseOrder?: Orders<T>
    rules?: Array<CrudStore.KeyRules<T>>
}

export interface NewListStoreProps<T> {
    baseOrder?: Orders<T>
    filters?: Partial<T>
}

export const newStore = <T>(initializer: StateCreator<T, [], []>, persist_opions?: PersistOptions<T, unknown>) => (persist_opions && persist_opions.name) ? create<T>()(persist(initializer, persist_opions)) : create<T>()(initializer)

export const newTableStore = <T extends { id: number }, E extends StoreError = StoreError,>({
    baseOrder = defaultOrder<T>()
}: NewTableStoreProps<T>) => newStore<CrudStore.Table<T, E>>(BaseStoreInitializers<T, E>().Table(baseOrder))

export const newTableInputsStore = <T extends { id: number }, E extends StoreError = StoreError,>({
    baseOrder = defaultOrder<T>(),
    rules = []
}: NewTableInputsStoreProps<T>) => newStore<CrudStore.TableInputs<T, E>>(BaseStoreInitializers<T, E>().TableInputs(baseOrder, rules))

export const newListStore = <T extends { id: number }, E extends StoreError = StoreError,>({
    baseOrder = defaultOrder<T>(),
    filters = {}
}: NewListStoreProps<T>) => newStore<CrudStore.List<T, E>>(BaseStoreInitializers<T, E>().List(baseOrder, filters))

export const newFormStore = <T extends { id: number }, E extends StoreError = StoreError,>({
    rules = [],
    initialData
}: NewFormStoreProps<T>) => newStore<CrudStore.Form<T, E>>(BaseStoreInitializers<T, E>().Form(rules, initialData || null))

export const newFormSimpleStore = <T extends { id: number }, E extends StoreError = StoreError,>({
    rules = [],
    initialData
}: NewFormStoreProps<T>) => newStore<CrudStore.FormSimple<T, E>>(BaseStoreInitializers<T, E>().FormSimple(rules, initialData || null))

export const newNavigationStore = <T extends { id: number }, E extends StoreError = StoreError,>(
) => newStore<CrudStore.Navigation<E>>(BaseStoreInitializers<T, E>().Navigation())
