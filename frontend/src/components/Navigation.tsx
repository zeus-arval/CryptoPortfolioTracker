import {Link, useNavigate} from "react-router-dom"
import {useContext} from "react"
import {ModalContext} from "../contexts/ModalContext"
import {AuthContext} from "../contexts/AuthContext"
import LoginImage from "../assets/images/login.svg"
import LogoutImage from "../assets/images/logout.svg"

export function Navigation() {
    const {open} = useContext(ModalContext)
    const {authorized, user, logout} = useContext(AuthContext)
    const navigate = useNavigate()

    const loginHandler = () => {
        open()
    }

    const logoutHandler = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className='h-16 border-b-2 border-gray-100 flex justify-between items-center px-10 w-full'>
            <span className='flex gap-7'>
                <Link className='active:font-bold hover:font-semibold text-gray-800 text-xl font-semibold' to='/'>Home</Link>
                {authorized && <div>
                    <Link className='active:font-bold hover:font-semibold' to='/account'>Account</Link>
                </div>}
            </span>

            <span className='flex flex-row gap-7 mr-10 items-center'>
                {authorized && <p>Welcome {user.credentials.firstName} {user.credentials.lastName}!</p>}
                {!authorized && <button onClick={loginHandler} className='h-12 bg-indigo-200'>
                    <div className='flex flex-row gap-2 items-center'>
                        <img src={LoginImage} alt="login" className='w-8 h-8'/>
                        <p>Log in</p>
                    </div>
                </button>}
                {authorized && <button onClick={logoutHandler} className='h-12'>
                    <div className='flex flex-row gap-2'>
                        <img src={LogoutImage} alt="logout"/>
                        <p>Log out</p>
                    </div>
                </button>}
            </span>
        </nav>
    )
}