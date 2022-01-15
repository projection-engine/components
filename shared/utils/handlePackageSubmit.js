export default function handlePackageSubmit(pack, hook, file, setAlert) {
    hook.db.table('file').update(file, {blob: JSON.stringify(pack)}).then(() => {
        setAlert({
            type: 'success',
            message: 'Saved'
        })
    }).catch(error => {
        setAlert({
            type: 'error',
            message: 'Error during saving process'
        })
    })
}