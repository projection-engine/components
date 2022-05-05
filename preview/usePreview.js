import {useEffect, useRef} from "react";

export default function usePreview(path) {
    const ref = useRef()

    const getData = async () => {
        try {
            const res = await fetch(path)
            if (res.ok)
                ref.current.src = await res.text()
        } catch (err) {
            if( ref.current)
                ref.current.src = ''
        }
    }
    useEffect(() => {
        if (ref.current)
            getData().catch()
    }, [path])

    return ref
}

