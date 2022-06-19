import PropTypes from "prop-types"
import styles from "./ViewWrapper.module.css"
import {Dropdown, DropdownOption, DropdownOptions, Icon} from "@f-ui/core"
import React from "react"

export default function ViewHeader(props){
    const {icon, title, children, orientation, hidden, switchView} = props
    return (
        <div className={styles.header}>
            <Dropdown
                variant={"outlined"}
                hideArrow={true}
                className={[styles.title, hidden ?  styles.titleHidden : ""].join(" ")}
            >
                <div className={styles.label} style={{flexDirection: hidden && orientation === "vertical" ? "column" : undefined}}>
                    {icon ? <div className={styles.icon}><Icon styles={{fontSize: "1rem"}}>{icon}</Icon></div> : null}
                    <label>{title}</label>
                </div>
                <DropdownOptions>
                    <DropdownOption
                        option={{
                            label: "Close",
                            icon: <Icon styles={{fontSize: "1rem"}}>close</Icon>,
                            onClick: () => switchView(undefined)
                        }}
                    />
                    <div className={styles.divider}/>
                    <DropdownOption
                        option={{
                            label: "Hierarchy",
                            icon: <Icon styles={{fontSize: "1rem"}}>account_tree</Icon>,
                            onClick: () => switchView("hierarchy")
                        }}
                    />
                    <DropdownOption
                        option={{
                            label: "Component Editor",
                            icon: <Icon styles={{fontSize: "1rem"}}>category</Icon>,
                            onClick: () => switchView("component")
                        }}
                    />
                    <DropdownOption
                        option={{
                            label: "Content Browser",
                            icon: <Icon styles={{fontSize: "1rem"}}>folder</Icon>,
                            onClick: () => switchView("files")
                        }}
                    />
                    <DropdownOption
                        option={{
                            label: "Shader Editor",
                            icon: <Icon styles={{fontSize: "1rem"}}>texture</Icon>,
                            onClick: () => switchView("blueprint")
                        }}
                    />
                </DropdownOptions>
            </Dropdown>
            {!hidden && children  ?
                <div className={styles.options}>
                    {children}
                </div>
                :
                null}
        </div>
    )
}
ViewHeader.propTypes={
    orientation: PropTypes.oneOf(["vertical", "horizontal"]),
    icon: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.node,
    switchView: PropTypes.func.isRequired,
    hidden: PropTypes.bool.isRequired
}
