import PropTypes from "prop-types";
import styles from './styles/Image.module.css'

export default function ImageVisualizer(props) {
    return (
        <div className={styles.wrapper}>
            {props.data.blob ? <img src={props.data.blob} alt={props.data.name} className={styles.image}/>
            :
                <div className={styles.image} style={{backgroundColor: '#e0e0e0'}}/>
            }
            <label className={styles.label} title={props.data.name}>
                {props.data.name}
            </label>
            {/*<ToolTip justify={"middle"} align={"middle"} content={props.data.name}/>*/}
        </div>
    )
}
ImageVisualizer.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.string,
        blob: PropTypes.string,
        creationDate: PropTypes.string
    })
}