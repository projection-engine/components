import styles from "../styles/ViewportOptions.module.css";
import {Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import Entity from "../../../engine/ecs/basic/Entity";
import COMPONENTS from "../../../engine/templates/COMPONENTS";
import PointLightComponent from "../../../engine/ecs/components/PointLightComponent";
import TransformComponent from "../../../engine/ecs/components/TransformComponent";

import DirectionalLightComponent from "../../../engine/ecs/components/DirectionalLightComponent";
import SkylightComponent from "../../../engine/ecs/components/SkyLightComponent";
import CameraComponent from "../../../engine/ecs/components/CameraComponent";
import SkyboxComponent from "../../../engine/ecs/components/SkyboxComponent";
import CubeMapComponent from "../../../engine/ecs/components/CubeMapComponent";
import CubeMapInstance from "../../../engine/instances/CubeMapInstance";
import PropTypes from "prop-types";

export default function AddComponent(props) {
    const {dispatchEntity, engine} = props
    return (
        <Dropdown className={styles.optionWrapper} hideArrow={true} variant={'outlined'}>
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
                        actor.components[COMPONENTS.POINT_LIGHT] = new PointLightComponent()
                        actor.components[COMPONENTS.TRANSFORM] = new TransformComponent()
                        actor.components[COMPONENTS.TRANSFORM].lockedRotation = true
                        actor.components[COMPONENTS.TRANSFORM].lockedScaling = true

                        dispatchEntity(actor)
                    }
                }}/>
                <DropdownOption option={{
                    disabled: true,
                    label: 'Spot light',
                    icon: <span className={'material-icons-round'}
                                style={{fontSize: '1.2rem'}}>flashlight_on</span>,
                    onClick: () => {
                        const actor = new Entity(undefined, 'Point light')
                        actor.components[COMPONENTS.DIRECTIONAL_LIGHT] = new PointLightComponent()
                        dispatchEntity(actor)
                    }
                }}/>
                <DropdownOption option={{

                    label: 'Directional light',
                    icon: <span className={'material-icons-round'}
                                style={{fontSize: '1.1rem'}}>light_mode</span>,
                    onClick: () => {

                        const actor = new Entity(undefined, 'Directional light')
                        actor.components[COMPONENTS.DIRECTIONAL_LIGHT] = new DirectionalLightComponent()
                        dispatchEntity(actor)
                    }
                }}/>
                <DropdownOption option={{

                    label: 'Skylight',
                    icon: <span className={'material-icons-round'}
                                style={{fontSize: '1.1rem'}}>sky</span>,
                    onClick: () => {
                        const actor = new Entity(undefined, 'Skylight')
                        actor.components[COMPONENTS.SKYLIGHT] = new SkylightComponent()
                        dispatchEntity(actor)
                    }
                }}/>
                <DropdownOption option={{
                    label: 'Camera',
                    icon: <span className={'material-icons-round'}
                                style={{fontSize: '1.1rem'}}>videocam</span>,
                    onClick: () => {
                        const actor = new Entity(undefined, 'Camera')
                        actor.components[COMPONENTS.CAMERA] = new CameraComponent()

                        actor.components[COMPONENTS.TRANSFORM] = new TransformComponent()
                        actor.components[COMPONENTS.TRANSFORM].rotation = [0, 0, 0]
                        actor.components[COMPONENTS.TRANSFORM].scaling = [0.8578777313232422, 0.5202516317367554, 0.2847398519515991]
                        actor.components[COMPONENTS.TRANSFORM].lockedScaling = true


                        dispatchEntity(actor)
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
                        actor.components.SkyboxComponent = new SkyboxComponent(undefined, engine.gpu)
                        dispatchEntity(actor)
                    }
                }}/>
                <DropdownOption option={{
                    label: 'CubeMap',
                    icon: <span className={'material-icons-round'}
                                style={{fontSize: '1.1rem'}}>panorama_photosphere</span>,
                    onClick: () => {

                        const actor = new Entity(undefined, 'Cubemap')
                        actor.components[COMPONENTS.CUBE_MAP] = new CubeMapComponent()
                        actor.components[COMPONENTS.CUBE_MAP].cubeMap = new CubeMapInstance(engine.gpu, actor.components[COMPONENTS.CUBE_MAP].resolution)
                        actor.components[COMPONENTS.TRANSFORM] = new TransformComponent()
                        actor.components[COMPONENTS.TRANSFORM].lockedRotation = true
                        actor.components[COMPONENTS.TRANSFORM].lockedScaling = true

                        dispatchEntity(actor)
                    }
                }}/>
            </DropdownOptions>
        </Dropdown>
    )
}

AddComponent.propTypes = {
    dispatchEntity: PropTypes.func,
    engine: PropTypes.object
}