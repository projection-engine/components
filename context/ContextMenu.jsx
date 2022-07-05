import PropTypes from "prop-types"
import React, {useEffect, useMemo, useRef, useState} from "react"
import styles from "./styles/ContextMenu.module.css"
import {Button, Icon, TextField} from "@f-ui/core"
import Search from "../search/Search"

const MAX_OPTIONS = 10
export default function ContextMenu(props) {
    const {options, close, selected} = props
    const [search, setSearch] = useState("")
    const optionsToRender = useMemo(() => {
        if(selected && options)
            return options.filter(o =>(!o.requiredTrigger || o.requiredTrigger === selected?.trigger )&& (!search || o.label && o.label.toLowerCase().includes(search.toLowerCase())))
        return []
    }, [options, search, selected])

    const parent = useRef()

    useEffect(() => {
        if(selected) {
            close()
            setSearch("")
        }
    }, [options])
    useEffect(() => {
        if(selected) {
            if (!parent.current)
                parent.current = document.getElementById("context-menu-element")?.previousSibling
            if (parent.current) {
                if (optionsToRender.length > MAX_OPTIONS || search)
                    parent.current.style.paddingBottom = "35px"
                else
                    parent.current.style.paddingBottom = "0"
            }
        }
    }, [optionsToRender])
    if(!selected)
        return null
    return (
        <>
            <div style={{overflowY: "auto", maxHeight: "275px"}}>
                {optionsToRender.map((o, i) => 
                    <React.Fragment key={"viewport-option-" + i}>
                        {o.divider ?
                            <div className={styles.divider}/>
                            :
                            <Button
                                disabled={o.disabled}
                                className={styles.button}
                                onClick={e => {
                                    o.onClick(props.selected?.selected, e)
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
                <div style={{padding: "4px", position: "absolute", bottom: "0", width: "100%"}}>
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

ContextMenu.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        icon: PropTypes.string,
        onClick: PropTypes.func,
        divider: PropTypes.bool,
        disabled: PropTypes.bool,
        shortcut: PropTypes.array
    })),
    engine: PropTypes.object,
    close: PropTypes.func,
    selected: PropTypes.object
}
function Shortcut(props){
    const shortcut = useMemo(() => {
        return props.shortcut?.map((s, i) => s + (i < props.shortcut.length -1 ? " + " : ""))
    }, [props.shortcut])
    if(!shortcut)
        return null
    return(
        <div className={styles.shortcut}>
            {shortcut}
        </div>
    )
}

Shortcut.propTypes={
    shortcut: PropTypes.array
}