import styles from "../styles/Actions.module.css"
import React from "react"
import {Button, Icon} from "@f-ui/core"
import PropTypes from "prop-types"

const {ipcRenderer} = window.require("electron")


export default function Actions(props){
    return (
        <div className={styles.wrapper}>
            <Button onClick={() => ipcRenderer.send(props.pageInfo.minimizeEvent)} className={styles.button} styles={{"--pj-accent-color": "#0095ff"}}>
                <Icon styles={{fontSize: "1.1rem"}} >minimize</Icon>
            </Button>
            <Button onClick={() => ipcRenderer.send(props.pageInfo.maximizeEvent)} className={styles.button} styles={{"--pj-accent-color": "#0095ff"}}>
                <Icon styles={{fontSize: "1rem"}} >check_box_outline_blank</Icon>
            </Button>
            <Button onClick={() => ipcRenderer.send((props.pageInfo.closeEvent))} className={styles.button} styles={{"--pj-accent-color": "red"}}>
                <Icon styles={{fontSize: "1.2rem"}} >close</Icon>
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