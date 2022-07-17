import useIcon from "../hooks/useIcon"
import styles from "../styles/Selector.module.css"
import PropTypes from "prop-types"
import React from "react"
import {ToolTip} from "@f-ui/core"

export default function Option(props){

    const icon = useIcon(props)
    return (
        <button
            className={styles.option}
            data-highlight={`${props.state.registryID === props.data.registryID}`}
            onClick={() => {
                props.setState(props.data)
                props.handleChange(props.data, () => props.setState({name: "Empty"}), () => props.setOpen(false))

                if(props.autoClose)
                    props.setOpen(false)
            }}
        >
            {icon}
            <div className={styles.overflow}>
                {props.data.name}
            </div>
            <ToolTip content={props.data.name}/>
        </button>
    )
}
Option.propTypes={
    type: PropTypes.string,
    autoClose: PropTypes.bool,
    setState: PropTypes.func,
    data: PropTypes.object,
    handleChange: PropTypes.func,
    setOpen: PropTypes.func,
    state: PropTypes.object
}
