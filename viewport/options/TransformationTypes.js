import styles from "../styles/ViewportOptions.module.css";
import {Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import ROTATION_TYPES from "../../../engine/editor/gizmo/ROTATION_TYPES";
import PropTypes from "prop-types";

export default function TransformationTypes(props){
    const {settingsContext} = props
    return (
        <div style={{justifyContent: 'center'}} className={styles.align}>

        </div>
    )
}

TransformationTypes.propTypes={
    settingsContext: PropTypes.object
}