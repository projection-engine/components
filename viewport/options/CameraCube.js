import styles from "../styles/ViewportOptions.module.css";
import CAMERA_TYPES from "../../../services/engine/editor/camera/CAMERA_TYPES";
import PropTypes from "prop-types";

export default function CameraCube(props){
    const {settingsContext, setCameraIsOrthographic, cameraIsOrthographic, lastCamera, id} = props
    return (
        <div className={styles.cameraView}>
            <div className={styles.cube} id={id + '-camera'}>
                <div
                    className={[styles.face, styles.front].join(' ')}
                    onClick={() => {
                        if (!cameraIsOrthographic) {
                            lastCamera.perspective = settingsContext.cameraType
                            settingsContext.cameraType = CAMERA_TYPES.FRONT
                            setCameraIsOrthographic(true)
                        } else {
                            settingsContext.cameraType = lastCamera.perspective
                            setCameraIsOrthographic(false)
                            lastCamera.ortho = settingsContext.cameraType
                        }
                    }}
                >
                    Front
                </div>
                <div className={[styles.face, styles.back].join(' ')}
                     onClick={() => {
                         if (!cameraIsOrthographic) {
                             lastCamera.perspective = settingsContext.cameraType
                             settingsContext.cameraType = CAMERA_TYPES.BACK
                             setCameraIsOrthographic(true)
                         } else {
                             settingsContext.cameraType = lastCamera.perspective
                             setCameraIsOrthographic(false)
                             lastCamera.ortho = settingsContext.cameraType
                         }
                     }}
                >
                    Back
                </div>
                <div className={[styles.face, styles.right].join(' ')}
                     onClick={() => {
                         if (!cameraIsOrthographic) {
                             lastCamera.perspective = settingsContext.cameraType
                             settingsContext.cameraType = CAMERA_TYPES.RIGHT
                             setCameraIsOrthographic(true)
                         } else {
                             settingsContext.cameraType = lastCamera.perspective
                             setCameraIsOrthographic(false)
                             lastCamera.ortho = settingsContext.cameraType
                         }
                     }}
                >Right
                </div>
                <div className={[styles.face, styles.left].join(' ')}
                     onClick={() => {
                         if (!cameraIsOrthographic) {
                             lastCamera.perspective = settingsContext.cameraType
                             settingsContext.cameraType = CAMERA_TYPES.LEFT
                             setCameraIsOrthographic(true)
                         } else {
                             settingsContext.cameraType = lastCamera.perspective
                             setCameraIsOrthographic(false)
                             lastCamera.ortho = settingsContext.cameraType
                         }
                     }}
                >Left
                </div>
                <div className={[styles.face, styles.top].join(' ')}
                     onClick={() => {
                         if (!cameraIsOrthographic) {
                             lastCamera.perspective = settingsContext.cameraType
                             settingsContext.cameraType = CAMERA_TYPES.TOP
                             setCameraIsOrthographic(true)
                         } else {
                             settingsContext.cameraType = lastCamera.perspective
                             setCameraIsOrthographic(false)
                             lastCamera.ortho = settingsContext.cameraType
                         }
                     }}
                >Top
                </div>
                <div className={[styles.face, styles.bottom].join(' ')}
                     onClick={() => {
                         if (!cameraIsOrthographic) {
                             lastCamera.perspective = settingsContext.cameraType
                             settingsContext.cameraType = CAMERA_TYPES.BOTTOM
                             setCameraIsOrthographic(true)
                         } else {
                             settingsContext.cameraType = lastCamera.perspective
                             setCameraIsOrthographic(false)
                             lastCamera.ortho = settingsContext.cameraType
                         }
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
    cameraIsOrthographic: PropTypes.bool,
    lastCamera: PropTypes.object
}