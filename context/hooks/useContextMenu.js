import useDirectState from "../../hooks/useDirectState"

export default function useContextMenu(){
    const [state] = useDirectState({
        options: [],
        element: undefined,
        target: {}
    })
    return state
}