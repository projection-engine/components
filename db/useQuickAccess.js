import {useState} from "react";
import EVENTS from "../../views/editor/utils/misc/EVENTS";
import FileSystem from "./FileSystem";


export default function useQuickAccess(projectID, load) {
    const [images, setImages] = useState([])
    const [meshes, setMeshes] = useState([])
    const [materials, setMaterials] = useState([])
    const fileSystem = new FileSystem(projectID)


    const refresh = () => {
        let promises = []
        load.pushEvent(EVENTS.REFRESHING)
        promises.push(
            new Promise((r) => {
                let data = fileSystem
                    .fromDirectory(fileSystem.path + '/assets', 'mesh')

                data = data.map(u => {
                    return fileSystem.readFile(u, 'json')
                })
                Promise.all(data)
                    .then(res => {
                        r({
                            type: 'mesh',
                            data: res
                        })
                    })

            })
        )
        promises.push(
            new Promise((r) => {
                let data = fileSystem
                    .fromDirectory(fileSystem.path + '/assets', 'pimg')

                data = data.map(u => {
                    return fileSystem.readFile(u)
                })
                Promise.all(data)
                    .then(res => {
                        r({
                            type: 'image',
                            data: res
                        })
                    })
            })
        )

        promises.push(
            new Promise((r) => {
                let data = fileSystem
                    .fromDirectory(fileSystem.path + '/assets', 'material')
                data = data.map(u => {
                    return fileSystem.readFile(u)
                })
                Promise.all(data)
                    .then(res => {
                        r({
                            type: 'material',
                            data: res
                        })
                    })
            })
        )

        Promise.all(promises.flat()).then(r => {
            setImages(r.filter(f => f.type !== 'mesh' && f.type !== 'material').map(f => f.data))
            setMaterials(r.filter(f => f.type === 'material').map(f => f.data))
            setMeshes(r.filter(f => f.type === 'mesh').map(f => f.data))

            load.finishEvent(EVENTS.REFRESHING)
        })
    }

    return {
        fileSystem,
        images,
        meshes,
        materials,
        refresh
    }
}