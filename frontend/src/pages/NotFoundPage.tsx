import {useContext} from "react";
import {ModalContext} from "../contexts/ModalContext";
import {Modal} from "../components/modal/Modal";
import {Login} from "../components/modal/Login";

export function NotFoundPage() {
    const {modal, close} = useContext(ModalContext)

    return (
        <div className='mt-36 flex justify-center'>
            <h1 className='text-4xl'>Oops, this page doesn't exist</h1>

            {modal && <Modal title='Login' onClose={close}>
                <Login />
            </Modal>}
        </div>
    )
}