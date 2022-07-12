import React, {useEffect, useRef} from "react"
import styles from "./styles/ContextMenu.module.css"
import * as DOM from "react-dom/client"
import Options from "./Options"

function checkMouseOffset(startPosition, event) {
    return Math.abs(startPosition.x - event.clientX) < 10 && Math.abs(startPosition.y - event.clientY) < 10
}

function setPlacementOffset(target, event) {
    const bBox = target.getBoundingClientRect()
    if (event.clientX + bBox.width > document.body.offsetWidth)
        target.style.left = (event.clientX - bBox.width / 2) + "px"
    else
        target.style.left = event.clientX + "px"
    if (event.clientY + bBox.height > document.body.offsetHeight) {
        target.style.top = event.clientY - bBox.height + "px"
    } else
        target.style.top = event.clientY + "px"
    target.style.zIndex = "999"
}

const RIGHT_BUTTON = 2
export default function Context() {
    const contextRef = useRef()
    const root = useRef()
    let startPosition = {}, locked = false
    const handleContext = (event) => {
        if (event.button === RIGHT_BUTTON && !locked) {
            event.preventDefault()
            if (!root.current)
                root.current = DOM.createRoot(contextRef.current)
            if (checkMouseOffset(startPosition, event)) {
                const targets = document.elementsFromPoint(event.clientX, event.clientY)
                    .filter(t => {
                        let hasAttribute = false
                        const attributes = Array.from(t.attributes)
                        for (let i = 0; i < attributes.length; i++) {
                            const attr = attributes[i]
                            if (!attr.nodeName.includes("data-"))
                                continue
                            const has = window.contextMenu.triggers.find(f => attr.nodeName === f)
                            if (has)
                                hasAttribute = hasAttribute || has

                        }
                        if (hasAttribute)
                            return t
                    })

                if (targets[0]) {
                    let trigger
                    Array.from(targets[0].attributes).forEach((attr) => {
                        const has = window.contextMenu.triggers.find((f) => attr.nodeName === f)
                        if (has)
                            trigger = has
                    })
                    root.current.render(
                        <Options
                            options={window.contextMenu.options}
                            selected={targets[0]}
                            trigger={trigger}
                            event={event}
                            setPadding={p => {
                                contextRef.current.style.paddingBottom = p
                            }}
                            close={() => {
                                contextRef.current.style.zIndex = "-1"
                            }}
                        />
                    )
                    setPlacementOffset(contextRef.current, event)
                }
            }
            startPosition = {x: 0, y: 0}
        }
    }

    const handleMouseDown = (event) => {
        startPosition = {x: event.clientX, y: event.clientY}
        if (contextRef.current && !document.elementsFromPoint(event.clientX, event.clientY).includes(contextRef.current))
            contextRef.current.style.zIndex = "-1"
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleMouseDown)
        contextRef.current.parentNode.addEventListener("mouseup", handleContext)
        document.onpointerlockchange = () => {
            locked = !!document.pointerLockElement
        }
        return () => {
            document.onpointerlockchange = undefined
            document.removeEventListener("mousedown", handleMouseDown)
            contextRef.current.parentNode.removeEventListener("mouseup", handleContext)
        }
    }, [])

    return (
        <div className={styles.wrapper} ref={contextRef}/>
    )
}