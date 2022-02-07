import {useContext, useEffect, useState} from "react";

import EVENTS from "../../views/editor/utils/misc/EVENTS";
import LoadProvider from "../../views/editor/hook/LoadProvider";
import {FILE_TYPES} from "../../views/files/hooks/useDB";
import FileSystem from "./FileSystem";


export default function useQuickAccess(projectID, load) {
    const [images, setImages] = useState([])
    const [meshes, setMeshes] = useState([])
    const [materials, setMaterials] = useState([])
    const fileSystem = new FileSystem()


    const refresh = () => {
        let promises = []
        load.pushEvent(EVENTS.REFRESHING)
        promises.push(
            new Promise((r) => {
                fileSystem
                    .listFiles({project: projectID, type: 'mesh'})
                    .then(res => r(res))
            })
        )
        promises.push(
            new Promise((r) => {
                fileSystem
                    .listFiles({project: projectID, type: 'image'})
                    .then(res => r(res))
            })
        )

        promises.push(
            new Promise((r) => {
                fileSystem
                    .listFiles({project: projectID, type: 'material'})
                    .then(res => r(res))
            })
        )


        Promise.all(promises.flat()).then(r => {
            setImages(r.flat().filter(f => f.type !== 'mesh' && f.type !== 'material'))
            setMaterials(r.flat().filter(f => f.type === 'material'))
            setMeshes(r.flat().filter(f => f.type === 'mesh'))

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