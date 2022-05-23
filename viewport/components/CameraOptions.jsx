import styles from "../styles/ViewportOptions.module.css";
import PropTypes from "prop-types";
import RENDER_TARGET from "../hooks/RENDER_TARGET";
import {Button, Dropdown, DropdownOption, DropdownOptions, ToolTip} from "@f-ui/core";
import React, {useMemo, useState} from "react";
import EditorCamera from "../../../project/extension/camera/EditorCamera";
import {handleGrab} from "../transformCamera";

export default function CameraOptions(props) {
    const {engine, setCameraIsOrthographic, cameraIsOrthographic} = props
    const cameraIcon = useMemo(() => {
        if (!cameraIsOrthographic)
            return (
                <div
                    style={{width: '20px', height: '20px', perspective: '40px', transformStyle: 'preserve-3d'}}>
                        <span
                            style={{fontSize: '1.1rem', transform: 'rotateX(45deg)'}}
                            className={'material-icons-round'}>grid_on</span>
                </div>
            )
        else
            return <span style={{fontSize: '1rem'}} className={'material-icons-round'}>grid_on</span>
    }, [cameraIsOrthographic])
    const renderer = engine.renderer
    const [cameraLocked, setCameraLocked] = useState(engine?.renderer?.camera?.locked)

    function bind(yaw, pitch) {
        renderer.camera.updateProjection()
        renderer.camera.yaw = yaw
        renderer.camera.pitch = pitch
        renderer.camera.updateViewMatrix()
        setCameraIsOrthographic(true)
    }

    return (
        <>

            <div className={styles.cameraView}>
                <div className={styles.cube} id={RENDER_TARGET + '-camera'}>
                    <div
                        className={[styles.face, styles.front].join(' ')}
                        onClick={() => bind(Math.PI /2, 0)}
                    >
                        Front
                    </div>
                    <div className={[styles.face, styles.back].join(' ')}
                         onClick={() => bind(Math.PI * 1.5, 0)}
                    >
                        Back
                    </div>
                    <div className={[styles.face, styles.right].join(' ')}
                         onClick={() => bind(0,0)}
                    >Right
                    </div>
                    <div
                        className={[styles.face, styles.left].join(' ')}
                        onClick={() => bind(Math.PI , 0)}
                    >Left
                    </div>
                    <div className={[styles.face, styles.top].join(' ')}
                         onClick={() => bind(0, Math.PI /2)}
                    >Top
                    </div>
                    <div className={[styles.face, styles.bottom].join(' ')}
                         onClick={() => bind(0, -Math.PI /2)}
                    >Bottom
                    </div>
                </div>
            </div>
            <div className={styles.buttonGroup} style={{display: 'grid', gap: '2px'}}>
                <Dropdown hideArrow={true}
                    className={styles.groupItemVert}
                    onClick={() => {
                        const engine = props.engine
                        engine.renderer.camera.ortho = !engine.renderer.camera.ortho
                        engine.renderer.camera.updateProjection()

                        setCameraIsOrthographic(!cameraIsOrthographic)
                    }}>
                    <ToolTip styles={{textAlign: 'left', display: 'grid'}}>
                        <div>Camera position</div>
                    </ToolTip>
                    <span style={{fontSize: '1.1rem'}} className={'material-icons-round'}>videocam</span>
                    <DropdownOptions>
                        <DropdownOption
                            option={{
                                label: 'Top',
                                onClick: () => bind(0, Math.PI /2)
                            }}/>
                        <DropdownOption
                            option={{
                                label: 'Bottom',
                                onClick: () => bind(0, -Math.PI /2)
                            }}/>
                        <DropdownOption
                            option={{
                                label: 'Left',
                                onClick: () => bind(Math.PI , 0)
                            }}/>
                        <DropdownOption
                            option={{
                                label: 'Right',
                                onClick: () => bind(0,0)
                            }}/>
                        <DropdownOption
                            option={{
                                label: 'Front',
                                onClick: () =>  bind(Math.PI /2, 0)
                            }}/>
                        <DropdownOption
                            option={{
                                label: 'Back',
                                onClick: () =>  bind(Math.PI * 1.5, 0)
                            }}/>
                    </DropdownOptions>
                </Dropdown>
                <Button
                    className={styles.groupItemVert}
                    onClick={() => {
                        engine.renderer.camera.ortho = !engine.renderer.camera.ortho
                        engine.renderer.camera.updateProjection()

                        setCameraIsOrthographic(!cameraIsOrthographic)
                    }}>
                    <ToolTip styles={{textAlign: 'left', display: 'grid'}}>
                        <div>Switch between last Ortho/Perspective</div>
                    </ToolTip>
                    {cameraIcon}
                </Button>
                <Button
                    className={styles.groupItemVert}
                    variant={cameraLocked ? 'filled' : undefined}
                    onClick={() => {
                        const original = engine.renderer.camera.locked
                        engine.renderer.camera.locked = !original
                        setCameraLocked(!original)
                    }}>
                    <ToolTip styles={{textAlign: 'left', display: 'grid'}}>
                        Lock camera rotation
                    </ToolTip>
                    <span className={'material-icons-round'} style={{fontSize: '1.1rem'}} >{cameraLocked ? 'lock' : 'lock_open'}</span>
                </Button>
                <div className={styles.buttonGroup} style={{
                    display: engine.renderer?.camera instanceof EditorCamera ? 'grid' : 'none',
                    transform: 'translateY(12px)',
                    gap: '2px'
                }}>
                    <div
                        className={[styles.groupItemVert, styles.dragInput].join(' ')}
                        onMouseDown={e => handleGrab(e, engine.renderer.camera, 0)}
                    >
                        <ToolTip styles={{textAlign: 'left', display: 'grid'}}>
                            <div>- Drag X to zoom in/out</div>
                        </ToolTip>
                        <span className={'material-icons-round'}>zoom_in</span>
                    </div>
                    <div
                        className={[styles.groupItemVert, styles.dragInput].join(' ')}
                        onMouseDown={e => handleGrab(e, engine.renderer.camera, 1)}
                        onDoubleClick={() => {
                            engine.renderer.camera.centerOn = [0, 0, 0]
                            engine.renderer.camera.updateViewMatrix()
                        }}>
                        <ToolTip styles={{textAlign: 'left', display: 'grid'}}>
                            <div>- Drag X to move forward/backwards</div>
                            <div>- Drag Y to move up/down</div>
                            <div>- Double click to center</div>
                        </ToolTip>
                        <span className={'material-icons-round'}>back_hand</span>
                    </div>
                </div>
            </div>
        </>
    )

}
CameraOptions.propTypes = {
    settingsContext: PropTypes.object,
    setCameraIsOrthographic: PropTypes.func,
    lastCamera: PropTypes.object,
    cameraIsOrthographic: PropTypes.bool,

}