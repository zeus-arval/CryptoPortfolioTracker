interface ErrorProps{
    message: string
}

export function ErrorComponent({message}: ErrorProps) {
    return (
        <p className='text-left mb-2 text-red-600'>
            {message}
        </p>
    )
}