import React, {useContext, useEffect, useRef} from "react";

import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

import {ThemeContext} from "@f-ui/core";
import DragDropProvider from "./hooks/DragDropProvider";
import useDragDrop from "./hooks/useDragDrop";

export default function DragDrop(props) {
    const {ref, hover} = useDragDrop(props)
    const handler = (e) => props.onDrop(e.detail)
    useEffect(() => {
        ref.current?.addEventListener('trigger-dragdrop', handler)
        if (!props.disabled)
            ref.current?.addEventListener('mousedown', hover)
        return () => {
            ref.current?.removeEventListener('trigger-dragdrop', handler)
            ref.current?.removeEventListener('mousedown', hover)
        }
    }, [props])

    return (
        <div
            ref={ref}
            data-dragdata={props.dragIdentifier} className={props.className} style={props.styles}>
            {props.children}
        </div>
    )

}

DragDrop.propTypes = {
    disabled: PropTypes.bool,
    dragImage: PropTypes.node,
    dragIdentifier: PropTypes.string.isRequired,
    onDrop: PropTypes.func.isRequired,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDragStart: PropTypes.func,
    dragData: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,

    className: PropTypes.string,
    styles: PropTypes.object,
    children: PropTypes.node
}