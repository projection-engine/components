import styles from "../styles/ViewportOptions.module.css";
import {Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import ROTATION_TYPES from "../../../services/engine/editor/gizmo/ROTATION_TYPES";
import PropTypes from "prop-types";

export default function TransformationTypes(props){
    const {settingsContext} = props
    return (
        <div style={{justifyContent: 'center'}} className={styles.align}>
            <Dropdown

                className={styles.optionWrapper}>
                <div className={styles.summary}>
                          <span style={{fontSize: '1.1rem'}}
                                className={'material-icons-round'}>transform</span>
                    <div className={styles.overflow}>
                        {settingsContext.rotationType === ROTATION_TYPES.RELATIVE ? 'Local' : 'Global'}
                    </div>
                </div>
                <DropdownOptions>
                    <DropdownOption option={{
                        label: 'Local',

                        icon: settingsContext.rotationType === ROTATION_TYPES.RELATIVE ?
                            <span style={{fontSize: '1.2rem'}}
                                  className={'material-icons-round'}>check</span> : undefined,
                        onClick: () => {
                            settingsContext.rotationType = ROTATION_TYPES.RELATIVE
                        }
                    }}/>
                    <DropdownOption option={{
                        label: 'Global',
                        icon: settingsContext.rotationType === ROTATION_TYPES.GLOBAL ?
                            <span style={{fontSize: '1.2rem'}}
                                  className={'material-icons-round'}>check</span> : undefined,
                        onClick: () => {
                            settingsContext.rotationType = ROTATION_TYPES.GLOBAL

                        }
                    }}/>
                </DropdownOptions>
            </Dropdown>
        </div>
    )
}

TransformationTypes.propTypes={
    settingsContext: PropTypes.object
}