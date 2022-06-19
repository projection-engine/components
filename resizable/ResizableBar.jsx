import PropTypes from "prop-types"
import styles from "./styles/Resizable.module.css"
import React, {useEffect, useRef} from "react"

export default function ResizableBar(props) {
    const ref = useRef()

    const handleMouseMove = (event) => {
        if (props.onResize)
            props.onResize()
        try{
            const bBox = ref.current?.previousSibling.getBoundingClientRect()
            const prevBbox = ref.current?.nextSibling.getBoundingClientRect()
            if (props.type === "width") {
                const newW = (event.clientX - bBox.left)
                const offset = newW - bBox.width
                ref.current.previousSibling.style.width = (event.clientX - bBox.left) + "px"
                ref.current.nextSibling.style.width = (prevBbox.width - offset) + "px"
            } else {
                const newH = (event.clientY - bBox.top)
                const offset = newH - bBox.height
                ref.current.previousSibling.style.height = (event.clientY - bBox.top) + "px"
                ref.current.nextSibling.style.height = (prevBbox.height - offset) + "px"
            }

        }catch (err){
            console.error(err)
            document.removeEventListener("mousemove", handleMouseMove)
        }
    }
    const handleMouseUp = () => {
        try{
            if (props.onResizeEnd)
                props.onResizeEnd(ref.current.nextSibling, ref.current.previousSibling)
            ref.current.parentNode.style.userSelect = "default"
            document.removeEventListener("mousemove", handleMouseMove)
        }catch (err){
            console.error(err)
            document.removeEventListener("mousemove", handleMouseMove)
        }
    }
    const handleMouseDown = (event) => {

        if (!props.disabled) {
            const siblings = Array.from(event.currentTarget.parentNode.children)
            const t = props.type === "width" ? "width" : "height"
            const next = event.currentTarget.nextSibling
            const prev = event.currentTarget.previousSibling
            siblings.forEach(s => {
                if(s !== prev && s !== next)
                    s.style[t] = s.getBoundingClientRect()[t] + "px"
            })
            if (props.onResizeStart)
                props.onResizeStart()
            event.currentTarget.parentNode.style.userSelect = "none"
            event.currentTarget.style.transition = "none"
            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp, {once: true})
        }
    }

    const initial = useRef({})
    const callback = () => {
        try{
            if (props.type === "width") {
                ref.current.previousSibling.style.width = initial.current.initialW1
                ref.current.nextSibling.style.width = initial.current.initialW2
            } else {
                ref.current.previousSibling.style.height = initial.current.initialH1
                ref.current.nextSibling.style.height = initial.current.initialH2
            }
        }catch (err) {}
    }

    useEffect(() => {
        const resize = new ResizeObserver(callback)
        const mutation = new MutationObserver(callback)

        if (ref.current.previousSibling) {
            const initialW1 = ref.current.previousSibling.style.width, initialW2 = ref.current.nextSibling.style.width,
                initialH1 = ref.current.previousSibling.style.height, initialH2 = ref.current.nextSibling.style.height
            initial.current = {initialW1, initialW2, initialH1, initialH2}
            mutation.observe(ref.current.parentNode, {childList: true})
            resize.observe(document.body)
        }

        if (props.type === "width") {
            if(props.resetTargets?.previous)
                ref.current.previousSibling.style.width = initial.current.initialW1
            if(props.resetTargets?.next)
                ref.current.nextSibling.style.width = initial.current.initialW2
        } else {
            if(props.resetTargets?.previous)
                ref.current.previousSibling.style.height = initial.current.initialH1
            if(props.resetTargets?.next)
                ref.current.nextSibling.style.height = initial.current.initialH2
        }
        return () => {
            mutation.disconnect()
            resize.disconnect()
        }
    }, [props.resetWhen])
    useEffect(() => {
        return () => {
            console.log(initial.current)
            if(ref.current?.previousSibling)
                ref.current.previousSibling.style[props.type] = "100%"
            if(ref.current?.nextSibling)
                ref.current.nextSibling.style[props.type] = "100%"
        }
    }, [])
    return (
        <div
            onMouseDown={handleMouseDown}
            style={{
                background: props.color,
                minHeight: props.type === "height" ? "3px" : "100%",
                maxHeight: props.type === "height" ? "3px" : "100%",
                minWidth: props.type === "width" ? "3px" : "100%",
                maxWidth: props.type === "width" ? "3px" : "100%",
                cursor: props.type === "width" ? "ew-resize" : "ns-resize"
            }}
            data-disabled={`${props.disabled}`}
            className={styles.wrapper} ref={ref}/>
    )
}

ResizableBar.propTypes = {
    resetTargets: PropTypes.shape({
        next: PropTypes.bool,
        previous: PropTypes.bool,
    }),
    resetWhen: PropTypes.array,
    onResize: PropTypes.func,
    onResizeEnd: PropTypes.func,
    onResizeStart: PropTypes.func,
    type: PropTypes.oneOf(["width", "height"]).isRequired,
    disabled: PropTypes.bool,
    color: PropTypes.string
}