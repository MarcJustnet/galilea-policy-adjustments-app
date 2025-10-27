// @ts-expect-error - K could be symbol, number or string, but in this case just string.
export type PermissionPaths<T, Prefix extends string = ''> = { [K in keyof T]: T[K] extends object ? PermissionPaths<T[K], `${Prefix}${K}.`> : `${Prefix}${K}` }[keyof T]
// @ts-expect-error - K could be symbol, number or string, but in this case just string.
export type ReplaceSymbolsWithStrings<T, Prefix extends string = ''> = { [K in keyof T]: T[K] extends symbol ? `${Prefix}${K}` : (T[K] extends object ? ReplaceSymbolsWithStrings<T[K], `${Prefix}${K}.`> : T[K]) }
