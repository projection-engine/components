import PropTypes from "prop-types";
import styles from '../styles/Mesh.module.css'

export default function Controls(props){
    return (
        <div className={styles.controlsWrapper}>

        </div>
    )
}

Controls.propTypes={
    engine: PropTypes.object
}