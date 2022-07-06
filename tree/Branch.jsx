import styles from "./styles/Branch.module.css"
import PropTypes from "prop-types"
import React, {useContext, useEffect, useMemo, useRef, useState} from "react"
import {Icon} from "@f-ui/core"
import {TreeProvider} from "./Tree"
import COMPONENTS from "../../project/engine/templates/COMPONENTS"
import EntityProvider from "./EntityProvider"

export default function Branch(props) {
    const {index} = props
    const offset = useContext(TreeProvider)
    const {
        entities,
        selected,
        setSelected
    } = useContext(EntityProvider)
    const ref=  useRef()
    const node = useMemo(() => {
        return entities[index + offset]
    }, [entities, offset])
    useEffect(() => {
        if(node) {
            const length = selected.length
            let is = false
            for (let i = 0; i < length; i++) {
                is = is || selected[i] === node.id
            }
            ref.current.setAttribute("data-selected", is ? "-" : "")
        }
    }, [selected, node])
    if(!node)
        return null
    return (
        <div
            ref={ref}
            className={styles.wrapper}
            data-open={""}
            data-selected={""}
            onClick={e => {
                if(e.target.nodeName !== "BUTTON")
                    setSelected(node.id, e.ctrlKey)
            }}
        >
            <div className={styles.summary}>
                <button
                    data-open={""}
                    className={styles.buttonSmall}
                    onClick={e => {
                        const currentValue = e.currentTarget.getAttribute("data-open")
                        e.currentTarget.setAttribute("data-open", currentValue === "-" ? "" : "-")
                        ref.current.setAttribute("data-open", currentValue === "-" ? "" : "-")
                    }}
                >
                    <Icon>arrow_drop_down</Icon>
                </button>
                <div className={styles.info} >
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
                    </>
                ) : null}
            </div>
        </div>
    )
}

Branch.propTypes={
    index: PropTypes.number.isRequired
}