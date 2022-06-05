import PropTypes from "prop-types"
import styles from "./styles/Frame.module.css"
import logo from "../../static/icons/logo.png"
import React from "react"
import {Button, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core"
import Actions from "./components/Actions"

const {ipcRenderer} = window.require("electron")
export default function Frame(props) {
    const LogoContent = (
        <>
            <div className={styles.logoWrapper}>
                <img src={logo} alt={"LOGO"} className={styles.logo}/>
            </div>

            <div className={styles.title}>
                {props.label}
            </div>

        </>
    )
    return (
        <div className={styles.wrapper}>
            {props.logoAction ?
                <Button
                    className={styles.dropdown}
                    onClick={() => ipcRenderer.send("switch-window")}>
                    {LogoContent}
                </Button>
                :
                LogoContent
            }
            {props.options && props.options.length > 0 ? <div className={styles.divider}/> : null}

            {props.options.map((o, i) => (
                <React.Fragment key={i + "-wrapper-frame"}>
                    <Dropdown>
                        {o.label}
                        <DropdownOptions>
                            {o.options.map((oo, j) => (
                                <React.Fragment key={i + "-wrapper-frame-option-" + j}>
                                    <DropdownOption option={{
                                        ...oo,
                                        icon: oo.icon ? <span className={"material-icons-round"}
                                            style={{fontSize: "1.1rem"}}>{oo.icon}</span> : undefined
                                    }}/>
                                </React.Fragment>
                            ))}
                        </DropdownOptions>
                    </Dropdown>
                </React.Fragment>
            ))}
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
        label: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            onClick: PropTypes.func,
            icon: PropTypes.string
        }))
    }))
}