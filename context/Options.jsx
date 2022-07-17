import PropTypes from "prop-types"
import React, {useMemo} from "react"
import styles from "./styles/ContextMenu.module.css"
import {Button, Icon} from "@f-ui/core"

export default function Options(props) {
    const {options, close, selected, trigger, event, callback} = props
    const optionsToRender = useMemo(() => {
        return options.filter(o => !o.requiredTrigger || o.requiredTrigger === trigger)
    }, [options, selected])

    return (
        <div style={{overflowY: "auto", maxHeight: "265px"}} ref={callback}>
            {optionsToRender.map((o, i) =>
                <React.Fragment key={"viewport-option-" + i}>
                    {o.divider ?
                        <div className={styles.divider}/>
                        :
                        <Button
                            disabled={o.disabled}
                            className={styles.button}
                            onClick={() => {
                                o.onClick(selected, event)
                                close()
                            }}>
                            <div className={styles.inline}>
                                <div className={styles.icon}>
                                    {o.icon ? <Icon styles={{fontSize: "1.1rem"}}>{o.icon}</Icon> : null}
                                </div>
                                <label className={styles.overflow}>{o.label}</label>
                            </div>
                            <Shortcut shortcut={o.shortcut}/>
                        </Button>}
                </React.Fragment>
            )}
        </div>
    )
}

Options.propTypes = {
    callback: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        icon: PropTypes.string,
        onClick: PropTypes.func,
        divider: PropTypes.bool,
        disabled: PropTypes.bool,
        shortcut: PropTypes.array
    })),
    trigger: PropTypes.string,
    close: PropTypes.func,
    selected: PropTypes.object,
    setPadding: PropTypes.func,
    event: PropTypes.object
}

function Shortcut(props) {
    const shortcut = useMemo(() => {
        return props.shortcut?.map((s, i) => s + (i < props.shortcut.length - 1 ? " + " : ""))
    }, [props.shortcut])
    if (!shortcut)
        return null
    return (
        <div className={styles.shortcut}>
            {shortcut}
        </div>
    )
}

Shortcut.propTypes = {
    shortcut: PropTypes.array
}