import PropTypes from "prop-types";
import styles from './styles/Preferences.module.css'
import {Button, Modal, Tab, VerticalTabs} from "@f-ui/core";
import {useContext, useState} from "react";
import ThemeProvider from "../../views/editor/hook/ThemeProvider";


export default function Preferences(props) {
    const [openTab, setOpenTab] = useState(0)
    const theme = useContext(ThemeProvider)

    const [changed, setChanged] = useState(false)
    return (
        <Modal open={props.settings.viewPreferences} handleClose={() => props.settings.setViewPreferences(false)}
               className={styles.wrapper}>

            <VerticalTabs open={openTab} setOpen={setOpenTab} className={styles.tabs}>
                <Tab label={'Theme'} className={styles.tab}>
                    <Button
                        onClick={() => {
                            setChanged(true)
                            theme.setDark(!theme.dark)
                        }}
                        className={styles.button}
                        variant={"outlined"}
                    >
                        <span className={'material-icons-round'}>{theme.dark ? 'dark_mode' : 'light_mode'}</span>
                        {theme.dark ? 'Dark theme' : 'Light theme'}
                    </Button>
                </Tab>
            </VerticalTabs>
            <div className={styles.submitWrapper}>
                <Button
                    disabled={!changed}
                    onClick={() => {
                        setChanged(false)
                        props.serializer.saveSettings()
                        props.settings.setViewPreferences(false)
                    }}
                    variant={'filled'} className={styles.submitButton}>
                    Ok
                </Button>

                <Button
                    className={styles.submitButton}
                    variant={"outlined"}
                    onClick={() => {
                        props.settings.setViewPreferences(false)
                    }}
                >
                    Cancel
                </Button>
            </div>

        </Modal>
    )
}
Preferences.propTypes = {

    serializer: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
}