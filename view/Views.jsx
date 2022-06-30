import PropTypes from "prop-types"
import styles from "./styles/Views.module.css"
import React, {useId, useMemo, useRef, useState} from "react"
import ResizableBar from "../resizable/ResizableBar"
import View from "./components/View"

export default function Views(props){
    const {tabs, setTabs} = props
    const id = useId()

    const [hidden, setHidden] = useState(false)
    const ref = useRef()

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
                    [orientation]: tabs.length > 0 ? "250px" : "0",
                    ["max" + maxMin]: tabs.length === 0 ? "0px" : (hidden ? "30px" : undefined),
                    ["min" + maxMin]: tabs.length  === 0 ? "0px" : (hidden ? "30px" : undefined),
                }}
            >
                {tabs.map((view, vI) => (
                    <React.Fragment key={id + "-view-"+vI} >
                        <View
                            hidden={hidden} 
                            instance={view}
                            styles={{   [orientation]: "inherit" }}
                            switchView={(newView) => {
                                if(!newView) {
                                    const copy = [...tabs]
                                    copy[vI] = undefined

                                    setTabs(copy.filter(e => e))
                                }
                                else if (newView !== view) {
                                    const copy = [...tabs]
                                    copy[vI] = newView
                                    setTabs(copy)
                                }
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

                                        const copy = [...tabs]
                                        copy.shift()
                                        setTabs(copy)

                                    }
                                    if (nextBB[invOrientation] < 25) {

                                        next.style[invOrientation] = "100%"

                                        const copy = [...tabs]
                                        copy[vI + 1] = undefined
                                        setTabs(copy.filter(e => e))
                                    }
                                }}
                            >

                            </ResizableBar>
                        ): null}
                    </React.Fragment>
                ))}

                <button
                    onClick={() =>
                        setTabs([...tabs, "console"])}
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

Views.propTypes={
    setTabs: PropTypes.func.isRequired,
    tabs: PropTypes.array.isRequired,


    resizePosition: PropTypes.oneOf(["top", "bottom"]),
    leftOffset: PropTypes.string,
    orientation: PropTypes.oneOf(["vertical", "horizontal"]),
}
