import PropTypes from "prop-types";
import styles from "./styles/ViewportOptions.module.css";
import {Button, Dropdown, DropdownOption, DropdownOptions, ToolTip} from "@f-ui/core";
import Range from "../range/Range";
import {useContext, useEffect, useMemo, useState} from "react";
import SettingsProvider from "../../services/hooks/SettingsProvider";
import {SHADING_MODELS} from "../../pages/project/hook/useSettings";


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

    const renderingType = useMemo(() => {
        switch (settingsContext.shadingModel) {
            case SHADING_MODELS.FLAT: {
                return (
                    <>
                        <div
                            style={{fontSize: '1.2rem'}}
                            className={'material-icons-round'}
                        >
                            dehaze
                        </div>
                        <div className={styles.overflow}>
                            Flat
                        </div>
                    </>
                )
            }
            case SHADING_MODELS.DETAIL: {
                return (
                    <>
                        <div
                            style={{fontSize: '1.2rem'}}
                            className={'material-icons-round'}
                        >
                            auto_awesome
                        </div>
                        <div className={styles.overflow}>
                            Details
                        </div>
                    </>
                )
            }
            default:
                return (
                    <>
                        <div
                            style={{fontSize: '1.2rem'}}
                            className={'material-icons-round'}
                        >
                            details
                        </div>
                        <div className={styles.overflow}>
                            Wireframe
                        </div>
                    </>
                )
        }
    }, [settingsContext.shadingModel])
    const cameraIcon = useMemo(() => {
        switch (settingsContext.cameraType) {
            case 'spherical':
            case 'free':
                return (
                    <>

                        <div
                            style={{width: '20px', height: '20px', perspective: '40px', transformStyle: 'preserve-3d'}}>
                        <span
                            style={{fontSize: '1.2rem', transform: 'rotateX(45deg)'}}
                            className={'material-icons-round'}>grid_on</span>
                        </div>
                        <div className={styles.overflow} style={{textTransform: 'capitalize'}}>
                            {settingsContext.cameraType === 'spherical' ? 'Spherical' : 'Free camera'}
                        </div>
                    </>

                )
            default:
                return (
                    <>
                        <span
                            style={{fontSize: '1.2rem'}}
                            className={'material-icons-round'}>grid_on
                        </span>
                        <div className={styles.overflow}>
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
                    <span style={{fontSize: '1.2rem'}} className={'material-icons-round'}>more_vert</span>
                    <DropdownOptions>
                        <DropdownOption option={{
                            label: 'Show FPS',
                            icon: settingsContext.fpsVisibility ? <span style={{fontSize: '1.2rem'}}
                                                                        className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.fpsVisibility = !settingsContext.fpsVisibility,
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
                <span style={{fontSize: '1.2rem'}}
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
                                icon: settingsContext.cameraType === 'free' ? <span style={{fontSize: '1.2rem'}}
                                                                                    className={'material-icons-round'}>check</span> : undefined,
                                onClick: () => settingsContext.cameraType = 'free',
                                disabled: settingsContext.cameraType === 'free'
                            }}/>

                        <DropdownOption option={{
                            label: 'Spherical',
                            icon: settingsContext.cameraType === 'spherical' ? <span style={{fontSize: '1.2rem'}}
                                                                                     className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.cameraType = 'spherical',
                            disabled: settingsContext.cameraType === 'spherical'
                        }}/>

                        <div className={styles.dividerWrapper}>
                            Orthographic
                            <div className={styles.divider}/>
                        </div>
                        <DropdownOption option={{
                            label: 'Top',
                            icon: settingsContext.cameraType === 'ortho-top' ? <span style={{fontSize: '1.2rem'}}
                                                                                     className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.cameraType = 'ortho-top',
                            disabled: settingsContext.cameraType === 'ortho-top'
                        }}/>
                        <DropdownOption option={{
                            label: 'Bottom',
                            icon: settingsContext.cameraType === 'ortho-bottom' ? <span style={{fontSize: '1.2rem'}}
                                                                                        className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.cameraType = 'ortho-bottom',
                            disabled: settingsContext.cameraType === 'ortho-bottom'
                        }}/>
                        <DropdownOption option={{
                            label: 'Left',
                            icon: settingsContext.cameraType === 'ortho-left' ? <span style={{fontSize: '1.2rem'}}
                                                                                      className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.cameraType = 'ortho-left',
                            disabled: settingsContext.cameraType === 'ortho-left'
                        }}/>
                        <DropdownOption option={{
                            label: 'Right',
                            icon: settingsContext.cameraType === 'ortho-right' ? <span style={{fontSize: '1.2rem'}}
                                                                                       className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.cameraType = 'ortho-right',
                            disabled: settingsContext.cameraType === 'ortho-right'
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

                <div
                    className={styles.optionWrapper}
                    style={{
                        justifyContent: 'center',
                        display: !settingsContext.fpsVisibility ? 'none' : undefined,
                        fontSize: '.75rem',
                        fontWeight: 550
                    }}
                    title={'Frames per second'}
                    id={props.id + '-frames'}
                />
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