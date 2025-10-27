import type { AxiosResponse, AxiosRequestConfig } from 'axios'

import type { API } from './api'
import type { AuthAPI, CrudAPI, APIError } from './types'

// export function IsService<T extends { new(...args: any[]): any }>(target: T): T {
//     const OriginalConstructor = target
//     const newConstructor: any = function (...args: any[]) {
//         const c = new OriginalConstructor(...args)
//         const servicePrototype = Object.getPrototypeOf(c)
//         const parentPrototype = Object.getPrototypeOf(servicePrototype)
//         const parentParentPrototype = Object.getPrototypeOf(parentPrototype)

//         const serviceMethods = Object.getOwnPropertyNames(servicePrototype)
//         const parentMethods = Object.getOwnPropertyNames(parentPrototype)
//         const parentParentMethods = Object.getOwnPropertyNames(parentParentPrototype);

//         [...serviceMethods, ...parentMethods, ...parentParentMethods].forEach((method) => {
//             if (method !== 'constructor' && typeof c[method] === 'function') c[method] = c[method].bind(c)
//         })

//         return c
//     }
//     newConstructor.prototype = OriginalConstructor.prototype
//     return newConstructor as T
// }

export type ServiceResponse<T> = Promise<AxiosResponse<T>>
export { AxiosResponse, CrudAPI, AuthAPI, APIError }

export interface BaseCrudServiceType<T> {
    new(): object
    baseURL: string
    GetTable: (params: CrudAPI.GetTable.Request<T>) => ServiceResponse<CrudAPI.GetTable.Result<T>>
    GetList: (params: CrudAPI.GetList.Request<T>) => ServiceResponse<CrudAPI.GetList.Result<T>>
    GetById: (id: number, params?: CrudAPI.GetById.Request<T>, signal?: AbortSignal) => ServiceResponse<CrudAPI.GetById.Result<T>>
    GetByIdSimple: (id: number) => ServiceResponse<CrudAPI.GetByIdSimple.Result<T>>
    GetByIdNavigation: (params?: CrudAPI.GetByIdNavigation.Request<T>) => ServiceResponse<CrudAPI.GetByIdNavigation.Result>
    Create: (data: T) => ServiceResponse<CrudAPI.Create.Result<T>>
    Update: (id: number, data: Partial<T> | T) => ServiceResponse<CrudAPI.Update.Result<T>>
    Delete: (id: number) => ServiceResponse<CrudAPI.Delete.Result<T>>
    Restore: (id: number) => ServiceResponse<CrudAPI.Restore.Result<T>>
    Upload: (file: File, setPercent: (p: number) => void, signal: AbortSignal | undefined, extraData?: CrudAPI.Json | null) => ServiceResponse<CrudAPI.Create.Result<T>>
    Download: (id: number) => ServiceResponse<Blob>
}

