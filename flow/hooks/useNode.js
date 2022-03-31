import {useEffect, useMemo, useRef, useState} from "react";
import getBezierCurve from "../utils/bezierCurve";

export default function useNode(props, selected, hidden) {
    const ref = useRef()
    const pathRef = useRef()

    const [height, setHeight] = useState()
    useEffect(() => {
        const h = ref.current.firstChild.scrollHeight
        setHeight(h >= 35 ? h : 55)
    }, [ hidden])

    const handleLinkDrag = (event) => {
        const parent = ref.current?.parentNode.parentNode
        const bBox = event.currentTarget.getBoundingClientRect()
        let parentBBox = parent.getBoundingClientRect()
        const bounding = {
            x: parent.scrollLeft - parentBBox.left,
            y: parent.scrollTop - parentBBox.top
        }

        const curve = getBezierCurve(
            {
                x: (bBox.x + bounding.x + 7.5) / props.scale,
                y: (bBox.y + bounding.y + 7.5) / props.scale
            },
            {
                x1: (event.clientX + bounding.x + 7.5) / props.scale,
                y1: (event.clientY + bounding.y + 7.5) / props.scale
            })

        pathRef.current?.setAttribute('d', curve)
    }


    let lastPlacement = {
        x: 0,
        y: 0
    }
    const handleDragStart = (event) => {
        let isFirst, alreadyFound = false
        document.elementsFromPoint(event.clientX, event.clientY)
            .forEach(e => {
                if (e.id?.includes('-node') && !alreadyFound && e.id === (props.node.id + '-node'))
                    isFirst = true
                else if (e.id?.includes('-node') && !alreadyFound)
                    alreadyFound = true
            })
        if(event.button === 0 && isFirst)
            props.setSelected(props.node.id, false)
        if (event.button === 0 && ((selected && event.ctrlKey) || isFirst)) {
            const parent = ref.current?.parentNode.parentNode
            let parentBBox = parent.getBoundingClientRect()
            let bounding = {
                x: parent.scrollLeft - parentBBox.left,
                y: parent.scrollTop - parentBBox.top
            }
            lastPlacement = {
                x: event.clientX + bounding.x,
                y: event.clientY + bounding.y
            }
            let nodeBbox = ref.current?.getBoundingClientRect()
            let current = {
                x: (nodeBbox.left + bounding.x) / props.scale,
                y: (nodeBbox.top + bounding.y) / props.scale
            }
            const handleMouseMove = (ev) => {
                parentBBox = parent.getBoundingClientRect()
                bounding = {
                    x: parent.scrollLeft - parentBBox.left,
                    y: parent.scrollTop - parentBBox.top
                }
                const mousePlacement = {
                    x: ev.clientX + bounding.x,
                    y: ev.clientY + bounding.y
                }
                const toBeApplied = {
                    x: lastPlacement.x - mousePlacement.x,
                    y: lastPlacement.y - mousePlacement.y
                }

                lastPlacement = mousePlacement
                nodeBbox = ref.current?.getBoundingClientRect()
                if (nodeBbox) {
                    current = {
                        x: ((nodeBbox.left + bounding.x) - toBeApplied.x) / props.scale,
                        y: ((nodeBbox.top + bounding.y) - toBeApplied.y) / props.scale
                    }

                    ref.current?.setAttribute('transform', `translate(${current.x} ${current.y})`)
                }
            }

            const handleMouseUp = () => {

                const bBox = ref.current.getBoundingClientRect()
                let fixedPlacement = current
                if (bBox.top - parentBBox.top < 0)
                    fixedPlacement.y = 0
                if (bBox.left - parentBBox.left < 0)
                    fixedPlacement.x = 0

                if (bBox.top - parentBBox.top > parentBBox.height)
                    fixedPlacement.y = parentBBox.height - bBox.height
                if (bBox.left - parentBBox.left > parentBBox.width)
                    fixedPlacement.x = parentBBox.width - bBox.width

                ref.current?.setAttribute('transform', `translate(${fixedPlacement.x} ${fixedPlacement.y})`)

                document.removeEventListener('mousemove', handleMouseMove)
            }
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp, {once: true})
        }

    }

    const outputLinks = useMemo(() => {
        return props.links.filter(l => {
            return l.source.includes(props.node.id)
        })
    }, [props.links])

    const inputLinks = useMemo(() => {

        return props.links.filter(l => {
            return l.target.includes(props.node.id)
        })
    }, [props.links])

    return {
        outputLinks,
        inputLinks,

        ref,
        handleDragStart,
        handleLinkDrag,
        height,
        pathRef
    }
}