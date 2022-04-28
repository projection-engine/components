import styles from "../styles/ViewportOptions.module.css";
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