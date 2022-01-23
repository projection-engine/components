import PropTypes from "prop-types";
import styles from './styles/Mesh.module.css'
import useEngine from "../../core/useEngine";
import {useEffect, useLayoutEffect, useState} from "react";
import randomID from "../../utils/randomID";
import Viewport from "../viewport/Viewport";
import Controls from "./components/Controls";

import importMesh from "../../utils/importMesh";

export default function MeshVisualizer(props) {
    const [id, setId] = useState()

    useLayoutEffect(() => {
        setId(randomID())
    }, [])
    const engine = useEngine(id, 'free', true, true)

    useEffect(() => {
        if (engine.gpu)
            importMesh(props.file.blob, props.file.type, engine, props.setAlert)
    }, [engine.gpu])

    return (
        <div className={styles.wrapper}>
            <Viewport allowDrop={false} id={id} engine={engine}/>
            <Controls/>
        </div>
    )
}
MeshVisualizer.propTypes = {
    file: PropTypes.shape({
        fileID: PropTypes.string,
        name: PropTypes.string,
        blob: PropTypes.any,
        type: PropTypes.string,
    }),
    setAlert: PropTypes.func
}