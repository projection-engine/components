import React, {useContext, useEffect, useMemo, useState} from 'react'
import PropTypes from "prop-types";
import styles from "./styles/ViewportOptions.module.css";
import {Button, Dropdown, DropdownOption, DropdownOptions, ToolTip} from "@f-ui/core";
import Range from "../range/Range";
import SettingsProvider from "../../services/hooks/SettingsProvider";
import {SHADING_MODELS} from "../../pages/project/hook/useSettings";
import CAMERA_TYPES from "../../services/engine/utils/camera/CAMERA_TYPES";
import {ENTITY_ACTIONS} from "../../services/utils/entityReducer";
import Entity from "../../services/engine/ecs/basic/Entity";
import PointLightComponent from "../../services/engine/ecs/components/PointLightComponent";
import DirectionalLightComponent from "../../services/engine/ecs/components/DirectionalLightComponent";
import SkyboxComponent from "../../services/engine/ecs/components/SkyboxComponent";
import CubeMapComponent from "../../services/engine/ecs/components/CubeMapComponent";
import ROTATION_TYPES from "../../services/engine/utils/misc/ROTATION_TYPES";
import SkylightComponent from "../../services/engine/ecs/components/SkyLightComponent";
import SphericalCamera from "../../services/engine/utils/camera/prespective/SphericalCamera";
import {handleGrab} from "./utils";
import CubeMapInstance from "../../services/engine/instances/CubeMapInstance";


