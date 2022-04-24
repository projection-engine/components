import PropTypes from "prop-types";

import styles from './styles/Viewport.module.css'
import useDimensions from "./hooks/useDimensions";
import {useCallback, useMemo, useRef} from "react";
import DragDrop from "../dragdrop/DragDrop";

export default function Viewport(props) {
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
        <DragDrop
            className={styles.viewport}
            dragIdentifier={'file-item-mesh'}
            onDrop={e => {
                if (props.allowDrop)
                    props.handleDrop([e?.registryID])
            }}
            disabled={true}
            dragData={null}
        >
            <canvas
                width={width}
                height={height}
                style={{background: 'transparent'}}
                onContextMenu={e => e.preventDefault()}
                id={props.id + '-canvas'}
            />
            <div style={{display: props.showPosition ? undefined : 'none'}} className={styles.position}
                 id={props.id + '-camera-position'}/>
        </DragDrop>
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