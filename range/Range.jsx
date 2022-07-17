import styles from "./styles/Range.module.css"
import PropTypes from "prop-types"
import React, {useEffect, useRef, useState} from "react"
import {Icon} from "@f-ui/core"

const DELAY = 200
export default function Range(props) {
    const [focused, setFocused] = useState(false)
    const [dragged, setDragged] = useState(false)
    const ref = useRef(), inputRef = useRef()
    const checkValue = () => isNaN(parseFloat(props.value))
    let currentValue = checkValue() ? 0 : parseFloat(props.value)
    const handleMouseMove = (e) => {
        let multiplier = e.movementX
        setDragged(true)
        const increment = props.integer ? 1 : Math.abs((props.incrementPercentage ? props.incrementPercentage : 0.1) * multiplier)

        if (e.movementX < 0 && (currentValue <= props.maxValue || !props.maxValue))
            currentValue = parseFloat((currentValue + increment).toFixed(props.precision ? props.precision : 1))
        else if (currentValue >= props.minValue || !props.minValue)
            currentValue = parseFloat((currentValue - increment).toFixed(props.precision ? props.precision : 1))

        if (props.integer)
            currentValue = Math.round(parseInt(currentValue))

        if (currentValue > props.maxValue && props.maxValue !== undefined)
            currentValue = props.maxValue
        else if (currentValue < props.minValue && props.minValue !== undefined)
            currentValue = props.minValue

        if (!props.hideValue) {
            const v = currentValue.toFixed(props.precision ? props.precision : 1)
            ref.current.innerText = v
            inputRef.current.value = v
        }
        if (props.handleChange)
            props.handleChange(currentValue)
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
        inputRef.current.value = checkValue() ? 0 : parseFloat(props.value)
    }, [])

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
                    currentValue = parseFloat(props.value)
                    if (document.pointerLockElement)
                        handleMouseMove(e)
                }}
                onMouseUp={() => {
                    document.exitPointerLock()
                    if (props.onFinish !== undefined)
                        props.onFinish(currentValue)
                    if (!props.disabled) {
                        if (!dragged)
                            setFocused(true)
                        else
                            setDragged(false)
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
            >
                <div className={styles.overflow}>
                    {props.hideValue ? <Icon styles={{
                        transform: "rotate(90deg)",
                        fontSize: "1.1rem"
                    }}>unfold_more</Icon> : currentValue.toFixed(props.precision ? props.precision : 1)}
                </div>
            </div>
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
    hideValue: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    handleChange: PropTypes.func,
    integer: PropTypes.bool
}