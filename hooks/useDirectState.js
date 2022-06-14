import {useMemo, useState} from "react"

export default function useDirectState(initialState={}){
    const [state, setState] = useState(initialState)
    return [
        useMemo(() => {
            return new Proxy(state, {
                get(obj, key) {
                    return obj[key]
                },
                set(obj, key, value) {
                    setState(prev => {
                        return {
                            ...prev,
                            [key]: value
                        }
                    })
                    return true
                }
            }
            )
        }, [state]), 
        () => setState({}),
        (data) => {
            const newState = {...state}
            Object.keys(data).forEach(d => {
                if(data[d])
                    newState[d] = data[d]
            })
            setState(newState)
        }]
}