import PropTypes from "prop-types";
import styles from "./styles/VO.module.css";
import {Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import Range from "../range/Range";

export default function ViewportOptions(props) {
    return (
        <div className={styles.options}>

            {props.hook.fullscreen ? null :
                <>
                    <Dropdown className={styles.optionWrapper} variant={'outlined'} justify={'start'} align={'bottom'}>
                        <span className={'material-icons-round'}>more_vert</span>
                        <DropdownOptions>
                            <DropdownOption option={{
                                label: 'Show FPS',
                                icon: props.hook.fps ? <span style={{fontSize: '1.2rem'}}
                                                             className={'material-icons-round'}>check</span> : undefined,
                                onClick: () => props.hook.setFps(!props.hook.fps),
                                shortcut: 'ctrl + shift + h'
                            }}/>

                            <DropdownOption option={{
                                label: 'Fullscreen',
                                icon: props.hook.fullscreen ? <span style={{fontSize: '1.2rem'}}
                                                                    className={'material-icons-round'}>check</span> : undefined,
                                onClick: () => props.hook.setFullscreen(!props.hook.fullscreen),
                                shortcut: 'F'
                            }}/>

                            <div className={styles.dividerWrapper}>
                                Viewport
                                <div className={styles.divider}/>
                            </div>
                            <div className={styles.rangeWrapper}>
                                <div className={styles.rangeLabel}>
                                    Fov
                                </div>
                                <Range value={props.hook.fov * 180 / 3.14}
                                       handleChange={e => props.hook.setFov(e * 3.14 / 180)}/>
                            </div>
                            <div className={styles.rangeWrapper}>
                                <div className={styles.rangeLabel}>
                                    Resolution
                                </div>
                                <Range
                                    value={props.hook.res}
                                    onFinish={() => {
                                        props.engine.setResolutionMultiplier(props.hook.res / 100)
                                    }}
                                    handleChange={e => props.hook.setRes(e)}/>
                            </div>

                        </DropdownOptions>
                    </Dropdown>
                    <Dropdown className={styles.optionWrapper} styles={{width: '125px'}} variant={'outlined'}
                              justify={'start'} align={'bottom'}>
                        <div className={styles.summary}>
                            <span
                                className={'material-icons-round'}>{!props.engine.cameraType === 'free' ? '360' : 'videocam'}</span>
                            <div className={styles.overflow}>
                                {props.engine.cameraType === 'free' ? 'Free camera' : 'Spherical camera'}
                            </div>
                        </div>
                        <DropdownOptions>
                            <DropdownOption
                                option={{
                                    label: 'Free',
                                    icon: props.engine.cameraType === 'free' ? <span style={{fontSize: '1.2rem'}}
                                                                                     className={'material-icons-round'}>check</span> : undefined,
                                    onClick: () => props.engine.setCameraType('free'),
                                    disabled: props.engine.cameraType === 'free'
                                }}/>

                            <DropdownOption option={{
                                label: 'Spherical',
                                icon: props.engine.cameraType === 'spherical' ? <span style={{fontSize: '1.2rem'}}
                                                                                      className={'material-icons-round'}>check</span> : undefined,
                                onClick: () => props.engine.setCameraType('spherical'),
                                disabled: props.engine.cameraType !== 'free'
                            }}/>
                        </DropdownOptions>
                    </Dropdown>

                </>
            }

            <div
                className={styles.optionWrapper}
                style={{justifyContent: 'center', display: !props.hook.fps ? 'none' : undefined}}
                title={'Frames per second'}
                id={props.id + '-frames'}
            />
        </div>
    )
}
ViewportOptions.propTypes = {
    engine: PropTypes.object,
    hook: PropTypes.object,
    id: PropTypes.string
}