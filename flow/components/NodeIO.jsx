import styles from "../styles/Node.module.css";
import PropTypes from "prop-types";
import {TYPES} from "../TYPES";
import {useContext, useEffect, useMemo, useRef} from "react";
import OnDragProvider from "../hooks/DragProvider";

export default function NodeIO(props) {
    const infoRef = useRef()
    const wrapperRef = useRef()
    const asInput = (e) => {
        e.preventDefault()
        const data = JSON.parse(e.dataTransfer.getData('text'))
        e.currentTarget.style.background = 'var(--fabric-background-primary)'

        if (data.type === 'output' && props.data.accept.includes(data.attribute.type))
            props.handleLink(data, {
                attribute: props.data,
                id: props.nodeID
            })
        else if (data.type !== 'output')
            props.setAlert({
                type: 'error',
                message: 'Can\'t link input with input.'
            })
        else
            props.setAlert({
                type: 'error',
                message: 'Invalid type'
            })
    }
    const getType = (a) => {
        switch (a) {
            case TYPES.VEC:
                return 'Vector'
            case TYPES.NUMBER:
                return 'Number'
            case TYPES.STRING:
                return 'String'
            case TYPES.COLOR:
                return 'RGB'
            case TYPES.TEXTURE:
                return 'Texture sample'
            case TYPES.OBJECT:
                return 'Object'
            case TYPES.EXECUTION:
                return 'Execution loop'
        }
    }
    const onDragContext = useContext(OnDragProvider)
    const parent = document.getElementById(props.nodeID)
    const handler = (e) => {
        const bBox = parent.getBoundingClientRect()

        if (e.type === 'dragover' && props.type === 'input' && props.data.accept) {

            infoRef.current.style.display = 'grid'
            infoRef.current.style.top = wrapperRef.current.offsetTop + 'px'
            infoRef.current.style.left = (e.clientX - bBox.x) + 'px'
            infoRef.current.style.borderLeft = props.data.accept.includes(onDragContext.dragType) ? 'green 2px solid' : 'red 2px solid'
        } else
            infoRef.current.style.display = 'none'
    }
    useEffect(() => {
        const el = document.getElementById(props.nodeID + props.data.key)
        if (el) {
            el.addEventListener('dragover', handler)
            el.addEventListener('dragleave', handler)
            el.addEventListener('drop', handler)
        }
        return () => {
            if (el) {
                el.removeEventListener('drop', handler)
                el.removeEventListener('dragleave', handler)
                el.removeEventListener('dragover', handler)
            }
        }
    }, [onDragContext.dragType])
    const isExecution = useMemo(() => {
        return (props.data.accept && props.data.accept.includes(TYPES.EXECUTION)) || props.data.type === TYPES.EXECUTION
    }, [])
    return (
        <>
            <div ref={infoRef} className={styles.infoWrapper}>
                {props.data.accept?.map((a, i) => (
                    <div className={styles.ioKey} key={i + '-key-' + a}>
                        <div className={styles.iconWrapper} data-valid={`${onDragContext.dragType === a}`}>
                                <span style={{fontSize: '.8rem'}}
                                      className={'material-icons-round'}>{onDragContext.dragType === a ? 'check' : 'close'}</span>
                        </div>
                        {getType(a)}
                    </div>
                ))}
            </div>
            <div className={styles.attribute} ref={wrapperRef}
                 style={{justifyContent: props.type === 'input' ? 'flex-start' : 'flex-end'}}>

                {props.type === 'output' && !isExecution? (
                    <div data-disabled={`${props.data.disabled}`} className={styles.overflow}
                         style={{color: props.data.color, fontWeight: 'bold'}}>
                        {props.data.label}
                    </div>
                ) : null}
                <div
                    data-disabled={`${props.data.disabled}`}
                    id={props.nodeID + props.data.key}
                    className={isExecution ? styles.executionConnection : styles.connection}
                    draggable={!props.data.disabled}
                    onDragOver={e => {
                        e.preventDefault()
                        if (!props.links.includes(props.data.key))
                            e.currentTarget.style.background = 'var(--fabric-accent-color)'
                    }}
                    style={{background: props.links.includes(props.data.key) && !props.data.disabled ? 'var(--fabric-accent-color' : undefined}}
                    onDrop={e => {
                        onDragContext.setDragType(undefined)
                        if (props.type === 'input')
                            asInput(e)
                        else
                            props.setAlert({
                                type: 'error',
                                message: 'Can\'t link with output.'
                            })

                    }}
                    onDragEnd={props.onDragEnd}
                    onDragLeave={e => {
                        e.preventDefault()
                        if (!props.links.includes(props.data.key))
                            e.currentTarget.style.background = 'var(--fabric-background-primary)'
                    }}
                    onDrag={props.handleLinkDrag}
                    onDragStart={e => {
                        e.dataTransfer
                            .setData(
                                'text',
                                JSON.stringify({
                                    id: props.nodeID,
                                    type: props.type,
                                    attribute: props.data
                                })
                            )

                        if (props.type === 'output')
                            onDragContext.setDragType(props.data.type)
                    }}>
                    {isExecution ?
                        <span className={'material-icons-round'}>navigate_next</span> : null}
                </div>
                {props.type === 'input' && !isExecution ? (
                    <div data-disabled={`${props.data.disabled}`} className={styles.overflow}
                         style={{fontWeight: 'normal'}}>
                        {props.data.label}
                    </div>
                ) : null}
            </div>
        </>
    )
}


NodeIO.propTypes = {
    handleLink: PropTypes.func,
    nodeID: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['input', 'output']),
    setAlert: PropTypes.func.isRequired,
    handleLinkDrag: PropTypes.func.isRequired,
    onDragEnd: PropTypes.func.isRequired,
    data: PropTypes.shape({
        disabled: PropTypes.bool,
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.number,
        accept: PropTypes.arrayOf(PropTypes.number),
        color: PropTypes.string
    }).isRequired,
    links: PropTypes.arrayOf(PropTypes.string).isRequired
}