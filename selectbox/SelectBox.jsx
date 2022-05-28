import PropTypes from "prop-types";
import {useEffect, useMemo, useRef} from "react";
import styles from './styles/SelectBox.module.css'

export default function SelectBox(props) {
    const ref = useRef()
    let initiated = false,
        startingPosition = {x: 0, y: 0}

    const ids = useMemo(() => {
        return props.nodes.map(n => n.id)
    }, [props.nodes])

    const handleMouseMove = (event) => {
        if (ref.current?.parentNode) {
            const bBox = ref.current.parentNode.getBoundingClientRect()
            const offset = {
                x: bBox.left - ref.current.parentNode.scrollLeft,
                y: bBox.top - ref.current.parentNode.scrollTop
            }

            let translation = {x: 0, y: 0}
            if (!initiated) {
                ref.current.style.top = (startingPosition.y - offset.y) + 'px'
                ref.current.style.left = (startingPosition.x - offset.x) + 'px'
                ref.current.style.zIndex = 999

                initiated = true
            }

            ref.current.style.left = (event.clientX - offset.x) + 'px'
            ref.current.style.top = (event.clientY - offset.y) + 'px'

            if (startingPosition.x - event.clientX < 0) {
                ref.current.style.width = (event.clientX - startingPosition.x) + 'px'
                translation.x = (startingPosition.x - event.clientX)
            } else {
                ref.current.style.width = (startingPosition.x - event.clientX) + 'px'
                translation.x = 0
            }
            if (startingPosition.y - event.clientY < 0) {
                ref.current.style.height = (event.clientY - startingPosition.y) + 'px'
                translation.y = (startingPosition.y - event.clientY)
            } else {
                ref.current.style.height = (startingPosition.y - event.clientY) + 'px'
                translation.y = 0
            }

            ref.current.style.transform = `translate(${translation.x + 'px'}, ${translation.y + 'px'})`
        }

    }
    const handleMouseDown = (event) => {
        const ctrl = event.ctrlKey
        if (event.button === 0 && !document.elementsFromPoint(event.clientX, event.clientY).find(n => (ids.indexOf(n.id) > -1) || n.tagName === 'INPUT'||n.tagName === 'BUTTON')) {
            if(!ctrl)
                props.setSelected([])
            startingPosition = {x: event.clientX, y: event.clientY}
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', ev => {
                initiated = false
                startingPosition = {x: 0, y: 0}
                if(ref.current) {
                    const bBox = ref.current?.getBoundingClientRect()
                    let currentBox = {
                        x1: bBox.x,
                        y1: bBox.y,
                        x2: bBox.x + bBox.width,
                        y2: bBox.y + bBox.height
                    }
                    let toSelect = []
                    for (const index in props.nodes) {
                        const node = props.nodes[index]

                        const elBox = document.getElementById(node.id)?.getBoundingClientRect()
                        // TOP LEFT

                        if (elBox && elBox.x > currentBox.x1 && elBox.y > currentBox.y1 && elBox.x < currentBox.x2 && elBox.y < currentBox.y2) {
                            toSelect.push(node.id)
                        }
                    }
                    if(!ctrl)
                        props.setSelected(toSelect)
                    else
                        props.setSelected([...props.selected, ...toSelect])
                    ref.current.style.height = '0px'
                    ref.current.style.width = '0px'
                    ref.current.style.zIndex = -1
                }

                document.removeEventListener('mousemove', handleMouseMove)
            }, {once: true})
        }
    }

    useEffect(() => {
        ref.current?.parentNode.addEventListener('mousedown', handleMouseDown)
        return () => {
            ref.current?.parentNode.removeEventListener('mousedown', handleMouseDown)
        }
    }, [props.nodes, ids, props.selected])


    return (
        <div style={{zIndex: -1}} ref={ref} className={styles.box}/>
    )
}
SelectBox.propTypes = {
    setSelected: PropTypes.func.isRequired,
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    nodes: PropTypes.arrayOf(PropTypes.shape({id: PropTypes.any})).isRequired
}