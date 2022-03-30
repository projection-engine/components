import PropTypes from "prop-types";
import styles from './styles/Resizable.module.css'
import {useEffect, useRef} from "react";

export default function ResizableBar(props) {
    const ref = useRef()

    const handleMouseMove = (event) => {
        if (props.onResize)
            props.onResize()

        const bBox = ref.current?.previousSibling.getBoundingClientRect()
        const prevBbox = ref.current?.nextSibling.getBoundingClientRect()

        if (props.type === 'width') {
            const newW = (event.clientX - bBox.left)
            const offset = newW - bBox.width
            ref.current.previousSibling.style.width = (event.clientX - bBox.left) + 'px'
            ref.current.nextSibling.style.width = (prevBbox.width - offset) + 'px'
        } else {
            const newH = (event.clientY - bBox.top)
            const offset = newH - bBox.height
            ref.current.previousSibling.style.height = (event.clientY - bBox.top) + 'px'
            ref.current.nextSibling.style.height = (prevBbox.height - offset) + 'px'
        }
    }
    const handleMouseUp = () => {
        if (props.onResizeEnd)
            props.onResizeEnd()
        ref.current.parentNode.style.userSelect = 'default'
        document.removeEventListener('mousemove', handleMouseMove)
    }
    const handleMouseDown = () => {
        if (!props.disabled) {
            if (props.onResizeStart)
                props.onResizeStart()
            ref.current.parentNode.style.userSelect = 'none'
            ref.current.parentNode.style.transition = 'none'
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp, {once: true})
        }
    }

    useEffect(() => {
        const initialW1 = ref.current.previousSibling.style.width,initialW2 = ref.current.nextSibling.style.width,
            initialH1 = ref.current.previousSibling.style.height,initialH2  =ref.current.nextSibling.style.height
        const r = new ResizeObserver(() => {
            if(ref.current) {
                if (props.type === 'width') {
                    ref.current.previousSibling.style.width = initialW1
                    ref.current.nextSibling.style.width = initialW2
                } else {
                    ref.current.previousSibling.style.height = initialH1
                    ref.current.nextSibling.style.height = initialH2
                }
            }
        })
        r.observe(document.body)
    }, [])
    return (
        <div
            onMouseDown={handleMouseDown}
            style={{
                background: props.color,
                minHeight: props.type === 'height' ? '3px' : '100%',
                maxHeight: props.type === 'height' ? '3px' : '100%',
                minWidth: props.type === 'width' ? '3px' : '100%',
                maxWidth: props.type === 'width' ? '3px' : '100%',
                cursor: props.type === 'width' ? 'ew-resize' : 'ns-resize'
            }}
            data-disabled={`${props.disabled}`}
            className={styles.wrapper} ref={ref}/>
    )
}

ResizableBar.propTypes = {
    onResize: PropTypes.func,
    onResizeEnd: PropTypes.func,
    onResizeStart: PropTypes.func,
    type: PropTypes.oneOf(['width', 'height']).isRequired,
    disabled: PropTypes.bool,
    color: PropTypes.string
}