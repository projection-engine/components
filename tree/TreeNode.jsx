import styles from './styles/Tree.module.css'
import PropTypes from "prop-types";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {Button} from "@f-ui/core";

export default function TreeNode(props) {
    const [open, setOpen] = useState(props.index === 0)
    const [onEdit, setOnEdit] = useState(false)
    const [currentLabel, setCurrentLabel] = useState(props.node.label)
    const ref = useRef()

    useEffect(() => {
        setCurrentLabel(props.node.label)
        if (props.node.attributes)
            Object.keys(props.node.attributes).forEach((attr) => {
                ref.current?.setAttribute(attr, `${props.node.attributes[attr]}`)
            })
        if (!props.node.phantomNode)
            ref.current?.setAttribute('data-node', `${props.node.id}`)
    }, [props.node])


    const selected = useMemo(() => {
        if (typeof props.selected === 'string')
            return props.selected === props.node.id
        else if (Array.isArray(props.selected))
            return props.selected.includes(props.node.id)
        else
            return false
    }, [props.selected])

    useEffect(() => {
        if (selected) {
            setOpen(true)
            props.triggerHierarchy()
        }
    }, [selected])
    const padding = useMemo(() => {
        return (parseInt(props.index) * (props.node.children.length === 0 ? 30 : 25))
    }, [props.index, props.node.children])

    return (
        <>
            <div className={styles.container}>
                {props.node.controlOption ?
                    <button className={styles.button} onClick={props.node.controlOption.onClick}>
                        {props.node.controlOption.icon}
                    </button>
                    :
                    null}
                <div
                    ref={ref}

                    id={props.node.id}
                    style={{paddingLeft: padding + 'px'}}
                    data-highlight={`${props.focusedNode === props.node.id}`}
                    data-selected={`${selected}`}
                    className={styles.row}

                    draggable={!props.node.phantomNode && props.draggable && !onEdit}
                    onDrop={props.onDrop}
                    onDragOver={props.onDragOver}
                    onDragLeave={props.onDragLeave}
                    onDragStart={props.onDragStart}

                    onClick={e => {
                        props.setFocusedNode(props.node.id)
                        if (props.node.onClick)
                            props.node.onClick(e)
                    }}
                >

                    {props.node.children?.length > 0 ? (
                        <button className={styles.button}
                                onClick={() => {
                                    if (!props.node.phantomNode)
                                        props.node.onClick()
                                    setOpen(!open)
                                }}
                        >
                        <span style={{width: '24px', overflow: 'hidden', fontSize: '1.2rem'}}
                              className={'material-icons-round'}>{open ? 'expand_more' : 'chevron_right'}</span>
                        </button>
                    ) : null}

                    {onEdit ?
                        <input
                            onKeyPress={key => {
                                if (key.code === 'Enter' && currentLabel !== props.node.label) {
                                    setOnEdit(false)
                                    props.handleRename(props.node, currentLabel)
                                }
                            }}
                            className={styles.input}
                            onBlur={() => {
                                setOnEdit(false)
                                if (currentLabel !== props.node.label)
                                    props.handleRename(props.node, currentLabel)
                            }}
                            value={currentLabel}
                            onChange={e => setCurrentLabel(e.target.value)}
                        />
                        :
                        <div className={styles.rowContentWrapper}>
                            <div
                                id={props.node.id + '-node'}
                                className={styles.rowContent}
                                style={{fontWeight: '600'}}
                                onDoubleClick={() => {
                                    setOnEdit(true)
                                }}
                            >
                                {props.node.icon}
                                <div className={styles.overflow}>
                                    {currentLabel}
                                </div>
                            </div>

                            <div className={[styles.rowContent, styles.rowType, styles.overflow].join(' ')}>
                                {props.node.type}
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div style={{
                display: open ? undefined : 'none',
                '--position-left': (padding + props.node.controlOption ? 19 : 0) + 'px'
            }} className={styles.children}>
                {props.node.children?.map((child, index) => (
                    <React.Fragment key={props.index + '-tree-node-' + index}>
                        <TreeNode
                            {...props}
                            selected={props.selected}
                            handleRename={props.handleRename}
                            node={child}
                            index={props.index + 1}
                            focusedNode={props.focusedNode}
                            setFocusedNode={props.setFocusedNode}

                            triggerHierarchy={() => {
                                setOpen(true)
                                props.triggerHierarchy()
                            }}
                        />
                    </React.Fragment>
                ))}
            </div>
        </>
    )
}

TreeNode.propTypes = {

    selected: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    handleRename: PropTypes.func.isRequired,
    node: PropTypes.shape({
        id: PropTypes.any.isRequired,
        label: PropTypes.string,
        onClick: PropTypes.func,

        children: PropTypes.array,
        icon: PropTypes.node,
        type: PropTypes.string,
        attributes: PropTypes.object,
        phantomNode: PropTypes.bool,
        controlOption: PropTypes.shape({
            icon: PropTypes.node,
            onClick: PropTypes.func
        })
    }).isRequired,
    index: PropTypes.number,
    focusedNode: PropTypes.string,
    setFocusedNode: PropTypes.func,

    draggable: PropTypes.bool,
    onDrop: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDragStart: PropTypes.func,
    triggerHierarchy: PropTypes.func.isRequired
}