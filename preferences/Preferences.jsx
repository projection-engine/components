import styles from './styles/Preferences.module.css'
import {Accordion, AccordionSummary, Button, Modal, Tab, VerticalTabs} from "@f-ui/core";
import React, {useContext, useState} from "react";
import SettingsProvider from "../../services/hooks/SettingsProvider";
import ThemeProvider from "../../services/hooks/ThemeProvider";
import ColorPicker from "../color/ColorPicker";
import Range from "../range/Range";


export default function Preferences() {
    const [openTab, setOpenTab] = useState(0)
    const settingsContext = useContext(SettingsProvider)
    const theme = useContext(ThemeProvider)

    return (
        <Modal
            blurIntensity={'1px'}
            open={settingsContext.preferencesVisibility}
            handleClose={() => settingsContext.preferencesVisibility = false}
            className={styles.wrapper}
        >

            <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}
                 className={theme.themeClass}>
                <VerticalTabs open={openTab} setOpen={setOpenTab} className={styles.tabs}>
                    <Tab label={'Theme'} className={styles.tab}>
                        <Button
                            onClick={() => theme.setDark(!theme.dark)}
                            className={styles.button}
                            variant={"outlined"}
                        >
                                <span
                                    className={'material-icons-round'}>{theme.dark ? 'dark_mode' : 'light_mode'}</span>
                            {theme.dark ? 'Dark theme' : 'Light theme'}
                        </Button>
                        <Accordion>
                            <AccordionSummary>
                                System color
                            </AccordionSummary>
                            <div style={{padding: '4px'}}>
                                <ColorPicker
                                    submit={color => {
                                        theme.setAccentColor(color)
                                    }}
                                    value={theme.accentColor}
                                />
                            </div>
                        </Accordion>
                    </Tab>
                    <Tab label={'Viewport'} className={styles.tab}>
                        <Accordion>
                            <AccordionSummary styles={{maxWidth: '100%', overflow: 'hidden'}}>
                                Gamma
                            </AccordionSummary>
                            <div style={{padding: '4px'}}>
                                <Range
                                    accentColor={'yellow'}
                                    value={settingsContext.gamma}
                                    minValue={.1}
                                    maxValue={10}
                                    handleChange={e => settingsContext.gamma = e}/>
                            </div>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary styles={{maxWidth: '100%', overflow: 'hidden'}}>
                                Exposure
                            </AccordionSummary>
                            <div style={{padding: '4px'}}>
                                <Range
                                    accentColor={'yellow'}
                                    value={settingsContext.exposure}
                                    minValue={.1}
                                    maxValue={10}
                                    handleChange={e => settingsContext.exposure = e}/>
                            </div>
                        </Accordion>
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

        </Modal>
    )
}
