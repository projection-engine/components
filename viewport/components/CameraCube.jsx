import styles from "../styles/ViewportOptions.module.css";
import CAMERA_TYPES from "../../../project/extension/camera/CAMERA_TYPES";
import PropTypes from "prop-types";
import RENDER_TARGET from "../hooks/RENDER_TARGET";

export default function CameraCube(props){
    const { engine, setCameraIsOrthographic} = props

    const renderer = engine.renderer
    return (
        <div className={styles.cameraView}>
            <div className={styles.cube} id={RENDER_TARGET+'-camera'}>
                <div
                    className={[styles.face, styles.front].join(' ')}
                    onClick={() => {
                        renderer.camera.ortho = true
                        renderer.camera.updateProjection()

                        renderer.camera.yaw = 1.57
                        renderer.camera.pitch = 0

                        renderer.camera.updateViewMatrix()
                        setCameraIsOrthographic(true)
                    }}
                >
                    Front
                </div>
                <div className={[styles.face, styles.back].join(' ')}
                     onClick={() => {
                         renderer.camera.ortho = true
                         renderer.camera.updateProjection()

                         renderer.camera.yaw = 3.1415 + 1.57
                         renderer.camera.pitch = 0

                         renderer.camera.updateViewMatrix()
                         setCameraIsOrthographic(true)
                     }}
                >
                    Back
                </div>
                <div className={[styles.face, styles.right].join(' ')}
                     onClick={() => {
                         renderer.camera.ortho = true
                         renderer.camera.updateProjection()

                         renderer.camera.yaw = 0
                         renderer.camera.pitch =0

                         renderer.camera.updateViewMatrix()
                         setCameraIsOrthographic(true)
                     }}
                >Right
                </div>
                <div className={[styles.face, styles.left].join(' ')}
                     onClick={() => {
                         renderer.camera.ortho = true
                         renderer.camera.updateProjection()

                         renderer.camera.yaw = 3.1415
                         renderer.camera.pitch = 0

                         renderer.camera.updateViewMatrix()
                         setCameraIsOrthographic(true)
                     }}
                >Left
                </div>
                <div className={[styles.face, styles.top].join(' ')}
                     onClick={() => {
                         renderer.camera.ortho = true
                         renderer.camera.updateProjection()

                         renderer.camera.yaw = 0
                         renderer.camera.pitch = 1.57

                         renderer.camera.updateViewMatrix()
                         setCameraIsOrthographic(true)
                     }}
                >Top
                </div>
                <div className={[styles.face, styles.bottom].join(' ')}
                     onClick={() => {
                         renderer.camera.ortho = true
                         renderer.camera.updateProjection()
                         renderer.camera.yaw = 0
                         renderer.camera.pitch = -1.57
                         renderer.camera.updateViewMatrix()
                         setCameraIsOrthographic(true)
                     }}
                >Bottom
                </div>
            </div>
        </div>
    )

}
CameraCube.propTypes={
    settingsContext: PropTypes.object,
    setCameraIsOrthographic: PropTypes.func,
    lastCamera: PropTypes.object
}