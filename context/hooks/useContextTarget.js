import {useContext, useEffect, useRef} from "react"
import ContextMenuProvider from "./ContextMenuProvider"

export default function useContextTarget(targetRef, op, tg) {
    const {id, ref} = targetRef,

        {targetElement, setOptions, setTriggers, setTargetElement} = useContext(ContextMenuProvider),
        focused = useRef(false)

    function handler(e){
        if(e.type === "mouseenter") {
            focused.current = true
            if(targetElement.id !== id) {
                setOptions(op)
                setTriggers(tg)
                setTargetElement(targetRef)
            }
        }
        else
            focused.current = false
    }
    useEffect(() => {
        if(focused.current)
            setOptions(op)
        const target = ref ? ref : document.getElementById(id)
        target?.addEventListener("mouseenter", handler)
        target?.addEventListener("mouseleave", handler)
  
        return () => {
            target?.removeEventListener("mouseenter", handler)
            target?.removeEventListener("mouseleave", handler)
        }
    }, [tg, op])
}