import styles from "./styles/Color.module.css"
import React, {useEffect, useRef, useState} from "react"
import PropTypes from "prop-types"
import {Dropdown, DropdownOptions} from "@f-ui/core"
import {RgbColorPicker,} from "react-colorful"
import Buttons from "./components/Buttons"
import ColorInput from "./components/ColorInput"


export default function ColorPicker(props) {
    const [value, setValue] = useState({r: 0, g: 0, b: 0})
    const initialized = useRef(false)
    useEffect(() => {
        if(!initialized.current){
            initialized.current = true
            if (typeof props.value === "string") {
                const split = props.value.match(/[\d.]+/g)
                const [r, g, b] = split.map(v => parseFloat(v))

                setValue({r: r, g: g, b: b})
            } else if (Array.isArray(props.value))
                setValue({r: props.value[0], g: props.value[1], b: props.value[2]})
            else if (typeof props.value === "object")
                setValue(props.value)
        }
    }, [props.value])

    return (
        <Dropdown
            hideArrow={true}
            modalClassName={styles.modal}
            className={styles.placeholder}
            attributes={{title: `rgb(${value.r},${value.g},${value.b})`}}
            styles={{
                height: props.size === "small" ? "25px" : "35px",
                background: `rgb(${value.r},${value.g},${value.b})`, ...props.styles
            }}
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
    size: PropTypes.oneOf(["small", "default"]),
    submit: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
    styles: PropTypes.object
}


