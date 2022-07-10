import React, {useEffect, useId, useState} from "react"
import styles from "./styles/Tree.module.css"
import Branch from "./Branch"
import PropTypes from "prop-types"
import useInfiniteScroll from "./useInfiniteScroll"
import {v4} from "uuid"
import ENTITY_WORKER_ACTIONS from "../../static/misc/ENTITY_WORKER_ACTIONS"

const localActionID= v4()
export const TreeProvider = React.createContext([0, [], new Map()])
export default function Tree(props) {
    const ID = useId()
    const [open, setOpen] = useState({})
    const [toRender, setToRender] = useState([])
    const [ref, offset, maxDepth] = useInfiniteScroll()

    useEffect(() => {
        // const entities = Array.from(window.renderer.entitiesMap.values())
        // const data = []
        // let rendered = -offset
        // const size = entities.length
        // const callback = (node, depth) => {
        //     if (rendered <= maxDepth) {
        //         rendered++
        //         if(rendered >= 0)
        //             data.push({node, depth})
        //         if (open[node.id]) {
        //             for (let i = 0; i < node.children.length; i++) {
        //                 if (rendered > maxDepth)
        //                     continue
        //                 callback(node.children[i], depth + 1)
        //             }
        //         }
        //     }
        // }
        // for (let i = 0; i < size; i++) {
        //     if (rendered > maxDepth || entities[i].parent !== undefined)
        //         continue
        //     callback(entities[i], 0)
        // }
        //
        // setToRender(data)
        window.entityWorker.postMessage({
            type: ENTITY_WORKER_ACTIONS.GET_HIERARCHY,
            actionID: localActionID
        })
        window.addEntityWorkerListener(
            payload => {
                const data = []
                for(let i =0; i < payload.length; i++){
                    if(!payload[i].parent || open[payload[i].parent.id])
                        data.push(payload[i].parent)
                }
                setToRender(data)
            },
            localActionID
        )
        
    }, [props.entitiesChangeID, maxDepth, open])
    return (
        <div
            ref={ref}
            data-self={"self"}
            data-offset={offset}
            className={styles.wrapper}
            id={"tree-view-" + ID}
        >
            <TreeProvider.Provider value={[offset,  open, setOpen]}>
                {toRender.map((e, i) => i < maxDepth ? (
                    <React.Fragment key={i + "-branch-" + ID}>
                        <Branch
                            {...toRender[i + offset]}
                            internalID={ID}
                            open={open}
                            setOpen={setOpen}
                        />
                    </React.Fragment>
                ) : null)}
            </TreeProvider.Provider>
        </div>
    )
}

Tree.propTypes = {
    entitiesChangeID: PropTypes.string
}