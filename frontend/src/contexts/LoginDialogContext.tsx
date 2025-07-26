import {createContext, type ReactNode, useState} from "react";

interface ILoginDialogContext{
    registering: boolean,
    openRegistration: () => void,
    closeRegistration: () => void,
}

export const LoginDialogContext = createContext<ILoginDialogContext>({
    registering: false,
    openRegistration: () => {},
    closeRegistration: () => {},
})

export function LoginDialogState({children}: {children: ReactNode}) {
    const [registering, setRegistering] = useState(false)

    const openRegistration = () => {
        setRegistering(true)
        console.log(`openRegistration: ${registering}`)
    }

    const closeRegistration = () => {
        setRegistering(false)
    }

    return (
        <LoginDialogContext.Provider value={{registering, openRegistration, closeRegistration}}>
            {children}
        </LoginDialogContext.Provider>
    )
}