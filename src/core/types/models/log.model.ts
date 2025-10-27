import type { BaseModel } from "./lib"

export interface Log extends BaseModel {
    name: string
    date: Date | string
    requestMethod: string
    requestOriginalUrl: string
    requestBody: string
    requestParams: string
    requestQuery: string
    requestHeaders: string
    requestIp: string
    requestHostname: string
    responseStatusCode?: number
    responseStatusMessage?: string
    responseBody?: string
    responseHeaders?: string
    extraLogs?: string
}
