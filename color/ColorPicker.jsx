import styles from './styles/Color.module.css'
import {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Button, Fabric, Modal, ToolTip} from "@f-ui/core";
import {RgbColorPicker} from "react-colorful";
import ThemeProvider from "../../services/hooks/ThemeProvider";
import Range from "../range/Range";


export default function ColorPicker(props) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState({r: 0, g: 0, b: 0})
    const theme = useContext(ThemeProvider)
    useEffect(() => {

        if (typeof props.value === 'string') {
            const split = props.value.match(/[\d.]+/g)
            const [r, g, b, a] = split.map(v => parseFloat(v))

            setValue({r: r, g: g, b: b})
        }
    }, [props.value, open])


    return (
        <Fabric className={styles.wrapper} accentColor={theme.accentColor} theme={theme.dark ? 'dark' : 'light'}>

            <Modal
                blurIntensity={0}
                variant={'fit'}
                open={open}
                handleClose={() => null}

                className={[styles.modal, theme.themeClass].join(' ')}
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
                            props.submit(`rgb(${value.r},${value.g},${value.b})`)
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

            <div className={styles.label}>{props.label}</div>
            <Button className={styles.placeholder} styles={{background: `rgb(${value.r},${value.g},${value.b})`}}
                    onClick={() => setOpen(true)}>
                <ToolTip content={`rgb(${value.r},${value.g},${value.b})`}/>
            </Button>
        </Fabric>
    )
}

ColorPicker.propTypes = {
    label: PropTypes.string,
    submit: PropTypes.func.isRequired,
    value: PropTypes.string
}