import Dexie from "dexie";

const fs = window.require('fs')
const path = window.require('path')
const {app} = window.require('@electron/remote')

export default class FileSystem extends Dexie {
    constructor() {
        super('FS');


        this._path = app.getAppPath() + '/projects'
        this.version(1).stores({
            file: 'id, relativePath, creationDate, lastUpdate, name, type, size, previewImage',
        });

        this.open()
    }


    // BLOB
    async getBlob(fileID) {

        return new Promise(resolve => {
            this.table('file')
                .get(fileID)
                .then(data => {
                    if (data)
                        fs.readFile(
                            FileSystem.getFileName(this._path, data),
                            data?.type === 'image' ? 'base64' : 'utf8',
                            (err, data) => {
                                resolve(data)
                            })
                    else
                        resolve(null)
                })
        })
    }


    async updateBlob(fileID, newData) {
        return new Promise(resolve => {
            this.table('file')
                .get(fileID)
                .then(data => {
                    if (data)
                        fs.writeFile(
                            FileSystem.getFileName(this._path, data),
                            newData,
                            data?.type === 'image' ? 'base64' : 'utf8',
                            () => {
                                resolve(true)
                            });
                    else
                        resolve(false)
                })
        })
    }

    // FILE
    async listFiles(filters = {}) {
        // return this.table('file')
        //     .where({...filters})
        //     .toArray();
    }


    async deleteFile(fileID) {
        return new Promise(resolve => {
            this.table('file')
                .get(fileID)
                .then(data => {
                    if (data)
                        fs.unlink(FileSystem.getFileName(this._path, data), () => {
                            this.table('file')
                                .delete(data.id)
                                .then(() => resolve(true))
                                .catch(() => resolve(false))
                        })
                    else
                        resolve(false)
                })
        })
    }

    async updateFile(fileID, data) {
        // return this.table('file').update(fileID, data)
    }

    async getFile(fileID) {
        // return this.table('file').get(fileID)
    }

    async getFileWithBlob(fileID) {
        return new Promise(resolve => {
            this.table('file')
                .get(fileID)
                .then(data => {
                    if (data)
                        fs.readFile(
                            FileSystem.getFileName(this._path, data),
                            data?.type === 'image' ? 'base64' : 'utf8',
                            (d) => {
                                resolve({
                                    ...data,
                                    blob: d
                                })
                            });
                    else
                        resolve(null)
                })
        })
    }

    async postFile(fileData) {
        // return this.table('file').add(fileData)
    }

    async postFileWithBlob(fileData, blob) {
        // try {
        //     delete fileData.blob
        // } catch (e) {
        // }

        // await this.table('file').add(fileData)
        //
        // await this.postBlob(fileData.id, blob)
    }

    // PROJECT
    async getProject(projectID) {
        // return this.table('project').get(projectID)
    }

    async postProject(projectData) {
        // return this.table('project').add(projectData)
    }

    async deleteProject(projectID) {
        // let promises = []

        // const files = await this.listFiles({project: projectID})
        // files.forEach(f => promises.push(
        //     new Promise(r => {
        //         this.deleteFile(f.id)
        //             .then(() => r())
        //             .catch(() => r())
        //     })
        // ))
        // promises.push(new Promise(r => {
        //     this.table('project')
        //         .delete(projectID)
        //         .then(() => r())
        //         .catch(() => r())
        // }))
        //
        // return Promise.all(promises)
    }

    async updateProject(projectID, data) {
        // return this.table('project').update(projectID, data)
    }

    async listProject() {

        return new Promise(resolve => {
            resolve(FileSystem.fromDirectory(this._path, '.projection'))
        })
    }

    // ENTITIES
    async listEntities(projectID) {
        // return this.table('entity').where({project: projectID}).toArray()
    }

    async postEntity(data) {
        // return this.table('entity').add(data)
    }

    async updateEntity(id, data) {
        // return this.table('entity').update(id, data)
    }

    async deleteEntity(id) {
        // let promises = []
        //
        // const related = await this.table('entity').where({linkedTo: id}).toArray()
        // related.forEach(f => promises.push(
        //     new Promise(r => {
        //         this.deleteEntity(f.id)
        //             .then(() => r())
        //             .catch(() => r())
        //     })
        // ))
        // promises.push(new Promise(r => {
        //     this.table('entity').delete(id)
        //         .then(() => r())
        //         .catch(() => r())
        // }))
        //
        // return Promise.all(promises)
    }

    static getFileName(basePath, file) {
        return path + file?.relativePath + file?.name + '.' + file?.type
    }

    static fromDirectory(startPath, extension) {

        if (!fs.existsSync(startPath)) {
            return []
        }
        let res = []
        let files = fs.readdirSync(startPath);
        for (let i = 0; i < files.length; i++) {
            let filename = path.join(startPath, files[i]);
            let stat = fs.lstatSync(filename);
            if (stat.isDirectory())
                res.push(...FileSystem.fromDirectory(filename, extension))
            else if (filename.indexOf(extension) >= 0)
                res.push(files[i])
        }

        return res
    }
}