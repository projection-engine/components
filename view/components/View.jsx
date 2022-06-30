import React, {useMemo} from "react"
import ShaderEditor from "../../../project/components/blueprints/ShaderEditor"
import Hierarchy from "../../../project/components/hierarchy/Hierarchy"
import ComponentEditor from "../../../project/components/component/ComponentEditor"
import ContentBrowser from "../../../project/components/files/ContentBrowser"
import Console from "../../../project/components/console/Console"
import styles from "../styles/Views.module.css"
import PropTypes from "prop-types"

export default function View(props){
    const Component = useMemo(() => {
        switch (props.instance){
        case "blueprint":
            return ShaderEditor
        case "hierarchy":
            return Hierarchy
        case "component":
            return ComponentEditor
        case "files":
            return ContentBrowser
        case "console":
            return Console
        default:
            return null
        }
    }, [props.instance])

    if(Component)
        return (
            <div className={styles.view} style={props.styles}>
                <Component {...props}/>
            </div>
        )
    return null
}
View.propTypes={
    styles: PropTypes.object,
    extendView: PropTypes.func,
    orientation: PropTypes.string,
    switchView: PropTypes.func,
    hidden: PropTypes.bool,
    instance: PropTypes.oneOf(["hierarchy", "component", "files", "blueprint", "console"])
}
 