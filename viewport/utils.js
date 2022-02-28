import MeshInstance from "../../services/engine/elements/instances/MeshInstance";
import Entity from "../../services/engine/ecs/basic/Entity";
import TransformComponent from "../../services/engine/ecs/components/TransformComponent";
import MeshComponent from "../../services/engine/ecs/components/MeshComponent";
import PickComponent from "../../services/engine/ecs/components/PickComponent";
import {ENTITY_ACTIONS} from "../../services/utils/entityReducer";

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