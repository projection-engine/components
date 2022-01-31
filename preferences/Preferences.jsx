import PropTypes from "prop-types";
import styles from './styles/Preferences.module.css'
import {Modal} from "@f-ui/core";

export default function Preferences(props){
    return (
        <Modal open={props.viewportHook.viewPreferences} handleClose={() => props.viewportHook.setViewPreferences(false)} className={styles.wrapper}>
            <div className={styles.tabs}>

            </div>
        </Modal>
    )
}
Preferences.propTypes={
    viewportHook: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
}