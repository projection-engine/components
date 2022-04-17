import MeshInstance from "../../engine/shared/instances/MeshInstance";
import Entity from "../../engine/shared/ecs/basic/Entity";
import TransformComponent from "../../engine/shared/ecs/components/TransformComponent";
import MeshComponent from "../../engine/shared/ecs/components/MeshComponent";
import PickComponent from "../../engine/shared/ecs/components/PickComponent";
import {ENTITY_ACTIONS} from "../../engine/utils/entityReducer";
import {linearAlgebraMath, Vector} from "pj-math";

export default function importMesh(type, engine) {
    let promise, name
    switch (type) {
        case 0: {
            name = 'Cube'
            promise = import('../../engine/editor/assets/Cube.json')
            break

        }
        case 1: {
            name = 'Sphere'
            promise = import('../../engine/editor/assets/Sphere.json')
            break

        }
        case 2: {
            name = 'Plane'
            promise = import('../../engine/editor/assets/Plane.json')
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


export function handleGrab(event, engine, type) {
    let requested = false
    const handleMouseMove = (e) => {
        if (!requested) {
            e.target.requestPointerLock()
            requested = true
        }


        const incrementX = ((0.1) * e.movementX),
            incrementY = ((0.1) * e.movementY),
            c = [...engine.camera.centerOn]

        if(type === 1) {
            let newPosition = linearAlgebraMath.multiplyMatrixVec(linearAlgebraMath.rotationMatrix('y', engine.camera.yaw), new Vector(incrementX, 0, 0))
            newPosition = newPosition.matrix

            c[0] += newPosition[0]
            c[1] -= incrementY
            c[2] += newPosition[2]

            engine.camera.centerOn = c
            engine.camera.updateViewMatrix()
        }
        else{

            engine.camera.radius +=  (0.1) * e.movementX
            engine.camera.updateViewMatrix()
        }
    }
    const handleMouseUp = () => {
        document.exitPointerLock()
        document.removeEventListener('mousemove', handleMouseMove)
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp, {once: true})
}