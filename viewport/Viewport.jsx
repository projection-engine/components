import PropTypes from "prop-types";

import styles from './styles/Viewport.module.css'
import useDimensions from "./hooks/useDimensions";
import {useMemo, useRef} from "react";

export default function Viewport(props) {
    const ref = useRef()
    useDimensions(
        props.id,
        props.engine
    )
    const {width, height} = useMemo(() => {
        if (props.resolutionMultiplier !== undefined)
            return {
                height: window.screen.height * props.resolutionMultiplier,
                width: window.screen.width * props.resolutionMultiplier
            }
        else
            return {
                height: window.screen.height,
                width: window.screen.width
            }
    }, [props.resolutionMultiplier])
    return (
        <div
            ref={ref}
            className={styles.viewport}
            onDragOver={e => {
                if (props.allowDrop) {
                    e.preventDefault()
                    ref.current?.classList.add(styles.hovered)
                }
            }}
            onDragLeave={e => {
                e.preventDefault()
                ref.current?.classList.remove(styles.hovered)
            }}
            onDrop={e => {

                if (props.allowDrop) {
                    e.preventDefault()
                    ref.current?.classList.remove(styles.hovered)
                    props.handleDrop(e)
                }
            }}>
            <canvas
                width={width}
                height={height}
                style={{background: 'transparent'}}
                onContextMenu={e => e.preventDefault()}
                id={props.id + '-canvas'}
            />
            <div style={{display: props.showPosition ? undefined : 'none'}} className={styles.position}
                 id={props.id + '-camera-position'}/>
        </div>
    )
}

Viewport.propTypes = {
    allowDrop: PropTypes.bool.isRequired,
    handleDrop: PropTypes.func,
    engine: PropTypes.object,
    showPosition: PropTypes.bool,
    id: PropTypes.string,
    resolutionMultiplier: PropTypes.number
}