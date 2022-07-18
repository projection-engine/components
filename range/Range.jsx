import styles from "./styles/Range.module.css"
import PropTypes from "prop-types"
import React, {useEffect, useRef, useState} from "react"

const DELAY = 200
export default function Range(props) {
    const [focused, setFocused] = useState(false)
    const dragged = useRef(false)
    const ref = useRef(), inputRef = useRef()
    const currentValue = useRef(0)
    const handleMouseMove = (e) => {
        let multiplier = e.movementX
        dragged.current = true
        const increment = props.integer ? 1 : Math.abs((props.incrementPercentage ? props.incrementPercentage : 0.1) * multiplier)

        if (e.movementX < 0 && (currentValue.current <= props.maxValue || !props.maxValue))
            currentValue.current = parseFloat((currentValue.current + increment).toFixed(props.precision ? props.precision : 1))
        else if (currentValue.current >= props.minValue || !props.minValue)
            currentValue.current = parseFloat((currentValue.current - increment).toFixed(props.precision ? props.precision : 1))

        if (props.integer)
            currentValue.current = Math.round(parseInt(currentValue.current))

        if (currentValue.current > props.maxValue && props.maxValue !== undefined)
            currentValue.current = props.maxValue
        else if (currentValue.current < props.minValue && props.minValue !== undefined)
            currentValue.current = props.minValue


        const v = currentValue.current.toFixed(props.precision ? props.precision : 1)

        ref.current.innerText = v
        inputRef.current.value = v

        if (props.handleChange)
            props.handleChange(currentValue.current)
    }

    let timeout
    const onChange = (input) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            let finalValue = parseFloat(input.value)

            if (!isNaN(finalValue)) {
                if (props.maxValue !== undefined && finalValue > props.maxValue)
                    finalValue = props.maxValue
                if (props.minValue !== undefined && finalValue < props.minValue)
                    finalValue = props.minValue

                if (props.handleChange)
                    props.handleChange(finalValue)
            }

            if (props.onFinish !== undefined)
                props.onFinish(finalValue)
        }, DELAY)
    }

    useEffect(() => {
        if (!dragged.current) {
            const parsedValue = isNaN(parseFloat(props.value)) ? 0 : parseFloat(parseFloat(props.value).toFixed(props.precision ? props.precision : 1))
            inputRef.current.value = parsedValue
            ref.current.innerText = parsedValue
            currentValue.current = parsedValue
        }
    }, [props.value])


    return (

        <div
            className={[styles.wrapper, styles.labeledWrapper].join(" ")}
            data-variant={props.variant}
            style={{"--accent-color": props.accentColor}}
        >
            {props.label ?
                <label title={props.label} style={{minWidth: props.minLabelWidth}}>{props.label}</label> : null}
            <input
                ref={inputRef}
                disabled={props.disabled}
                autoFocus={true}
                onChange={(e) => onChange(e.target)}
                type={"number"}
                style={{
                    display: focused ? undefined : "none",
                    cursor: "text",
                    background: "var(--pj-background-quaternary)",
                    borderRadius: !props.accentColor ? "3px" : undefined
                }}
                className={styles.draggable}
                onBlur={() => setFocused(false)}
            />

            <div
                ref={ref}
                data-disabled={`${props.disabled}`}
                onMouseDown={() => {
                    if (!focused && !props.disabled)
                        ref.current?.requestPointerLock()
                }}
                onMouseMove={(e) => {
                    if (document.pointerLockElement)
                        handleMouseMove(e)
                }}
                onMouseUp={() => {
                    document.exitPointerLock()
                    if (props.onFinish !== undefined)
                        props.onFinish(currentValue.current)
                    if (!props.disabled) {
                        if (!dragged.current)
                            setFocused(true)
                        else
                            dragged.current = false
                    }
                }}
                style={{
                    display: !focused ? undefined : "none",
                    color: props.disabled ? "#999" : undefined,
                    cursor: props.disabled ? "default" : undefined,
                    background: props.disabled ? "var(--background-0)" : undefined,
                    borderRadius: !props.accentColor || props.disabled ? "3px" : undefined
                }}
                className={styles.draggable}
            />
        </div>
    )
}
Range.propTypes = {
    minLabelWidth: PropTypes.string,
    variant: PropTypes.oneOf(["embedded", "default"]),
    label: PropTypes.string,
    precision: PropTypes.number,
    maxValue: PropTypes.number,
    minValue: PropTypes.number,
    onFinish: PropTypes.func,
    accentColor: PropTypes.string,
    disabled: PropTypes.bool,
    incrementPercentage: PropTypes.number,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    handleChange: PropTypes.func,
    integer: PropTypes.bool
}