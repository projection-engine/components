import PropTypes from "prop-types";
import styles from './styles/Range.module.css'
import {useRef, useState} from "react";
import {Button} from "@f-ui/core";

export default function Range(props) {
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    let lastMousePlacement = undefined

    let currentValue = props.value
    const handleMouseMove = (e) => {
        if (lastMousePlacement === undefined)
            lastMousePlacement = e.clientX

        if (lastMousePlacement >= e.clientX) {
            currentValue = parseFloat(currentValue) + Math.abs((props.incrementPercentage ? props.incrementPercentage : 0.1) * (e.clientX - lastMousePlacement))
            props.handleChange(currentValue.toFixed(1))
        } else {
            currentValue = parseFloat(currentValue) - Math.abs((props.incrementPercentage ? props.incrementPercentage : 0.1) * (e.clientX - lastMousePlacement))
            props.handleChange(currentValue.toFixed(1))
        }


        lastMousePlacement = e.clientX
    }
    const ref = useRef()
    const handleMouseDown = (e) => {
        if (!focused && !props.disabled) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', handleMouseMove)
                lastMousePlacement = undefined
            }, {once: true})
        } else if (!document.elementsFromPoint(e.clientX, e.clientY).includes(ref.current))
            setFocused(false)
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.labelWrapper}>
                {props.label}
            </div>
            <div className={styles.content} onMouseEnter={() => setHovered(true)}
                 onMouseLeave={() => setHovered(false)}>
                {hovered && !props.disabled ?
                    <Button

                        className={styles.button}
                        onClick={() => {
                            props.handleChange((parseFloat(props.value) + (props.increment ? props.increment : 0.1)).toFixed(1))
                        }}
                    >
                        <span className={'material-icons-round'}>chevron_left</span>
                    </Button>
                    :
                    <div className={styles.button}/>
                }
                {focused ?
                    <input
                        disabled={props.disabled}
                        ref={ref}
                        value={props.value}
                        onMouseDown={handleMouseDown}
                        onChange={(e) => {
                            if (isNaN(parseFloat(e.target.value)))
                                props.handleChange(0.0)
                            else
                                props.handleChange(parseFloat(e.target.value))
                        }} type={'number'}
                        style={{cursor: 'text',background: 'var(--background-3)'}}
                        onBlur={() => {
                            setFocused(false)
                        }}
                        className={styles.draggable}
                    />
                    :
                    <div
                        ref={ref}
                        onMouseDown={handleMouseDown}
                        style={{
                            color: props.disabled ? 'var(--fabric-color-quaternary)' : undefined,
                            cursor: props.disabled ? 'default' : undefined,
                            background: props.disabled ? 'var(--background-0)' : undefined
                        }}
                        onDoubleClick={() => setFocused(true)}
                        className={styles.draggable}
                    >
                        {parseFloat(props.value).toFixed(1)}
                    </div>
                }

                {hovered && !props.disabled ?
                    <Button
                        className={styles.button}
                        onClick={() => {
                            props.handleChange((parseFloat(props.value) - (props.increment ? props.increment : 0.1)).toFixed(1))
                        }}>
                        <span className={'material-icons-round'}>chevron_right</span>
                    </Button>
                    :
                    <div className={styles.button}/>
                }
            </div>

        </div>
    )

}

Range.propTypes = {
    disabled: PropTypes.bool,
    incrementPercentage: PropTypes.number,
    increment: PropTypes.number,
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    handleChange: PropTypes.func
}