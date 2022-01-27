import PropTypes from "prop-types";
import styles from './styles/Resizable.module.css'
import {useEffect, useRef, useState} from "react";

export default function ResizableBar(props) {
    const ref = useRef()

    const handleMouseMove = (event) => {

        const bBox = ref.current?.previousSibling.getBoundingClientRect()
        const prevBbox = ref.current?.nextSibling.getBoundingClientRect()

        if (props.type === 'width') {
            const newW = (event.clientX - bBox.left)
            const offset = newW - bBox.width
            ref.current.previousSibling.style.width = (event.clientX - bBox.left) + 'px'
            ref.current.nextSibling.style.width =  (prevBbox.width - offset) + 'px'
        }
        else {
            const newH = (event.clientY - bBox.top)
            const offset = newH - bBox.height
            ref.current.previousSibling.style.height = (event.clientY - bBox.top) + 'px'
            ref.current.nextSibling.style.height =  (prevBbox.height - offset) + 'px'
        }
    }
    const handleMouseUp = () => {
        ref.current.parentNode.style.userSelect = 'default'
        document.removeEventListener('mousemove', handleMouseMove)
    }
    const handleMouseDown = () => {
        ref.current.parentNode.style.userSelect = 'none'
        ref.current.parentNode.style.transition = 'none'
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp, {once: true})
    }
    useEffect(() => {
        if(!props.disabled)
        ref.current?.addEventListener('mousedown', handleMouseDown)
        return () => {
            ref.current?.removeEventListener('mousedown', handleMouseDown)
        }
    }, [props.disabled])
    return (
        <div style={{
            background: props.color,
            height: props.type === 'height' ? '3px' : '100%',
            width: props.type === 'width' ? '3px' : '100%',
            cursor: props.type === 'width' ? 'ew-resize' : 'ns-resize'
        }} data-disabled={`${props.disabled}`} className={styles.wrapper} ref={ref}/>
    )
}

ResizableBar.propTypes = {
    type: PropTypes.oneOf(['width', 'height']).isRequired,
    disabled: PropTypes.bool,
    color: PropTypes.string
}