import MeshInstance from "../../engine/instances/MeshInstance";
import Entity from "../../engine/ecs/basic/Entity";
import TransformComponent from "../../engine/ecs/components/TransformComponent";
import MeshComponent from "../../engine/ecs/components/MeshComponent";

import {ENTITY_ACTIONS} from "../../engine/hooks/useEngineEssentials";
import {linearAlgebraMath, Vector} from "pj-math";
import COMPONENTS from "../../engine/templates/COMPONENTS";

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
            entity.components[COMPONENTS.MESH] = new MeshComponent(undefined, mesh.id)
            entity.components[COMPONENTS.TRANSFORM] = transformation

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