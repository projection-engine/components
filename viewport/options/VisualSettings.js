import {Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";

import styles from "../styles/ViewportOptions.module.css";
import PropTypes from "prop-types";

export default function VisualSettings(props) {
    const {settingsContext} = props
    return (
        <Dropdown
            className={styles.optionWrapper}
        >
            <div className={styles.summary}>
                          <span style={{fontSize: '1.1rem'}}
                                className={'material-icons-round'}>visibility</span>
                <div className={styles.overflow}>
                    View
                </div>
            </div>
            <DropdownOptions>

                <DropdownOption option={{
                    label: 'Grid',
                    keepAlive: true,
                    icon: settingsContext.gridVisibility ? <span style={{fontSize: '1.2rem'}}
                                                                 className={'material-icons-round'}>check</span> : undefined,
                    onClick: () => settingsContext.gridVisibility = !settingsContext.gridVisibility,
                }}/>
                <DropdownOption option={{
                    label: 'Icons',
                    keepAlive: true,
                    icon: settingsContext.iconsVisibility ? <span style={{fontSize: '1.2rem'}}
                                                                  className={'material-icons-round'}>check</span> : undefined,
                    onClick: () => settingsContext.iconsVisibility = !settingsContext.iconsVisibility
                }}/>
            </DropdownOptions>
        </Dropdown>
    )
}

VisualSettings.propTypes={
    settingsContext: PropTypes.object
}