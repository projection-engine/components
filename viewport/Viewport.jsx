import PropTypes from "prop-types";
import styles from './styles/Viewport.module.css'
import {useContext, useEffect, useRef, useState} from "react";
import GPUContextProvider from "./hooks/GPUContextProvider";
import RENDER_TARGET from "./hooks/RENDER_TARGET";

export default function Viewport(props) {
    const ref = useRef()
    const {bindGPU} = useContext(GPUContextProvider)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if(visible)
            bindGPU(ref.current)
    }, [visible])
    useEffect(() => {
        const obs = new IntersectionObserver((e) => setVisible(e[0]?.isIntersecting))
        obs.observe(ref.current)
        return () => obs.disconnect()
    }, [])
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
            <div style={{display: props.showPosition ? undefined : 'none'}} className={styles.position}
                 id={RENDER_TARGET + '-camera-position'}/>
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