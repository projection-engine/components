import React, {useContext, useEffect, useRef} from "react"
import ReactDOM from "react-dom"
import styles from "../styles/DragDrop.module.css"
import {ThemeContext} from "@f-ui/core"

export default function useDragDrop(props) {
    const {
        disabled,
        onDrop,
        onDragOver,
        onDragLeave,
        onDragStart,
        dragImage,
        dragData,
        dragIdentifier
    } = props

    const event = new CustomEvent('trigger-dragdrop', {detail: dragData});
    const ref = useRef()

    const theme = useContext(ThemeContext)
    const toolTip = (
        <div className={[styles.container, theme.dark ? styles.dark : styles.light].join(' ')}>
            {dragImage}
        </div>
    )
    const mountingPoint = useRef()
    let isFirst = true
    const handleMouseMove = (e) => {
        if (isFirst) {

            isFirst = false
            if (onDragStart)
                onDragStart()
        }

        const bBox = mountingPoint.current?.getBoundingClientRect()

        mountingPoint.current.style.left = (e.clientX + 10) + 'px'
        mountingPoint.current.style.top = (e.clientY + 10) + 'px'

        let transform = {x: '0px', y: '0px'}
        if ((e.clientX + 10 + bBox.width) > document.body.offsetWidth)
            transform.x = 'calc(-100% - 10px)'
        if ((e.clientY + 10 + bBox.height) > document.body.offsetHeight)
            transform.y = 'calc(-100% - 10px)'

        mountingPoint.current.style.transform = `translate(${transform.x}, ${transform.y})`
    }
    const hover = (e) => {

        mountingPoint.current.style.position = 'fixed'
        mountingPoint.current.style.zIndex = '999'
        ReactDOM.render(
            toolTip,
            mountingPoint.current
        )
        mountingPoint.current.style.left = (e.clientX + 10) + 'px'
        mountingPoint.current.style.top = (e.clientY + 10) + 'px'

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', (e) => {
            document.elementsFromPoint(e.clientX, e.clientY).forEach(t => {
                const attr = t.getAttribute('data-dragdata')

                if (attr && dragIdentifier.includes(attr)) {
                    try {
                        t.dispatchEvent(event)

                    } catch (e) {
                    }
                }
            })
            onExit()
            isFirst = true
        }, {once: true})
    }

    useEffect(() => {
        const m = document.getElementById('drag-drop-mounting-point')
        if (!mountingPoint.current && !m) {
            mountingPoint.current = document.createElement("div")
            mountingPoint.current.setAttribute('id', 'drag-drop-mounting-point')

            document.body.appendChild(mountingPoint.current)
        } else
            mountingPoint.current = m
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    const onExit = () => {
        try {
            document.removeEventListener('mousemove', handleMouseMove)
            if (mountingPoint.current)
                ReactDOM.unmountComponentAtNode(mountingPoint.current)
        } catch (e) {

        }
    }

    useEffect(() => {
        return () => {
            ref.current?.removeEventListener('mousedown', hover)
            onExit()
        }
    }, [])

    return {ref, hover}
}