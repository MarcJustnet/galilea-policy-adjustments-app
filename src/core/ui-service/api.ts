import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios"
import axios from "axios"

interface APIConfig {
    app: string
    baseURL: string
    storeKey: string
}

export class API {
    public instance: AxiosInstance
    private config: APIConfig
    private contentType: string = 'application/json'

    constructor(config: APIConfig) {
        this.config = config
        this.instance = axios.create({
            baseURL: config.baseURL,
            headers: {
                'Content-Type': this.contentType,
                'X-App-Name': config.app
            }
        })
        this.instance.interceptors.request.use(this.requestInterceptor.bind(this))
        this.instance.interceptors.response.use(this.responseSuccess.bind(this), this.responseError.bind(this))
    }

    protected get baseURL() {
        return this.config.baseURL
    }

    requestInterceptor(config: InternalAxiosRequestConfig) {
        if (!config.headers.Authorization && localStorage) {
            const store = localStorage.getItem(this.config.storeKey)
            const token = store ? JSON.parse(store).state.token : null
            if (token) config.headers.Authorization = `Bearer ${token}`
        }
        return config
    }

    responseSuccess(value: AxiosResponse): AxiosResponse | Promise<AxiosResponse> {
        return value
    }

    async responseError({ response, request, message, isAxiosError, name, status, code }: AxiosError): Promise<never> {
        return Promise.reject({ response, request, message, isAxiosError, name, status, code })
    }
}
