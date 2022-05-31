import styles from "./styles/Color.module.css"
import {useEffect, useState} from "react"
import PropTypes from "prop-types"
import {Button, Modal, ToolTip} from "@f-ui/core"
import {RgbColorPicker} from "react-colorful"
import Range from "../range/Range"


export default function ColorPicker(props) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState({r: 0, g: 0, b: 0})
    useEffect(() => {

        if (typeof props.value === 'string') {
            const split = props.value.match(/[\d.]+/g)
            const [r, g, b, a] = split.map(v => parseFloat(v))

            setValue({r: r, g: g, b: b})
        }
        else if(typeof props.value === "object")
            setValue(props.value)
    }, [props.value, open])


    return (

        <div className={styles.wrapper} style={{...{    height: '35px'}, ...props.styles}}>
            <Modal
                blurIntensity={0}
                variant={'fit'}
                open={open}
                handleClose={() => null}

                className={styles.modal}
            >
                <RgbColorPicker color={value} onChange={e => setValue(e)}/>
                <div className={styles.inputs}>
                    <div className={styles.inputLabel}>
                        R
                        <Range
                            maxValue={255}
                            minValue={0}

                            handleChange={v => setValue(prev => {
                                return {
                                    ...prev,
                                    r: v
                                }
                            })}
                            value={value.r}
                            accentColor={'red'}
                        />
                    </div>
                    <div className={styles.inputLabel}>
                        G
                        <Range
                            maxValue={255}
                            minValue={0}

                            handleChange={v => setValue(prev => {
                                return {
                                    ...prev,
                                    g: v
                                }
                            })}
                            value={value.g}
                            accentColor={'green'}
                        />
                    </div>
                    <div className={styles.inputLabel}>
                        B
                        <Range
                            maxValue={255}
                            minValue={0}

                            handleChange={v => setValue(prev => {
                                return {
                                    ...prev,
                                    b: v
                                }
                            })}
                            value={value.b}
                            accentColor={'blue'}
                        />
                    </div>
                </div>
                <div className={styles.buttons}>
                    <Button
                        className={styles.button}
                        variant={'filled'}
                        onClick={() => {
                            setOpen(false)
                            props.submit(`rgb(${value.r},${value.g},${value.b})`, [value.r, value.g, value.b])
                        }}>
                        Ok
                    </Button>
                    <Button className={styles.button} onClick={() => {
                        setOpen(false)
                        setValue({r: 0, g: 0, b: 0})
                    }}>
                        Cancel
                    </Button>
                </div>
            </Modal>

            {props.label ? <div className={styles.label}>{props.label}</div> : null}
            <Button className={styles.placeholder}
                    styles={{...{    height: '35px', background: `rgb(${value.r},${value.g},${value.b})`}, ...props.styles}}
                    onClick={() => setOpen(true)}>
                <ToolTip content={`rgb(${value.r},${value.g},${value.b})`}/>
            </Button>

        </div>
    )
}

ColorPicker.propTypes = {
    label: PropTypes.string,
    submit: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    styles: PropTypes.object
}