import PropTypes from "prop-types"
import React, {useEffect, useMemo, useState} from "react"
import styles from "./styles/ContextMenu.module.css"
import {Button, Icon} from "@f-ui/core"
import Search from "../search/Search"

const MAX_OPTIONS = 10
export default function Options(props) {
    const {options, close, selected, setPadding, trigger, event, callback} = props
    const [search, setSearch] = useState("")
    const optionsToRender = useMemo(() => {
        return options.filter(o => (!o.requiredTrigger || o.requiredTrigger === trigger) && (!search || o.label && o.label.toLowerCase().includes(search.toLowerCase())))
    }, [options, search, selected])

    useEffect(() => {
        setSearch("")
    }, [options])
    useEffect(() => {

        if (optionsToRender.length > MAX_OPTIONS || search)
            setPadding("45px")
        else
            setPadding("0px")
    }, [optionsToRender])


    return (
        <>
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
            {optionsToRender.length > MAX_OPTIONS || search ? (
                <div style={{
                    padding: "4px",
                    position: "absolute",
                    bottom: "0",
                    width: "100%",
                    borderTop: "var(--pj-border-primary) 1px solid"
                }}>
                    <Search
                        setSearchString={e => {
                            setSearch(e)
                        }}
                        searchString={search}
                    />
                </div>
            ) : null}
        </>
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