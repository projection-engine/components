import styles from '../styles/Actions.module.css'
import {Button} from "@f-ui/core";
import PropTypes from "prop-types";
const {ipcRenderer} = window.require('electron')


export default function Actions(props){
    return (
        <div className={styles.wrapper}>
            <Button onClick={() => ipcRenderer.send(props.pageInfo.minimizeEvent)} className={styles.button} styles={{'--fabric-accent-color': "#0095ff"}}>
                <span style={{fontSize: '1.1rem'}} className={'material-icons-round'}>minimize</span>
            </Button>
            <Button onClick={() => ipcRenderer.send(props.pageInfo.maximizeEvent)} className={styles.button} styles={{'--fabric-accent-color': "#0095ff"}}>
                <span style={{fontSize: '1rem'}} className={'material-icons-round'}>check_box_outline_blank</span>
            </Button>
            <Button onClick={() => ipcRenderer.send((props.pageInfo.closeEvent))} className={styles.button} styles={{'--fabric-accent-color': "red"}}>
                <span style={{fontSize: '1.2rem'}} className={'material-icons-round'}>close</span>
            </Button>
        </div>
    )
}

Actions.propTypes={
    pageInfo: PropTypes.shape({
        pageID: PropTypes.string,
        closeEvent: PropTypes.string,
        minimizeEvent: PropTypes.string,
        maximizeEvent: PropTypes.string
    }),
}