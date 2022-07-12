import PropTypes from "prop-types"
import styles from "../styles/Views.module.css"
import {Dropdown, DropdownOption, DropdownOptions, Icon} from "@f-ui/core"
import React from "react"
import VIEWS from "../VIEWS"

export default function Header(props){
    const {icon, title, children, orientation, hidden, switchView} = props
    return (
        <div className={hidden ? styles.headerHidden : styles.header}>
            <Dropdown
                variant={"outlined"}
                styles={{  height: orientation === "vertical" && hidden ? "fit-content" : "25px"}}
                hideArrow={true}

                className={styles.title}
            >

                <div className={styles.label} data-hidden={`${hidden && orientation === "vertical"}`}>
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
                            onClick: () => switchView(VIEWS.HIERARCHY)
                        }}
                    />
                    <DropdownOption
                        option={{
                            label: "Component EditorCamera",
                            icon: <Icon styles={{fontSize: "1rem"}}>category</Icon>,
                            onClick: () => switchView(VIEWS.COMPONENT)
                        }}
                    />
                    <DropdownOption
                        option={{
                            label: "Content Browser",
                            icon: <Icon styles={{fontSize: "1rem"}}>folder</Icon>,
                            onClick: () => switchView(VIEWS.FILES)
                        }}
                    />
                    <DropdownOption
                        option={{
                            label: "Shader EditorCamera",
                            icon: <Icon styles={{fontSize: "1rem"}}>texture</Icon>,
                            onClick: () => switchView(VIEWS.BLUEPRINT)
                        }}
                    />
                    <DropdownOption
                        option={{
                            label: "Console",
                            icon: <Icon styles={{fontSize: "1rem"}}>terminal</Icon>,
                            onClick: () => switchView(VIEWS.CONSOLE)
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
Header.propTypes={
    orientation: PropTypes.oneOf(["vertical", "horizontal"]),
    icon: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.node,
    switchView: PropTypes.func.isRequired,
    hidden: PropTypes.bool.isRequired
}
