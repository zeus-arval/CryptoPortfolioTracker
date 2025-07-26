import type { ChangeEvent } from "react"

interface IInputProps{
    fieldText: string,
    placeholder: string,
    type: string,
    value: string,
    action: (event: ChangeEvent<any>) => void
}

export default function UserDataInput({fieldText, placeholder, type, value, action} : IInputProps){
    return(
        <div className="justify-items-start">
            <p className='font-semibold text-xs mb-1'>{fieldText}:</p>
            <input
                type={type}
                placeholder={placeholder}
                className='border py-2 px-4 mb-6 w-full outline-0 rounded-md'
                value={value}
                onChange={action}
            />
        </div>
    )
}