export const BaseCrudService = <T,>(API: API, baseURL: string): BaseCrudServiceType<T> => {
    class BaseCrudServiceClass {
        static baseURL = baseURL

        static async GetTable(params: CrudAPI.GetTable.Request<T>) {
            return await API.instance.get<CrudAPI.GetTable.Result<T>>(`${baseURL}`, { params })
        }

        static async GetList(params: CrudAPI.GetList.Request<T>) {
            return await API.instance.get<CrudAPI.GetList.Result<T>>(`${baseURL}/list`, { params })
        }

        static async GetById(id: number, params?: CrudAPI.GetById.Request<T>, signal?: AbortSignal) {
            const extra: AxiosRequestConfig = {}
            if (params) extra.params = params
            if (signal) extra.signal = signal
            return await API.instance.get<CrudAPI.GetById.Result<T>>(`${baseURL}/${id}`, extra)
        }

        static async GetByIdSimple(id: number) {
            return await API.instance.get<CrudAPI.GetByIdSimple.Result<T>>(`${baseURL}/${id}`)
        }

        static async GetByIdNavigation(params?: CrudAPI.GetByIdNavigation.Request<T>) {
            const extra: AxiosRequestConfig = {}
            if (params) extra.params = params
            return await API.instance.get<CrudAPI.GetByIdNavigation.Result>(`${baseURL}/navigation`, extra)
        }

        static async Create(data: T) {
            return await API.instance.post<CrudAPI.Create.Result<T>>(`${baseURL}`, data)
        }

        static async Update(id: number, data: Partial<T> | T) {
            return await API.instance.put<CrudAPI.Update.Result<T>>(`${baseURL}/${id}`, data)
        }

        static async Delete(id: number) {
            return await API.instance.delete<CrudAPI.Delete.Result<T>>(`${baseURL}/${id}`)
        }

        static async Restore(id: number) {
            return await API.instance.patch<CrudAPI.Restore.Result<T>>(`${baseURL}/${id}/restore`)
        }

        static async Upload(file: File, setPercent: (p: number) => void, signal: AbortSignal | undefined, extraData?: CrudAPI.Json | null) {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('last_modified', file.lastModified.toString())
            if (extraData) this.JsonToFormData(extraData, formData)

            return await API.instance.post<CrudAPI.Create.Result<T>>(`${baseURL}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 0))
                    setPercent(percentCompleted)
                },
                signal
            })
        }

        static async Download(id: number) {
            return await API.instance.get<Blob>(`${baseURL}/${id}/download`, {
                responseType: 'blob'
            })
        }

        private static GetKey(key: string, parent_keys: string[]): string {
            let keyToUse = key
            if (parent_keys.length === 0) keyToUse = key
            else if (parent_keys.length === 1) keyToUse = `${parent_keys[0]}[${key}]`
            else keyToUse = `${parent_keys[0]}[${parent_keys.slice(1).join('][')}][${key}]`
            return keyToUse
        }

        private static IsNull(key: string | null | undefined): boolean {
            if (key === 'undefined' || key === 'null') return true
            if (key === undefined || key === null) return true
            return false
        }

        private static JsonToFormData(json: CrudAPI.Json, formData: FormData = new FormData(), parent_keys: string[] = []): FormData {
            Object.entries(json).forEach(([key, value]) => {
                if (this.IsNull(key)) return
                const keyToUse = this.GetKey(key, parent_keys)
                if (value === null) formData.append(keyToUse, 'null')
                else if (typeof value === 'boolean') formData.append(keyToUse, value ? 'true' : 'false')
                else if (typeof value === 'number') formData.append(keyToUse, value.toString())
                else if (value instanceof Object && !(value instanceof File)) {
                    if (Array.isArray(value)) {
                        value.forEach((v, i) => {
                            let value = v
                            if (value === null) value = 'null'
                            else if (typeof value === 'boolean') value = value ? 'true' : 'false'
                            else if (typeof value === 'number') value = value.toString()
                            formData.append(`${keyToUse}[${i}]`, v as string | File)
                        })
                    } else formData = this.JsonToFormData(value, formData, [...parent_keys, key])
                } else formData.append(keyToUse, value)
            })
            return formData
        }
    }

    return BaseCrudServiceClass
}

export interface BaseAuthServiceType<T, M extends string> extends BaseCrudServiceType<T> {
    Login: (data: AuthAPI.Login.Request) => Promise<AxiosResponse<AuthAPI.Login.Result<T, M>>>
    LoginMsal: (data: AuthAPI.LoginMsal.Request) => Promise<AxiosResponse<AuthAPI.LoginMsal.Result<T, M>>>
    Profile: () => Promise<AxiosResponse<AuthAPI.Profile.Result<T>>>
    PasswordInitToken: (token: string) => Promise<AxiosResponse<AuthAPI.PasswordInitToken.Result<T>>>
    ForgotPassword: (data: AuthAPI.ForgotPassword.Request) => Promise<AxiosResponse<AuthAPI.ForgotPassword.Result>>
    PasswordInit: (token: string, data: AuthAPI.PasswordInit.Request) => Promise<AxiosResponse<AuthAPI.PasswordInit.Result<T>>>
    PasswordRestoreToken: (token: string) => Promise<AxiosResponse<AuthAPI.PasswordRestoreToken.Result<T>>>
    PasswordRestore: (token: string, data: AuthAPI.PasswordRestore.Request) => Promise<AxiosResponse<AuthAPI.PasswordRestore.Result<T>>>
}

export const BaseAuthService = <T, M extends string = 'user'>(API: API, baseURL: string): BaseAuthServiceType<T, M> => {
    class BaseAuthServiceClass extends BaseCrudService<T>(API, baseURL) {
        static async Login(data: AuthAPI.Login.Request) {
            return await API.instance.post<AuthAPI.Login.Result<T, M>>(`${baseURL}/login`, data)
        }

        static async LoginMsal(data: AuthAPI.LoginMsal.Request) {
            return await API.instance.post<AuthAPI.LoginMsal.Result<T, M>>(`${baseURL}/login_msal`, data)
        }

        static async Profile() {
            return await API.instance.get<AuthAPI.Profile.Result<T>>(`${baseURL}/me`)
        }

        static async PasswordInitToken(token: string) {
            return await API.instance.get<AuthAPI.PasswordInitToken.Result<T>>(`${baseURL}/password_init/${token}`)
        }

        static async ForgotPassword(data: AuthAPI.ForgotPassword.Request) {
            return await API.instance.post<AuthAPI.ForgotPassword.Result>(`${baseURL}/forgot_password`, data)
        }

        static async PasswordInit(token: string, data: AuthAPI.PasswordInit.Request) {
            return await API.instance.post<AuthAPI.PasswordInit.Result<T>>(`${baseURL}/password_init/${token}`, data)
        }

        static async PasswordRestoreToken(token: string) {
            return await API.instance.get<AuthAPI.PasswordRestoreToken.Result<T>>(`${baseURL}/password_restore/${token}`)
        }

        static async PasswordRestore(token: string, data: AuthAPI.PasswordRestore.Request) {
            return await API.instance.post<AuthAPI.PasswordRestore.Result<T>>(`${baseURL}/password_restore/${token}`, data)
        }
    }

    return BaseAuthServiceClass
}
