import styles from "./styles/Color.module.css"
import React, {useEffect, useState} from "react"
import PropTypes from "prop-types"
import {Dropdown, DropdownOptions} from "@f-ui/core"
import {RgbColorPicker,} from "react-colorful"
import Buttons from "./components/Buttons"
import ColorInput from "./components/ColorInput"


export default function ColorPicker(props) {
    const [value, setValue] = useState({r: 0, g: 0, b: 0})
    useEffect(() => {
        if (typeof props.value === "string") {
            const split = props.value.match(/[\d.]+/g)
            const [r, g, b] = split.map(v => parseFloat(v))

            setValue({r: r, g: g, b: b})
        }
        else if(typeof props.value === "object")
            setValue(props.value)
    }, [props.value])

    return (
        <Dropdown
            hideArrow={true}
            wrapperClassname={styles.modal}
            className={styles.placeholder}
            attributes={{title: `rgb(${value.r},${value.g},${value.b})`}}
            styles={{height: "35px", background: `rgb(${value.r},${value.g},${value.b})`, ...props.styles}}
        >
            <DropdownOptions>

                <RgbColorPicker color={value} onChange={e => setValue(e)}/>
                <ColorInput value={value} setValue={setValue}/>
                <Buttons setValue={setValue} value={value} submit={props.submit}/>
            </DropdownOptions>
        </Dropdown>
    )
}


ColorPicker.propTypes = {
    submit: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    styles: PropTypes.object
}


