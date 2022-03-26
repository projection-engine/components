import PropTypes from "prop-types";
import styles from '../styles/Node.module.css'
import React, {useEffect, useMemo} from 'react'
import useNode from "../hooks/useNode";
import NodeIO from "./NodeIO";
import NodeShowcase from "./NodeShowcase";
import NODE_TYPES from "../NODE_TYPES";
import {TYPES} from "../TYPES";

export default function Node(props) {
    const selected = useMemo(() => {
        return props.selected.indexOf(props.node.id) > -1
    }, [props.selected])
    const {

        ref,
        handleDragStart,
        handleLinkDrag,
        height,
        pathRef,
        outputLinks,
        inputLinks
    } = useNode(props, selected)

    console.log(props.node)
    useEffect(() => {
        document.addEventListener('mousedown', handleDragStart)
        return () => {
            document.removeEventListener('mousedown', handleDragStart)
        }
    }, [props.node, props.selected, selected, props.scale])

    const nodeInfo = useMemo(() => {
        switch (props.node.type) {
            case NODE_TYPES.FUNCTION:
                return {
                    backgroundColor: '#7b6fa2',
                    icon: <span style={{fontSize: '1rem'}} className={'material-icons-round'}>functions</span>
                }
            case NODE_TYPES.RESPONSE:
                return {
                    backgroundColor: '#a14a2a',
                    icon: <span style={{fontSize: '1rem'}} className={'material-icons-round'}>output</span>
                }
            default:
                return {
                    backgroundColor: '#0095ff',
                    icon: <span style={{fontSize: '1rem'}} className={'material-icons-round'}>tune</span>
                }
        }
    }, [props.node])

    const outputInfo = useMemo(() => {

        if(props.node.output?.length === 1 && (props.node.output[0].type === TYPES.NUMBER || props.node.output[0].type === TYPES.COLOR || props.node.output[0].type === TYPES.VEC)){
            return props.node.output[0].type === TYPES.VEC ? JSON.stringify( props.node[props.node.output[0].key] ) :  props.node[props.node.output[0].key]
        }
        return null
    }, [props.node])



    return (
        <g>
            <g
                ref={ref}
                transform={`translate(${props.node.x} ${props.node.y})`}
            >
                <foreignObject
                    data-node={props.node.canBeDeleted ? props.node.id : undefined}
                    id={props.node.id}

                    className={styles.wrapper}

                    style={{
                        width: '250px',
                        height: height + 'px',
                        outline: selected ? nodeInfo.backgroundColor + ' 2px solid' : undefined
                    }}>
                    <div
                        className={styles.label}
                        style={{borderColor: nodeInfo.backgroundColor}}
                        id={props.node.id + '-node'}
                    >
                        {nodeInfo.icon}
                        {props.node.name}

                        {outputInfo ?
                            <label style={{textAlign: 'right', width: '100%'}}>
                                {outputInfo}
                            </label>
                        :null}
                    </div>
                    <div className={styles.content}>
                        <div className={styles.column}>
                            {props.node.inputs.filter(a => Array.isArray(a.accept)).map((a, i) => (
                                        <React.Fragment key={a.key + '-input-' + i}>
                                            <NodeIO
                                                handleLink={props.handleLink}
                                                setAlert={props.setAlert}
                                                nodeID={props.node.id}
                                                onDragEnd={() => {
                                                    pathRef.current.setAttribute('d', undefined)
                                                }}
                                                data={a}
                                                handleLinkDrag={handleLinkDrag}
                                                links={inputLinks}
                                                type={'input'}
                                            />
                                        </React.Fragment>
                                    ))}
                            <NodeShowcase node={props.node}/>
                        </div>
                        <div className={styles.column} style={{justifyContent: 'flex-end'}}>
                            {props.node.output.map((a, i) => (
                                <React.Fragment key={a.key + '-output-' + i}>
                                    <NodeIO
                                        setAlert={props.setAlert}
                                        nodeID={props.node.id}
                                        onDragEnd={() => {
                                            pathRef.current.setAttribute('d', undefined)
                                        }}
                                        data={a}
                                        handleLinkDrag={handleLinkDrag}
                                        links={outputLinks}
                                        type={'output'}
                                    />
                                </React.Fragment>
                            ))}
                        </div>

                    </div>
                </foreignObject>
            </g>
            <path
                ref={pathRef}
                fill={'none'}
                stroke={'var(--fabric-accent-color)'}
                strokeWidth={'2'}
                strokeDasharray={'3,3'}
            />
        </g>
    )
}
Node.propTypes = {
    links: PropTypes.array,
    setAlert: PropTypes.func,
    node: PropTypes.object.isRequired,
    scale: PropTypes.number,
    handleLink: PropTypes.func,
    selected: PropTypes.string,
    setSelected: PropTypes.func,
}