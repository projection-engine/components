import styles from './styles/Tree.module.css'
import PropTypes from "prop-types";
import React, {useEffect, useRef, useState} from "react";
import {Button} from "@f-ui/core";
import {TYPES_ARRAY} from "../scene/hierarchy/TYPES";

export default function TreeNode(props) {
    const [open, setOpen] = useState(props.index === 0)
    const [onEdit, setOnEdit] = useState(false)
    const [currentLabel, setCurrentLabel] = useState(props.node.label)
    const ref = useRef()

    useEffect(() => {
        setCurrentLabel(props.node.label)
    }, [props.node])
    useEffect(() => {
        if(props.node.attributes){
            Object.keys(props.node.attributes).forEach((attr) => {
                ref.current?.setAttribute(attr, `${props.node.attributes[attr]}`)
            })
        }
    }, [props.node.attributes])

    return (
        <>
            <div
                ref={ref}
                style={{paddingLeft: (parseInt(props.index) * (props.node.children.length === 0 ? 32 : 24)) + 'px'}}
                data-highlight={`${props.focusedNode === props.node.id}`}
                data-selected={`${props.selected?.id === props.node.id}`}
                className={styles.row}
                onClick={() => {
                    props.setFocusedNode(props.node.id)
                    props.node.onClick()
                }}
            >

                {props.node.children?.length > 0 ? (
                    <Button
                        onClick={() => {
                            props.node.onClick()
                            setOpen(!open)
                        }}
                        className={styles.hideButton}>
                        <div style={{width: '24px', overflow: 'hidden', fontSize: '1.2rem'}}
                             className={'material-icons-round'}>{open ? 'expand_more' : 'chevron_right'}</div>
                    </Button>
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
            {open ?
                props.node.children?.map((child, index) => (
                    <React.Fragment key={props.index + '-tree-node-' + index}>
                        <TreeNode
                            selected={props.selected}
                            handleRename={props.handleRename}
                            node={child}
                            index={props.index + 1}
                            focusedNode={props.focusedNode}
                            setFocusedNode={props.setFocusedNode}
                        />
                    </React.Fragment>
                ))
                :
                null}
        </>
    )
}

TreeNode.propTypes = {
    selected: PropTypes.object,
    handleRename: PropTypes.func.isRequired,
    node: PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        onClick: PropTypes.func,
        children: PropTypes.array,
        icon: PropTypes.node,
        type: PropTypes.oneOf(TYPES_ARRAY),
        attributes: PropTypes.object
    }).isRequired,
    index: PropTypes.number,
    focusedNode: PropTypes.string,
    setFocusedNode: PropTypes.func
}