export default function ViewportOptions(props) {
    const settingsContext = useContext(SettingsProvider)
    const [res, setRes] = useState(settingsContext.resolutionMultiplier * 100)
    const [fov, setFov] = useState(settingsContext.fov * 180 / 3.1415)
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
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreen)
        }
    }, [fullscreen])

    const cameraIcon = useMemo(() => {
        if (!cameraIsOrthographic)
            return (
                <div
                    style={{width: '20px', height: '20px', perspective: '40px', transformStyle: 'preserve-3d'}}>
                        <span
                            style={{fontSize: '1.2rem', transform: 'rotateX(45deg)'}}
                            className={'material-icons-round'}>grid_on</span>
                </div>
            )
        else
            return <span style={{fontSize: '1rem'}} className={'material-icons-round'}>grid_on</span>
    }, [cameraIsOrthographic])
    const cameraOptions = useMemo(() => {

        return Object.keys(CAMERA_TYPES)
            .map(c => {
                return {
                    label: CAMERA_TYPES[c],
                    icon: settingsContext.cameraType === CAMERA_TYPES[c] ?
                        <span style={{fontSize: '1.2rem'}}
                              className={'material-icons-round'}>check</span> : undefined,
                    onClick: () => {
                        const isOrtho = CAMERA_TYPES[c] !== CAMERA_TYPES.SPHERICAL && CAMERA_TYPES[c] !== CAMERA_TYPES.FREE
                        if (isOrtho)
                            setLastCamera({
                                ...lastCamera,
                                ortho: CAMERA_TYPES[c]
                            })
                        else
                            setLastCamera({
                                ...lastCamera,
                                perspective: CAMERA_TYPES[c]
                            })
                        settingsContext.cameraType = CAMERA_TYPES[c]

                        setCameraIsOrthographic(isOrtho)
                    },
                    disabled: settingsContext.cameraType === CAMERA_TYPES[c]
                }
            })
    }, [settingsContext.cameraType, props.engine, lastCamera, cameraIsOrthographic])

    return (
        <>
            <div className={styles.options} style={{display: fullscreen ? 'none' : undefined}} draggable={false}>
                <div className={styles.align}>
                    <Dropdown
                        hideArrow={true}
                        className={[styles.optionWrapper, styles.highlighted].join(' ')}>
                        <span style={{fontSize: '1.1rem'}} className={'material-icons-round'}>more_vert</span>
                        <DropdownOptions>
                            <DropdownOption option={{
                                label: 'Fullscreen',
                                shortcut: 'Ctrl + shift + f',
                                onClick: () => {
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
                                }
                            }}/>
                            <DropdownOption option={{
                                label: 'Show FPS',
                                icon: settingsContext.performanceMetrics ? <span style={{fontSize: '1.2rem'}}
                                                                                 className={'material-icons-round'}>check</span> : undefined,
                                onClick: () => settingsContext.performanceMetrics = !settingsContext.performanceMetrics,
                                shortcut: 'Ctrl + shift + h'
                            }}/>

                            <div className={styles.divider}/>

                            <div className={styles.rangeWrapper}>
                                <div className={styles.rangeLabel}>
                                    Fov
                                </div>
                                <Range
                                    accentColor={'green'}
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
                                    accentColor={'red'}
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
                    <Dropdown className={styles.optionWrapper} hideArrow={true}>
                        <div className={styles.align}>
                            <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>add</span> Create
                        </div>
                        <DropdownOptions>
                            <div className={styles.dividerWrapper}>
                                Lights
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

                                label: 'Skylight',
                                icon: <span className={'material-icons-round'}
                                            style={{fontSize: '1.1rem'}}>sky</span>,
                                onClick: () => {
                                    const actor = new Entity(undefined, 'Skylight')
                                    actor.components.SkylightComponent = new SkylightComponent()
                                    props.engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                                }
                            }}/>

                            <div className={styles.dividerWrapper}>
                                Misc
                                <div className={styles.divider}/>
                            </div>
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
                                label: 'CubeMap',
                                icon: <span className={'material-icons-round'}
                                            style={{fontSize: '1.1rem'}}>panorama_photosphere</span>,
                                onClick: () => {

                                    const actor = new Entity(undefined, 'Cubemap')
                                    actor.components.CubeMapComponent = new CubeMapComponent()
                                    actor.components.CubeMapComponent.cubeMap = new CubeMapInstance(props.engine.gpu, actor.components.CubeMapComponent.resolution)
                                    props.engine.dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: actor})
                                }
                            }}/>
                        </DropdownOptions>
                    </Dropdown>


                </div>
                <div className={styles.align}>
                    <Dropdown
                        disabled={true}
                        className={[styles.optionWrapper, styles.highlighted].join(' ')}>
                        <div className={styles.summary}>
                          <span style={{fontSize: '1.1rem'}}
                                className={'material-icons-round'}>transform</span>
                            <div className={styles.overflow}>
                                {settingsContext.rotationType === ROTATION_TYPES.RELATIVE ? 'Local' : 'Global'}
                            </div>
                        </div>
                        <DropdownOptions>
                            <DropdownOption option={{
                                label: 'Local',

                                icon: settingsContext.rotationType === ROTATION_TYPES.RELATIVE ?
                                    <span style={{fontSize: '1.2rem'}}
                                          className={'material-icons-round'}>check</span> : undefined,
                                onClick: () => {
                                    settingsContext.rotationType = ROTATION_TYPES.RELATIVE
                                }
                            }}/>
                            <DropdownOption option={{
                                label: 'Global',
                                icon: settingsContext.rotationType === ROTATION_TYPES.GLOBAL ?
                                    <span style={{fontSize: '1.2rem'}}
                                          className={'material-icons-round'}>check</span> : undefined,
                                onClick: () => {
                                    settingsContext.rotationType = ROTATION_TYPES.GLOBAL

                                }
                            }}/>
                        </DropdownOptions>
                    </Dropdown>
                </div>
                <div className={styles.align}>
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

                            <div className={'material-icons-round'}
                                 style={{fontSize: '17px', color: 'var(-colorToApply)'}}>
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
            </div>
            <div className={styles.floating}>
                <div className={styles.cameraView}>
                    <div className={styles.cube} id={props.id + '-camera'}>
                        <div
                            className={[styles.face, styles.front].join(' ')}
                            onClick={() => {
                                if (!cameraIsOrthographic) {
                                    lastCamera.perspective = settingsContext.cameraType
                                    settingsContext.cameraType = CAMERA_TYPES.FRONT
                                    setCameraIsOrthographic(true)
                                }
                                else {
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
                                 }
                                 else {
                                     settingsContext.cameraType = lastCamera.perspective
                                     setCameraIsOrthographic(false)
                                     lastCamera.ortho = settingsContext.cameraType
                                 }
                             }}
                        >
                            Back</div>
                        <div className={[styles.face, styles.right].join(' ')}
                             onClick={() => {
                                 if (!cameraIsOrthographic) {
                                     lastCamera.perspective = settingsContext.cameraType
                                     settingsContext.cameraType = CAMERA_TYPES.RIGHT
                                     setCameraIsOrthographic(true)
                                 }
                                 else {
                                     settingsContext.cameraType = lastCamera.perspective
                                     setCameraIsOrthographic(false)
                                     lastCamera.ortho = settingsContext.cameraType
                                 }
                             }}
                        >Right</div>
                        <div className={[styles.face, styles.left].join(' ')}
                             onClick={() => {
                                 if (!cameraIsOrthographic) {
                                     lastCamera.perspective = settingsContext.cameraType
                                     settingsContext.cameraType = CAMERA_TYPES.LEFT
                                     setCameraIsOrthographic(true)
                                 }
                                 else {
                                     settingsContext.cameraType = lastCamera.perspective
                                     setCameraIsOrthographic(false)
                                     lastCamera.ortho = settingsContext.cameraType
                                 }
                             }}
                        >Left</div>
                        <div className={[styles.face, styles.top].join(' ')}
                             onClick={() => {
                            if (!cameraIsOrthographic) {
                                lastCamera.perspective = settingsContext.cameraType
                                settingsContext.cameraType = CAMERA_TYPES.TOP
                                setCameraIsOrthographic(true)
                            }
                            else {
                                settingsContext.cameraType = lastCamera.perspective
                                setCameraIsOrthographic(false)
                                lastCamera.ortho = settingsContext.cameraType
                            }
                        }}
                        >Top</div>
                        <div className={[styles.face, styles.bottom].join(' ')}
                             onClick={() => {
                            if (!cameraIsOrthographic) {
                                lastCamera.perspective = settingsContext.cameraType
                                settingsContext.cameraType = CAMERA_TYPES.BOTTOM
                                setCameraIsOrthographic(true)
                            }
                            else {
                                settingsContext.cameraType = lastCamera.perspective
                                setCameraIsOrthographic(false)
                                lastCamera.ortho = settingsContext.cameraType
                            }
                        }}
                        >Bottom</div>
                    </div>
                </div>

                <Dropdown className={styles.floatingOption} hideArrow={true}>

                    <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>videocam</span>

                    <DropdownOptions>
                        {cameraOptions.map((c, i) => (
                            <React.Fragment key={i + '-options-vp'}>
                                <DropdownOption
                                    option={c}/>
                            </React.Fragment>
                        ))}
                    </DropdownOptions>
                </Dropdown>
                <Button className={styles.floatingOption}
                        onClick={() => {
                            if (cameraIsOrthographic)
                                settingsContext.cameraType = lastCamera.perspective
                            else
                                settingsContext.cameraType = lastCamera.ortho

                            setCameraIsOrthographic(!cameraIsOrthographic)
                        }}>
                    {cameraIcon}
                </Button>

                <div
                    style={{display: props.engine.renderer?.camera instanceof SphericalCamera ? undefined : 'none'}}
                    className={[styles.floatingOption, styles.dragInput].join(' ')}
                    onMouseDown={e => handleGrab(e, props.engine.renderer)}>
                    <span className={'material-icons-round'} style={{fontSize: '1rem'}}>back_hand</span>
                </div>
            </div>
        </>
    )

}
ViewportOptions.propTypes = {
    fullscreenID: PropTypes.string,
    engine: PropTypes.object,
    id: PropTypes.string
}