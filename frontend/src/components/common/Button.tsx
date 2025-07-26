
interface IButtonProps {
    type: 'button' | 'submit',
    text: string,
    onClick?: () => void,
}

interface ICustomColorButtonProps extends IButtonProps{
    colorClass: string,
    customClass?: string,
}

export function IndigoButton({type, text, onClick}: IButtonProps) {
    if (onClick === undefined){
        onClick = () => {}
    }

    return (
        <button
            onClick={onClick}
            type={type}
            className='rounded-xl py-3 px-14 font-bold bg-indigo-200 hover:bg-indigo-100'
        >{text}</button>
    )
}

export function CustomColorButton({type, text, onClick, colorClass, customClass}: ICustomColorButtonProps){
    const className = customClass ?? `mx-5 rounded px-8 py-1 text-white ${colorClass}`

    if (onClick === undefined){
        onClick = () => {}
    }

    return (
        <button
            type={type}
            className={className}
            onClick={onClick}>
            {text}
        </button>
    )
}
