import PropTypes from "prop-types"
import React, {useId} from "react"
import styles from "./styles/Tree.module.css"
import TreeNode from "./TreeNode"
import SelectBox from "../select-box/SelectBox"
import useContextTarget from "../context/hooks/useContextTarget"

export default function TreeView(props) {
    const {
        nodes,
        draggable,
        onDragOver,
        onDragLeave,
        onDrop,
        onDragStart,
        handleRename,
        onMultiSelect,
        contextTriggers,
        options,
        selected, 
        className,
        multiSelect,
        ids
    } = props 
    let t
    const ID = useId()

    useContextTarget(
        {id: "tree-view-"+ID},
        options,
        contextTriggers
    )

    return (
        <div data-self={"self"} className={[styles.wrapper, className].join(" ")} style={styles} id={"tree-view-"+ID}>
            {onMultiSelect && Array.isArray(selected) && multiSelect? <SelectBox setSelected={onMultiSelect} selected={selected} nodes={ids} />: null}
            {nodes.map((child, index) => (
                <React.Fragment key={ID + "-tree-" + index}>
                    <TreeNode
                        open={true}
                        rootIndex={index === 0}
                        onDragOver={(e) => {
                            if(draggable) {
                                e.preventDefault()

                                t = e.currentTarget.parentNode.parentNode
                                t.classList.add(styles.hoveredNode)
                            }
                            if (onDragOver)
                                onDragOver(e, e.currentTarget.id)
                        }}
                        onDragLeave={(e) => {
                            if(draggable) {

                                e.preventDefault()
                                if(t)
                                    t.classList.remove(styles.hoveredNode)
                            }
                            if (onDragLeave)
                                onDragLeave(e, e.currentTarget.id)
                        }}
                        onDrop={(e) => {
                            if(draggable) {
                                e.preventDefault()
                                if(t)
                                    t.classList.remove(styles.hoveredNode)
                            }
                            if (onDrop)
                                onDrop(e, e.currentTarget.id)
                        }}
                        onDragStart={(e) => {
                            if(!onDragStart)
                                e.dataTransfer.setData("text", e.currentTarget.id)
                            else
                                onDragStart(e, e.currentTarget.id)
                        }}
                        draggable={draggable}
                        handleRename={handleRename}
                        triggerHierarchy={() => null}
                        node={child} index={0}
                        selected={selected}
                        setSelected={(v) => {
                            if(typeof onMultiSelect === "function")
                                onMultiSelect([v])
                        }}

                    />
                </React.Fragment>
            ))}
        </div>
    )
}

TreeView.propTypes = {
    styles: PropTypes.object,
    className: PropTypes.string,
    onMultiSelect: PropTypes.func,
    multiSelect: PropTypes.bool,

    contextTriggers: PropTypes.array, 
    selected: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

    ids: PropTypes.array,
    nodes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.any.isRequired,
        label: PropTypes.string,
        onClick: PropTypes.func,
        children: PropTypes.array,
        icon: PropTypes.node,
        type: PropTypes.string,
        attributes: PropTypes.object,
        phantomNode: PropTypes.bool,

        hidden: PropTypes.bool,
        onHide: PropTypes.func,
        canBeHidden: PropTypes.bool,
        draggable: PropTypes.bool
    })).isRequired,
    handleRename: PropTypes.func.isRequired,

    draggable: PropTypes.bool,
    onDrop: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDragStart: PropTypes.func,

    options: PropTypes.arrayOf(PropTypes.shape({
        onClick: PropTypes.func,
        label: PropTypes.string,
        shortcut: PropTypes.any,
        icon: PropTypes.node,
        requiredTrigger: PropTypes.string
    })),
}