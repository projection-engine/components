import PropTypes from "prop-types"
import styles from "./styles/Frame.module.css"
import logo from "../../static/logo.png"
import React, {useContext} from "react"
import {Button, Dropdown, DropdownOption, DropdownOptions, DropdownProvider, Icon} from "@f-ui/core"
import Actions from "./components/Actions"
import ROUTES from "../../../public/static/ROUTES"

const {ipcRenderer} = window.require("electron")
export default function Frame(props) {
    const LogoContent = (
        <div
            className={styles.logoWrapper}
            style={{maxWidth: props.logoAction ? undefined : "unset", padding: "0 16px"}}
        >
            <img src={logo} alt={"LOGO"} className={styles.logo}/>
            {props.logoAction ? null : <label className={styles.title}>{props.label}</label>}
        </div>
    )
    return (
        <div className={styles.wrapper}>
            <div className={styles.options}>
                {props.logoAction ?
                    <Button
                        className={styles.logoButton}
                        onClick={() => ipcRenderer.send(ROUTES.SWITCH_MAIN_WINDOW)}>
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
                                <Dropdown className={styles.button} styles={{paddingRight: "0"}}>
                                    {o.label}
                                    <DropdownOptions>
                                        <FrameButtonOptions option={o} index={i}/>
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
        closeEvent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        minimizeEvent:PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        maximizeEvent: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
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
            icon: PropTypes.node
        }))
    }))
}

function FrameButtonOptions(props) {
    const ctx = useContext(DropdownProvider)
    return (
        <>
            {props.option.options.map((option, j) =>
                option.divider ?
                    <div
                        className={styles.vertDivider}
                        key={props.index + "-wrapper-frame-option-" + j}
                    />
                    :
                    <React.Fragment key={props.index + "-wrapper-frame-option-" + j}>
                        <Button
                            className={styles.optionButton}
                            disabled={option.disabled}
                            onClick={() => {
                                option.onClick()
                                ctx.setOpen(false)
                            }}
                        >
                            <div className={styles.iconContainer}>
                                {option.icon ? option.icon : undefined}
                            </div>
                            {option.label}
                        </Button>
                    </React.Fragment>
            )}
        </>
    )

}

FrameButtonOptions.propTypes = {
    index: PropTypes.number,
    option: PropTypes.object
}