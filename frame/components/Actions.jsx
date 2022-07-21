import styles from "../styles/Actions.module.css"
import React from "react"
import {Button, Icon} from "@f-ui/core"
import PropTypes from "prop-types"

const {ipcRenderer} = window.require("electron")


export default function Actions(props) {
    return (
        <div className={styles.wrapper}>
            {props.pageInfo.minimizeEvent ?
                <Button
                    onClick={() => {
                        if (typeof props.pageInfo.minimizeEvent === "function")
                            props.pageInfo.minimizeEvent()
                        else
                            ipcRenderer.send(props.pageInfo.minimizeEvent)
                    }}
                    className={styles.button}
                    styles={{"--pj-accent-color": "#0095ff"}}
                >
                    <Icon styles={{fontSize: "1.1rem"}}>minimize</Icon>
                </Button>
                :
                null
            }
            {props.pageInfo.maximizeEvent ?
                <Button
                    onClick={() => {
                        if (typeof props.pageInfo.maximizeEvent === "function")
                            props.pageInfo.maximizeEvent()
                        else
                            ipcRenderer.send(props.pageInfo.maximizeEvent)
                    }}
                    className={styles.button}
                    styles={{"--pj-accent-color": "#0095ff"}}>
                    <Icon styles={{fontSize: "1rem"}}>check_box_outline_blank</Icon>
                </Button>
                :
                null
            }
            {props.pageInfo.closeEvent ?
                <Button
                    onClick={() => {
                        if (typeof props.pageInfo.closeEvent === "function")
                            props.pageInfo.closeEvent()
                        else
                            ipcRenderer.send(props.pageInfo.closeEvent)
                    }}
                    className={styles.button}
                    styles={{"--pj-accent-color": "red"}}>
                    <Icon styles={{fontSize: "1.2rem"}}>close</Icon>
                </Button>
                :
                null
            }
        </div>
    )
}

Actions.propTypes = {
    pageInfo: PropTypes.shape({
        pageID: PropTypes.string,
        closeEvent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        minimizeEvent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        maximizeEvent: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    }),
}