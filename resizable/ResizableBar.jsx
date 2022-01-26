import PropTypes from "prop-types";
import styles from './styles/Resizable.module.css'
import {useEffect, useRef} from "react";

export default function ResizableBar(props) {
    const ref = useRef()
    const handleMouseMove = (event) => {
        const bBox = ref.current?.parentNode.getBoundingClientRect()


        if (props.direction === 'width')
            ref.current.parentNode.style.width = ( event.clientX - bBox.left) + 'px';
        else
            ref.current.parentNode.style.height = (event.clientY - bBox.top) + 'px'
    }
    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
    }
    const handleMouseDown = () => {
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
    }, [props.direction, props.disabled])
    return (
        <div style={{
            top: props.direction === 'width' ? '0' : '100%',
            transform: props.direction === 'width' ? undefined : 'translateY(-100%)',
            height: props.direction === 'height' ? '5px' : '100%',
            width: props.direction === 'width' ? '5px' : '100%',
            cursor: props.direction === 'width' ? 'ew-resize' : 'ns-resize'
        }} data-disabled={`${props.disabled}`} className={styles.wrapper} ref={ref}/>
    )
}

ResizableBar.propTypes = {
    direction: PropTypes.oneOf(['width', 'height']),
    minDimension: PropTypes.number,
    maxDimension: PropTypes.number,
    disabled: PropTypes.bool
}