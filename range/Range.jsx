import PropTypes from "prop-types"
import styles from "./styles/Range.module.css"
import React, {useEffect, useRef, useState} from "react"
import KEYS from "../../project/engine/templates/KEYS"
import {Icon} from "@f-ui/core"

export default function Range(props) {
    const [focused, setFocused] = useState(false)
    const [inputCache, setInputCache] = useState(parseFloat(props.value))
    const [dragged, setDragged] = useState(false)
    let currentValue = parseFloat(props.value)

    const handleMouseMove = (e) => {

        let multiplier = e.movementX
        setDragged(true)
        const increment = props.integer ? 1 : Math.abs((props.incrementPercentage ? props.incrementPercentage : 0.1) * multiplier)

        if (e.movementX < 0 && (currentValue <= props.maxValue || !props.maxValue))
            currentValue = parseFloat((currentValue + increment).toFixed(props.precision ? props.precision : 1))
        else if (currentValue >= props.minValue || !props.minValue)
            currentValue = parseFloat((currentValue - increment).toFixed(props.precision ? props.precision : 1))

        if (props.integer)
            currentValue = parseInt(Math.round(currentValue))


        if (currentValue > props.maxValue && props.maxValue !== undefined)
            currentValue = props.maxValue
        else if (currentValue < props.minValue && props.minValue !== undefined)
            currentValue = props.minValue

        if(!props.hideValue)
            ref.current.innerText = currentValue.toFixed(props.precision ? props.precision : 1)
        props.handleChange(currentValue)
    }
    const ref = useRef()

    useEffect(() => {
        setInputCache(props.value)
    }, [focused])
    const submit = () => {
        let finalValue = parseFloat(inputCache)

        if (!isNaN(finalValue)) {
            if (props.maxValue !== undefined && finalValue > props.maxValue)
                finalValue = props.maxValue
            if (props.minValue !== undefined && finalValue < props.minValue)
                finalValue = props.minValue

            props.handleChange(finalValue)
        }

        if (props.onFinish !== undefined)
            props.onFinish(finalValue)

        setFocused(false)
    }
    return (
        <div
            data-disabled={`${props.disabled}`}
            className={styles.wrapper}
            style={{"--accentColor": props.accentColor, borderRadius: !props.accentColor ? "3px" : undefined, ...props.styles}}
            title={props.title}>
            {focused ?
                <input
                    disabled={props.disabled}
                    ref={ref}
                    value={inputCache}

                    autoFocus={true}
                    onChange={(e) => {
                        setInputCache(e.target.value)
                    }} type={"number"}
                    style={{cursor: "text", background: "var(--pj-background-quaternary)"}}
                    onKeyDown={k => {

                        if (k.key === KEYS.Enter)
                            submit()
                    }}
                    onBlur={() => submit()}
                    className={styles.draggable}
                />
                :
                <div
                    ref={ref}
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
                            props.onFinish(currentValue)
                        if (!props.disabled) {
                            if (!dragged)
                                setFocused(true)
                            else
                                setDragged(false)
                        }
                    }}
                    style={{
                        color: props.disabled ? "#999999" : undefined,
                        cursor: props.disabled ? "default" : undefined,
                        background: props.disabled ? "var(--background-0)" : undefined
                    }}
                    className={styles.draggable}
                >
                    <div className={styles.overflow}>
                        {props.hideValue ? <Icon styles={{transform: "rotate(90deg)", fontSize: "1.1rem"}}>unfold_more</Icon> : currentValue.toFixed(props.precision ? props.precision : 1)}
                    </div>
                </div>
            }
            {props.metric ?
                <div className={styles.metricWrapper}>
                    {props.metric === "angle" ? "θ" : props.metric}
                </div>
                :
                null
            }
        </div>
    )

}

Range.propTypes = {

    hideValue: PropTypes.bool,
    title: PropTypes.string,
    styles: PropTypes.object,

    metric: PropTypes.string,
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