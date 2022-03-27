import PropTypes from "prop-types";
import React, {useMemo, useState} from "react";
import Node from "./Node";
import styles from '../styles/Board.module.css'
import handleDropBoard from "../utils/handleDropBoard";

import handleBoardScroll from "../utils/handleBoardScroll";
import useBoard from "../hooks/useBoard";
import {ContextMenu} from "@f-ui/core";
import getBoardOptions from "../utils/getBoardOptions";
import OnDragProvider from "../hooks/DragProvider";
import SelectBox from "../../selectbox/SelectBox";


export default function Board(props) {
    const {

        scale,
        links,
        ref,
        handleLink
    } = useBoard(props.hook, props.setAlert, props.parentRef)

    const handleDropNode = (n, e) => {
        const bounding = {
            x: ref.current.scrollLeft - ref.current.getBoundingClientRect().left,
            y: ref.current.scrollTop - ref.current.getBoundingClientRect().top
        }
        const mousePlacement = {
            x: e.clientX + bounding.x,
            y: e.clientY + bounding.y
        }
        const current = {
            x: mousePlacement.x,
            y: mousePlacement.y
        }
        n.x = (current.x - 100) / scale
        n.y = (current.y - 25) / scale
        props.hook.setNodes(prev => {
            return [...prev, n]
        })
    }
    const boardOptions = useMemo(() => {
        return getBoardOptions((n, mouseInfo) => {
            handleDropNode(n, mouseInfo)
        },props.setSelected,  props.hook, links, props.allNodes)
    }, [props.hook.nodes, props.hook.links, links])


    const [dragType, setDragType] = useState()
    const setSelected = (i) => {
        if (i && !props.selected.find(e => e === i))
            props.setSelected(prev => {
                return [...prev, i]
            })
        else if (props.selected.find(e => e === i))
            props.setSelected(prev => {
                const copy = [...prev]
                copy.splice(copy.indexOf(i), 1)
                return copy
            })
    }



    return (
        <OnDragProvider.Provider value={{setDragType, dragType}}>
            <ContextMenu
                options={boardOptions}
                triggers={[

                    'data-node',
                    'data-board',
                    'data-link'
                ]}
                styles={{
                    overflow: 'hidden',
                    width: '100%',
                    height: '100%',
                    borderRadius: '5px',
                    position: 'relative'
                }}

            >
                <SelectBox nodes={props.hook.nodes} selected={props.selected} setSelected={props.setSelected}/>
                <svg
                    onDragOver={e => e.preventDefault()}
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        height: '10000px',
                        width: '10000px',
                    }}
                    data-board={'self'}
                    onContextMenu={e => e.preventDefault()}
                    onDrop={e => {
                        e.preventDefault()
                        const n = handleDropBoard(e.dataTransfer.getData('text'), props.allNodes)
                        if (n) {
                            handleDropNode(n, e)
                        }
                    }}
                    ref={ref}
                    className={[styles.wrapper, styles.background].join(' ')}
                    onMouseDown={e => {
                        if (e.button === 2)
                            handleBoardScroll(ref.current.parentNode, e)

                        if (e.target === ref.current)
                            props.setSelected([])
                    }}
                >
                    {links.map((l, i) => (
                        <g key={l.target + '-' + l.source} className={styles.link}>

                            <path
                                data-link={l.target + '-' + l.source}
                                fill={'none'}
                                stroke={'var(--fabric-accent-color)'}
                                id={l.target + '-' + l.source}/>
                            <path
                                data-link={l.target + '-' + l.source}
                                fill={'none'}
                                stroke={'transparent'}
                                strokeWidth={'10'}

                                id={l.target + '-' + l.source + '-supplementary'}/>
                        </g>
                    ))}
                    {props.hook.nodes.map(node => (
                        <React.Fragment key={node.id}>
                            <Node
                                links={links}
                                setAlert={props.setAlert}
                                setSelected={(i, multi) => {
                                    if (multi)
                                        setSelected(i)
                                    else
                                        props.setSelected([i])
                                }}
                                selected={props.selected}
                                node={node}
                                scale={scale}
                                handleLink={handleLink}/>
                        </React.Fragment>
                    ))}

                </svg>
            </ContextMenu>
        </OnDragProvider.Provider>
    )
}
Board.propTypes = {
    allNodes: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.any,
        dataTransfer: PropTypes.string,
        tooltip: PropTypes.string,
        icon: PropTypes.node,
        getNewInstance: PropTypes.func
    })).isRequired,
    setAlert: PropTypes.func.isRequired,
    parentRef: PropTypes.object,
    hook: PropTypes.object,
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    setSelected: PropTypes.func,
}