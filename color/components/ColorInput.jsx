import styles from "../styles/Color.module.css"
import LabeledRange from "../../range/LabeledRange"
import React from "react"
import PropTypes from "prop-types"

export default function ColorInput(props){
    const {value, setValue} = props
    return (
        <div className={styles.inputs}>
            <LabeledRange
                label={"R"}
                variant={"embedded"}
                maxValue={255}
                minValue={0}

                handleChange={v => setValue(prev => {
                    return {
                        ...prev,
                        r: v
                    }
                })}
                value={value.r}
                accentColor={"red"}
            />

            <LabeledRange
                label={"G"}
                variant={"embedded"}
                maxValue={255}
                minValue={0}
                handleChange={v => setValue(prev => {
                    return {
                        ...prev,
                        g: v
                    }
                })}
                value={value.g}
                accentColor={"green"}
            />

            <LabeledRange
                label={"B"}
                variant={"embedded"}
                maxValue={255}
                minValue={0}

                handleChange={v => setValue(prev => {
                    return {
                        ...prev,
                        b: v
                    }
                })}
                value={value.b}
                accentColor={"blue"}
            />
        </div>
    )
}
ColorInput.propTypes={
    value: PropTypes.object,
    setValue: PropTypes.func
}