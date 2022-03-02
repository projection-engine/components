import PropTypes from "prop-types";
import styles from './styles/Range.module.css'
import {useEffect, useRef, useState} from "react";
import {KEYS} from "../../services/hooks/useHotKeys";

export default function Range(props) {
    const [focused, setFocused] = useState(false)

    let currentValue = props.value
    let locked = false

    const handleMouseMove = (e) => {
        let multiplier = e.movementX

        const increment = Math.abs((props.incrementPercentage ? props.incrementPercentage : 0.1) * multiplier)
        if (!locked) {
            locked = true
            ref.current?.requestPointerLock()
        }
        if (e.movementX < 0 && (currentValue <= props.maxValue || !props.maxValue)) {
            currentValue = parseFloat(currentValue) + increment
            props.handleChange(currentValue.toFixed(1))
        } else if (currentValue >= props.minValue || !props.minValue) {
            currentValue = parseFloat(currentValue) - increment
            props.handleChange(currentValue.toFixed(1))
        }
        if (currentValue > props.maxValue && props.maxValue !== undefined)
            currentValue = props.maxValue
        else if (currentValue < props.minValue && props.minValue !== undefined)
            currentValue = props.minValue

    }
    const ref = useRef()
    const handleMouseDown = (e) => {
        if (!focused && !props.disabled) {

            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', () => {

                locked = false
                document.exitPointerLock()
                document.removeEventListener('mousemove', handleMouseMove)
            }, {once: true})
        } else if (!document.elementsFromPoint(e.clientX, e.clientY).includes(ref.current))
            setFocused(false)
    }
    const [inputCache, setInputCache] = useState(props.value)
    useEffect(() => {
        setInputCache(props.value)
    }, [focused])

    return (
        <div className={styles.wrapper} style={{'--accentColor': props.accentColor}}
             title={props.label}>
            {focused ?
                <input
                    disabled={props.disabled}
                    ref={ref}
                    value={inputCache}
                    onMouseDown={handleMouseDown}

                    onChange={(e) => {
                        setInputCache(e.target.value)
                        // if (isNaN(parseFloat(e.target.value)))
                        //     props.handleChange(0.0)
                        // else
                        //     props.handleChange(parseFloat(e.target.value))
                    }} type={'number'}
                    style={{cursor: 'text', background: 'var(--fabric-background-quaternary)'}}
                    onKeyDown={k => {

                        if(k.key === KEYS.Enter){
                            let finalValue = parseFloat(inputCache)
                            if(!isNaN(finalValue))
                                props.handleChange(finalValue)

                            if (props.onFinish)
                                props.onFinish()

                            setFocused(false)
                        }
                    }}
                    onBlur={() => {
                        let finalValue = parseFloat(inputCache)
                        console.log(finalValue, !isNaN(finalValue))
                        if (!isNaN(finalValue)) {
                            if (props.maxValue !== undefined && finalValue > props.maxValue)
                                finalValue = props.maxValue
                            if (props.minValue !== undefined && finalValue < props.minValue)
                                finalValue = props.minValue

                            props.handleChange(finalValue)
                        }

                        if (props.onFinish)
                            props.onFinish()

                        setFocused(false)
                    }}
                    className={styles.draggable}
                />
                :
                <div
                    ref={ref}
                    onMouseDown={handleMouseDown}
                    onMouseUp={() => {
                        if (props.onFinish)
                            props.onFinish()
                    }}
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
    metric: PropTypes.oneOf(['angle', 'cm', 'm', 'un']),

    maxValue: PropTypes.number,
    minValue: PropTypes.number,

    onFinish: PropTypes.func,
    accentColor: PropTypes.string,
    disabled: PropTypes.bool,
    incrementPercentage: PropTypes.number,
    increment: PropTypes.number,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    handleChange: PropTypes.func
}