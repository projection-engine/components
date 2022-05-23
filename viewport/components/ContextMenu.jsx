import PropTypes from "prop-types";
import React, {useContext, useEffect, useRef, useState} from "react";
import GPUContextProvider from "../hooks/GPUContextProvider";
import styles from '../styles/ContextMenu.module.css'
import {Button} from "@f-ui/core";

const BUTTON_RIGHT = 2
export default function ContextMenu(props) {
    const {gpu, renderer} = useContext(GPUContextProvider)
    const [open, setOpen] = useState(false)
    const ref = useRef()

    function handler(event) {
        if (event.button === BUTTON_RIGHT) {
            setOpen(!open)
            ref.current.style.left = event.clientX + 'px'
            ref.current.style.top = event.clientY + 'px'
            const target = gpu.canvas.getBoundingClientRect()
            renderer.testClick({x: event.clientX - target.left, y: event.clientY - target.top}, false, true)
        } else
            setOpen(false)

    }

    const first = useRef(false)
    useEffect(() => {
        if (!first.current) {
            ref.current.parentNode.removeChild(ref.current)
            document.body.appendChild(ref.current)
            first.current = true
        }

        gpu.canvas.addEventListener('mousedown', handler)
        return () => gpu.canvas.removeEventListener('mousedown', handler)
    }, [open, renderer])
    return (
        <div ref={ref} style={{display: open && props.options.length > 0 ? undefined : 'none'}}
             className={styles.wrapper}>
            {props.options.map((o, i) => (
                <React.Fragment key={'viewport-option-' + i}>
                    <Button
                        className={styles.button}
                        onClick={() => {
                            console.log(o)
                            o.onClick()
                        }}>
                        <div className={styles.icon}>
                            <span style={{fontSize: '1.1rem'}}
                                  className={'material-icons-round'}>{o.icon}</span>
                        </div>
                        {o.label}
                    </Button>
                </React.Fragment>
            ))}
        </div>
    )
}

ContextMenu.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        icon: PropTypes.string,
        onClick: PropTypes.func
    }))
}