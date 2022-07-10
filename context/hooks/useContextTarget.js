import {useEffect, useRef} from "react"

export default function useContextTarget(targetRef, options, triggers) {
    const focused = useRef(false)
    function handler(e){
        if(e.type === "mouseenter") {
            focused.current = true
            if(window.contextMenu.target !== e.currentTarget) {
                window.contextMenu.options= options
                window.contextMenu.triggers= triggers
                window.contextMenu.target = e.currentTarget
            }
        }
        else
            focused.current = false
    }

    useEffect(() => {
        if(focused.current)
            window.contextMenu.options = options
        const target = typeof targetRef === "string" ? document.getElementById(targetRef) : targetRef
        if(target){
            target.addEventListener("mouseenter", handler)
            target.addEventListener("mouseleave", handler)
            return () => {
                target.removeEventListener("mouseenter", handler)
                target.removeEventListener("mouseleave", handler)
            }
        }
    }, [triggers, options])
}