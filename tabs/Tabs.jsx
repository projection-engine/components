import styles from "./styles/Tabs.module.css"
import PropTypes from "prop-types"
import {Button, Icon, ToolTip} from "@f-ui/core"
import React, {useMemo, useRef, useState} from "react"
import ResizableBar from "../resizable/ResizableBar"

export default function Tabs(props) {
    const [hidden, setHidden] = useState(false)
    const ref = useRef()
    const stylesHidden = useMemo(() => {
        return {
            flexDirection: hidden ? "row" : undefined,
            width: hidden ? "100%" : undefined,
            height: hidden ? "25px" : undefined,
            borderRadius: hidden ? "5px" : undefined
        }
    }, [hidden])
    const current = useMemo(() => {
        return props.tabs[props.open]
    }, [props.open, props.tabs])

    return (
        <>
            <ResizableBar
                // resetTargets={{previous: true, next: true}}
                resetWhen={[hidden]}
                type={"height"}
                onResizeStart={() => setHidden(false)}
                onResizeEnd={() => {
                    if (ref.current.getBoundingClientRect().height <= 45)
                        setHidden(true)
                }}/>
            <div className={styles.wrapper} ref={ref} style={{height: hidden ? "fit-content" : undefined}}>
                <div className={styles.switcher} style={stylesHidden}>
                    <Button
                        className={styles.button}
                        styles={{background: "var(--pj-border-primary)"}}
                        onClick={() => setHidden(!hidden)}
                    >
                        <Icon
                            styles={{fontSize: "1rem"}}>{hidden ? "expand_more" : "expand_less"}</Icon>
                    </Button>
                    {props.tabs.map((t, i) => (
                        <React.Fragment key={i + "-open-tab-view"}>
                            <Button
                                className={styles.button}
                                onClick={() => {
                                    setHidden(false)
                                    props.setOpen(i)
                                }} variant={i === props.open ? "filled" : undefined}
                            >
                                {t.icon ? <Icon
                                    styles={{fontSize: "1rem"}}>{t.icon}</Icon> : null}
                                <ToolTip animation={"0ms"}>{t.label}</ToolTip>
                            </Button>

                        </React.Fragment>
                    ))}
                    {current?.close && !hidden ?
                        <Button
                            className={[styles.button, styles.close].join(" ")}
                            onClick={() => {
                                props.setOpen(prev => prev - 1)
                                current.close()
                            }}
                            variant={"filled"}
                        >
                            <ToolTip content={"Close active view"} animation={"0ms"}/>
                            <Icon  styles={{fontSize: "1rem"}}>close</Icon>
                        </Button>
                        :
                        null}

                </div>

                {props.tabs.map((t, i) => (
                    <div style={{
                        display: props.open === i && !hidden ? undefined : "none",
                        overflow: "hidden",
                        height: "100%",
                        width: "100%"
                    }} key={i + "-children-tab-view"}>
                        {t.children}
                    </div>
                ))}
            </div>
        </>
    )
}

Tabs.propTypes = {
    open: PropTypes.number,
    setOpen: PropTypes.func,

    tabs: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        children: PropTypes.node,
        icon: PropTypes.string,
        close: PropTypes.func
    }))
}