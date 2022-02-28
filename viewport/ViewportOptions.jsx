import PropTypes from "prop-types";
import styles from "./styles/ViewportOptions.module.css";
import {Button, Dropdown, DropdownOption, DropdownOptions, ToolTip} from "@f-ui/core";
import Range from "../range/Range";
import {useContext, useEffect, useMemo, useState} from "react";
import SettingsProvider from "../../services/hooks/SettingsProvider";
import {SHADING_MODELS} from "../../pages/project/hook/useSettings";
import CAMERA_TYPES from "../../services/engine/utils/camera/CAMERA_TYPES";
import {ENTITY_ACTIONS} from "../../services/utils/entityReducer";
import MeshInstance from "../../services/engine/elements/instances/MeshInstance";
import Entity from "../../services/engine/ecs/basic/Entity";
import TransformComponent from "../../services/engine/ecs/components/TransformComponent";
import MeshComponent from "../../services/engine/ecs/components/MeshComponent";
import PickComponent from "../../services/engine/ecs/components/PickComponent";
import importMesh from "./utils";
import PointLightComponent from "../../services/engine/ecs/components/PointLightComponent";
import DirectionalLightComponent from "../../services/engine/ecs/components/DirectionalLightComponent";
import SkyboxComponent from "../../services/engine/ecs/components/SkyboxComponent";
import CubeMapComponent from "../../services/engine/ecs/components/CubeMapComponent";
import TerrainComponent from "../../services/engine/ecs/components/TerrainComponent";


