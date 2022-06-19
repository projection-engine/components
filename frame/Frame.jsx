import PropTypes from "prop-types"
import styles from "./styles/Frame.module.css"
import logo from "../../static/icons/logo.png"
import React from "react"
import {Button, Dropdown, DropdownOption, DropdownOptions, Icon} from "@f-ui/core"
import Actions from "./components/Actions"

const {ipcRenderer} = window.require("electron")
export default function Frame(props) {
    const LogoContent = (
        <div className={styles.logoWrapper} style={{maxWidth: props.logoAction ? undefined : "unset", padding: "0 16px"}}>
            <img src={logo} alt={"LOGO"} className={styles.logo}/>
            {props.logoAction  ?null : <label className={styles.title}>{props.label}</label>}
        </div>
    )
    return (
        <div className={styles.wrapper}>
            <div className={styles.options}>
                {props.logoAction ?
                    <Button
                        className={styles.dropdown}
                        onClick={() => ipcRenderer.send("switch-window")}>
                        {LogoContent}
                    </Button>
                    :
                    LogoContent
                }
                {props.options.map((o, i) => (
                    <React.Fragment key={i + "-wrapper-frame"}>
                        {o.divider ?
                            <div className={styles.divider}/>
                            :
                            o.options ? (
                                <Dropdown className={styles.button}>
                                    {o.label}
                                    <DropdownOptions>
                                        {o.options.map((oo, j) => (
                                            <React.Fragment key={i + "-wrapper-frame-option-" + j}>
                                                <DropdownOption option={{
                                                    ...oo,
                                                    icon: oo.icon ? oo.icon : undefined
                                                }}/>
                                            </React.Fragment>
                                        ))}
                                    </DropdownOptions>
                                </Dropdown>
                            )
                                :
                                <Button onClick={o.onClick} className={styles.button}>
                                    {o.icon ? <Icon styles={{fontSize: "1.1rem"}}>{o.icon}</Icon> : null}
                                    {o.label}
                                </Button>        
                        }
                            
                    </React.Fragment>
                ))}
            </div>
            <div className={styles.draggable}/>
            <Actions pageInfo={props.pageInfo}/>
        </div>
    )
}
Frame.propTypes = {
    logoAction: PropTypes.bool,
    pageInfo: PropTypes.shape({
        pageID: PropTypes.string,
        closeEvent: PropTypes.string,
        minimizeEvent: PropTypes.string,
        maximizeEvent: PropTypes.string
    }),
    label: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        divider: PropTypes.bool,
        label: PropTypes.string,
        onClick: PropTypes.func,
        icon: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            onClick: PropTypes.func,
            icon: PropTypes.string
        }))
    }))
}