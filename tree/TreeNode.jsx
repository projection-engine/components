import styles from './styles/Tree.module.css'
import PropTypes from "prop-types";
import React, {useEffect, useMemo, useRef, useState} from "react";

export default function TreeNode(props) {
    const [open, setOpen] = useState(props.index === 0)
    const [onEdit, setOnEdit] = useState(false)
    const [currentLabel, setCurrentLabel] = useState(props.node.label)
    const ref = useRef()

    useEffect(() => {
        setCurrentLabel(props.node.label)

        if (!props.node.phantomNode)
            ref.current?.setAttribute('data-node', `${props.node.id}`)
        else
            ref.current?.setAttribute('data-root', `${props.node.id}`)
    }, [props.node])


    const selected = useMemo(() => {
        if (typeof props.selected === 'string')
            return props.selected === props.node.id
        else if (Array.isArray(props.selected))
            return props.selected.includes(props.node.id)
        else
            return false
    }, [props.selected])


    const padding = useMemo(() => {
        return (parseInt(props.index) * (props.node.children?.length === 0 ? 30 : 25))
    }, [props.index, props.node.children])

    return (
        <>
            <div
                className={styles.container}
                title={currentLabel}
                data-selected={`${selected}`}
            >
                {props.node.canBeHidden ?
                    <button className={styles.button} onClick={props.node.onHide}>
                        <span className={'material-icons-round'}
                              style={{fontSize: '1rem'}}>{!props.node.hidden ? 'visibility' : 'visibility_off'}</span>
                    </button>
                    :
                    null}
                <div

                    ref={ref}
                    style={{paddingLeft: padding + 'px'}}
                    className={styles.row}
                >

                    {props.node.children?.length > 0 ? (
                        <button
                            className={styles.button}
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
                        <div
                            className={styles.rowContentWrapper}
                            onClick={e => {
                                if (props.node.onClick)
                                    props.node.onClick(e)
                            }}>
                            <div
                                id={props.node.id}
                                className={styles.rowContent}
                                style={{fontWeight: props.index === 0 ? '550' : undefined, width: !props.node.type ? '90%' : undefined}}

                                draggable={!props.node.phantomNode && props.draggable && props.node.draggable}

                                onDrop={props.onDrop}
                                onDragOver={props.onDragOver}
                                onDragLeave={props.onDragLeave}
                                onDragStart={props.onDragStart}

                                onDoubleClick={() => {
                                    setOnEdit(true)
                                }}
                            >
                                {props.node.icon}
                                <div className={styles.overflow}>
                                    {currentLabel}
                                </div>
                            </div>

                            {props.node.type ?
                                <div className={[styles.rowContent, styles.rowType, styles.overflow].join(' ')}>
                                    {props.node.type}
                                </div>
                                :
                                null
                            }
                        </div>
                    }
                </div>
            </div>
            {open ?
                <div style={{
                    '--position-left': (padding + props.node.canBeHidden ? 19 : 0) + 'px'
                }} className={styles.children}>
                    {props.node.children?.map((child, index) => (
                        <React.Fragment key={props.index + '-tree-node-' + index}>
                            <TreeNode
                                {...props}
                                selected={props.selected}
                                handleRename={props.handleRename}
                                node={child}
                                index={props.index + 1}

                            />
                        </React.Fragment>
                    ))}
                </div>
                : null
            }
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

        hidden: PropTypes.bool,
        onHide: PropTypes.func,
        canBeHidden: PropTypes.bool
    }).isRequired,
    index: PropTypes.number,
    draggable: PropTypes.bool,
    onDrop: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDragStart: PropTypes.func
}