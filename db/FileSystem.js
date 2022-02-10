import FileBlob from "../../services/workers/FileBlob";
import MeshParser from "../../services/engine/utils/MeshParser";
import randomID from "../../pages/project/utils/misc/randomID";
import ImageProcessor from "../../services/workers/ImageProcessor";

const fs = window.require('fs')
const path = window.require('path')

export default class FileSystem {
    constructor(projectID) {

        this._path = (localStorage.getItem('basePath') + '\\projects\\' + projectID).replace(/\\\\/g, '\\')
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
                            resolve(JSON.parse(res.toString()))
                        } catch (e) {
                            resolve(null)
                        }
                    })
                    break
                case 'base64':
                    fs.readFile(pathName, 'base64', (e, res) => {
                        if (!e)
                            resolve(res.toString())
                        else
                            resolve(null)
                    })
                    break
                default:
                    fs.readFile(pathName, (e, res) => {
                        if (!e)
                            resolve(res.toString())
                        else
                            resolve(null)
                    })
                    break
            }
        })
    }

    async findRegistry(p) {
        return new Promise(resolve => {
            fs.readdir(this.path + '\\assetsRegistry', (e, res) => {
                if (res) {
                    Promise
                        .all(
                            res.map(data => {
                                return this.readRegistryFile(data.replace('.reg', ''))
                            })
                        )
                        .then(registryData => {
                            const parsedPath = path.resolve(p)

                            resolve(registryData.filter(f => f !== undefined).find(f => {
                                return parsedPath.includes(f.path)
                            }))
                        })
                } else resolve()
            })
        })
    }

    async deleteFile(pathName, absolute) {
        const currentPath = absolute ? pathName : (this._path + pathName)
        return new Promise(resolve => {
            fs.rm(currentPath, () => {
                this.findRegistry(currentPath)
                    .then(rs => {
                        console.trace(rs)
                        if (rs) {
                            fs.rm(this.path + '\\assetsRegistry\\' + rs.id + '.reg', () => {
                                resolve()
                            })
                        } else resolve()
                    })


            })
        })
    }

    async importFile(file, path) {
        return new Promise(resolve => {
            const newRoot = path + '\\' + file.name.split(/\.([a-zA-Z0-9]+)$/)[0]
            const fileID = randomID()
            switch (file.name.split(/\.([a-zA-Z0-9]+)$/)[1]) {
                case 'png':
                case 'jpg':
                case 'jpeg': {
                    FileBlob
                        .loadAsString(file, false, true)
                        .then(res => {

                            const promises = [
                                new Promise(r => {
                                    fs.writeFile(
                                        newRoot + `.pimg`,
                                        res,
                                        () => {
                                            r()
                                        })
                                }),
                                new Promise(r => {
                                    if (!fs.existsSync(this.path + '\\previews\\'))
                                        fs.mkdirSync(this.path + '\\previews\\')
                                    ImageProcessor.reduceImage(res).then(reduced => {
                                        fs.writeFile(
                                            this.path + '\\previews\\' + fileID + `.preview`,
                                            reduced,
                                            (error) => {
                                                console.trace(error)
                                                r()
                                            })
                                    })
                                }),
                                new Promise(r => {
                                    fs.writeFile(
                                        this.path + '\\assetsRegistry\\' + fileID + `.reg`,
                                        JSON.stringify({
                                            id: fileID,
                                            path: newRoot.replace(this.path + '\\assets\\', '') + `.pimg`
                                        }),
                                        (error) => {

                                            r()
                                        })
                                })
                            ]

                            Promise.all(promises)
                                .then(() => {
                                    resolve()
                                })
                        })
                    break
                }
                case 'obj':
                    FileBlob
                        .loadAsString(file)
                        .then(res => {
                            const data = MeshParser
                                .parseObj(res)

                            const promises = [
                                new Promise(r => {
                                    fs.writeFile(
                                        newRoot + `.mesh`,
                                        JSON.stringify(data),
                                        () => {
                                            r()
                                        })
                                }),
                                new Promise(r => {
                                    fs.writeFile(
                                        this.path + '\\assetsRegistry\\' + fileID + `.reg`,
                                        JSON.stringify({
                                            id: fileID,
                                            path: newRoot.replace(this.path + '\\assets\\', '') + `.mesh`
                                        }),
                                        () => {
                                            r()
                                        })
                                })
                            ]

                            Promise.all(promises)
                                .then(() => {
                                    resolve()
                                })
                        })
                    break
                case 'gltf':
                    fs.mkdir(newRoot, (err) => {
                        if (!err)
                            FileBlob
                                .loadAsString(file)
                                .then(res => {
                                    MeshParser
                                        .parseGLTF(res)
                                        .then(data => {
                                            if (data) {
                                                const promises = data.map(d => {
                                                    return [
                                                        new Promise(r => {
                                                            fs.writeFile(
                                                                newRoot + `\\${d.name}.mesh`,
                                                                JSON.stringify(d.data),
                                                                () => {
                                                                    r()
                                                                });
                                                        }),
                                                        new Promise(r => {
                                                            const fID = randomID()
                                                            fs.writeFile(
                                                                this.path + '\\assetsRegistry\\' + fID + `.reg`,
                                                                JSON.stringify({
                                                                    id: fID,
                                                                    path: newRoot.replace(this.path + '\\assets\\', '') + `\\${d.name}.mesh`
                                                                }),
                                                                () => {
                                                                    r()
                                                                })
                                                        })]
                                                })

                                                Promise.all(promises)
                                                    .then(() => {
                                                        resolve()
                                                    })
                                            }
                                        })
                                })
                        else
                            resolve(err)
                    })

                    break
            }
        })
    }

    async readRegistryFile(id) {
        return new Promise(resolve => {
            fs.readFile(this.path + '\\assetsRegistry\\' + id + '.reg', (e, res) => {
                if (!e) {
                    try {
                        resolve(JSON.parse(res.toString()))
                    } catch (e) {
                        resolve()
                    }
                } else
                    resolve()

            })
        })
    }

    assetExists(path) {
        return fs.existsSync(this.path + '\\assets\\' + path)
    }

    async writeAsset(path, fileData, previewImage) {
        const fileID = randomID()
        return new Promise(resolve => {
            const promises = [
                new Promise(resolve1 => {
                    fs.writeFile(this.path + '\\assets\\' + path, fileData, (err) => {
                        if (!previewImage)
                            resolve1()
                        else {
                            if (!fs.existsSync(this.path + '\\previews'))
                                fs.mkdirSync(this.path + '\\previews')
                            fs.writeFile(this.path + '\\previews\\' + path + '.preview', previewImage, () => {
                                resolve1()
                            })
                        }

                    })
                }),

                new Promise(resolve1 => {

                    fs.writeFile(this.path + '\\assetsRegistry\\' + fileID + '.reg', JSON.stringify({
                        id: fileID,
                        path: path
                    }), (err) => {

                        resolve1()
                    })
                })
            ]

            Promise.all(promises)
                .then(() => {
                    resolve()
                })

        })
    }

    async updateAsset(path, fileData, previewImage) {
        return new Promise(resolve => {
            if (!fs.existsSync(this.path + '/assets'))
                fs.mkdir(this.path + '/assets', () => null)
            if (!fs.existsSync(this.path + '/preview'))
                fs.mkdir(this.path + '/preview', () => null)
            this.writeAsset(path, fileData, previewImage)
                .then(() => resolve())
        })
    }

    async updateEntity(entity) {

        return new Promise(resolve => {
            if (!fs.existsSync(this.path + '\\logic'))
                fs.mkdir(this.path + '\\logic', () => null)
            fs.writeFile(this.path + '\\logic\\' + entity.id + '.entity', JSON.stringify(entity), (e) => {
                resolve()
            })
        })
    }

    async updateProject(meta, settings) {
        return Promise.all([
            new Promise(resolve => {
                if (meta)

                    fs.writeFile(this.path + '/.meta', JSON.stringify(meta), () => {
                        resolve()
                    })

                else
                    resolve()
            }),

            new Promise(resolve => {
                if (settings) {
                    let sett = {...settings}
                    delete sett.type
                    delete sett.data

                    fs.writeFile(this.path + '/.settings', JSON.stringify(sett), () => {
                        resolve()
                    })
                } else
                    resolve()
            })
        ])
    }


    dirStructure(dir, done) {
        let results = [];
        if (fs.existsSync(dir))
            fs.readdir(dir, (err, list) => {
                if (err) return done([]);
                let pending = list.length;
                if (!pending) return done(results);
                list.forEach((file) => {
                    file = path.resolve(dir, file);
                    fs.stat(file, (err, stat) => {
                        results.push(file);
                        if (stat && stat.isDirectory()) {
                            this.dirStructure(file, (res) => {
                                results = results.concat(res)
                                if (!--pending) done(results)
                            })
                        } else if (!--pending) done(results)
                    })
                })
            })
        else
            done([])

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

    readRegistry() {
        return new Promise(resolve => {
            fs.readdir(this.path + '\\assetsRegistry\\', (e, res) => {
                if (!e) {
                    let promises = res.map(f => {
                        return new Promise(resolve1 => {
                            const registryPath = this.path + '\\assetsRegistry\\' + f
                            fs.readFile(registryPath, (e, registryFile) => {
                                if (!e)
                                    resolve1({
                                        ...JSON.parse(registryFile.toString()),
                                        registryPath
                                    })
                                else
                                    resolve1()
                            })
                        })
                    })

                    Promise.all(promises).then(registryFiles => {
                        resolve(registryFiles
                            .filter(f => f !== undefined))
                    })
                } else
                    resolve([])
            })
        })
    }

    async rename(from, to, registry) {
        let newRegistry = registry
        if (!registry)
            newRegistry = await this.readRegistry()


        return new Promise(rootResolve => {
            fs.lstat(from, (er, stat) => {
                if (stat !== undefined && stat.isDirectory())
                    fs.mkdir(to, () => {
                        fs.readdir(from, (error, res) => {
                            if (res) {
                                let promises = []
                                res.forEach(file => {
                                    const oldPath = from + `/${file}`
                                    const newPath = to + `/${file}`;

                                    if (fs.lstatSync(oldPath).isDirectory())
                                        promises.push(this.rename(oldPath, newPath, newRegistry))
                                    else
                                        promises
                                            .push(
                                                new Promise(resolve => {
                                                    fs.rename(
                                                        oldPath,
                                                        newPath,
                                                        (err) => {
                                                            resolve(err)
                                                        }
                                                    )
                                                }),

                                                // UPDATE REGISTRY
                                                new Promise(resolve => {
                                                    const regData = newRegistry.find(reg => {
                                                        return reg.path.replaceAll(/\\\\/g, '\\') === oldPath.replace(this.path + '\\assets\\', '').replaceAll('/', '\\')
                                                    })

                                                    if (regData) {
                                                        fs.writeFile(regData.registryPath, JSON.stringify({
                                                            id: regData.id,
                                                            path: newPath.replace(this.path + '\\assets\\', '').replaceAll('/', '\\')
                                                        }), (error) => {
                                                            console.trace(error)
                                                            resolve(regData.registryPath, regData)
                                                        })
                                                    } else
                                                        resolve()
                                                })
                                            )
                                })

                                Promise.all(promises)
                                    .then((errors) => {
                                        fs.rm(from, {recursive: true, force: true}, (e) => {
                                            rootResolve(errors)
                                        })

                                    })
                            } else
                                rootResolve(error)
                        })
                    })
                else if (stat !== undefined) {
                    // RENAME SINGLE FILE
                    let promises = [
                        new Promise(resolve => {
                            fs.rename(
                                from,
                                to,
                                (err) => {
                                    resolve(err)
                                }
                            )
                        }),

                        // UPDATE REGISTRY
                        new Promise(resolve => {
                            const regData = newRegistry.find(reg => {
                                return reg.path.replaceAll(/\\\\/g, '\\') === from.replace(this.path + '\\assets\\', '').replaceAll('/', '\\')
                            })

                            if (regData) {
                                fs.writeFile(regData.registryPath, JSON.stringify({
                                    id: regData.id,
                                    path: to.replace(this.path + '\\assets\\', '').replaceAll('/', '\\')
                                }), (error) => {
                                    resolve(regData.registryPath, regData)
                                })
                            } else
                                resolve()
                        })
                    ]


                    Promise.all(promises)
                        .then((errors) => {
                            console.trace(errors)
                            rootResolve()
                        })
                } else
                    rootResolve(er)
            })
        })

    }

    static async createProject(name) {
        return new Promise(resolve => {
            const projectID = randomID(), projectPath = localStorage.getItem('basePath') + 'projects\\' + projectID
            if (!fs.existsSync(localStorage.getItem('basePath') + 'projects'))
                fs.mkdirSync(localStorage.getItem('basePath') + 'projects')

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