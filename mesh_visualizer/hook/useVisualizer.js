import {useContext, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState} from "react";
import {enableBasics} from "../../../core/utils/utils";
import entityReducer, {ENTITY_ACTIONS} from "../../../core/ecs/utils/entityReducer";
import DeferredSystem from "../../../core/ecs/systems/DeferredSystem";
import PostProcessingSystem from "../../../core/ecs/systems/PostProcessingSystem";
import Entity from "../../../core/ecs/basic/Entity";
import Engine from "../../../core/Engine";
import PhysicsSystem from "../../../core/ecs/systems/PhysicsSystem";
import TransformSystem from "../../../core/ecs/systems/TransformSystem";
import ShadowMapSystem from "../../../core/ecs/systems/ShadowMapSystem";
import PickSystem from "../../../core/ecs/systems/PickSystem";
import GridComponent from "../../../core/ecs/components/GridComponent";
import parseEngineEntities from "../../../core/utils/parseEngineEntities";
import randomID from "../../../utils/misc/randomID";
import importMesh from "../../../utils/parsers/importMesh";

import planeMesh from '../../../core/assets/meshes/plane.json'
import sphereMesh from '../../../core/assets/meshes/sphere.json'
import Mesh from "../../../core/renderer/elements/Mesh";
import TransformComponent from "../../../core/ecs/components/TransformComponent";
import MeshComponent from "../../../core/ecs/components/MeshComponent";
import MaterialComponent from "../../../core/ecs/components/MaterialComponent";
import PickComponent from "../../../core/ecs/components/PickComponent";
import DirectionalLightComponent from "../../../core/ecs/components/DirectionalLightComponent";
import SkyboxComponent from "../../../core/ecs/components/SkyboxComponent";
import LoadProvider from "../../../hook/LoadProvider";
import EVENTS from "../../../utils/misc/EVENTS";


export default function useVisualizer(initializePlane, initializeSphere) {
    const [id, setId] = useState()
    const [gpu, setGpu] = useState()
    const [meshes, setMeshes] = useState([])
    const [materials, setMaterials] = useState([])
    const [entities, dispatchEntities] = useReducer(entityReducer, [])
    const [initialized, setInitialized] = useState(false)
    const load = useContext(LoadProvider)
    const renderer = useRef()
    let resizeObserver

    useLayoutEffect(() => {
        // load.pushEvent(EVENTS.LOADING_VIEWPORT)
        setId(randomID())
    }, [])


    useEffect(() => {
        if (id && !gpu) {
            const newGPU = document.getElementById(id + '-canvas').getContext('webgl2', {
                antialias: false,
                preserveDrawingBuffer: true
            })
            enableBasics(newGPU)
            setGpu(newGPU)
        } else if (gpu && !initialized && id) {

            const gridEntity = new Entity(undefined, 'Grid')

            dispatchEntities({type: ENTITY_ACTIONS.ADD, payload: gridEntity})
            dispatchEntities({
                type: ENTITY_ACTIONS.ADD_COMPONENT, payload: {
                    entityID: gridEntity.id,
                    data: new GridComponent(gpu)
                }
            })

            initializeSkybox(dispatchEntities, gpu)
            initializeLight(dispatchEntities)

            if(initializePlane)
                initializeMesh(planeMesh, gpu, randomID(), 'Plane', dispatchEntities, setMeshes)
            if(initializeSphere)
                initializeMesh(sphereMesh, gpu, randomID(), 'Sphere', dispatchEntities, setMeshes)

            renderer.current = new Engine(id, gpu)
            renderer.current.systems = [
                new TransformSystem(),
                new ShadowMapSystem(gpu),
                new DeferredSystem(gpu, 1),
                new PostProcessingSystem(gpu, 1)
            ]
            setInitialized(true)

            parseEngineEntities({meshes, materials}, entities, materials, meshes, renderer.current)
        } else if (gpu && id) {

            resizeObserver = new ResizeObserver(() => {
                if ( initialized)
                    renderer.current.camera.aspectRatio = gpu?.canvas.width / gpu?.canvas.height
            })
            resizeObserver.observe(document.getElementById(id + '-canvas'))

            renderer.current?.stop()
            parseEngineEntities({meshes, materials}, entities, materials, meshes, renderer.current)


            renderer.current?.start(entities)
        }

        return () => {
            renderer.current?.stop()
        }
    }, [meshes, materials, entities, gpu, id])


    return {
        id,load,
        entities, dispatchEntities,
        meshes, setMeshes, gpu,
        materials, setMaterials,
        initialized
    }
}
function initializeSkybox(dispatch,gpu){
    const newEntity = new Entity(undefined, 'sky')
    const sky = new SkyboxComponent(undefined, gpu)
    sky.hdrTexture = {blob: '/default_skybox.jpg',imageID: undefined, type: 'jpg'}
    dispatch({
        type: ENTITY_ACTIONS.ADD,
        payload: newEntity
    })
    dispatch({
        type: ENTITY_ACTIONS.ADD_COMPONENT,
        payload: {
            entityID: newEntity.id,
            data: sky
        }
    })
}
function initializeLight(dispatch){
    const newEntity = new Entity(undefined, 'light')
    const light = new DirectionalLightComponent()
    light.direction = [0, 100, 100]
    dispatch({
        type: ENTITY_ACTIONS.ADD,
        payload: newEntity
    })
    dispatch({
        type: ENTITY_ACTIONS.ADD_COMPONENT,
        payload: {
            entityID: newEntity.id,
            data: light
        }
    })
}
export function initializeMesh(data, gpu, id, name, dispatch, setMeshes) {
    let mesh = new Mesh({
        ...data,
        id: id,
        gpu: gpu,
        maxBoundingBox: data.boundingBoxMax,
        minBoundingBox: data.boundingBoxMin
    })
    setMeshes(prev => [...prev, mesh])

    const newEntity = new Entity(undefined, name)

    const transformation = new TransformComponent()
    transformation.scaling = data.scaling
    transformation.rotation = data.rotation
    transformation.translation = data.translation

    dispatch({
        type: ENTITY_ACTIONS.ADD,
        payload: newEntity
    })
    dispatch({
        type: ENTITY_ACTIONS.ADD_COMPONENT,
        payload: {
            data: new MeshComponent(undefined, mesh.id),
            entityID: newEntity.id
        }
    })
    dispatch({
        type: ENTITY_ACTIONS.ADD_COMPONENT,
        payload: {
            data: new MaterialComponent(),
            entityID: newEntity.id
        }
    })
    dispatch({
        type: ENTITY_ACTIONS.ADD_COMPONENT,
        payload: {
            data: transformation,
            entityID: newEntity.id
        }
    })
}