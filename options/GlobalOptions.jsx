import styles from './styles/GlobalOptions.module.css'
import {Button, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import PropTypes from "prop-types";
import {useContext} from "react";
import GlobalProvider from "../../hook/GlobalProvider";

export default function GlobalOptions(props) {

    return (
        <div className={styles.wrapper}>
            <Button
                onClick={() => {
                    props.save().then(() => {
                        props.redirect()
                    })
                }}
                className={styles.logoWrapper}>
                {/*<span className={'material-icons-round'}>home</span>*/}
                Projection
            </Button>
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
                        onClick: () => props.downloadProject()
                    }}/>

                    <DropdownOption option={{

                        label: 'Preferences',
                        icon: <span className={'material-icons-round'} style={{fontSize: '1rem'}}>settings</span>,
                        shortcut: 'Ctrl + alt + S',
                        onClick: () => props.settings.setViewPreferences(true)
                    }}/>
                </DropdownOptions>
            </Dropdown>
            <Dropdown className={styles.dropdownLabel} align={'bottom'} justify={'start'}>
                Editor
                <DropdownOptions>
                    <DropdownOption option={{
                        label: 'Show scene options',
                        icon: props.settings.visibility.scene ? <span className={'material-icons-round'} style={{fontSize: '1rem'}}>check</span> : undefined,
                        keepAlive: true,
                        onClick: () => props.settings.setVisibility(prev => {
                            return  {...prev, scene: !prev.scene}
                        })
                    }}/>

                    <DropdownOption option={{
                        label: 'Show files',
                        keepAlive: true,
                        icon: props.settings.visibility.files ? <span className={'material-icons-round'} style={{fontSize: '1rem'}}>check</span> : undefined,
                        onClick: () => props.settings.setVisibility(prev => {
                            return  {...prev, files: !prev.files}
                        })
                    }}/>

                    <DropdownOption option={{
                        label: 'Show viewport options',
                        keepAlive: true,
                        icon: props.settings.visibility.viewportOptions ? <span className={'material-icons-round'} style={{fontSize: '1rem'}}>check</span> : undefined,
                        onClick: () => props.settings.setVisibility(prev => {
                            return  {...prev, viewportOptions: !prev.viewportOptions}
                        })
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
    downloadProject: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired
}