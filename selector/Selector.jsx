import React, {useContext, useEffect, useState} from "react"
import styles from "./styles/Selector.module.css"
import {Dropdown, DropdownOptions, ToolTip} from "@f-ui/core"
import useIcon from "./hooks/useIcon"
import PropTypes from "prop-types"
import QuickAccessProvider from "../../project/context/QuickAccessProvider"
import Options from "./components/Options"
import useLocalization from "../../global/useLocalization"

export default function Selector(props) {
    const [state, setState] = useState({})
    const translate = useLocalization("COMPONENTS", "SELECTOR")
    const quickAccess = useContext(QuickAccessProvider)

    const getType = () => {
        switch (props.type) {
        case "image":
            return quickAccess.images
        case "material":
            return quickAccess.materials
        case "mesh":
            return quickAccess.meshes
        case "script":
            return quickAccess.scripts
        default:
            return []
        }
    }

    useEffect(() => {
        console.log(props.selected)
        const rID = (props.selected?.registryID ? props.selected?.registryID : props.selected)
        let name = translate("EMPTY"),
            data =  quickAccess[props.type + "s"]?.find(e => e.registryID === rID)
        setState(data ? data : {name})
    }, [props.selected])
    const icon = useIcon({type: props.type, data: state})
    return (
        <Dropdown
            hideArrow={true}
            modalClassName={styles.modal}
            className={styles.button}
            styles={{maxHeight: props.size === "small" ? "25px" : "43px", minHeight:  props.size === "small" ? "unset" : "43px"}}
        >
            <ToolTip content={state.name}/>
            <div className={styles.wrapper}>
                {props.size !== "small" ? icon : undefined}
                <div className={styles.overflow} style={{width: "100%", textAlign: "left"}}>
                    {state.name}
                </div>
                <label className={styles.buttonType}>
                    {props.type}
                </label>
            </div>
            <DropdownOptions>
                <Options
                    handleChange={props.handleChange}
                    type={props.type}
                    images={quickAccess.images}
                    meshes={quickAccess.meshes}
                    selected={props.selected}
                    getType={getType}
                    setState={setState}
                    state={state}
                    autoClose={props.autoClose}
                />
            </DropdownOptions>
        </Dropdown>

    )
}

Selector.propTypes = {
    size: PropTypes.oneOf(["small", "default"]),
    autoClose: PropTypes.bool,
    type: PropTypes.oneOf(["image", "mesh", "material", "script"]),
    handleChange: PropTypes.func,
    selected: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
}

