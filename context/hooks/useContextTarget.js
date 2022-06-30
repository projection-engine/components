import {useContext, useEffect, useRef} from "react"
import ContextMenuProvider from "./ContextMenuProvider"

export default function useContextTarget(targetRef, options, triggers) {
    const {id, ref} = targetRef,
        [state, setState]= useContext(ContextMenuProvider),
        focused = useRef(false)
    function handler(e){
        if(e.type === "mouseenter") {
            focused.current = true

            if(state.target?.id !== id) {
                setState({
                    options,
                    triggers,
                })
            }
        }
        else
            focused.current = false
    }

    useEffect(() => {
        if(focused.current)
            setState(prev => ({
                ...prev,
                options,
            }))

        const target = ref ? ref : document.getElementById(id)
        target?.addEventListener("mouseenter", handler)
        target?.addEventListener("mouseleave", handler)
  
        return () => {
            target?.removeEventListener("mouseenter", handler)
            target?.removeEventListener("mouseleave", handler)
        }
    }, [triggers, options, state.target])
}