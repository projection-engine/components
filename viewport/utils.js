import MeshInstance from "../../services/engine/instances/MeshInstance";
import Entity from "../../services/engine/ecs/basic/Entity";
import TransformComponent from "../../services/engine/ecs/components/TransformComponent";
import MeshComponent from "../../services/engine/ecs/components/MeshComponent";
import PickComponent from "../../services/engine/ecs/components/PickComponent";
import {ENTITY_ACTIONS} from "../../services/utils/entityReducer";
import {linearAlgebraMath, Vector} from "pj-math";

export default function importMesh(type, engine) {
    let promise, name
    switch (type) {
        case 0: {
            name = 'Cube'
            promise = import('../../static/assets/Cube.json')
            break

        }
        case 1: {
            name = 'Sphere'
            promise = import('../../static/assets/Sphere.json')
            break

        }
        case 2: {
            name = 'Plane'
            promise = import('../../static/assets/Plane.json')
            break
        }
        default:
            break
    }

    if (promise) {
        promise.then(data => {
            const mesh = new MeshInstance({
                ...data,
                gpu: engine.gpu,
                maxBoundingBox: data.maxBoundingBox,
                minBoundingBox: data.minBoundingBox,
            })

            engine.setMeshes(prev => {
                return [...prev, mesh]
            })
            const entity = new Entity(undefined, "New " + name)
            const transformation = new TransformComponent()
            transformation.scaling = data.scaling
            transformation.rotation = data.rotation
            transformation.translation = data.translation
            entity.components.MeshComponent = new MeshComponent(undefined, mesh.id)
            entity.components.TransformComponent = transformation
            entity.components.PickComponent = new PickComponent(undefined, engine.entities.length + 1)

            engine.dispatchEntities({
                type: ENTITY_ACTIONS.ADD,
                payload: entity
            })
        })

    }
}


export function handleGrab(event, engine){
    let requested = false
    const handleMouseMove = (e) => {
        if(!requested){
            e.target.requestPointerLock()
            requested = true
        }
        const incrementX =  ((0.1) * e.movementX)
        const incrementY =  ((0.1) * e.movementY)

        engine.camera.centerOn[0] -= incrementX
        engine.camera.centerOn[1]-= incrementY

        engine.camera.updateViewMatrix()
    }
    const handleMouseUp = () => {
        document.exitPointerLock()
        document.removeEventListener('mousemove', handleMouseMove)
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp, {once: true})
}