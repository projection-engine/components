import styles from './styles/GlobalOptions.module.css'
import {Button, Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import PropTypes from "prop-types";

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
                        onClick: () => null // TODO
                    }}/>

                    <DropdownOption option={{
                        label: 'Preferences',
                        icon: <span className={'material-icons-round'} style={{fontSize: '1rem'}}>settings</span>,
                        shortcut: 'Ctrl + alt + S',
                        onClick: () => props.viewportHook.setViewPreferences(true)
                    }}/>
                </DropdownOptions>
            </Dropdown>
            <Dropdown className={styles.dropdownLabel} align={'bottom'} justify={'start'}>
                Editor
                <DropdownOptions>
                    <DropdownOption option={{
                        label: 'Show scene options',
                        icon: props.viewportHook.showScene ? <span className={'material-icons-round'} style={{fontSize: '1rem'}}>check</span> : undefined,

                        onClick: () => null// TODO
                    }}/>

                    <DropdownOption option={{
                        label: 'Show files',
                        icon: props.viewportHook.showFiles ? <span className={'material-icons-round'} style={{fontSize: '1rem'}}>check</span> : undefined,
                        onClick: () => null // TODO
                    }}/>

                    <DropdownOption option={{
                        label: 'Show viewport options',
                        icon: props.viewportHook.showViewportOptions ? <span className={'material-icons-round'} style={{fontSize: '1rem'}}>check</span> : undefined,

                        onClick: () => null// TODO
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
    save: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
    viewportHook: PropTypes.object.isRequired
}