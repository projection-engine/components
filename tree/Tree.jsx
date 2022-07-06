import React, {useEffect, useId, useRef, useState} from "react"
import styles from "./styles/Tree.module.css"
import Branch from "./Branch"
import PropTypes from "prop-types"

export const TreeProvider = React.createContext([0, [], new Map()])
const BRANCH_SIZE = 25, DELAY = 500
export default function Tree(props) {
    const ID = useId()
    const ref = useRef()
    const [maxDepth, setMaxDepth] = useState(0)
    useEffect(() => {
        let timeout
        const updateSize = () => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                const bBox = ref.current.getBoundingClientRect()
                const quantity = Math.floor(bBox.height / BRANCH_SIZE)
                setMaxDepth(quantity)
            }, DELAY)
        }
        updateSize()
        const observer = new ResizeObserver(() => updateSize())
        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    const [offset, setOffset] = useState(0)
    const handleWheel = (e) => {
        e.preventDefault()
        const current = parseInt(ref.current.getAttribute("data-offset")) - Math.sign(e.wheelDelta)
        if (current >= 0)
            setOffset(current)
    }
    useEffect(() => {
        ref.current?.addEventListener("wheel", handleWheel, {passive: false})
        return () => ref.current?.removeEventListener("wheel", handleWheel, {passive: false})
    }, [])


    const [open, setOpen] = useState({})

    const [toRender, setToRender] = useState([])
    useEffect(() => {
        const entities = Array.from(props.entities.values())
        const data = []
        let rendered = -offset
        const size = entities.length
        const callback = (node, depth) => {
            if (rendered <= maxDepth) {
                rendered++
                if(rendered >= 0)
                    data.push({node, depth})
                if (open[node.id]) {
                    for (let i = 0; i < node.children.length; i++) {
                        if (rendered > maxDepth)
                            continue
                        callback(node.children[i], depth + 1)
                    }
                }
            }
        }
        for (let i = 0; i < size; i++) {
            if (rendered > maxDepth || entities[i].parent !== undefined)
                continue
            callback(entities[i], 0)
        }
        setToRender(data)
    }, [props.entities, offset, maxDepth, open])
    return (
        <div
            ref={ref}
            data-self={"self"}
            data-offset={offset}
            className={styles.wrapper}
            id={"tree-view-" + ID}
        >
            <TreeProvider.Provider value={[offset,  open, setOpen]}>
                {toRender.map((e, i) =>
                    <React.Fragment key={i + "-branch-" + ID}>
                        <Branch
                            {...e}
                            index={i}
                            internalID={ID}
                            open={open}
                            setOpen={setOpen}
                        />
                    </React.Fragment>
                )}
            </TreeProvider.Provider>
        </div>
    )
}

Tree.propTypes = {
    entities: PropTypes.object
}