import styles from "./styles/Color.module.css"
import React, {useContext, useEffect, useState} from "react"
import PropTypes from "prop-types"
import {Button, Dropdown, DropdownOptions, DropdownProvider, ToolTip} from "@f-ui/core"
import {RgbColorPicker} from "react-colorful"
import EN from "../../static/locale/EN"
import LabeledRange from "../templates/LabeledRange"


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
            style={props.styles}
            hideArrow={true}
            wrapperClassname={styles.modal}
            className={styles.wrapper}
        >
            {props.label ? <div className={styles.label}>{props.label}</div> : null}
            <div className={styles.placeholder}
                style={{height: "35px", background: `rgb(${value.r},${value.g},${value.b})`, ...props.styles}}>
                <ToolTip content={`rgb(${value.r},${value.g},${value.b})`}/>
            </div>
            <DropdownOptions>
                <RgbColorPicker color={value} onChange={e => setValue(e)}/>
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
                <Buttons setValue={setValue} value={value} submit={props.submit}/>
            </DropdownOptions>
        </Dropdown>
    )
}

ColorPicker.propTypes = {
    label: PropTypes.string,
    submit: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    styles: PropTypes.object
}

const Buttons = (props) => {
    const {submit, value, setValue} = props
    const ctx = useContext(DropdownProvider)
    return ( 

        <div className={styles.buttons}>
            <Button
                className={styles.button}
                variant={"filled"}
                onClick={() => {
                    ctx.setOpen(false)
                    submit(`rgb(${value.r},${value.g},${value.b})`, [value.r, value.g, value.b])
                }}>
                {EN.COMPONENTS.COLOR_PICKER.ACCEPT}
            </Button>
            <Button className={styles.button} onClick={() => {
                ctx.setOpen(false)
                setValue({r: 0, g: 0, b: 0})
            }}>
                {EN.COMPONENTS.COLOR_PICKER.CANCEL}
            </Button>
        </div>
    
    )
}
Buttons.propTypes={
    submit: PropTypes.func,
    value: PropTypes.object,
    setValue: PropTypes.func,
}