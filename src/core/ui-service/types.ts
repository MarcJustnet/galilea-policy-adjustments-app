import type { Orders } from "../types"

interface BaseResponse<T> {
    status: number
    data: T
    message?: string
}

export namespace CrudAPI {
    type Filters<T> = Partial<T> | Record<string, string>

    export namespace GetTable {
        export type Result<T> = BaseResponse<{
            data: T[]
            page: number
            nextPage: number
            totalRecords: number
            totalPages: number
            totalWithoutFilter: number
        }>

        export interface Request<T> {
            page: number
            limit: number | '*'
            order?: Orders<T>
            filters?: Filters<T>
            filter?: string
        }
    }

    export namespace GetById {
        export type Result<T> = BaseResponse<{
            data: T
            allCount: number
            filteredCount: number
            filteredIds: number[]
        }>

        export interface Request<T> {
            order?: Orders<T>
            state?: {
                change?: true
            }
            filters?: Filters<T>
            filter?: string
        }
    }

    export namespace GetByIdSimple {
        export type Result<T> = BaseResponse<{
            data: T
        }>
    }

    export namespace GetByIdNavigation {
        export type Result = BaseResponse<{
            allCount: number
            filteredCount: number
            filteredIds: number[]
        }>

        export interface Request<T> {
            order?: Orders<T>
            filters?: Filters<T>
            filter?: string
        }
    }

    export namespace GetList {
        export type Result<T> = BaseResponse<{
            data: T[]
            page: number
            nextPage: number
            totalRecords: number
            totalPages: number
        }>

        interface InfinityDataParamsExtra {
            extraData?: Array<{ id: string | number, name: string, name_or_email?: string }>
        }

        export interface Request<T> {
            page: number
            limit: number | '*'
            order: Orders<T>
            filter: string
            filters: Filters<T>
            extra?: InfinityDataParamsExtra
        }
    }

    export namespace Create {
        export type Result<T> = BaseResponse<T>
    }

    export namespace Update {
        export type Result<T> = BaseResponse<T>
    }

    export namespace Delete {
        export type Result<T> = BaseResponse<T>
    }

    export namespace Restore {
        export type Result<T> = BaseResponse<T>
    }

    export interface Json {
        [key: string]: string | number | boolean | Json | File | null | Array<string | number | boolean | File | null>
    }
}

export namespace AuthAPI {
    interface Tokens {
        tokenType: string
        accessToken: string
        expiresIn: string
    }

    export namespace Login {
        export type Result<T, M extends string> = BaseResponse<{
            tokens: Tokens
        } & { [K in M]: T }>

        export interface Request {
            email: string
            password: string
        }
    }

    export namespace LoginMsal {
        export type Result<T, M extends string> = BaseResponse<{
            tokens: Tokens
        } & { [K in M]: T }>

        export interface Request {
            name: string
            email: string
            msalId: string
        }
    }

    export namespace Profile {
        export type Result<T> = BaseResponse<T>
    }

    export namespace PasswordInitToken {
        export type Result<T> = BaseResponse<{
            data: T
        }>
    }

    export namespace ForgotPassword {
        export type Result = BaseResponse<{
            message: string
        }>

        export interface Request {
            email: string
        }
    }

    export interface PasswordUpdateBody {
        password: string
        confirmPassword: string
    }

    export namespace PasswordInit {
        export type Result<T> = BaseResponse<{
            data: T
        }>
        export type Request = PasswordUpdateBody
    }

    export namespace PasswordRestoreToken {
        export type Result<T> = BaseResponse<{
            data: T
        }>
    }

    export namespace PasswordRestore {
        export type Result<T> = BaseResponse<{
            data: T
        }>
        export type Request = PasswordUpdateBody
    }
}

interface Context {
    [key: string]: unknown
    key?: string
    label?: string
    value?: unknown
}

interface IError {
    context: Context | undefined
    messages: string
    field: Array<string | number>
}

export interface APIError extends Error {
    message: string
    stack?: string
    errors?: IError[]
    status: number
}
