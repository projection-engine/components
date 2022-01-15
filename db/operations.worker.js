onmessage = event => {
    const data = event.data
    switch (data.type){
        case 'get':{
            data.db.table(data.params.table).get(data.params.query).then(res => {
                postMessage(res)
            }).catch(error => {
                postMessage(null)
            })
            break
        }
        case 'list':{
            data.db.table(data.params.table).toArray().then(res => {
                data.onmessage = res
                postMessage(data)
            }).catch(error => {
                data.onmessage = []
                postMessage(data)
            })
            break
        }
        case 'delete':{
            data.db.table(data.params.table).delete(data.params.query).then(res => {
                data.onmessage = true
                postMessage(data)
            }).catch(error => {
                data.onmessage = false
                postMessage(data)
            })
            break
        }
        case 'update':{
            data.db.table(data.params.table).update(data.params.query, data.params.data).then(res => {
                data.onmessage = true
                postMessage(data)
            }).catch(error => {
                data.onmessage = false
                postMessage(data)
            })
            break
        }
        case 'insert':{
            data.db.table(data.params.table).add(data.params.data).then(res => {
                data.onmessage = true
                postMessage(data)
            }).catch(error => {
                data.onmessage = false
                postMessage(data)
            })
            break
        }
        default:
            data.onmessage = false

            postMessage(data)
            break
    }
}
