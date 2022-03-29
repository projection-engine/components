import {useEffect, useMemo, useRef, useState} from "react";
import getBezierCurve from "../utils/bezierCurve";

export default function useGroup(props, selected) {
    const ref = useRef()
    const pathRef = useRef()

    let lastPlacement = {
        x: 0,
        y: 0
    }
    const handleDragStart = (event) => {
        let isFirst, alreadyFound = false
        document.elementsFromPoint(event.clientX, event.clientY)
            .forEach(e => {
                if (e.id?.includes('-node') && !alreadyFound && e.id === (props.group.id + '-node'))
                    isFirst = true
                else if (e.id?.includes('-node') && !alreadyFound)
                    alreadyFound = true
            })
        if(event.button === 0 && isFirst)
            props.setSelected(props.group.id, false)
        if (event.button === 0 && ((selected && event.ctrlKey) || isFirst)) {
            const t = ref.current.firstChild

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



    return {
        selected,
        ref,
        pathRef,
        handleDragStart
    }
}