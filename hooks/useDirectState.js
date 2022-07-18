import {useMemo, useState} from "react"

export default function useDirectState(initialState = {}, onChange) {
    const [state, setState] = useState(initialState)

    return [
        useMemo(() => {
            return new Proxy(state, {
                get(obj, key) {
                    return obj[key]
                },
                set(obj, key, value) {
                    if (onChange)
                        onChange(key, value)
                    setState(prev => {
                        return {
                            ...prev,
                            [key]: value
                        }
                    })
                    return true
                }
            })
        }, [state]),
        () => setState({}),
        (data) => {
            const newState = {...state}
            Object.keys(data).forEach(d => {
                if (data[d] !== undefined)
                    newState[d] = data[d]
            })
            setState(newState)

        }
    ]
}