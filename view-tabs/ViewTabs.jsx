import styles from "./styles/Tabs.module.css"
import PropTypes from "prop-types"
import {Button, Icon, ToolTip} from "@f-ui/core"
import React, {useMemo, useRef, useState} from "react"
import ResizableBar from "../resizable/ResizableBar"

export default function ViewTabs(props) {
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

    return (
        <>
            <ResizableBar
                resetWhen={[hidden]}
                type={"height"}
                onResizeStart={() => setHidden(false)}
                onResizeEnd={() => {
                    if (ref.current.getBoundingClientRect().height <= 45)
                        setHidden(true)
                }}
            />
            <div className={styles.wrapper} ref={ref} style={{height: hidden ? "fit-content" : undefined}}>
                <div className={styles.switcher} style={stylesHidden}>
                    <Button
                        className={styles.button}
                        onClick={() => setHidden(!hidden)}
                    >
                        <Icon
                            styles={{fontSize: "1rem"}}>{hidden ? "expand_more" : "expand_less"}</Icon>
                    </Button>
                    {props.tabs.map((t, i) => (
                        <div className={styles.tab} key={i + "-open-tab-view"}>
                            <Button
                                className={styles.button}
                                attributes={{"data-active": `${props.open === i}`, "data-closable": `${t.close !== undefined}`}}
                                onClick={() => {
                                    setHidden(false)
                                    props.setOpen(i)
                                }}
                            >
                                {t.icon ? <Icon
                                    styles={{fontSize: "1rem"}}>{t.icon}</Icon> : null}
                                {t.label}
                            </Button>
                            {t.close && !hidden ?
                                <Button
                                    attributes={{"data-active": `${props.open === i}`}}
                                    className={[styles.button, styles.close].join(" ")}
                                    onClick={() => {
                                        if(props.open === i)
                                            props.setOpen(i - 1)
                                        t.close()
                                    }}
                                >
                                    <ToolTip content={"Close active view"} animation={"0ms"}/>
                                    <Icon  styles={{fontSize: "1rem"}}>close</Icon>
                                </Button>
                                :
                                null}
                        </div>
                    ))}


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

ViewTabs.propTypes = {
    open: PropTypes.number,
    setOpen: PropTypes.func,

    tabs: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        children: PropTypes.node,
        icon: PropTypes.string,
        close: PropTypes.func
    }))
}