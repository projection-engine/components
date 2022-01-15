import PropTypes from "prop-types";
import React, {useEffect, useRef, useState} from "react";
import styles from './styles/Tree.module.css'
import TreeNode from "./TreeNode";

export default function TreeView(props) {
    const [focusedNode, setFocusedNode] = useState()
    const ref = useRef()
    const handleMouseDown = (ev) => {
        if (focusedNode && !document.elementsFromPoint(ev.clientX, ev.clientY).includes(ref.current)) {
            setFocusedNode(undefined)
        }
    }
    useEffect(() => {
        document.addEventListener('mousedown', handleMouseDown)
        return () => document.removeEventListener('mousedown', handleMouseDown)
    }, [focusedNode])

    return (
        <div className={styles.wrapper}>
            {props.nodes.map((child, index) => (
                <React.Fragment key={'tree-' + index}>
                    <TreeNode
                        handleRename={props.handleRename}
                        node={child} index={0}
                        selected={props.selected}
                        focusedNode={focusedNode}
                        setFocusedNode={setFocusedNode}

                    />
                </React.Fragment>
            ))}
        </div>
    )
}

TreeView.propTypes = {
    selected: PropTypes.object,
    nodes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        onClick: PropTypes.func,
        children: PropTypes.array,
        icon: PropTypes.node,
        type: PropTypes.string,
        attributes: PropTypes.object
    })).isRequired,
    handleRename: PropTypes.func.isRequired,
}