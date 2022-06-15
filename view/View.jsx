import PropTypes from "prop-types"
import styles from "./View.module.css"
import {Dropdown, DropdownOption, Icon} from "@f-ui/core"
import React, {useId, useRef, useState} from "react"
import ResizableBar from "../resizable/ResizableBar"

export default function View(props){
    const id = useId()
    const SIZE = props.content.length
    const [hidden, setHidden] = useState(false)
    const ref = useRef()
    return (
        <>
            <ResizableBar
                resetTargets={{previous: true, next: false}}
                resetWhen={[hidden]}
                type={"width"}
                onResizeStart={() => {
                    if(hidden)
                        setHidden(false)
                }}
                onResizeEnd={() => {
                    if (ref.current.getBoundingClientRect().width <= 45)
                        setHidden(true)
                }}/>
            <div 
                ref={ref} 
                className={styles.wrapper}
                data-orientation={props.orientation} 
                style={{width: "300px", maxWidth: hidden ? "30px" : undefined, minWidth: hidden ? "30px" : undefined}}
            >
                {props.content.map((view, vI) => (
                    <React.Fragment key={id + "-view-"+vI} >
                        <div className={styles.view}>
                            <div className={styles.header}>
                                <div className={[styles.title, hidden ? styles.titleHidden : ""].join(" ")}>
                                    {view.icon ? <div className={styles.icon}><Icon styles={{fontSize: "1.2rem"}}>{view.icon}</Icon></div> : null}
                                    <label>{view.title}</label>
                                </div>
                                {!hidden && view.headerOptions  ?
                                    <div className={styles.options}>
                                        {view.headerOptions}
                                    </div>
                                    :
                                    null}
                            </div>
                            {hidden ? null : view.content}
                        </div>
                        {vI < SIZE -1 && SIZE > 1 ? <ResizableBar type={"height"}/> : null}
                    </React.Fragment>
                ))}
            </div>
        </>
    )
}

View.propTypes={
    content: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        icon: PropTypes.string,
        headerOptions: PropTypes.node,
        
        content: PropTypes.node
    })),
    orientation: PropTypes.oneOf(["vertical", "horizontal"]),
}
