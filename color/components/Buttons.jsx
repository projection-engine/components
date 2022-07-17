import PropTypes from "prop-types"
import {Button, DropdownProvider} from "@f-ui/core"
import styles from "../styles/Color.module.css"
import React, {useContext} from "react"
import useLocalization from "../../../global/useLocalization"

export default function Buttons(props) {
    const {submit, value} = props
    const ctx = useContext(DropdownProvider)

    const translate = useLocalization("COMPONENTS", "COLOR_PICKER")
    return (

        <div className={styles.buttons}>
            <Button
                className={styles.button}
                variant={"filled"}
                onClick={() => {
                    submit(`rgb(${value.r},${value.g},${value.b})`, [value.r, value.g, value.b])
                    ctx.setOpen(false)
                }}>
                {translate("ACCEPT")}
            </Button>
            <Button 
                className={styles.button}
                styles={{"--fabric-accent-color": "#f55"}}
                onClick={() => {
                    ctx.setOpen(false)
                }}
            >
                {translate("CANCEL")}
            </Button>
        </div>

    )
}
Buttons.propTypes={
    submit: PropTypes.func,
    value: PropTypes.object
}