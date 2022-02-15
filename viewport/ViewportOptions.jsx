import PropTypes from "prop-types";
import styles from "./styles/ViewportOptions.module.css";
import {Button, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import Range from "../range/Range";
import {useContext, useMemo, useState} from "react";
import SettingsProvider from "../../services/hooks/SettingsProvider";
import {SHADING_MODELS} from "../../pages/project/hook/useSettings";


export default function ViewportOptions(props) {
    const settingsContext = useContext(SettingsProvider)
    const [res, setRes] = useState(settingsContext.resolutionMultiplier * 100)
    const [fov, setFov] = useState(settingsContext.fov * 180 / 3.1415)

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
    const [fullscreen, setFullscreen] = useState(false)
    return (
        <div className={styles.options} draggable={false}>
            <Button className={styles.optionWrapper} onClick={() => {
                const el = document.getElementById(props.fullscreenID)
                if(el) {
                    if (!fullscreen) {
                        el.requestFullscreen()
                            .then(r => {
                                setFullscreen(true)
                                el.addEventListener('fullscreenchange', () => {
                                    if(! document.fullscreenElement)
                                        setFullscreen(false)
                                }, {once: true})
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
            <Dropdown className={styles.optionWrapper} justify={'start'} align={'bottom'}>
                <span style={{fontSize: '1.2rem'}} className={'material-icons-round'}>more_vert</span>
                <DropdownOptions>
                    <DropdownOption option={{
                        label: 'Show FPS',
                        icon: settingsContext.fpsVisibility ? <span style={{fontSize: '1.2rem'}}
                                                                    className={'material-icons-round'}>check</span> : undefined,
                        onClick: () => settingsContext.fpsVisibility = !settingsContext.fpsVisibility,
                        shortcut: 'ctrl + shift + h'
                    }}/>

                    <div className={styles.dividerWrapper}>
                        Viewport
                        <div className={styles.divider}/>
                    </div>
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

            <Dropdown
                className={styles.optionWrapper}


                justify={'start'} align={'bottom'}>
                <div className={styles.summary}>
                            <span
                                style={{fontSize: '1.2rem'}}
                                className={'material-icons-round'}>{settingsContext.cameraType !== 'free' ? '360' : 'videocam'}</span>
                    <div className={styles.overflow}>
                        {settingsContext.cameraType === 'free' ? 'Free camera' : 'Spherical camera'}
                    </div>
                </div>
                <DropdownOptions>
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
                        disabled: settingsContext.cameraType !== 'free'
                    }}/>
                </DropdownOptions>
            </Dropdown>

            <Dropdown
                className={styles.optionWrapper}

                justify={'start'} align={'bottom'}>
                <div className={styles.summary}>
                    {renderingType}
                </div>
                <DropdownOptions>
                    <DropdownOption
                        option={{
                            label: 'Flat',
                            icon: settingsContext.shadingModel === SHADING_MODELS.FLAT ?
                                <span style={{fontSize: '1.2rem'}}
                                      className={'material-icons-round'}>check</span> : undefined,
                            onClick: () => settingsContext.shadingModel = SHADING_MODELS.FLAT,
                            disabled: settingsContext.shadingModel === SHADING_MODELS.FLAT
                        }}/>

                    <DropdownOption option={{
                        label: 'Detail',
                        icon: settingsContext.shadingModel === SHADING_MODELS.DETAIL ?
                            <span style={{fontSize: '1.2rem'}}
                                  className={'material-icons-round'}>check</span> : undefined,
                        onClick: () => settingsContext.shadingModel = SHADING_MODELS.DETAIL,
                        disabled: settingsContext.shadingModel === SHADING_MODELS.DETAIL
                    }}/>
                    <DropdownOption option={{
                        label: 'Wireframe',
                        icon: settingsContext.shadingModel === SHADING_MODELS.WIREFRAME ?
                            <span style={{fontSize: '1.2rem'}}
                                  className={'material-icons-round'}>check</span> : undefined,
                        onClick: () => settingsContext.shadingModel = SHADING_MODELS.WIREFRAME,
                        disabled: true // settingsContext.shadingModel === SHADING_MODELS.WIREFRAME
                    }}/>
                </DropdownOptions>
            </Dropdown>
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
    )
}
ViewportOptions.propTypes = {
    fullscreenID: PropTypes.string,
    engine: PropTypes.object,
    id: PropTypes.string
}