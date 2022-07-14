import {useEffect} from "react"

export default function useContextTarget(targetRef, options, triggers) {
    useEffect(() => {
        console.log(targetRef)
        window.contextMenu.targets[typeof targetRef === "string" ? targetRef : targetRef.id] = {
            options: options,
            triggers: triggers
        }
    }, [triggers, options])
}