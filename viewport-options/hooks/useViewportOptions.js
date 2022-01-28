import {useState} from "react";

export default function useViewportOptions() {
    const [fov, setFov] = useState(1.57)
    const [fps, setFps] = useState(false)
    const [res, setRes] = useState(100)
    const [fullscreen, setFullscreen] = useState(false)

    return {
        fov, setFov,
        fps, setFps,
        res, setRes,
        fullscreen, setFullscreen
    }
}