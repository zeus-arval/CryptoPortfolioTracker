import {Modal} from "../components/modal/Modal";
import {Login} from "../components/modal/Login";
import {useContext} from "react";
import {ModalContext} from "../contexts/ModalContext";
import {LoginDialogContext} from "../contexts/LoginDialogContext";
import {AuthContext} from "../contexts/AuthContext";

export function HomePage() {
    const {modal, close} = useContext(ModalContext)
    const {registering, closeRegistration} = useContext(LoginDialogContext)
    const {authorized} = useContext(AuthContext)

    const closeHandler = () => {
        close()
        closeRegistration()
        console.log(registering)
    }

    return (
        <div className='h-screen flex items-center  flex-col'>
            <div className='text-center text-4xl mt-24'>
                Welcome to the crypto tracker!
            </div>

            {modal && <Modal title={registering ? 'Registration' : 'Login'} onClose={closeHandler}>
                <Login />
            </Modal>}
        </div>
    )
}