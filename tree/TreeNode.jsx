import styles from "./styles/Tree.module.css"
import PropTypes from "prop-types"
import React, {useEffect, useMemo, useRef, useState} from "react"
import {Icon} from "@f-ui/core"

export default function TreeNode(props) {
    const [open, setOpen] = useState(props.index === 0)
    const [onEdit, setOnEdit] = useState(false)
    const [currentLabel, setCurrentLabel] = useState(props.node.label)
    const ref = useRef()

    useEffect(() => {
        setCurrentLabel(props.node.label)

        if (!props.rootIndex)
            ref.current?.setAttribute("data-node", `${props.node.id}`)
        else
            ref.current?.setAttribute("data-root", `${props.node.id}`)
    }, [props.node])


    const selected = useMemo(() => {
        if (typeof props.selected === "string")
            return props.selected === props.node.id ? 1 : 0
        else if (Array.isArray(props.selected))

            return props.selected[0] === props.node.id ? 1 : props.selected.includes(props.node.id) ? 2 : 0
        else
            return 0
    }, [props.selected])


    const padding = useMemo(() => {
        return (parseInt(props.index) * (props.node.children?.length === 0 ? 30 : 25))
    }, [props.index, props.node.children])

    return (
        <>
            <div
                className={styles.container}
                title={currentLabel}
                data-disabled={`${props.node.disabled === true}`}
                data-selected={`${selected}`}
            >

                <div

                    ref={ref}
                    style={{paddingLeft: padding + "px"}}
                    className={styles.row}
                >

                    {props.node.children?.length > 0 ? (
                        <button
                            className={styles.button}
                            disabled={props.node.disabled}
                            onClick={() => {
                                setOpen(!open)
                            }}
                        >
                            <Icon 
                                styles={{width: "24px", overflow: "hidden", fontSize: "1.2rem"}}
                            >{open ? "expand_more" : "chevron_right"}</Icon>
                        </button>
                    ) : null}

                    {onEdit ?
                        <input
                            onKeyPress={key => {
                                if (key.code === "Enter" && currentLabel !== props.node.label) {
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
                        <>
                            <div
                                className={styles.rowContentWrapper}
                                onClick={e => {
                                    if (props.node.onClick)
                                        props.node.onClick(e)
                                }}>
                                <div
                                    id={props.node.id}
                                    className={styles.rowContent}
                                    style={{
                                        fontWeight: props.index === 0 ? "550" : undefined,
                                        width: !props.node.type ? "90%" : undefined
                                    }}

                                    draggable={props.node.draggable}

                                    onDrop={props.onDrop}
                                    onDragOver={props.onDragOver}
                                    onDragLeave={props.onDragLeave}
                                    onDragStart={props.onDragStart}

                                >
                                    {props.node.icon}
                                    <div 
                                        className={styles.overflow}
                                        onDoubleClick={() => {
                                            if(!props.node.disabled)
                                                setOnEdit(true)
                                        }}
                                        style={{
                                            cursor: !props.node.disabled ? "pointer" : undefined
                                        }}>
                                        {currentLabel}
                                    </div>
                                </div>

                            </div>
                            {props.node.canBeHidden ?
                                <button className={styles.button} onClick={props.node.onHide}>
                                    <Icon
                                        styles={{fontSize: "1rem"}}>{!props.node.hidden ? "visibility" : "visibility_off"}</Icon>
                                </button>
                                :
                                null}
                        </>
                    }

                </div>
            </div>
            {open ?
                <div style={{
                    "--position-left": `${padding}px`
                }} className={styles.children}>
                    {props.node.children?.map((child, index) => (
                        <React.Fragment key={props.index + "-tree-node-" + index}>
                            <TreeNode
                                {...props}
                                selected={props.selected}
                                handleRename={props.handleRename}
                                node={child}
                                rootIndex={false}
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
    setSelected: PropTypes.func,
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
        disabled: PropTypes.bool,

        hidden: PropTypes.bool,
        onHide: PropTypes.func,
        canBeHidden: PropTypes.bool,
        draggable: PropTypes.bool
    }).isRequired,
    index: PropTypes.number,
    draggable: PropTypes.bool,
    onDrop: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDragStart: PropTypes.func,
    rootIndex: PropTypes.bool
}