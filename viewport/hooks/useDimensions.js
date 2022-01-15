import {useEffect, useState} from "react";
import PostProcessing from "../../../core/renderer/buffers/PostProcessing";

export default function useDimensions(id, engine) {
    let resizeObs
    const [bound , setBound] = useState(false)
    const callback = () => {
        const target = document.getElementById(id + '-canvas')
        if (target) {
            const bBox = target.parentNode.getBoundingClientRect()
            const newWidth = bBox.width, newHeight = bBox.height
            engine.setPostProcessing(new PostProcessing(engine.gpu))
            engine?.gpu.viewport(0, 0, newWidth, newHeight)
            target.width = newWidth
            target.height = newHeight

        }
    }
    useEffect(() => {
        const target = document.getElementById(id + '-canvas')
        if (target && engine.gpu && !bound && engine.ready) {
            if (!resizeObs)
                resizeObs = new ResizeObserver(callback)
            resizeObs.observe(target.parentNode)
            resizeObs.observe(target.parentNode.lastChild)
            callback(true)
            setBound(true)
        }
    }, [id, engine])

    useEffect(() => {
        setBound(false)
    },[])

}