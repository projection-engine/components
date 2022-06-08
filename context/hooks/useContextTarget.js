import {useContext, useEffect, useRef} from "react"
import ContextMenuProvider from "./ContextMenuProvider"

export default function useContextTarget(targetRef, options, triggers) {
    const {id, ref} = targetRef,
        state= useContext(ContextMenuProvider),
        focused = useRef(false)
    function handler(e){
        if(e.type === "mouseenter") {
            focused.current = true

            if(state.target?.id !== id) {
                state.options = options
                state.target = targetRef
                state.triggers = triggers
            }
        }
        else
            focused.current = false
    }
    // useEffect(() => {
    //     console.log("UPDATED BECAUSE TARGET")
    // } , [state.target])
    // useEffect(() => {
    //     console.log("UPDATED BECAUSE OPTIONS")
    // } , [options])
    // useEffect(() => {
    //     console.log("UPDATED BECAUSE TRIGGERS")
    // } , [triggers])
    useEffect(() => {
        if(focused.current)
            state.options = options
        const target = ref ? ref : document.getElementById(id)
        target?.addEventListener("mouseenter", handler)
        target?.addEventListener("mouseleave", handler)
  
        return () => {
            target?.removeEventListener("mouseenter", handler)
            target?.removeEventListener("mouseleave", handler)
        }
    }, [triggers, options, state.target])
}