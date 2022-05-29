import {useEffect, useRef} from "react";
import FileSystem from '../../project/utils/files/FileSystem'

export default function usePreview(path, setError) {
    const ref = useRef()

    const getData = async () => {
        try {
            const p = path.split('')
            p.shift()
            const res = await fetch(path.charAt(0) === FileSystem.sep ? p.join('') : path)
            if (res.ok) ref.current.src = await res.text()
            else setError(true)

        } catch (err) {
            setError(true)
        }
    }
    useEffect(() => {
        if (ref.current) getData().catch()
    }, [path])

    return ref
}

