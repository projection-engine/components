import PropTypes from "prop-types"
import styles from "./ViewWrapper.module.css"
import {Button, Icon} from "@f-ui/core"
import React, {useContext, useEffect, useId, useMemo, useRef, useState} from "react"
import ResizableBar from "../resizable/ResizableBar"
import Search from "../search/Search"
import {createFolder} from "../../project/components/hierarchy/utils/hiearchyUtils"
import Hierarchy from "../../project/components/hierarchy/Hierarchy"
import ComponentEditor from "../../project/components/component/ComponentEditor"
import EngineProvider from "../../project/providers/EngineProvider"

export default function ViewWrapper(props){
    const id = useId()

    const [hidden, setHidden] = useState(false)
    const ref = useRef()
    const [tabs, setTabs] = useState(props.content)
    const SIZE = useMemo(() => {
        return tabs.length
    }, [tabs])
    useEffect(() => {
        console.log(tabs)
    }, [tabs])
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
                }}
            />
            <div 
                ref={ref} 
                className={styles.wrapper}
                data-orientation={props.orientation} 
                style={{width: "300px", maxWidth: hidden ? "30px" : undefined, minWidth: hidden ? "30px" : undefined}}
            >
                {tabs.map((view, vI) => (
                    <React.Fragment key={id + "-view-"+vI} >
                        <View 
                            hidden={hidden} 
                            instance={view} 
                            switchView={(newView) => {
                                console.log(newView)
                                if(newView !== view)
                                    setTabs(prev => {
                                        const copy = [...prev]
                                        copy[vI] = newView
                                        return copy
                                    })
                            }}
                        />
                        {vI < SIZE -1 && SIZE > 1 ? (
                            <ResizableBar
                                type={"height"}
                                onResizeEnd={(next, prev) => {
                                    const nextBB = next.getBoundingClientRect()
                                    const prevBB = prev.getBoundingClientRect()

                                    if (prevBB.height < 25) {
                                        prev.style.height = "100%"
                                        setTabs(prev => {
                                            const copy = [...prev]
                                            copy.shift()
                                            return copy
                                        })

                                    }
                                    if (nextBB.height < 25) {

                                        next.style.height = "100%"
                                        setTabs(prev => {
                                            const copy = [...prev]
                                            copy[vI + 1] = undefined
                                            return copy.filter(e => e)
                                        })
                                    }
                                }}
                            />
                        ): null}
                    </React.Fragment>
                ))}
            </div>
        </>
    )
}

ViewWrapper.propTypes={
    content: PropTypes.arrayOf(PropTypes.oneOf(["hierarchy", "component", "files", "blueprint"])),
    orientation: PropTypes.oneOf(["vertical", "horizontal"]),
}

function View(props){
    const Component = useMemo(() => {
        switch (props.instance){
        case "blueprint":
            return null
        case "hierarchy":
            return  Hierarchy
        case "component":
            return ComponentEditor
        case "files":
            return null
        default:
            return null
        }
    }, [props.instance])

    if(Component)
        return (
            <div className={styles.view}>
                <Component hidden={props.hidden} switchView={props.switchView}/>
            </div>
        )
    return null
}
View.propTypes={
    switchView: PropTypes.func,
    hidden: PropTypes.bool,
    instance: PropTypes.oneOf(["hierarchy", "component", "files", "blueprint"])
}
 