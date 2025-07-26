export const apiConfig = () => {
    const VERSION: string = 'v1'
    const END_POINT: string = `https://localhost:8080/api/${VERSION}/`

    return { version: VERSION, endPoint: END_POINT }
}