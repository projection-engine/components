import React, {useContext, useDeferredValue, useEffect, useMemo, useState} from "react"
import styles from "./styles/Selector.module.css"
import {Button, Dropdown, DropdownOptions, DropdownProvider, Icon, ToolTip} from "@f-ui/core"
import useIcon from "./hooks/useIcon"
import PropTypes from "prop-types"
import Search from "../search/Search"
import QuickAccessProvider from "../../project/providers/QuickAccessProvider"
import EN from "../../static/locale/EN"
import Options from "./components/Options"

export default function Selector(props) {
    const [state, setState] = useState({})

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
        let name = EN.COMPONENTS.SELECTOR.EMPTY,
            data = (typeof props.selected === "object" && Object.keys(props.selected).length > 0) ? props.selected : quickAccess[props.type + "s"]?.find(e => e.registryID === props.selected)
        setState(data ? data : {name})
    }, [props.selected])
    const icon = useIcon({type: props.type, data: state})
    return (
        <Dropdown
            hideArrow={true}
            modalClassName={styles.modal}
            className={styles.button}
            styles={{height: "100%"}}
        >
            <div className={styles.wrapper}>
                {icon}
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
    autoClose: PropTypes.bool,
    type: PropTypes.oneOf(["image", "mesh", "material", "script"]),
    handleChange: PropTypes.func,
    selected: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
}

