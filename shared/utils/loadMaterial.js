import {colorToImage} from "../../../../core/utils/imageManipulation";
import PBR from "../../../../core/renderer/material/PBR";

export function getFetchPromise(obj, database, allData=false) {
    return new Promise((resolve) => {

        if (obj.type === 'object')
            database.table(`file`).get(obj.ref).then(res => resolve(allData ? res : res.blob)).catch(e => {
                resolve()
            })
        else if (obj.type === 'string')
            resolve(colorToImage(obj.ref))
        else
            resolve()
    })
}

export function loadMaterial(mat, database) {
    let parsedBlob = {}
    try {
        parsedBlob = JSON.parse(mat.blob)
    } catch (e) {
        console.log(e)
    }

    if (parsedBlob.response) {
        let albedo = getFetchPromise(parsedBlob.response.albedo, database),
            metallic = getFetchPromise(parsedBlob.response.metallic, database),
            roughness = getFetchPromise(parsedBlob.response.roughness, database),
            normal = getFetchPromise(parsedBlob.response.normal, database),
            height = getFetchPromise(parsedBlob.response.height, database),
            ao = getFetchPromise(parsedBlob.response.ao, database)
        return {
            mat: mat,
            promise: Promise.all([albedo, metallic, roughness, normal, height, ao])
        }
    }
    return {}
}

export default function loadPromises(mat, database, gpu, callback) {
    const obj = loadMaterial(mat, database)
    if (obj.promise !== undefined) {
        obj.promise.then(promiseRes => {
            let mat = new PBR(
                gpu,
                promiseRes[0],
                promiseRes[1],
                promiseRes[2],
                promiseRes[3],
                promiseRes[4],
                promiseRes[5],
                obj.mat.id
            )
            mat.name = obj.mat.name

            callback(mat, [...promiseRes])
        })
    } else
        callback(undefined, [])
}
