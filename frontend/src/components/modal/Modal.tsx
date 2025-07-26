import type {ReactNode} from "react";

interface ModalProps{
    title: string,
    children: ReactNode,
    onClose: () => void,
}

export function Modal({title, children, onClose}: ModalProps) {
    return (
        <>
            <div className='fixed bg-black/50 top-0 bottom-0 right-0 left-0' onClick={onClose}/>
            <div className='rounded-xl bg-white w-[500px] p-5 top-32 left-1/2 absolute -translate-x-1/2'>
                <h1 className="text-center text-2xl mb-10">{title}</h1>
                {children}
            </div>
        </>
    )
}