import styles from "./styles/Styles.module.css"
import PropTypes from "prop-types"
import Range from "../range/Range"
import React from "react"

export default function LabeledRange(props) {
    return (
        <div
            className={styles.wrapper}
            data-variant={props.variant}
            style={{background: props.disabled ? "transparent" : undefined}}
        >
            <label title={props.label} style={{minWidth: props.minLabelWidth}}>{props.label}</label>
            {props.variant === "embedded" ? <div className={styles.divider}/> : undefined}
            <Range {...props} styles={{width: "100%"}} accentColor={props.variant === "embedded" ? undefined : props.accentColor}/>
        </div>
    )
}
LabeledRange.propTypes = {
    minLabelWidth: PropTypes.string,
    variant: PropTypes.oneOf(["embedded", "default"]),
    label: PropTypes.string,
    styles: PropTypes.object,

    metric: PropTypes.string,
    precision: PropTypes.number,
    maxValue: PropTypes.number,
    minValue: PropTypes.number,

    onFinish: PropTypes.func,
    accentColor: PropTypes.string,
    disabled: PropTypes.bool,
    incrementPercentage: PropTypes.number,
    hideValue: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    handleChange: PropTypes.func
}