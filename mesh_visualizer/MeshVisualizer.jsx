import PropTypes from "prop-types";
import styles from './styles/Mesh.module.css'
import useEngine from "../../core/useEngine";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import randomID from "../../utils/misc/randomID";
import Viewport from "../viewport/Viewport";
import Controls from "./components/Controls";

import importMesh from "../../utils/parsers/importMesh";
import Engine from "../../core/Engine";

export default function MeshVisualizer(props) {
    const [id, setId] = useState()
    const [entities, setEntities] = []

    useLayoutEffect(() => {
        setId(randomID())
    }, [])
    const engine = useRef()

    useEffect(() => {
        // if(!engine.current)
        //     engine.current = new Engine(id, document.getElementById(id + '-canvas')., 75)
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