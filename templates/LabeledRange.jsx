import styles from './styles/Styles.module.css'
import PropTypes from "prop-types";
import Range from "../range/Range";

export default function LabeledRange(props) {
    return (
        <div
            className={styles.wrapper}
        >
            <label title={props.label}>{props.label}</label>
            <Range {...props}/>
        </div>
    )
}
LabeledRange.propTypes = {
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

    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    handleChange: PropTypes.func
}