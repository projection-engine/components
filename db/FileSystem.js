import FileBlob from "../../services/workers/FileBlob";
import MeshParser from "../../services/engine/utils/MeshParser";
import randomID from "../../views/editor/utils/misc/randomID";

const fs = window.require('fs')
const path = window.require('path')

export default class FileSystem {
    constructor(projectID) {
        this._path = 'projects/' + projectID
    }

    get path() {
        return this._path
    }

    async readFile(pathName, type) {
        return new Promise(resolve => {
            switch (type) {
                case 'json':
                    fs.readFile(pathName, (e, res) => {
                        try {
                            resolve(res.toJSON())
                        } catch (e) {
                            resolve(null)
                        }
                    })
                    break
                case 'base64':
                    fs.readFile(pathName, 'base64', (e, res)=> {
                        resolve(res.toString())
                    })
                    break
                default:
                    fs.readFile(pathName, (e, res) => {
                        resolve(res.toString())
                    })
                    break
            }
        })
    }

    async updateFile(pathName, blob, asBinaryBuffer) {
        return new Promise((resolve, discard) => {
            this.deleteFile(pathName)
                .then(() => {
                    if (asBinaryBuffer) {
                        let data = blob.replace(/^data:image\/\w+;base64,/, "");
                        let buf = Buffer.from(data, 'base64');
                        fs.writeFile(
                            pathName,
                            buf,
                            () => {
                                resolve()
                            })
                    } else
                        fs.writeFile(
                            pathName,
                            blob,
                            () => {
                                resolve()
                            })
                })
                .catch(() => discard())
        })
    }

    async deleteFile(pathName) {
        return new Promise(resolve => {
            fs.unlink(this._path + pathName, () => {
                resolve()
            })
        })
    }

    static async importFile(file, projectID) {
        return new Promise(resolve => {
            switch (file.name.type.split('/')[1]) {
                case 'png':
                case 'jpg':
                case 'jpeg': {
                    FileBlob
                        .loadAsString(file, false, true)
                        .then(res => {
                            fs.writeFile(
                                `projects/${projectID}/assets/${file.name.split('.')[0]}.pimg`,
                                res,
                                () => {
                                    resolve()
                                });
                        })
                    break
                }
                case 'obj':
                    FileBlob
                        .loadAsString(file, false, true)
                        .then(res => {
                            const data = MeshParser
                                .parseObj(res)
                            fs.writeFile(
                                `projects/${projectID}/assets/${file.name}`,
                                JSON.stringify(data),
                                () => {
                                    resolve()
                                });
                        })
                    break
                case 'gltf':
                    FileBlob
                        .loadAsString(file, false, true)
                        .then(res => {
                            MeshParser
                                .parseGLTF(res)
                                .then(data => {
                                    fs.writeFile(
                                        `projects/${projectID}/assets/${file.name}`,
                                        JSON.stringify(data),
                                        () => {
                                            resolve()
                                        });
                                })
                        })
                    break
            }
        })
    }

    readProjectData() {
        const assets = this.fromDirectory(this._path + '/assets')
        const logic = this.fromDirectory(this._path + '/logic')
        const settings = fs.readFileSync(this._path + '/data/.settings')
        const meta = fs.readFileSync(this._path + '/data/.meta')

        return {
            assets,
            logic,
            settings,
            meta
        }
    }

    fromDirectory(startPath, extension) {

        if (!fs.existsSync(startPath)) {
            return []
        }
        let res = []
        let files = fs.readdirSync(startPath);
        for (let i = 0; i < files.length; i++) {
            let filename = path.join(startPath, files[i]);
            let stat = fs.lstatSync(filename);
            if (stat.isDirectory())
                res.push(...this.fromDirectory(filename, extension))
            else if (filename.indexOf(extension) >= 0)
                res.push(files[i])
        }

        return res
    }
    foldersFromDirectory(startPath) {

        if (!fs.existsSync(startPath)) {
            return []
        }
        let res = []
        let files = fs.readdirSync(startPath);
        for (let i = 0; i < files.length; i++) {
            let filename = path.join(startPath, files[i]);
            let stat = fs.lstatSync(filename);
            if (stat.isDirectory())
                res.push(filename)
        }

        return res
    }
    static async createProject(name){
        return new Promise(resolve => {
            const projectID = randomID(), projectPath = 'projects/' + projectID
            fs.mkdir(projectPath, () => {
                fs.writeFile(projectPath + '/.meta', JSON.stringify({
                    id: projectID,
                    name: name,
                    creationDate: new Date().toDateString()
                }), () => {
                    resolve(projectID)
                })
            })
        })

    }
}