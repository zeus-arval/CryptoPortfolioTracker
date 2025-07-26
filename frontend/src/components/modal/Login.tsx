import {type ChangeEvent, type FormEvent, useContext, useState} from "react";
import {ErrorComponent} from "../ErrorComponent";
import {LoadingComponent} from "../LoadingComponent";
import {AuthContext} from "../../contexts/AuthContext";
import {LoginDialogContext} from "../../contexts/LoginDialogContext";
import {Register} from "./Register";
import {CustomColorButton, IndigoButton} from "../common/Button";
import UserDataInput from "../common/Input";
import { ModalContext } from "../../contexts/ModalContext";

export function Login() {
    const {registering, closeRegistration, openRegistration} = useContext(LoginDialogContext)
    const {authError, login, clearError} = useContext(AuthContext)
    const {close} = useContext(ModalContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const changeUserEmail = (event: ChangeEvent<any>) => {
        setEmail(event.target.value)
    }

    const changeUserPassword = (event: ChangeEvent<any>) => {
        setPassword(event.target.value)
    }

    const changePhoneNumber = (event: ChangeEvent<any>) => {
        setPhoneNumber(event.target.value)
    }

    const submitHandler = async (event: FormEvent) => {
        event.preventDefault()
        setError('')

        if (!email.trim()){
            setError('Enter email')
            return
        }

        if (!password.trim()) {
            setError('Enter password')
            return
        }

        setLoading(true)
        await login({
            email: email,
            password: password,
            phoneNumber: phoneNumber,
            credentials: {},
        })

        setLoading(false)
    }

    const registerHandler = () => {
        openRegistration()
        console.log('opening registration')
        console.log(`${registering}`)
    }

    const closeHandler = () => {
        closeRegistration()
        setError('')
        clearError()
        close()
    }

    return (
        <div>
            {!registering && <div>
                <form onSubmit={submitHandler} className='flex-row'>
                    <UserDataInput placeholder='Enter your email address...' fieldText="Email" type="email" value={email} action={changeUserEmail} />
                    <UserDataInput placeholder='Enter your password...' fieldText="Password" type="password" value={password} action={changeUserPassword} />
                    <UserDataInput placeholder='Enter your phone number...' fieldText="Phone number" type="tel" value={phoneNumber} action={changePhoneNumber} />

                    {(error || authError) && <ErrorComponent message={error === '' ? authError : error} />}

                    <div className='flex justify-center mt-7 mb-6'>
                        <CustomColorButton colorClass='bg-indigo-300 hover:bg-indigo-400' type='submit' text='LOG IN'/>
                    </div>
                </form>
                <div className='flex justify-center mt-7 mb-6'>
                    <IndigoButton type='button' text='SIGN UP' onClick={registerHandler}/>
                </div>
                {loading && <LoadingComponent />}
            </div>}
            {registering && <Register onClose={closeHandler}/>}
        </div>
    )
}