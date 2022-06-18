import PropTypes from "prop-types"
import styles from "./ViewWrapper.module.css"
import {Button, Dropdown, DropdownOption, DropdownOptions, Icon} from "@f-ui/core"
import React from "react" 
export default function ViewHeader(props){
    const {icon, title, children} = props
    return (
        <div className={styles.header}>
            <Dropdown
                hideArrow={true}
                className={[styles.title, props.hidden ?  styles.titleHidden : ""].join(" ")}
            >
                {icon ? <div className={styles.icon}><Icon styles={{fontSize: "1.2rem"}}>{icon}</Icon></div> : null}
                <label>{title}</label>
                <DropdownOptions>
                    <DropdownOption
                        option={{
                            label: "Hierarchy",
                            onClick: () => props.switchView("hierarchy")
                        }}
                    />
                    <DropdownOption
                        option={{
                            label: "Component Editor",
                            onClick: () => props.switchView("component")
                        }}
                    />
                </DropdownOptions>
            </Dropdown>
            {!props.hidden && children  ?
                <div className={styles.options}>
                    {children}
                </div>
                :
                null}
        </div>
    )
}
ViewHeader.propTypes={
    icon: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.node,
    switchView: PropTypes.func.isRequired,
    hidden: PropTypes.bool.isRequired
}
