import styles from "./styles/Branch.module.css"
import PropTypes from "prop-types"
import React, {useContext, useEffect, useRef} from "react"
import {Icon} from "@f-ui/core"
import EntityProvider from "./EntityProvider"
import COMPONENTS from "../../project/engine/templates/COMPONENTS"

export default function Branch(props) {
    const {depth, node, open, setOpen} = props
    const {selected, setSelected} = useContext(EntityProvider)
    const ref = useRef()
    useEffect(() => {
        if (node) {
            const length = selected.length
            let is = false
            for (let i = 0; i < length; i++)
                is = is || selected[i] === node.id
            console.log(is)
            ref.current.setAttribute("data-selected", is ? "-" : "")
        }
    }, [selected, node])

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
            onClick={e => {
                if (e.target.nodeName !== "BUTTON")
                    setSelected(node.id, e.ctrlKey)
            }}
        >
            <div className={styles.summary}>
                <button
                    data-open={open[node.id] ? "-" : ""}
                    className={styles.buttonSmall}
                    onClick={e => {
                        if (!open[node.id])
                            setOpen({...open, [node.id]: true})
                        else
                            setOpen({...open, [node.id]: false})
                    }}
                >
                    <Icon>arrow_drop_down</Icon>
                </button>
                <div className={styles.info}>
                    <label className={styles.overflow}>{node.name}</label>
                </div>
                <button className={styles.buttonSmall}>
                    <Icon styles={{fontSize: ".9rem"}}>
                        visibility
                    </Icon>
                </button>
            </div>
            <div className={styles.content}>
                {node.components[COMPONENTS.MESH] ? (
                    <>
                        <Icon>view_in_ar</Icon>
                        Mesh
                        {}
                    </>
                ) : null}
            </div>
        </div>
    )
}

Branch.propTypes = {
    maxDepth: PropTypes.number,
    totalRendered: PropTypes.number,
    open: PropTypes.object,
    setOpen: PropTypes.func,
    depth: PropTypes.number,
    node: PropTypes.object,
}