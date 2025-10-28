import type { KeyOfType, Orders } from "../types"

export function defaultOrder<T, K extends KeyOfType<T, number>>(key: K): Orders<T>
export function defaultOrder<T>(): Orders<T>
export function defaultOrder<T, K extends KeyOfType<T, number>>(key?: K): Orders<T> {
    return [[key ?? ('id' as KeyOfType<T>), 'ASC']] as Orders<T>
}
