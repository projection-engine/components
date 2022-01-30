import React, {useEffect, useMemo, useRef, useState} from "react";
import styles from "./styles/ImageSelector.module.css";
import {Button} from "@f-ui/core";
import ImageVisualizer from "../image_preview/ImageVisualizer";
import PropTypes from "prop-types";

export default function ImageSelector(props) {
    const ref = useRef()

    const [state, setState] = useState({})
    const [open, setOpen] = useState(false)
    const content = useMemo(() => {
        return props.availableTextures.map((t, i) => (
            <React.Fragment key={'texture-' + t.name + '-' + i}>
                <Button
                    className={styles.button}
                    variant={state.id === t.id ? 'minimal-horizontal' : undefined}
                    highlight={state.id === t.id}
                    onClick={() => {
                        setState(t)
                        props.handleChange(t)
                    }}
                >
                    <ImageVisualizer  data={{
                        ...t,
                        blob: t.previewImage ? t.previewImage : t.blob
                    }}
                    />
                </Button>
            </React.Fragment>
        ))
    }, [props.availableTextures, state])

    useEffect(() => {
        setState((typeof props.classObject === 'object' && Object.keys(props.classObject).length > 0) ? props.classObject : {
            name: 'Empty texture'
        })
    }, [props.classObject])
    const handleMouseDown = (e) => {
        const elements = document.elementsFromPoint(e.clientX, e.clientY)
        if (!elements.includes(ref.current))
            setOpen(false)
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleMouseDown)
        return () => document.removeEventListener('mousedown', handleMouseDown)
    }, [])

    return (
        <div className={styles.wrapper}>

            <Button
                className={styles.button}

                highlight={open}
                onClick={() => setOpen(true)}>
                <ImageVisualizer data={{
                    ...state,
                    blob: state.previewImage ? state.previewImage : state.blob
                }}/>
            </Button>
            <div style={{zIndex: open ? '999' : '-1'}} className={styles.modal} ref={ref}>
                {content}
            </div>
        </div>
    )
}

ImageSelector.propTypes = {
    availableTextures: PropTypes.array.isRequired,
    handleChange: PropTypes.func,
    classObject: PropTypes.object
}