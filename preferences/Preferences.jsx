import PropTypes from "prop-types";
import styles from './styles/Preferences.module.css'
import {Button, Modal, Tab, VerticalTabs} from "@f-ui/core";
import {useContext, useState} from "react";
import SettingsProvider from "../../services/hooks/SettingsProvider";
import ThemeProvider from "../../services/hooks/ThemeProvider";
import ColorPicker from "../color/ColorPicker";


export default function Preferences(props) {
    const [openTab, setOpenTab] = useState(0)
    const theme = useContext(ThemeProvider)
    const settingsContext = useContext(SettingsProvider)
    const [changed, setChanged] = useState(false)

    return (
        <Modal
            blurIntensity={'5px'}
            open={settingsContext.preferencesVisibility}
            handleClose={() => null}
            className={styles.wrapper}
        >
            <ThemeProvider.Provider value={theme}>
                <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}} className={theme.themeClass}>
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
                                <span
                                    className={'material-icons-round'}>{theme.dark ? 'dark_mode' : 'light_mode'}</span>
                                {theme.dark ? 'Dark theme' : 'Light theme'}
                            </Button>
                            <ColorPicker
                                submit={color => {
                                    theme.setAccentColor(color)
                                }}
                                value={theme.accentColor}
                                label={'System color'}/>
                        </Tab>
                    </VerticalTabs>
                    <div className={styles.submitWrapper}>


                        <Button
                            className={styles.submitButton}
                            variant={"filled"}
                            onClick={() => {
                                settingsContext.preferencesVisibility = false
                            }}
                        >
                            Ok
                        </Button>
                    </div>
                </div>
            </ThemeProvider.Provider>
        </Modal>
    )
}
Preferences.propTypes = {

    serializer: PropTypes.object,

}