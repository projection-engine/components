import PropTypes from "prop-types"
import React, {useEffect, useId, useRef, useState} from "react"
import styles from "./styles/Tree.module.css"
import Branch from "./Branch"
import SelectBox from "../select-box/SelectBox"
import useContextTarget from "../context/hooks/useContextTarget"


export const TreeProvider = React.createContext(0)
const BRANCH_SIZE = 25, DELAY = 500
export default function Tree(props) {
    const {
        contextTriggers,
        options,
        className,
    } = props

    const ID = useId()
    useContextTarget(
        {id: "tree-view-"+ID},
        options,
        contextTriggers
    )
    const ref = useRef()
    const [branches, setBranches] = useState([])
    useEffect(() => {
        let timeout
        const updateSize = () => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                const bBox = ref.current.getBoundingClientRect()
                const quantity = Math.floor(bBox.height /BRANCH_SIZE)
                const newBranches = []
                for(let i =0; i < quantity; i++)
                    newBranches.push(<Branch index={i}/>)
                setBranches(newBranches)
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
        if(current >= 0)
            setOffset(current)
    }
    useEffect(() => {
        ref.current?.addEventListener("wheel", handleWheel, {passive: false})
        return () => ref.current?.removeEventListener("wheel", handleWheel, {passive: false})
    }, [])

    return (
        <div 
            ref={ref} 
            data-self={"self"}
            data-offset={offset}
            className={[styles.wrapper, className].join(" ")} 
            style={styles} 
            id={"tree-view-"+ID}
        >
            <TreeProvider.Provider value={offset}>
                {branches.map((branch, index)=> (
                    <React.Fragment key={"branch-" + index  + ID}>
                        {branch}
                    </React.Fragment>
                ))}
            </TreeProvider.Provider>
        </div>
    )
}

Tree.propTypes = {


}