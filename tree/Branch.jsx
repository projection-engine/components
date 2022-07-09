import styles from "./styles/Branch.module.css"
import PropTypes from "prop-types"
import React, {useContext, useEffect, useMemo, useRef, useState} from "react"
import {Icon} from "@f-ui/core"
import EntityProvider from "./EntityProvider"
import COMPONENTS from "../../project/engine/templates/COMPONENTS"
import handleDropFolder from "../../project/components/files/utils/handleDropFolder"
import Packager from "../../project/engine/Packager"

export default function Branch(props) {
    const {depth, node, open, setOpen} = props
    const {selected, setSelected, lockedEntity, setLockedEntity} = useContext(EntityProvider)
    const ref = useRef()
    const [active, setActive] = useState(true)

    useEffect(() => {
        if (node) {
            setActive(window.renderer.entitiesMap.get(node.id).active)
            const length = selected.length
            let is = false
            for (let i = 0; i < length; i++)
                is = is || selected[i] === node.id
             
            ref.current.setAttribute("data-selected", is ? "-" : "")
        }
    }, [selected, node])

    const icon = useMemo(() => {
        if(node) {
            if (node.components[COMPONENTS.FOLDER])
                return "inventory_2"
            if (node.components[COMPONENTS.POINT_LIGHT])
                return "lightbulb"
            if (node.components[COMPONENTS.DIRECTIONAL_LIGHT])
                return "light_mode"
            if (node.components[COMPONENTS.PROBE])
                return "lens_blur"
            return "category"
        }
    }, [node])
    
    if (!node)
        return null
    return (
        <div
            id={node.id}
            ref={ref}
            className={styles.wrapper}
            data-open={open[node.id] ? "-" : ""}
            data-selected={""}
            data-parentopen={""}
            style={{paddingLeft: depth * 16 + "px"}}
            onMouseDown={e => {
                if (e.target.nodeName !== "BUTTON" && e.target.nodeName !== "SPAN")
                    setSelected(node.id, e.ctrlKey)
            }}
            onDragOver={e => {
                e.preventDefault()
                ref.current.classList.add(styles.draggedOver)
            }}
            onDragLeave={e => {
                e.preventDefault()
                ref.current.classList.remove(styles.draggedOver)
            }}
            onDrop={e => {
                e.preventDefault()
                ref.current.classList.remove(styles.draggedOver)
                // handleDropFolder(e.dataTransfer.getData("text"), b.id, props.hook)
            }}
        >
            <div className={styles.summary}>
                {node.children.length > 0 ? (
                    <button
                        data-open={open[node.id] ? "-" : ""}
                        className={styles.buttonSmall}
                        onClick={() => {
                            if (!open[node.id])
                                setOpen({...open, [node.id]: true})
                            else
                                setOpen({...open, [node.id]: false})
                        }}
                    >
                        <Icon>arrow_drop_down</Icon>
                    </button>
                ) : <div style={{width: "25px"}}/>}
                <div className={styles.info}>
                    <button
                        data-locked={lockedEntity === node.id ? "-" : ""}
                        className={styles.buttonIcon}
                        onClick={() => setLockedEntity(node.id)}
                    >
                        <Icon styles={{fontSize: icon === "lens_blur" ? "1.35rem" : "1rem"}}>{icon}</Icon>
                    </button>
                    <div
                        className={styles.label} 
                        draggable={true}
                    >
                        {node.name}
                    </div>
                </div>
                <button
                    className={styles.buttonSmall}
                    onClick={() => {
                        window.renderer.entitiesMap.get(node.id).active = !active
                        Packager.lights()
                        setActive(!active)
                    }}>
                    <Icon styles={{fontSize: ".9rem"}}>
                        {active ? "visibility" : "visibility_off"}
                    </Icon>
                </button>
            </div>
            <div className={styles.content}>
                {node.components[COMPONENTS.MESH] ? (
                    <>
                        <Icon>view_in_ar</Icon>
                        Mesh
                    </>
                ) : null}
            </div>
        </div>
    )
}

Branch.propTypes = {
    open: PropTypes.object,
    setOpen: PropTypes.func,
    depth: PropTypes.number,
    node: PropTypes.object,
}