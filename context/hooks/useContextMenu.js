import {useState} from "react"

export default function useContextMenu(){
    const [state, setState] = useState({
        options: [],
        triggers: []
    })

    return [state, setState]
}