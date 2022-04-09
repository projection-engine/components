import {useEffect} from "react";

export default function useDimensions(id, engine) {
    let resizeObs

    const callback = (e) => {
        let isDocument = false
        Array.from(e).forEach(ev => {
            isDocument = isDocument || ev.target === document.body
        })

        const target = document.getElementById(id + '-canvas')

        if (target) {
            if(isDocument)
                target.parentNode.parentNode.style.width = '100%'
            const bBox = target.parentNode.getBoundingClientRect()
            target.width = bBox.width
            target.height = bBox.height

        }
    }
    useEffect(() => {
        const target = document.getElementById(id + '-canvas')
        if (target && engine.gpu ) {
            if (!resizeObs)
                resizeObs = new ResizeObserver(callback)
            resizeObs.observe(target.parentNode)
            resizeObs.observe(document.body)
            callback(true)
        }
    }, [id, engine.gpu])

}