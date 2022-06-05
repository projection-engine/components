import {useLayoutEffect, useRef} from "react"

import styles from "./styles/Loader.module.css"
import randomInRange from "./utils/randomInRange"


export default function useLoader(dark, accentColor) {
    const renderTarget = useRef()
    useLayoutEffect(() => {
        const e = document.createElement("div")
        e.classList.add(styles.wrapper)
        e.style.display = "none"
        document.body.appendChild(e)
        renderTarget.current = e
        return () => {
            document.body.removeChild(renderTarget.current)
        }
    }, [])

    const render = () => {
        if (Object.keys(events).length > 0)
            renderTarget.current.innerHTML = `
                    <div
                        class="${styles.loader}"
                        style="background: ${dark ? "#303030" : "white"}; color: ${dark ? "white" : "#333333"}"
                    >
                        ${Object.keys(events).map((e, i) => `
                            <div class="${styles.loadInfo}">
                                ${e}
                                <div data-index="${i}" class="${styles.loaderBar}" style="background: ${dark ? "#111111" : " #ced4da"};">
                                    <div class="${styles.loading}" style="animation-delay: ${i * 100}ms; background: ${accentColor ? accentColor : "#0095ff"}; --animationSpeed: ${randomInRange(2, 1) + "s"};"></div>
                                </div>
                            </div>        
                        `).join(" ")}
                    </div>
                `
        else
            renderTarget.current.style.display = "none"
    }
    let events = {}
    const pushEvent = (key) => {
        events[key] = true
        renderTarget.current.style.display = "block"
        render()
    }
    const getEvent = (key) => {
        return !events[key]
    }
    const finishEvent = (key) => {
        delete events[key]
        render()
    }

    return {
        events,
        pushEvent,
        getEvent,
        finishEvent
    }
}