export default function ViewportOptions(props) {
    const settingsContext = useContext(SettingsProvider)
    const [res, setRes] = useState(settingsContext.resolutionMultiplier * 100)
    const [fov, setFov] = useState(settingsContext.fov * 180 / 3.1415)
    const [fullscreen, setFullscreen] = useState(false)

    const handleFullscreen = () => {
        if (!document.fullscreenElement)
            setFullscreen(false)
        else
            setFullscreen(true)
    }
    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullscreen)
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreen)
        }
    }, [fullscreen])

    const cameraIcon = useMemo(() => {
        switch (settingsContext.cameraType) {
            case CAMERA_TYPES.SPHERICAL:
            case CAMERA_TYPES.FREE:
                return (
                    <>

                        <div
                            style={{width: '20px', height: '20px', perspective: '40px', transformStyle: 'preserve-3d'}}>
                        <span
                            style={{fontSize: '1.2rem', transform: 'rotateX(45deg)'}}
                            className={'material-icons-round'}>grid_on</span>
                        </div>
                        <div className={styles.overflow} style={{textTransform: 'capitalize'}}>
                            {settingsContext.cameraType === CAMERA_TYPES.SPHERICAL ? 'Spherical' : 'Free camera'}
                        </div>
                    </>

                )
            default:
                return (
                    <>
                        <span
                            style={{fontSize: '1rem'}}
                            className={'material-icons-round'}>grid_on
                        </span>
                        <div className={styles.overflow} style={{textTransform: 'capitalize'}}>
                            {settingsContext.cameraType.replace('ortho-', '')}
                        </div>
                    </>
                )
        }
    }, [settingsContext.cameraType])

    return (
        <div className={styles.options} style={{display: fullscreen ? 'none' : undefined}} draggable={false}>

            <div className={styles.alignStart}>
                <Dropdown
                    className={styles.optionWrapper} variant={'outlined'}
                    justify={'start'} align={'bottom'}>
                    <span style={{fontSize: '1.1rem'}} className={'material-icons-round'}>more_vert</span>
                    <DropdownOptions>
                        <DropdownOption option={{
                            label: 'Show FPS',
                            icon: settingsContext.performanceMetrics ? <span style={{fontSize: '1.2rem'}}
                                                                             className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.performanceMetrics = !settingsContext.performanceMetrics,
                            shortcut: 'ctrl + shift + h'
                        }}/>

                        <div className={styles.divider}/>

                        <div className={styles.rangeWrapper}>
                            <div className={styles.rangeLabel}>
                                Fov
                            </div>
                            <Range
                                value={fov} maxValue={120} minValue={45}
                                onFinish={() => {
                                    settingsContext.fov = fov * 3.14 / 180
                                }}
                                handleChange={e => {
                                    setFov(e)
                                }}
                            />
                        </div>
                        <div className={styles.rangeWrapper}>
                            <div className={styles.rangeLabel}>
                                Resolution
                            </div>
                            <Range
                                value={res} maxValue={200} minValue={10}
                                onFinish={() => {
                                    settingsContext.resolutionMultiplier = res / 100
                                }}
                                handleChange={e => {
                                    setRes(e)
                                }}
                            />
                        </div>

                    </DropdownOptions>
                </Dropdown>
                <Button className={styles.optionWrapper} onClick={() => {
                    const el = document.getElementById(props.fullscreenID)
                    if (el) {
                        if (!fullscreen) {
                            el.requestFullscreen()
                                .then(r => {
                                    setFullscreen(true)
                                })
                        } else {
                            document.exitFullscreen()
                                .then(() => setFullscreen(false))

                        }
                    }
                }}>
                <span style={{fontSize: '1.1rem'}}
                      className={'material-icons-round'}>fullscreen</span>
                </Button>
                <Dropdown
                    className={styles.optionWrapper}


                    justify={'start'} align={'bottom'}>
                    <div className={styles.summary}>
                        {cameraIcon}
                    </div>
                    <DropdownOptions>

                        <div className={styles.dividerWrapper}>
                            Perspective
                            <div className={styles.divider}/>
                        </div>
                        <DropdownOption
                            option={{
                                label: 'Free',
                                icon: settingsContext.cameraType === CAMERA_TYPES.FREE ?
                                    <span style={{fontSize: '1.2rem'}}
                                          className={'material-icons-round'}>check</span> : undefined,
                                onClick: () => settingsContext.cameraType = CAMERA_TYPES.FREE,
                                disabled: settingsContext.cameraType === CAMERA_TYPES.FREE
                            }}/>

                        <DropdownOption option={{
                            label: 'Spherical',
                            icon: settingsContext.cameraType === CAMERA_TYPES.SPHERICAL ?
                                <span style={{fontSize: '1.2rem'}}
                                      className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.cameraType = CAMERA_TYPES.SPHERICAL,
                            disabled: settingsContext.cameraType === CAMERA_TYPES.SPHERICAL
                        }}/>

                        <div className={styles.dividerWrapper}>
                            Orthographic
                            <div className={styles.divider}/>
                        </div>
                        <DropdownOption option={{
                            label: 'Top',
                            icon: settingsContext.cameraType === CAMERA_TYPES.TOP ? <span style={{fontSize: '1.2rem'}}
                                                                                          className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.cameraType = CAMERA_TYPES.TOP,
                            disabled: settingsContext.cameraType === CAMERA_TYPES.TOP
                        }}/>
                        <DropdownOption option={{
                            label: 'Bottom',
                            icon: settingsContext.cameraType === CAMERA_TYPES.BOTTOM ?
                                <span style={{fontSize: '1.2rem'}}
                                      className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.cameraType = CAMERA_TYPES.BOTTOM,
                            disabled: settingsContext.cameraType === CAMERA_TYPES.BOTTOM
                        }}/>
                        <DropdownOption option={{
                            label: 'Left',
                            icon: settingsContext.cameraType === CAMERA_TYPES.LEFT ? <span style={{fontSize: '1.2rem'}}
                                                                                           className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.cameraType = CAMERA_TYPES.LEFT,
                            disabled: settingsContext.cameraType === CAMERA_TYPES.LEFT
                        }}/>
                        <DropdownOption option={{
                            label: 'Right',
                            icon: settingsContext.cameraType === CAMERA_TYPES.RIGHT ? <span style={{fontSize: '1.2rem'}}
                                                                                            className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.cameraType = CAMERA_TYPES.RIGHT,
                            disabled: settingsContext.cameraType === CAMERA_TYPES.RIGHT
                        }}/>

                        <DropdownOption option={{
                            label: 'Front',
                            icon: settingsContext.cameraType === CAMERA_TYPES.FRONT ? <span style={{fontSize: '1.2rem'}}
                                                                                            className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.cameraType = CAMERA_TYPES.FRONT,
                            disabled: settingsContext.cameraType === CAMERA_TYPES.FRONT
                        }}/>
                        <DropdownOption option={{
                            label: 'Back',
                            icon: settingsContext.cameraType === CAMERA_TYPES.BACK ? <span style={{fontSize: '1.2rem'}}
                                                                                           className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.cameraType = CAMERA_TYPES.BACK,
                            disabled: settingsContext.cameraType === CAMERA_TYPES.BACK
                        }}/>
                    </DropdownOptions>
                </Dropdown>

                <Dropdown
                    className={styles.optionWrapper}
                    justify={'start'} align={'bottom'}>
                    <div className={styles.summary}>
                          <span style={{fontSize: '1.1rem'}}
                                className={'material-icons-round'}>visibility</span>
                        <div className={styles.overflow}>
                            View
                        </div>
                    </div>
                    <DropdownOptions>
                        <DropdownOption option={{
                            label: 'Anti-aliasing',
                            keepAlive: true,
                            icon: settingsContext.fxaa ? <span style={{fontSize: '1.2rem'}}
                                                               className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.fxaa = !settingsContext.fxaa,
                        }}/>
                        <DropdownOption option={{
                            label: 'Grid',
                            keepAlive: true,
                            icon: settingsContext.gridVisibility ? <span style={{fontSize: '1.2rem'}}
                                                                         className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.gridVisibility = !settingsContext.gridVisibility,
                        }}/>
                        <DropdownOption option={{
                            label: 'Icons',
                            keepAlive: true,
                            icon: settingsContext.iconsVisibility ? <span style={{fontSize: '1.2rem'}}
                                                                          className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.iconsVisibility = !settingsContext.iconsVisibility
                        }}/>
                    </DropdownOptions>
                </Dropdown>
                <Dropdown
                    className={styles.optionWrapper}
                    justify={'start'} align={'bottom'}>
                    Add

                    <DropdownOptions>
                        <div className={styles.dividerWrapper}>
                            Meshes
                            <div className={styles.divider}/>
                        </div>
                        <DropdownOption option={{
                            label: 'Cube',
                            onClick: () => importMesh(0, props.engine)
                        }}/>
                        <DropdownOption option={{
                            label: 'Sphere',

                            onClick: () => importMesh(1, props.engine)
                        }}/>
                        <DropdownOption option={{
                            label: 'Plane',
                            onClick: () => importMesh(2, props.engine)
                        }}/>

                        <div className={styles.dividerWrapper}>
                            Misc
                            <div className={styles.divider}/>
                        </div>
                        <DropdownOption option={{

                            label: 'Point light',
                            icon: <span className={'material-icons-round'}
                                        style={{fontSize: '1.2rem'}}>lightbulb</span>,
                            onClick: () => {
                                const actor = new Entity(undefined, 'Point light')
                                actor.components.PointLightComponent = new PointLightComponent()
                                props.engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                            }
                        }}/>
                        <DropdownOption option={{
                            disabled: true,
                            label: 'Spot light',
                            icon: <span className={'material-icons-round'}
                                        style={{fontSize: '1.2rem'}}>flashlight_on</span>,
                            onClick: () => {
                                const actor = new Entity(undefined, 'Point light')
                                actor.components.DirectionalLightComponent = new PointLightComponent()
                                props.engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                            }
                        }}/>
                        <DropdownOption option={{

                            label: 'Directional light',
                            icon: <span className={'material-icons-round'}
                                        style={{fontSize: '1.1rem'}}>light_mode</span>,
                            onClick: () => {

                                const actor = new Entity(undefined, 'Directional light')
                                actor.components.DirectionalLightComponent = new DirectionalLightComponent()
                                props.engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                            }
                        }}/>
                        <DropdownOption option={{

                            label: 'Skybox',
                            icon: <span className={'material-icons-round'}
                                        style={{fontSize: '1.1rem'}}>cloud</span>,
                            onClick: () => {
                                const actor = new Entity(undefined, 'Skybox')
                                actor.components.SkyboxComponent = new SkyboxComponent(undefined, props.engine.gpu)
                                props.engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                            }
                        }}/>
                        <DropdownOption option={{
                            disabled: true,

                            label: 'CubeMap',
                            icon: <span className={'material-icons-round'}
                                        style={{fontSize: '1.1rem'}}>panorama_photosphere</span>,
                            onClick: () => {

                                const actor = new Entity(undefined, 'Cubemap')
                                actor.components.CubeMapComponent = new CubeMapComponent()
                                props.engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                            }
                        }}/>
                    </DropdownOptions>
                </Dropdown>
            </div>
            <div className={styles.alignEnd}>
                <div className={styles.buttonGroup}>
                    <Button
                        className={styles.groupItem}
                        variant={'minimal'}
                        highlight={settingsContext.shadingModel === SHADING_MODELS.DETAIL}
                        onClick={() => {
                            settingsContext.shadingModel = SHADING_MODELS.DETAIL
                        }}
                        styles={{borderRadius: '5px 0 0 5px'}}>
                        <div className={styles.shadedIcon}/>
                        <ToolTip>
                            <div style={{textAlign: 'left'}}>
                                <div style={{fontWeight: 'normal'}}>
                                    Viewport shading:
                                </div>
                                Details
                            </div>
                        </ToolTip>
                    </Button>
                    <Button
                        className={styles.groupItem}
                        variant={'minimal'}
                        highlight={settingsContext.shadingModel === SHADING_MODELS.FLAT}
                        onClick={() => {
                            settingsContext.shadingModel = SHADING_MODELS.FLAT
                        }}>
                        <div className={styles.flatIcon}/>
                        <ToolTip>
                            <div style={{textAlign: 'left'}}>
                                <div style={{fontWeight: 'normal'}}>
                                    Viewport shading:
                                </div>
                                Flat
                            </div>
                        </ToolTip>
                    </Button>
                    <Button
                        disabled={true}
                        className={styles.groupItem}
                        variant={'minimal'}
                        highlight={settingsContext.shadingModel === SHADING_MODELS.WIREFRAME}
                        onClick={() => {
                            settingsContext.shadingModel = SHADING_MODELS.WIREFRAME
                        }}
                        styles={{borderRadius: '0 5px 5px 0'}}>

                        <div className={'material-icons-round'} style={{fontSize: '17px', color: 'var(-colorToApply)'}}>
                            language
                        </div>
                        <ToolTip>
                            <div style={{textAlign: 'left'}}>
                                <div style={{fontWeight: 'normal'}}>
                                    Viewport shading:
                                </div>
                                Wireframe
                            </div>
                        </ToolTip>
                    </Button>
                </div>
            </div>

            {/*TODO*/}
            {/*<div className={styles.cameraView}>*/}
            {/*    <div className={styles.cube}>*/}
            {/*        <div className={[styles.cubeFace, styles.cubeFaceFront].join(' ')}>front</div>*/}
            {/*        <div className={[styles.cubeFace, styles.cubeFaceBack].join(' ')}>back</div>*/}
            {/*        <div className={[styles.cubeFace, styles.cubeFaceRight].join(' ')}>right</div>*/}
            {/*        <div className={[styles.cubeFace, styles.cubeFaceLeft].join(' ')}>left</div>*/}
            {/*        <div className={[styles.cubeFace, styles.cubeFaceTop].join(' ')}>top</div>*/}
            {/*        <div className={[styles.cubeFace, styles.cubeFaceBottom].join(' ')}>bottom</div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )

}
ViewportOptions.propTypes = {
    fullscreenID: PropTypes.string,
    engine: PropTypes.object,
    id: PropTypes.string
}