import {useState} from "react"

export default function useContextMenu(){
    const [state, setState] = useState({
        options: [],
        triggers: [],
        target: undefined
    })

    return [state, setState]
}