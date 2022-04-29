import {useEffect, useRef} from "react";

export default function usePreview(path) {
    const ref = useRef()

    useEffect(() => {
        try {
            if (ref.current)
                fetch(path)
                    .then(async res => {
                        if (res.ok) {
                            ref.current.src = await res.text()
                        }
                        throw new Error('Something went wrong');
                    })
                    .catch((err) => {
                        console.log(err)
                        ref.current.src = ''
                    })
        } catch (e) {
        }
    }, [path])

    return ref
}

