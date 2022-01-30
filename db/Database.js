import Dexie from "dexie";
import randomID from "../../utils/randomID";
import splitData from "./utils/splitData";
import sortBlobs from "./utils/sortBlobs";

export default class Database extends Dexie {
    _ready = false

    constructor(name, options) {
        super(name, options);

        this.version(1).stores({
            project: 'id, settings',
            entity: 'id, linkedTo, project, blob',

            file: 'id, project, name, creationDate, parent, instanceOf, type, size, previewImage',
            blob: 'id, parentFile, data, partIndex'
        });

        this.open()
            .then(() => this._ready = true)
    }

    get ready() {
        return this._ready
    }

    // BLOB
    async getBlob(fileID) {
        let response = ''
        let data = await this.table('blob')
            .where({parentFile: fileID})
            .toArray()

        data.sort(sortBlobs)
        data.forEach(d => {
            response += d.data
        })

        return response
    }

    async postBlob(parentFile, data) {
        const parts = splitData(data)

        let promises = []
        parts.forEach((p, i) => {
            promises.push(new Promise(resolve => {
                this.table('blob')
                    .add({
                        id: randomID(),
                        parentFile,
                        data: p,
                        partIndex: i
                    })
                    .then(() => resolve())
                    .catch(() => resolve())
            }))
        })

        return Promise.all(promises)
    }

    async _deleteBlobParts(fileID) {
        const existing = await this.table('blob')
            .where({parentFile: fileID})
            .toArray()
        let promises = []
        existing.forEach(e => {
            promises.push(new Promise(resolve => {
                this.table('blob')
                    .delete(e.id)
                    .then(() => resolve())
                    .catch(() => resolve())
            }))
        })
        return Promise.all(promises)
    }

    async updateBlob(fileID, newData) {
        await this._deleteBlobParts(fileID)
        return await this.postBlob(fileID, newData)
    }

    // FILE
    async listFiles(filters = {}) {
        return this.table('file')
            .where({...filters})
            .toArray();
    }

    async listFilesWithFilter(callback) {
        return this.table('file').filter(callback).toArray()
    }

    async deleteFile(fileID) {
        let promises = []
        const dependents = await this.listFiles({parent: fileID})


        dependents.forEach(d => {
            promises.push(new Promise(r => {
                this.deleteFile(d.id)
                    .then(() => r())
                    .catch(() => r())
            }))
        })
        promises.push(new Promise(r => {
            this._deleteBlobParts(fileID)
                .then(() => r())
                .catch(() => r())
        }))

        promises.push(new Promise(r => {
            this.table('file').delete(fileID)
                .then(() => r())
                .catch(() => r())
        }))
        return Promise.all(promises)
    }

    async updateFile(fileID, data) {
        return this.table('file').update(fileID, data)
    }

    async getFile(fileID) {
        return this.table('file').get(fileID)
    }

    async getFileWithBlob(fileID) {

        const blob = await this.getBlob(fileID)
        const file = await this.table('file').get(fileID)
        return {
            ...file,
            blob
        }
    }

    async postFile(fileData) {
        return this.table('file').add(fileData)
    }

    async postFileWithBlob(fileData, blob) {
        await this.table('file').add(fileData)
        await this.postBlob(fileData.id, blob)
    }

    // PROJECT
    async getProject(projectID) {
        return this.table('project').get(projectID)
    }

    async postProject(projectData) {
        return this.table('project').add(projectData)
    }

    async deleteProject(projectID) {
        let promises = []

        const files = await this.listFiles({project: projectID})
        files.forEach(f => promises.push(
            new Promise(r => {
                this.deleteFile(f.id)
                    .then(() => r())
                    .catch(() => r())
            })
        ))
        promises.push(new Promise(r => {
            this.table('project')
                .delete(projectID)
                .then(() => r())
                .catch(() => r())
        }))

        return Promise.all(promises)
    }

    async updateProject(projectID, data) {
        return this.table('project').update(projectID, data)
    }

    async listProject() {
        return this.table('project').toArray()
    }

    // ENTITIES
    async listEntities(projectID) {
        return this.table('entity').where({project: projectID}).toArray()
    }

    async postEntity(data) {
        return this.table('entity').add(data)
    }

    async updateEntity(id, data) {
        return this.table('entity').update(id, data)
    }

    async deleteEntity(id) {
        return this.table('entity').delete(id)
    }
}