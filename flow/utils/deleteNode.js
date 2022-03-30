import cloneClass from "../../../services/utils/misc/cloneClass";

export function removeLink (link, hook) {
    if (link) {
        let t = link.targetKey
        hook.setNodes(prev => {
            const clone = prev
            const target = clone.findIndex(p => link.target.includes(p.id))
            if(clone[target]) {
                const cloneC = cloneClass(clone[target])
                delete cloneC[t]
                clone[target] = cloneC
            }
            return clone
        })
        hook.setLinks(prev => {
            return prev.filter(l => {
                const p = {
                    target: l.target.id + l.target.attribute.key,
                    source: l.source.id + l.source.attribute.key
                }

                return !(p.target === link.target && p.source === link.source);
            })
        })
    }
}
export default function deleteNode(node, hook, setSelected){
    const target = node

    if(setSelected)
        setSelected([])

    let found, n = [...hook.links]
    do {
        found = n.findIndex(el => el.target.id === target || el.source.id === target)
        if (found > -1) {
            removeLink({
                target: n[found].target.id + n[found].target.attribute.key,
                source: n[found].source.id + n[found].source.attribute.key,
                targetKey: n[found].target.attribute.key,
                sourceKey: n[found].source.attribute.key
            }, hook)
            n.splice(found, 1)
        }
    } while (found > -1 || found === undefined)

    hook.setLinks(n)

    hook.setNodes(prev => {
        let n = [...prev]
        n.splice(n.findIndex(el => el.id === target), 1)
        return n
    })
}