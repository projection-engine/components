import PropTypes from "prop-types"
import {Button, DropdownProvider} from "@f-ui/core"
import styles from "../styles/Color.module.css"
import EN from "../../../static/locale/EN"
import React, {useContext} from "react"

export default function Buttons(props) {
    const {submit, value} = props
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
            <Button 
                className={styles.button}
                styles={{"--fabric-accent-color": "#f55"}}
                onClick={() => {
                    ctx.setOpen(false)
                }}
            >
                {EN.COMPONENTS.COLOR_PICKER.CANCEL}
            </Button>
        </div>

    )
}
Buttons.propTypes={
    submit: PropTypes.func,
    value: PropTypes.object
}