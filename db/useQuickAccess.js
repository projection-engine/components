import {useContext, useEffect, useState} from "react";
import DatabaseProvider from "./DatabaseProvider";
import {FILE_TYPES} from "../files/hooks/useDB";
import LoadProvider from "../../hook/LoadProvider";
import EVENTS from "../../utils/misc/EVENTS";

export default function useQuickAccess(projectID) {
    const database = useContext(DatabaseProvider)
    const load = useContext(LoadProvider)
    const [images, setImages] = useState([])
    const [meshes, setMeshes] = useState([])
    const [materials, setMaterials] = useState([])

    const refresh = () => {
        let promises = []
        load.pushEvent(EVENTS.REFRESHING)
        promises.push(
            new Promise((r) => {
                database
                    .listFiles({project: projectID, type: 'mesh', instanceOf: FILE_TYPES.FILE})
                    .then(res => r(res))
            })
        )
        promises.push(
            new Promise((r) => {
                database
                    .listFilesWithFilter((file) => {
                        if (file.project === projectID && file.instanceOf === FILE_TYPES.FILE)
                            switch (file.type) {
                                case  'jpg':
                                case  'jpeg':
                                case  'hdr':
                                case 'png':
                                    return file
                                default:
                                    return
                            }
                    })
                    .then(res => r(res))
            })
        )

        promises.push(
            new Promise((r) => {
                database
                    .listFiles({project: projectID, type: 'material', instanceOf: FILE_TYPES.FILE})
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

    useEffect(() => {
        if (projectID)
            refresh()
    }, [projectID])

    return {
        images,
        meshes,
        materials,
        refresh
    }
}