import {useEffect, useRef} from "react"
import AsyncFS from "../../project/templates/AsyncFS"

export default function usePreview(path, setError) {
    const ref = useRef()

    const getData = async () => {
        try {
            AsyncFS.read(path).then(res => {
                if (!res[0]) {
                    ref.current.src = res[1]
                    setError(false)
                }
                else
                    setError(true)
            })
        } catch (err) {
            setError(true)
        }
    }
    useEffect(() => {
        if (ref.current) getData().catch()
    }, [path])

    return ref
}

