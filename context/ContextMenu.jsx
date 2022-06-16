import PropTypes from "prop-types"
import React, {useEffect, useMemo, useState} from "react"
import styles from "./ContextMenu.module.css"
import {Button, Icon, TextField} from "@f-ui/core"

export default function ContextMenu(props) {
    const {options, close, selected, target} = props
    const [search, setSearch] = useState("")
    const optionsToRender = useMemo(() => {
        if(selected && options)
            return options.filter(o => !search || o.label.toLowerCase().includes(search.toLowerCase()))
        return []
    }, [options, search, selected])
    useEffect(() => {
        if(selected) {
            close()
            setSearch("")
        }
    }, [options])

    if(!selected)
        return null
    return (
        < >
            {target?.label ?
                <label className={styles.label}>
                    <div className={styles.overflow}>{target.label}</div>
                </label>
                :
                null}
            <div style={{overflowY: "auto", maxHeight: "275px"}}>
                {optionsToRender.map((o, i) => !o.requiredTrigger || o.requiredTrigger === selected?.trigger ? (
                    <React.Fragment key={"viewport-option-" + i}>
                        {o.divider ? <div className={styles.divider}/> :
                            <Button
                                disabled={o.disabled}
                                className={styles.button}
                                onClick={e => {
                                    o.onClick(props.selected?.selected, e)
                                    close()
                                }}>
                                <div className={styles.inline}>
                                    <div className={styles.icon}>
                                        <Icon styles={{fontSize: "1.1rem"}}>{o.icon}</Icon>
                                    </div>
                                    <label className={styles.overflow}>{o.label}</label>
                                </div>
                                <Shortcut shortcut={o.shortcut}/>
                            </Button>}
                    </React.Fragment>
                )
                    :
                    null)}
            </div>
            {optionsToRender.length > 5 ?  
                <div style={{padding: "0 4px", position: "absolute", bottom: "0", width: "100%"}}>
                    <TextField handleChange={e => setSearch(e.target.value)} width={"100%"} value={search} height={"25px"} placeholder={"Search"}/>
                </div>
                :
                null
            }
        </>
    )
}

ContextMenu.propTypes = {
    target: PropTypes.object,
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