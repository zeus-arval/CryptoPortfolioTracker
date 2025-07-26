import {type ChangeEvent, type FormEvent, useContext, useState} from "react";
import {ErrorComponent} from "../ErrorComponent";
import {AuthContext} from "../../contexts/AuthContext";
import {LoadingComponent} from "../LoadingComponent";
import { IndigoButton } from "../common/Button";
import UserDataInput from "../common/Input";

interface IRegisterProps{
    onClose: () => void,
}

export function Register({onClose}: IRegisterProps) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [error, setError] = useState('')
    const {authError, register} = useContext(AuthContext)
    const [loading, setLoading] = useState(false)

    const changeFirstName = (event: ChangeEvent<any>) => {
        setFirstName(event.target.value)
    }

    const changeLastName = (event: ChangeEvent<any>) => {
        setLastName(event.target.value)
    }

    const changePassword = (event: ChangeEvent<any>) => {
        setPassword(event.target.value)
    }

    const changeEmail = (event: ChangeEvent<any>) => {
        setEmail(event.target.value)
    }

    const changePhoneNumber = (event: ChangeEvent<any>) => {
        setPhoneNumber(event.target.value)
    }

    const submitHandler = async (event: FormEvent) => {
        event.preventDefault()

        setError('')

        if (!isValidData(firstName, 'Enter first name') ||
            !isValidData(lastName, 'Enter last name') ||
            !isValidData(email, 'Enter email') ||
            !isValidData(password, 'Enter password') || 
            !isValidData(phoneNumber, 'Enter phone number')){
            return
        }

        setLoading(true)

        await register({
            email: email,
            password: password,
            phoneNumber: phoneNumber,
            credentials: {
                firstName: firstName,
                lastName: lastName,
            }
        })

        setLoading(false)
        onClose()
    }

    const isValidData = (data: string, errorMessage: string) => {
        if (!data.trim()){
            setError(errorMessage)
            return false
        }

        return true
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                    <UserDataInput fieldText="First Name" placeholder="Enter your first name..." type="text" value={firstName} action={changeFirstName}/>
                    <UserDataInput fieldText="Last Name" placeholder="Enter your last name..." type="text" value={lastName} action={changeLastName}/>
                    <UserDataInput fieldText="Email" placeholder="Enter your email..." type="email" value={email} action={changeEmail}/>
                    <UserDataInput fieldText="Password" placeholder="Enter your password..." type="password" value={password} action={changePassword}/>
                    <UserDataInput fieldText="Phone number" placeholder="Enter your phone number..." type="tel" value={phoneNumber} action={changePhoneNumber}/>
                
                {(error || authError) && <ErrorComponent message={error === '' ? authError : error} />}
                <div className='flex justify-center mt-7 mb-6'>
                    <IndigoButton type='submit' text='SIGN UP'/>
                </div>
                {loading && <LoadingComponent />}
            </form>
        </div>
    )
}