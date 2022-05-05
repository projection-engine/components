import styles from './styles/GlobalOptions.module.css'
import {Button, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import {useContext, useMemo} from "react";
import SettingsProvider from "../../pages/project/hooks/SettingsProvider";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import WebBuilder from "../../builders/web/WebBuilder";
const {shell} = window.require('electron')
export default function GlobalOptions(props) {
    const settingsContext = useContext(SettingsProvider)
    const exporter = useMemo(() => {
        if (props.quickAccess.fileSystem)
            return new WebBuilder(props.quickAccess.fileSystem)
        return undefined
    }, [props.quickAccess])
    return (
        <div className={styles.wrapper}>
            <Link to={'/'}>
                <Button
                    className={styles.logoWrapper}>
                    {/*<span className={'material-icons-round'}>home</span>*/}
                    Projection
                </Button>
            </Link>
            <Dropdown className={styles.dropdownLabel} align={'bottom'} justify={'start'}>
                File
                <DropdownOptions>
                    <DropdownOption option={{
                        label: 'Save',
                        icon: <span className={'material-icons-round'} style={{fontSize: '1rem'}}>save</span>,
                        shortcut: 'Ctrl + S',
                        onClick: () => props.save()
                    }}/>

                    <DropdownOption option={{
                        label: 'Export project',
                        icon: <span className={'material-icons-round'} style={{fontSize: '1rem'}}>save_alt</span>,
                        onClick: () => {
                            exporter.build({
                                entities: props.engine.entities,
                                meshes: props.engine.meshes,
                                materials: props.engine.materials,
                                scripts: props.engine.scripts
                            })
                                .then(() => {

                                    props.setAlert({
                                        type: 'success',
                                        message: 'Successfully exported'
                                    })
                                    setTimeout(() => {
                                        shell.openPath(props.quickAccess.fileSystem.path + '\\out\\web' ).catch()
                                    }, 2000)
                                })
                                .catch(() => props.setAlert({type: 'error', message: 'Error during packaging process'}))
                        }
                    }}/>

                    <DropdownOption option={{

                        label: 'Preferences',
                        icon: <span className={'material-icons-round'} style={{fontSize: '1rem'}}>settings</span>,
                        shortcut: 'Ctrl + alt + S',
                        onClick: () => settingsContext.preferencesVisibility = true
                    }}/>
                </DropdownOptions>
            </Dropdown>
            <Dropdown className={styles.dropdownLabel} align={'bottom'} justify={'start'}>
                Editor
                <DropdownOptions>
                    <DropdownOption option={{
                        label: 'Show scene options',
                        icon: settingsContext.sceneVisibility ? <span className={'material-icons-round'}
                                                                      style={{fontSize: '1rem'}}>check</span> : undefined,
                        keepAlive: true,
                        onClick: () => settingsContext.sceneVisibility = !settingsContext.sceneVisibility
                    }}/>

                    <DropdownOption option={{
                        label: 'Show files',
                        keepAlive: true,
                        icon: settingsContext.filesVisibility ? <span className={'material-icons-round'}
                                                                      style={{fontSize: '1rem'}}>check</span> : undefined,
                        onClick: () => settingsContext.filesVisibility = !settingsContext.filesVisibility
                    }}/>

                    <DropdownOption option={{
                        label: 'Show viewport options',
                        keepAlive: true,
                        icon: settingsContext.viewportOptionsVisibility ? <span className={'material-icons-round'}
                                                                                style={{fontSize: '1rem'}}>check</span> : undefined,
                        onClick: () => settingsContext.viewportOptionsVisibility = !settingsContext.viewportOptionsVisibility
                    }}/>
                    <DropdownOption option={{
                        label: 'Show camera coordinates',
                        keepAlive: true,
                        icon: settingsContext.cameraCoordsVisibility ? <span className={'material-icons-round'}
                                                                             style={{fontSize: '1rem'}}>check</span> : undefined,
                        onClick: () => settingsContext.cameraCoordsVisibility = !settingsContext.cameraCoordsVisibility
                    }}/>
                </DropdownOptions>
            </Dropdown>
            <Dropdown disabled={true} className={styles.dropdownLabel}>
                Help
            </Dropdown>
        </div>
    )
}

GlobalOptions.propTypes = {
    engine: PropTypes.object,
    setAlert: PropTypes.func,

    quickAccess: PropTypes.object,
    save: PropTypes.func
}