import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import axios from "axios";
import type {ICredentials, IUser} from "../models/user";
import {apiConfig} from "../config/api";
import {ModalContext} from "./ModalContext";
import {useCookies} from "react-cookie";

interface IAuthContext{
    authorized: boolean,
    authError: string,
    user: IUser,
    logout: () => void,
    register: (newUser: IUser) => void,
    login: (user: IUser) => void,
    refreshToken: () => Promise<any>,
    tryGetCredentialsFromCookies: () => void,
    clearError: () => void,
}

export const AuthContext = createContext<IAuthContext>({
    authorized: false,
    authError: '',
    user: {
        email: '',
        password: '',
        phoneNumber: '',
        credentials: {

        },
    },
    logout: () => {},
    register: (newUser: IUser) => {},
    login: (user: IUser) => {},
    refreshToken: () => Promise.reject(),
    tryGetCredentialsFromCookies: () => {},
    clearError: () => {},
})

export const AuthState = ({children}: {children: ReactNode}) => {
    const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'refresh_token',
        'user_first_name', 'user_last_name'])

    const {close} = useContext(ModalContext)
    const [authError, setAuthError] = useState('')
    const [authorized, setAuthorized] = useState(false)
    const apiEndpoint = `${apiConfig().endPoint}Account`
    const [user, setUser] = useState<IUser>({email: '', password: '', phoneNumber: '', credentials: {
        refreshToken: cookies.refresh_token,
        token: cookies.access_token,
        firstName: cookies.user_first_name,
        lastName: cookies.user_last_name,
    }})

    const setCredentials = (credentials: ICredentials) => {
        setUser(prev => ({ ...prev, credentials: {
                refreshToken: credentials.refreshToken,
                token: credentials.token,
                firstName: credentials.firstName ?? prev.credentials.firstName,
                lastName: credentials.lastName ?? prev.credentials.lastName,
            },
        }))

        removeCookie('access_token')
        removeCookie('refresh_token')
        setCookie('access_token', credentials.token)
        setCookie('refresh_token', credentials.refreshToken)

        if (credentials.firstName && credentials.lastName){
            removeCookie('user_first_name')
            removeCookie('user_last_name')

            setCookie('user_first_name', credentials.firstName)
            setCookie('user_last_name', credentials.lastName)
        }
    }

    const clearError = () => {
        setAuthError('')
    }

    const tryGetCredentialsFromCookies = () => {
        user.credentials = {
            ...user.credentials,
            refreshToken: cookies.refresh_token ?? undefined,
            token: cookies.access_token ?? undefined,
            firstName: cookies.user_first_name ?? undefined,
            lastName: cookies.user_last_name ?? undefined,
        }

        if (cookies.refresh_token && cookies.access_token){
            setAuthorized(true)
        }
    }

    const fetch = async (data: any, headers: any, endPointPath: string, onSuccess: () => void) => {
        try {
            const apiEndPoint = `${apiEndpoint}/${endPointPath}`

            setAuthError('')
            await axios.post<ICredentials>(apiEndPoint,
                data,
                {
                    headers
            }).then(function(response){
                const data = response.data
                setCredentials(data)
                setAuthorized(true)
                onSuccess()
                return data.token
            }).catch(function(error) {
                setAuthError(error.message)
                setAuthorized(false)
            })
        }
        catch (error){
            console.log("Unhandled error occurred")
        }
    }

    const login = async (user: IUser) => {
        const data = {
            'email': user.email,
            'password': user.password,
        }
        const headers = {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        }

        await fetch(data, headers, 'Login', close)
    }

    const logout = () => {
        setAuthorized(false)
        setAuthError('')
        setUser({email: '', password: '', phoneNumber: '', credentials: {}})
        removeCookie('access_token')
        removeCookie('refresh_token')
    }

    const register = async (newUser: IUser) => {
        const data = {
            'email': newUser.email,
            'password': newUser.password,
            'phonenumber': newUser.phoneNumber,
            'firstName': newUser.credentials.firstName,
            'lastName': newUser.credentials.lastName,
        }
        const headers = {
            'accept': 'text/plain',
            'Content-Type': 'application/json',
        }

        await fetch(data, headers, 'Register', close)
    }

    const refreshToken = async () => {
        const data = {
            'jwt': cookies.access_token,
            'refreshToken': cookies.refresh_token,
        }
        const headers = {
            'accept': 'text/plain',
            'Content-Type': 'application/json',
        }

        return await fetch(data, headers, 'RefreshToken', () => {})
    }

    useEffect(tryGetCredentialsFromCookies)

    return (
        <AuthContext.Provider value={{authorized, authError, user, logout, register, login, refreshToken, tryGetCredentialsFromCookies, clearError}}>
            {children}
        </AuthContext.Provider>
    )
}