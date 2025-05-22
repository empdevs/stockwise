import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { IResponse } from "../Types";
import { Uri } from "../Uri";


const instance = axios.create({
    // baseURL: Uri.localUri,
    baseURL: `${Uri.rootUri}:3000`,
    timeout: 30000,
});
export abstract class Adapter {
    abstract get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;

    abstract post<T>(url: string, object: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;

    abstract patch<T>(url: string, object: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;

    abstract delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;

}

export class ApiAdapter extends Adapter {
    constructor() {
        super();
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        if (config) {
            return instance.get(url, config);
        }
        return instance.get(url);
    }
    async post<T>(url: string, object: T, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        if (config) {
            return instance.post(url, object, config);
        }
        return instance.post(url, object);
    }
    async patch<T>(url: string, object: T, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        if (config) {
            return instance.patch(url, object, config);
        }
        return instance.patch(url, object);
    }
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        if (config) {
            return instance.delete(url, config);
        }
        return instance.delete(url);
    }
}
export class ApiService {
    public config: AxiosRequestConfig = {};
    private adapter: ApiAdapter = new ApiAdapter();


    public async getItem<T>(url: string, params?: any): Promise<IResponse<T>> {
        const urlString: string = url;
        let currentConfig = this.config;
        if (params && Object.keys(params).length > 0) {
            currentConfig.params = {
                ...currentConfig.params,
                ...params
            }
        }
        const { data: response } = await this.adapter.get<IResponse<T>>(urlString, currentConfig);
        const item: T = response.data;
        if (!response.error) {
            return ({
                data: item,
                error: response.error,
                message: response.message,
            });
        } else {
            return ({
                data: null as T,
                error: true,
                message: response.message,
            });
        }
    }

    public async insertItem<T>(url: string, body: any, config?: AxiosRequestConfig): Promise<IResponse<T>> {

        let currentConfig = this.config;
        if (config) {
            currentConfig = {
                ...currentConfig,
                ...config
            }
        }
        const { data: response } = await this.adapter.post<IResponse<T>>(url, body, currentConfig);
        const item: T = response.data;
        if (!response.error) {
            return ({
                data: item,
                error: response.error,
                message: response.message,
            });
        } else {
            return ({
                data: null as T,
                error: true,
                message: response.message,
            });
        }
    }

    public async patchItem<T>(url: string, params: any, object: any, config?: AxiosRequestConfig): Promise<IResponse<T>> {
        const urlString: string = url;
        let currentConfig = this.config;
        if (config) {
            currentConfig = {
                ...currentConfig,
                ...config
            }
        }
        if (params && Object.keys(params).length > 0) {
            currentConfig.params = {
                ...currentConfig.params,
                ...params
            }
        }
        const { data: response } = await this.adapter.patch<IResponse<T>>(urlString, object, currentConfig);
        const item: T = response.data;
        if (!response.error) {
            return ({
                data: item,
                error: response.error,
                message: response.message,
            });
        } else {
            return ({
                data: null as T,
                error: true,
                message: response.message,
            });
        }
    }

    public async deleteItem<T>(url: string, params?: any): Promise<IResponse<T>> {
        const urlString: string = url;
        let currentConfig = this.config;
        if (params && Object.keys(params).length > 0) {
            currentConfig.params = {
                ...currentConfig.params,
                ...params
            }
        }
        const { data: response } = await this.adapter.delete<IResponse<T>>(urlString, currentConfig);
        const item: T = response.data;
        if (!response.error) {
            return ({
                data: item,
                error: response.error,
                message: response.message,
            });
        } else {
            return ({
                data: null as T,
                error: true,
                message: response.message,
            });
        }
    }

    // public async putItem<T>(url: string, params: IParameters, object: any, config?: AxiosRequestConfig): Promise<IResponseSingle<T>> {
    //     const urlString: string = url;
    //     let currentConfig = this.config;
    //     if (config) {
    //         currentConfig = {
    //             ...currentConfig,
    //             ...config
    //         }
    //     }
    //     if (params && Object.keys(params).length > 0) {
    //         currentConfig.params = {
    //             ...currentConfig.params,
    //             ...params
    //         }
    //     }
    //     const { data: response } = await this.adapter.put(urlString, object, currentConfig);
    //     const item: T = response.item;
    //     if (!response.error) {
    //         return ({
    //             item: item,
    //             error: response.error,
    //             message: response.message,
    //         });
    //     } else {
    //         return ({
    //             item: null,
    //             error: true,
    //             message: response.message,
    //         });
    //     }
    // }
}
