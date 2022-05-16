import {Dropdown, DropdownOption, DropdownOptions, ToolTip} from "@f-ui/core";
import styles from "../styles/ViewportOptions.module.css";
import CAMERA_TYPES from "../../../project/utils/extension/camera/CAMERA_TYPES";
import React, {useMemo} from "react";
import PropTypes from "prop-types";

export default function Cameras(props){
    const {settingsContext, lastCamera, setLastCamera, setCameraIsOrthographic, cameraIsOrthographic} = props
    const cameraOptions = useMemo(() => {

        return Object.keys(CAMERA_TYPES)
            .map(c => {
                return {
                    label: CAMERA_TYPES[c],
                    icon: settingsContext.cameraType === CAMERA_TYPES[c] ?
                        <span style={{fontSize: '1.2rem'}}
                              className={'material-icons-round'}>check</span> : undefined,
                    onClick: () => {
                        const isOrtho = CAMERA_TYPES[c] !== CAMERA_TYPES.SPHERICAL && CAMERA_TYPES[c] !== CAMERA_TYPES.FREE
                        if (isOrtho)
                            setLastCamera({
                                ...lastCamera,
                                ortho: CAMERA_TYPES[c]
                            })
                        else
                            setLastCamera({
                                ...lastCamera,
                                perspective: CAMERA_TYPES[c]
                            })
                        settingsContext.cameraType = CAMERA_TYPES[c]

                        setCameraIsOrthographic(isOrtho)
                    },
                    disabled: settingsContext.cameraType === CAMERA_TYPES[c]
                }
            })
    }, [settingsContext.cameraType, props.engine, lastCamera, cameraIsOrthographic])

    return(
        <Dropdown

            className={styles.groupItemVert}
            hideArrow={true}>
                                    <span className={'material-icons-round'}
                                          style={{fontSize: '1.1rem'}}>videocam</span>
            <ToolTip styles={{textAlign: 'left', display: 'grid'}}>
                <div>- Cameras</div>
            </ToolTip>
            <DropdownOptions>
                {cameraOptions.map((c, i) => (
                    <React.Fragment key={i + '-options-vp'}>
                        <DropdownOption
                            option={c}
                        />
                    </React.Fragment>
                ))}
            </DropdownOptions>
        </Dropdown>

    )
}
Cameras.propTypes={
    setCameraIsOrthographic: PropTypes.func,
    cameraIsOrthographic: PropTypes.bool,
    lastCamera: PropTypes.object,
    setLastCamera: PropTypes.func,
    settingsContext: PropTypes.object
}