import PropTypes from "prop-types";
import styles from '../styles/Group.module.css'
import React, {useEffect, useMemo, useState} from 'react'
import useGroup from "../hooks/useGroup";
import {KEYS} from "../../../services/hooks/useHotKeys";

export default function Group(props) {
    const [onEdit, setOnEdit] = useState(false)
    const [nameCache, setNameCache] = useState(props.group.name)
    const selected = useMemo(() => {
        return props.selected.indexOf(props.group.id) > -1
    }, [props.selected])

    const {
        ref,
        handleDragStart
    } = useGroup(props, selected)


    useEffect(() => {
        document.addEventListener('mousedown', handleDragStart)
        return () => {
            document.removeEventListener('mousedown', handleDragStart)
        }
    }, [props.group, props.selected, selected, props.scale])

    const rgb = useMemo(() => {
        return props.group.color.slice(0, 3).join(', ')
    }, [props.group.color])
    return (
        <g>
            <g
                ref={ref}
                transform={`translate(${props.group.x} ${props.group.y})`}
            >
                <foreignObject
                    data-group={props.group.id}
                    id={props.group.id}

                    className={styles.wrapper}
                    data-seleted={`${selected}`}
                    style={{
                        background: props.group.color ? `rgba(${rgb}, .5)` : 'rgba(150, 150, 150, .5)',
                        width: props.group.width + 'px',
                        height: props.group.height + 'px'
                    }}>
                    {onEdit ?
                        <input
                            style={{background: `rgb(${rgb})`}}
                            value={nameCache}
                            onChange={v => setNameCache(v.target.value)}
                            className={styles.input}
                            onBlur={() => {
                                props.submitName(nameCache)
                                setOnEdit(false)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === KEYS.Enter) {
                                    props.submitName(nameCache)
                                    setOnEdit(false)
                                }
                            }}
                        />
                        :
                        <div
                            className={styles.header}
                            style={{background: `rgb(${rgb})`}}
                            id={props.group.id + '-node'}
                            onDoubleClick={() => setOnEdit(true)}
                        >
                            {props.group.name}
                        </div>
                    }

                </foreignObject>
            </g>
        </g>
    )
}
Group.propTypes = {
    submitName: PropTypes.func,
    group: PropTypes.object.isRequired,
    scale: PropTypes.number,

    selected: PropTypes.array,
    setSelected: PropTypes.func,
}