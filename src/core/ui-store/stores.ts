import type { StateCreator } from "zustand"
import { create } from "zustand"
import type { PersistOptions } from 'zustand/middleware'
import { persist } from 'zustand/middleware'

import type { KeyOfType, Orders } from "../types"

import { defaultOrder } from "./constants"
import { BaseStoreInitializers } from "./initializers"
import type { CrudStore, StoreError } from "./types"

export interface NewTableStoreProps<T, K extends KeyOfType<T, number> = KeyOfType<T, number>> {
    baseOrder?: Orders<T>
    idKey?: K
}

export interface NewFormStoreProps<T, K extends KeyOfType<T, number> = KeyOfType<T, number>> {
    rules?: Array<CrudStore.KeyRules<T>>
    initialData?: T
    idKey?: K
}

export interface NewTableInputsStoreProps<T, K extends KeyOfType<T, number> = KeyOfType<T, number>> {
    baseOrder?: Orders<T>
    rules?: Array<CrudStore.KeyRules<T>>
    idKey?: K
}

export interface NewListStoreProps<T, K extends KeyOfType<T, number> = KeyOfType<T, number>> {
    baseOrder?: Orders<T>
    filters?: Partial<T>
    idKey?: K
}

export const newStore = <T>(initializer: StateCreator<T, [], []>, persist_opions?: PersistOptions<T, unknown>) => (persist_opions && persist_opions.name) ? create<T>()(persist(initializer, persist_opions)) : create<T>()(initializer)

export const newTableStore = <T extends Record<K, number>, K extends KeyOfType<T, number> = KeyOfType<T, number>, E extends StoreError = StoreError>({
    baseOrder,
    idKey
}: NewTableStoreProps<T, K> = {} as NewTableStoreProps<T, K>) => {
    const key = (idKey ?? 'id') as K
    return newStore<CrudStore.Table<T, E>>(BaseStoreInitializers<T, K, E>(key).Table(baseOrder ?? defaultOrder<T, K>(key)))
}

export const newTableInputsStore = <T extends Record<K, number>, K extends KeyOfType<T, number> = KeyOfType<T, number>, E extends StoreError = StoreError>({
    baseOrder,
    rules = [],
    idKey
}: NewTableInputsStoreProps<T, K> = {} as NewTableInputsStoreProps<T, K>) => {
    const key = (idKey ?? 'id') as K
    return newStore<CrudStore.TableInputs<T, E>>(BaseStoreInitializers<T, K, E>(key).TableInputs(baseOrder ?? defaultOrder<T, K>(key), rules))
}

export const newListStore = <T extends Record<K, number>, K extends KeyOfType<T, number> = KeyOfType<T, number>, E extends StoreError = StoreError>({
    baseOrder,
    filters = {},
    idKey
}: NewListStoreProps<T, K> = {} as NewListStoreProps<T, K>) => {
    const key = (idKey ?? 'id') as K
    return newStore<CrudStore.List<T, E>>(BaseStoreInitializers<T, K, E>(key).List(baseOrder ?? defaultOrder<T, K>(key), filters))
}

export const newFormStore = <T extends Record<K, number>, K extends KeyOfType<T, number> = KeyOfType<T, number>, E extends StoreError = StoreError>({
    rules = [],
    initialData,
    idKey
}: NewFormStoreProps<T, K> = {} as NewFormStoreProps<T, K>) => {
    const key = (idKey ?? 'id') as K
    return newStore<CrudStore.Form<T, E>>(BaseStoreInitializers<T, K, E>(key).Form(rules, initialData || null))
}

export const newFormSimpleStore = <T extends Record<K, number>, K extends KeyOfType<T, number> = KeyOfType<T, number>, E extends StoreError = StoreError>({
    rules = [],
    initialData,
    idKey
}: NewFormStoreProps<T, K> = {} as NewFormStoreProps<T, K>) => {
    const key = (idKey ?? 'id') as K
    return newStore<CrudStore.FormSimple<T, E>>(BaseStoreInitializers<T, K, E>(key).FormSimple(rules, initialData || null))
}

export const newNavigationStore = <T extends Record<K, number>, K extends KeyOfType<T, number> = KeyOfType<T, number>, E extends StoreError = StoreError>(
    idKey?: K
) => {
    const key = (idKey ?? 'id') as K
    return newStore<CrudStore.Navigation<E>>(BaseStoreInitializers<T, K, E>(key).Navigation())
}
