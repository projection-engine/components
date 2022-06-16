import styles from "./VerticalTabs.module.css"
import React, {useId, useState} from "react"
import PropTypes from "prop-types"
import {Button, Icon} from "@f-ui/core"
import ResizableBar from "../resizable/ResizableBar"

export default function VerticalTabs(props){
    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState(-1)
    const id = useId()

    return (
        <>
            {!props.tabs[tab]?.disabled && props.tabs[tab]?.content ?
                props.absolute ?
                    <div className={styles.contentWrapper}>
                        <div style={{ maxWidth: "0px"}}/>
                        <ResizableBar
                            type={"width"}
                        />
                        <div className={styles.content} >
                            {props.tabs[tab].content}
                        </div>
                    </div>
                    :
                    <>
                        <ResizableBar
                            type={"width"}
                        />
                        {props.tabs[tab].content}
                    </>
                :
                null
            }
            <div className={styles.bar} data-hidden={`${!open}`}>
                <Button onClick={() => {
                    setOpen(!open)
                    setTab(-1)
                }} className={styles.hideButton}>
                    <Icon  styles={{fontSize: "1.1rem"}}>{open ? "navigate_next" : "chevron_left"}</Icon>
                </Button>
                {props.tabs.map((o ,i)=> (
                    <React.Fragment key={id + "-option-vertical-tab-" + i}>
                        <Button
                            disabled={o.disabled}
                            variant={tab === i ? "filled" : undefined}
                            className={styles.button}
                            onClick={() => {
                                if(tab === i)
                                    setTab(-1)
                                else
                                    setTab(i)
                            }}
                        >
                            <label>
                                {o.label}
                            </label>
                        </Button>
                    </React.Fragment>
                ))}
            </div>
        </>
        
    )
}
VerticalTabs.propTypes={
    absolute: PropTypes.bool,
    tabs: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        content: PropTypes.node,
        disabled: PropTypes.bool
    }))
}