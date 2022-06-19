import PropTypes from "prop-types"
import styles from "./ViewWrapper.module.css"
import React, {useId, useMemo, useRef, useState} from "react"
import ResizableBar from "../resizable/ResizableBar"
import Hierarchy from "../../project/components/hierarchy/Hierarchy"
import ComponentEditor from "../../project/components/component/ComponentEditor"
import ContentBrowser from "../../project/components/files/ContentBrowser"
import ShaderEditor from "../../project/components/blueprints/ShaderEditor"

export default function ViewWrapper(props){
    const id = useId()

    const [hidden, setHidden] = useState(false)
    const ref = useRef()
    const [tabs, setTabs] = useState(props.content)
    const SIZE = useMemo(() => {
        return tabs.length
    }, [tabs])
    const orientation = props.orientation === "horizontal" ? "height" : "width"
    const maxMin= props.orientation === "horizontal" ? "Height" : "Width"
    const invOrientation = props.orientation === "horizontal" ? "width" : "height"
    return (
        <>
            {props.resizePosition === "bottom" || tabs.length === 0 ? null :
                <ResizableBar
                    resetTargets={{previous: true, next: false}}
                    resetWhen={[hidden]}
                    type={orientation}
                    onResizeStart={() => {
                        if(hidden)
                            setHidden(false)
                    }}
                    onResizeEnd={() => {
                        if (ref.current.getBoundingClientRect()[orientation] <= 45)
                            setHidden(true)
                    }}
                />
            }
            <div 
                ref={ref} 
                className={styles.wrapper}
                data-orientation={props.orientation} 
                style={{
                    flexDirection: props.orientation === "horizontal" ? "row" : undefined,
                    [orientation]: tabs.length > 0 ? "300px" : "0", ["max" + maxMin]: tabs.length === 0 ? "0px" : (hidden ? "30px" : undefined),
                    ["min" + maxMin]: tabs.length  === 0 ? "0px" : (hidden ? "30px" : undefined),
                }}
            >
                {tabs.map((view, vI) => (
                    <React.Fragment key={id + "-view-"+vI} >
                        <View 
                            hidden={hidden} 
                            instance={view}
                            switchView={(newView) => {
                                if(!newView) {

                                    setTabs(prev => {
                                        const copy = [...prev]
                                        copy[vI] = undefined
                                        return copy.filter(e => e)
                                    })
                                }
                                else if (newView !== view)
                                    setTabs(prev => {
                                        const copy = [...prev]
                                        copy[vI] = newView
                                        return copy
                                    })
                            }}
                            orientation={props.orientation}
                        />
                        {vI < SIZE -1 && SIZE > 1 ? (
                            <ResizableBar
                                type={invOrientation}
                                resetWhen={tabs}
                                onResizeEnd={(next, prev) => {
                                    const nextBB = next.getBoundingClientRect()
                                    const prevBB = prev.getBoundingClientRect()

                                    if (prevBB[invOrientation] < 25) {
                                        prev.style[invOrientation] = "100%"
                                        setTabs(prev => {
                                            const copy = [...prev]
                                            copy.shift()
                                            return copy
                                        })

                                    }
                                    if (nextBB[invOrientation] < 25) {

                                        next.style[invOrientation] = "100%"
                                        setTabs(prev => {
                                            const copy = [...prev]
                                            copy[vI + 1] = undefined
                                            return copy.filter(e => e)
                                        })
                                    }
                                }}
                            >

                            </ResizableBar>
                        ): null}
                    </React.Fragment>
                ))}

                <button
                    onClick={() =>
                        setTabs([...tabs, "hierarchy"])}
                    style={{
                        left: props.orientation === "vertical" ? tabs.length  === 0 ? props.leftOffset : "10px" : "100%",
                        top: "100%",
                        transform: props.orientation === "vertical" ?  "translate(-100%, -100%)" : (tabs.length  === 0? "translate(0, -100%)" : "translate(-100%, -100%)")
                    }}
                    className={styles.extendView}
                />
            </div>
            {props.resizePosition === "top" || tabs.length === 0 ? null :
                <ResizableBar
                    resetTargets={{previous: true, next: false}}
                    resetWhen={[hidden]}
                    type={orientation}
                    onResizeStart={() => {
                        if(hidden)
                            setHidden(false)
                    }}
                    onResizeEnd={() => {
                        if (ref.current.getBoundingClientRect()[orientation] <= 45)
                            setHidden(true)
                    }}
                />
            }
        </>
    )
}

ViewWrapper.propTypes={
    resizePosition: PropTypes.oneOf(["top", "bottom"]),
    leftOffset: PropTypes.string,
    content: PropTypes.arrayOf(PropTypes.oneOf(["hierarchy", "component", "files", "blueprint"])),
    orientation: PropTypes.oneOf(["vertical", "horizontal"]),
}

function View(props){
    const Component = useMemo(() => {
        switch (props.instance){
        case "blueprint":
            return ShaderEditor
        case "hierarchy":
            return Hierarchy
        case "component":
            return ComponentEditor
        case "files":
            return ContentBrowser
        default:
            return null
        }
    }, [props.instance])

    if(Component)
        return (
            <div className={styles.view}>
                <Component {...props}/>
            </div>
        )
    return null
}
View.propTypes={
    extendView: PropTypes.func,
    orientation: PropTypes.string,
    switchView: PropTypes.func,
    hidden: PropTypes.bool,
    instance: PropTypes.oneOf(["hierarchy", "component", "files", "blueprint"])
}
 