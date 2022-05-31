import PropTypes from "prop-types"
import React, {useMemo, useState} from "react"
import styles from "./styles/Tree.module.css"
import TreeNode from "./TreeNode"
import {ContextMenu} from "@f-ui/core"
import Search from "../search/Search"
import SelectBox from "../selectbox/SelectBox"

export default function TreeView(props) {
    const [searchString, setSearchString] = useState('')
    let t
    const content = useMemo(() => {
        return (
            (searchString.length > 0 ? props.nodes.filter(n => n.label.toLowerCase().includes(searchString.toLowerCase())) : props.nodes).map((child, index) => (
                <React.Fragment key={'tree-' + index}>
                    <TreeNode

                        open={true}
                        onDragOver={(e) => {
                            if(props.draggable) {
                                e.preventDefault()

                                t = e.currentTarget.parentNode.parentNode
                                t.classList.add(styles.hoveredNode)
                            }
                            if (props.onDragOver)
                                props.onDragOver(e, e.currentTarget.id)
                        }}
                        onDragLeave={(e) => {
                            if(props.draggable) {

                                e.preventDefault()
                                if(t)
                                    t.classList.remove(styles.hoveredNode)
                            }
                            if (props.onDragLeave)
                                props.onDragLeave(e, e.currentTarget.id)
                        }}
                        onDrop={(e) => {
                            if(props.draggable) {
                                e.preventDefault()
                                if(t)
                                    t.classList.remove(styles.hoveredNode)
                            }
                            if (props.onDrop)
                                props.onDrop(e, e.currentTarget.id)
                        }}
                        onDragStart={(e) => {

                            if(!props.onDragStart)
                                e.dataTransfer.setData('text', e.currentTarget.id)
                            else
                                props.onDragStart(e, e.currentTarget.id)
                        }}
                        draggable={props.draggable}
                        handleRename={props.handleRename}
                        triggerHierarchy={() => null}
                        node={child} index={0}
                        selected={props.selected}

                    />
                </React.Fragment>
            ))
        )
    }, [searchString, props])

    return (
        <div data-self={'self'} className={[styles.wrapper, props.className].join(' ')} style={props.styles}>
            {props.searchable ? <Search width={'100%'} size={'default'} searchString={searchString} setSearchString={setSearchString}/> : undefined}

            {props.onMultiSelect && Array.isArray(props.selected) && props.multiSelect? <SelectBox setSelected={props.onMultiSelect} selected={props.selected} nodes={props.ids} />: null}
            {props.options && props.options.length > 0 ?
                <ContextMenu
                    className={styles.content}
                    options={props.options}
                    triggers={props.contextTriggers}>
                    {content}
                </ContextMenu>
                :
                content
            }
        </div>
    )
}

TreeView.propTypes = {
    styles: PropTypes.object,
    className: PropTypes.string,
    onMultiSelect: PropTypes.func,
    multiSelect: PropTypes.bool,

    contextTriggers: PropTypes.array,
    searchable: PropTypes.bool,
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
        canBeHidden: PropTypes.bool
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