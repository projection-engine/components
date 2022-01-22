import {useEffect} from "react";

export default function useDimensions(id, engine) {
    let resizeObs

    const callback = () => {
        const target = document.getElementById(id + '-canvas')
        if (target) {
            const bBox = target.parentNode.getBoundingClientRect()
            const newWidth = bBox.width, newHeight = bBox.height
            engine?.gpu.viewport(0, 0, newWidth, newHeight)
            target.width = newWidth
            target.height = newHeight

        }
    }
    useEffect(() => {
        const target = document.getElementById(id + '-canvas')
        if (target && engine.gpu && engine.ready) {
            if (!resizeObs)
                resizeObs = new ResizeObserver(callback)
            resizeObs.observe(target.parentNode)
            resizeObs.observe(target.parentNode.lastChild)
            callback(true)
        }
    }, [id, engine.gpu, engine.ready])

}