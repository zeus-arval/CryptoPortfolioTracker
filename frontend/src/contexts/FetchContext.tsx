import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import type {IBaseModel} from "../models/baseModel";
import axios, {Axios, AxiosError} from "axios";
import {apiConfig} from "../config/api";
import {AuthContext} from "./AuthContext";
import {useCookies} from "react-cookie";
import {ModalContext} from "./ModalContext";

interface IFetchContext{
    fetchError: string,
    fetchInProgress: boolean,
    get: <T extends IBaseModel>(endPoint: string) => any,
    getData: <T extends IBaseModel>(id: string, endPoint: string) => any,
    post: <T extends IBaseModel>(data: any, endPoint: string) => any,
    put: <T extends IBaseModel>(data: any, id: string, endPoint: string) => void,
    deleteData: <T extends IBaseModel>(id: string, endPoint: string) => void,
}

export const FetchContext = createContext<IFetchContext>({
    fetchError: '',
    fetchInProgress: false,
    get: async <T extends IBaseModel>(endPoint: string) => { return {}} ,
    getData: async <T extends IBaseModel>(id: string, endPoint: string) => {},
    post: async <T extends IBaseModel>(data: any, endPoint: string) => {},
    put: async <T extends IBaseModel>(data: any, id: string, endPoint: string) => {},
    deleteData: async <T extends IBaseModel>(id: string, endPoint: string) => {},
})

export function FetchState({children}: {children: ReactNode}) {
    const url = apiConfig().endPoint
    const { user, refreshToken } = useContext(AuthContext)
    const [fetchError, setFetchingError] = useState('')
    const [fetchInProgress, setFetchInProgress] = useState(false)
    const {close} = useContext(ModalContext)
    const [cookies] = useCookies(['access_token', 'refresh_token',
        'user_first_name', 'user_last_name'])

    const tryFetch = async (method: () => Promise<any>, onSuccess: () => void) => {
        try {
            setFetchingError('')
            setFetchInProgress(true)
            const response = await method()
            onSuccess()
            return response
        }
        catch (e: unknown){
            const err = e as AxiosError
            if (err.response!.status === 401){
                await refreshToken()
                const response: any = await tryFetch(method, onSuccess)
                return response
            }
            setFetchingError(err.message)
            setFetchInProgress(false)
        }
    }

    const get = async <T extends IBaseModel>(endPoint: string) => {
        const fullEndpoint = `${url}${endPoint}`

        if (!cookies.access_token){
            await refreshToken()
        }

        const response = await tryFetch(() => {
            return axios.get<T[]>(fullEndpoint, {
                headers: {
                    "Authorization": `Bearer ${user.credentials.token}`,
                }
            })
        }, () => {})

        return response?.data ?? []
    }
    
    const getData = async <T extends IBaseModel>(id: string, endPoint: string) => {
        const fullEndpoint = `${url}${endPoint}/${id}`
        const response = await tryFetch(() => {
            return axios.get<T[]>(fullEndpoint, {
                headers: {
                    'accept': 'application/json',
                    "Authorization": `Bearer ${user.credentials.token}`,
                }
            })
        }, () => {})
        return response.data
    }
    
    const post = async <T extends IBaseModel>(data: any, endPoint: string) => {
        const fullEndPoint = `${url}${endPoint}`
        const response = await tryFetch(() => {
            return axios.post<T>(fullEndPoint, data, {
                headers: {
                    "Authorization": `Bearer ${user.credentials.token}`,
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
        }, close)

        return response.data
    }
    
    const put = async <T extends IBaseModel>(data: any, id: string, endPoint: string) => {
        const fullEndPoint = `${url}${endPoint}/${id}`

        const response = await tryFetch(() => {
            return axios.put<T>(fullEndPoint, data, {
                headers: {
                    "Authorization": `Bearer ${user.credentials.token}`,
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
        }, close)

        return response.data
    }
    
    const deleteData = async <T extends IBaseModel>(id: string, endPoint: string) => {
        const fullEndPoint = `${url}${endPoint}/${id}`

        const response = await tryFetch(() => {
            return axios.delete<T>(fullEndPoint, {
                headers: {
                    'accept': '*/*',
                    "Authorization": `Bearer ${user.credentials.token}`,
                }
            })
        }, () => {})

        return response.data
    }

    // useEffect(() => {
    //     setToken(user.credentials.token ?? '')
    // }, [user.credentials.token])

    return (
        <FetchContext.Provider value={{fetchError, fetchInProgress, get, getData, post, put, deleteData}}>
            {children}
        </FetchContext.Provider>
    )
}