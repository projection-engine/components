import PropTypes from "prop-types";
import styles from './styles/Range.module.css'
import {useEffect, useRef, useState} from "react";
import {KEYS} from "../../services/hooks/useHotKeys";

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

        props.handleChange(currentValue)
    }
    const ref = useRef()

    useEffect(() => {
        setInputCache(props.value)
    }, [focused])

    return (
        <div
            data-disabled={`${props.disabled}`}
            className={styles.wrapper}
            style={{'--accentColor': props.accentColor, borderRadius: !props.accentColor ? '5px' : undefined}}
            title={props.label}>
            {focused ?
                <input
                    disabled={props.disabled}
                    ref={ref}
                    value={inputCache}

                    autoFocus={true}
                    onChange={(e) => {
                        setInputCache(e.target.value)
                    }} type={'number'}
                    style={{cursor: 'text', background: 'var(--fabric-background-quaternary)'}}
                    onKeyDown={k => {

                        if (k.key === KEYS.Enter) {
                            let finalValue = parseFloat(inputCache)
                            if (props.onFinish !== undefined)
                                props.onFinish()

                            if (!isNaN(finalValue))
                                props.handleChange(props.integer ? parseInt(finalValue) : finalValue)

                            setFocused(false)
                        }
                    }}
                    onBlur={() => {
                        let finalValue = parseFloat(inputCache)

                        if (props.onFinish !== undefined)
                            props.onFinish()

                        if (!isNaN(finalValue)) {
                            if (props.maxValue !== undefined && finalValue > props.maxValue)
                                finalValue = props.maxValue
                            if (props.minValue !== undefined && finalValue < props.minValue)
                                finalValue = props.minValue

                            props.handleChange(props.integer ? parseInt(finalValue) : finalValue)
                        }


                        setFocused(false)
                    }}
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
                            props.onFinish()
                        if (!props.disabled) {
                            if (!dragged)
                                setFocused(true)
                            else
                                setDragged(false)
                        }
                    }}
                    style={{
                        color: props.disabled ? '#999999' : undefined,
                        cursor: props.disabled ? 'default' : undefined,
                        background: props.disabled ? 'var(--background-0)' : undefined
                    }}

                    className={styles.draggable}
                >
                    {parseFloat(props.value).toFixed(props.precision ? props.precision : 1)}
                </div>
            }
            {props.metric ?
                <div className={styles.metricWrapper}>
                    {props.metric === 'angle' ? 'θ' : props.metric}
                </div>
                :
                null
            }
        </div>
    )

}

Range.propTypes = {
    metric: PropTypes.string,
    precision: PropTypes.number,
    maxValue: PropTypes.number,
    minValue: PropTypes.number,

    onFinish: PropTypes.func,
    accentColor: PropTypes.string,
    disabled: PropTypes.bool,
    incrementPercentage: PropTypes.number,

    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    handleChange: PropTypes.func
}