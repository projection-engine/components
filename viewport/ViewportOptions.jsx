import React, {useContext, useEffect, useMemo, useState} from 'react'
import PropTypes from "prop-types";
import styles from "./styles/ViewportOptions.module.css";
import {Button, Dropdown, DropdownOptions, ToolTip} from "@f-ui/core";
import Range from "../range/Range";
import SettingsProvider from "../../pages/project/utils/hooks/SettingsProvider";
import CAMERA_TYPES from "../../engine/editor/camera/CAMERA_TYPES";
import {ENTITY_ACTIONS} from "../../engine/utils/entityReducer";
import SphericalCamera from "../../engine/editor/camera/prespective/SphericalCamera";
import {handleGrab} from "./utils";
import GIZMOS from "../../engine/editor/gizmo/GIZMOS";
import {HISTORY_ACTIONS} from "../../pages/project/utils/hooks/historyReducer";
import Cameras from "./options/Cameras";
import ShadingTypes from "./options/ShadingTypes";
import TransformationTypes from "./options/TransformationTypes";
import AddComponent from "./options/AddComponent";
import VisualSettings from "./options/VisualSettings";
import MoreOptions from "./options/MoreOptions";
import CameraCube from "./options/CameraCube";


export default function ViewportOptions(props) {
    const settingsContext = useContext(SettingsProvider)

    const [gridSize, setGridSize] = useState(settingsContext.gridSize)
    const [fullscreen, setFullscreen] = useState(false)
    const [cameraIsOrthographic, setCameraIsOrthographic] = useState(!(settingsContext.cameraType === CAMERA_TYPES.SPHERICAL || settingsContext.cameraType === CAMERA_TYPES.FREE))
    const [lastCamera, setLastCamera] = useState({
        ortho: CAMERA_TYPES.FRONT,
        perspective: CAMERA_TYPES.SPHERICAL
    })
    const handleFullscreen = () => {
        if (!document.fullscreenElement)
            setFullscreen(false)
        else
            setFullscreen(true)
    }
    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullscreen)
        return () => document.removeEventListener('fullscreenchange', handleFullscreen)
    }, [fullscreen])

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

    const dispatchEntity = (entity) => {
        props.engine.dispatchChanges({
            type: HISTORY_ACTIONS.PUSHING_DATA,
            payload: [entity]
        })
        props.engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: entity})
    }

    return (
        <>
            {props.minimal ? null :
                <div className={styles.options} style={{display: fullscreen ? 'none' : undefined}} draggable={false}>
                    <div style={{justifyContent: 'flex-start'}} className={styles.align}>
                        <MoreOptions settingsContext={settingsContext} fullscreen={fullscreen}
                                     setFullscreen={setFullscreen} fullscreenID={props.fullscreenID}/>
                        <VisualSettings settingsContext={settingsContext}/>
                        <AddComponent dispatchEntity={dispatchEntity} engine={props.engine}/>
                    </div>
                    <TransformationTypes settingsContext={settingsContext}/>
                    <ShadingTypes settingsContext={settingsContext}/>
                </div>}
            <div className={styles.floating}
                 style={{left: '4px', right: 'unset', top: 'calc(50% - 35px)', transform: 'translateY(-50%)'}}>
                <div className={styles.buttonGroup} style={{display: 'grid'}}>
                    <Button
                        className={styles.transformationWrapper}
                        variant={settingsContext.gizmo === GIZMOS.TRANSLATION ? 'filled' : undefined}
                        styles={{borderRadius: '5px 5px 0  0'}}
                        highlight={settingsContext.gizmo === GIZMOS.TRANSLATION}
                        onClick={() => {
                            settingsContext.gizmo = GIZMOS.TRANSLATION
                        }}>
                        <span className={'material-icons-round'}>open_with</span>
                    </Button>
                    <Button
                        className={styles.transformationWrapper}
                        variant={settingsContext.gizmo === GIZMOS.ROTATION ? 'filled' : undefined}
                        highlight={settingsContext.gizmo === GIZMOS.ROTATION}
                        onClick={() => {
                            settingsContext.gizmo = GIZMOS.ROTATION
                        }}>
                        <span className={'material-icons-round'}>cached</span>
                    </Button>
                    <Button
                        className={styles.transformationWrapper}
                        variant={settingsContext.gizmo === GIZMOS.SCALE ? 'filled' : undefined}
                        styles={{borderRadius: '0 0 5px 5px'}}
                        highlight={settingsContext.gizmo === GIZMOS.SCALE}
                        onClick={() => {
                            settingsContext.gizmo = GIZMOS.SCALE
                        }}>
                        <span className={'material-icons-round'}>transform</span>
                    </Button>
                </div>
            </div>
            <div className={styles.floating} style={{top: props.minimal ? '4px' : undefined}}>
                {props.minimal ? null : <CameraCube id={props.id} setCameraIsOrthographic={setCameraIsOrthographic}
                                                    settingsContext={settingsContext}
                                                    cameraIsOrthographic={cameraIsOrthographic}
                                                    lastCamera={lastCamera}/>}
                <div className={styles.buttonGroup} style={{display: 'grid', gap: '2px'}}>
                    {props.minimal ? null :
                        (
                            <>
                                <Cameras lastCamera={lastCamera} cameraIsOrthographic={cameraIsOrthographic}
                                         setCameraIsOrthographic={setCameraIsOrthographic} setLastCamera={setLastCamera}
                                         settingsContext={settingsContext}/>
                                <Button
                                    className={styles.groupItemVert}
                                    onClick={() => {
                                        if (cameraIsOrthographic)
                                            settingsContext.cameraType = lastCamera.perspective
                                        else
                                            settingsContext.cameraType = lastCamera.ortho

                                        setCameraIsOrthographic(!cameraIsOrthographic)
                                    }}>
                                    <ToolTip styles={{textAlign: 'left', display: 'grid'}}>
                                        <div>- Switch between last Ortho/Perspective</div>
                                    </ToolTip>
                                    {cameraIcon}
                                </Button>

                                <Dropdown

                                    className={styles.groupItemVert}
                                    hideArrow={true}>
                                    <ToolTip styles={{textAlign: 'left', display: 'grid'}}>
                                        <div>- Grid size</div>
                                    </ToolTip>
                                    <span className={'material-icons-round'}
                                          style={{fontSize: '1rem'}}>grid_4x4</span>
                                    <DropdownOptions>
                                        <div className={styles.rangeWrapper} style={{display: 'grid'}}>
                                            <div className={styles.rangeLabel}>
                                                Grid size
                                            </div>
                                            <Range
                                                onFinish={v => {
                                                    setGridSize(v)
                                                    settingsContext.gridSize = v
                                                }} accentColor={'red'}
                                                handleChange={(v) => setGridSize(v)}
                                                value={gridSize}
                                                precision={2}
                                            />
                                        </div>
                                    </DropdownOptions>
                                </Dropdown>
                            </>
                        )}
                    <div className={styles.buttonGroup} style={{
                        display: props.engine.renderer?.camera instanceof SphericalCamera ? 'grid' : 'none',
                        transform: 'translateY(12px)',
                        gap: '2px'
                    }}>
                        <div
                            className={[styles.groupItemVert, styles.dragInput].join(' ')}
                            onMouseDown={e => handleGrab(e, props.engine.renderer, 0)}
                        >
                            <ToolTip styles={{textAlign: 'left', display: 'grid'}}>
                                <div>- Drag Y to zoom in/out</div>
                            </ToolTip>
                            <span className={'material-icons-round'}>zoom_in</span>
                        </div>
                        <div
                            className={[styles.groupItemVert, styles.dragInput].join(' ')}
                            onMouseDown={e => handleGrab(e, props.engine.renderer, 1)}
                            onDoubleClick={() => {
                                props.engine.renderer.camera.centerOn = [0, 0, 0]
                                props.engine.renderer.camera.updateViewMatrix()
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
            </div>

        </>
    )

}
ViewportOptions.propTypes = {
    minimal: PropTypes.bool,
    fullscreenID: PropTypes.string,
    engine: PropTypes.object,
    id: PropTypes.string
}