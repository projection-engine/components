import {useState} from "react"

export default function useContextMenu(){
    const [options, setOptions] = useState([])
    const [triggers, setTriggers] = useState([])
    const [onContext, setOnContext] = useState()
    const [targetElement, setTargetElement] = useState({})
    return {
        options, setOptions,
        targetElement, setTargetElement,
        triggers, setTriggers,
        onContext, setOnContext
    }
}