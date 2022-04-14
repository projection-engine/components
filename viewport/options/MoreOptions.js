import styles from "../styles/ViewportOptions.module.css";
import {Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import Entity from "../../../services/engine/ecs/basic/Entity";
import COMPONENTS from "../../../services/engine/templates/COMPONENTS";
import PointLightComponent from "../../../services/engine/ecs/components/PointLightComponent";
import TransformComponent from "../../../services/engine/ecs/components/TransformComponent";
import PickComponent from "../../../services/engine/ecs/components/PickComponent";
import DirectionalLightComponent from "../../../services/engine/ecs/components/DirectionalLightComponent";
import SkylightComponent from "../../../services/engine/ecs/components/SkyLightComponent";
import CameraComponent from "../../../services/engine/ecs/components/CameraComponent";
import SkyboxComponent from "../../../services/engine/ecs/components/SkyboxComponent";
import CubeMapComponent from "../../../services/engine/ecs/components/CubeMapComponent";
import CubeMapInstance from "../../../services/engine/instances/CubeMapInstance";
import PropTypes from "prop-types";
import Range from "../../range/Range";
import {useState} from "react";

export default function MoreOptions(props) {
    const {settingsContext, fullscreen, setFullscreen, fullscreenID} = props
    const [res, setRes] = useState(settingsContext.resolutionMultiplier * 100)
    const [fov, setFov] = useState(settingsContext.fov * 180 / 3.1415)
    return (
        <Dropdown
            hideArrow={true}
            className={styles.optionWrapper}>
            <span style={{fontSize: '1.1rem'}} className={'material-icons-round'}>more_vert</span>
            <DropdownOptions>
                <DropdownOption option={{
                    label: 'Fullscreen',
                    shortcut: 'Ctrl + shift + f',
                    onClick: () => {
                        const el = document.getElementById(fullscreenID)
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
    )
}

MoreOptions.propTypes = {
    fullscreenID: PropTypes.string,
    settingsContext: PropTypes.object,
    fullscreen: PropTypes.bool, setFullscreen: PropTypes.func
}