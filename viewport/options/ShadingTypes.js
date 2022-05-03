import styles from "../styles/ViewportOptions.module.css";
import {Button, ToolTip} from "@f-ui/core";
import {SHADING_MODELS} from "../../../pages/project/hooks/useSettings";
import PropTypes from "prop-types";

export default function ShadingTypes(props){
    const {settingsContext} = props
    return(
        <div style={{justifyContent: 'flex-end'}} className={styles.align}>
            <div className={styles.buttonGroup}>
                <Button
                    className={styles.groupItem}
                    variant={'minimal'}
                    highlight={settingsContext.shadingModel === SHADING_MODELS.DETAIL}
                    onClick={() => {
                        settingsContext.shadingModel = SHADING_MODELS.DETAIL
                    }}
                    styles={{borderRadius: '5px 0 0 5px'}}>
                    <div className={styles.shadedIcon}/>
                    <ToolTip>
                        <div style={{textAlign: 'left'}}>
                            <div style={{fontWeight: 'normal'}}>
                                Viewport shading:
                            </div>
                            Details
                        </div>
                    </ToolTip>
                </Button>
                <Button
                    className={styles.groupItem}
                    variant={'minimal'}
                    highlight={settingsContext.shadingModel === SHADING_MODELS.FLAT}
                    onClick={() => {
                        settingsContext.shadingModel = SHADING_MODELS.FLAT
                    }}>
                    <div className={styles.flatIcon}/>
                    <ToolTip>
                        <div style={{textAlign: 'left'}}>
                            <div style={{fontWeight: 'normal'}}>
                                Viewport shading:
                            </div>
                            Flat
                        </div>
                    </ToolTip>
                </Button>
                <Button
                    disabled={true}
                    className={styles.groupItem}
                    variant={'minimal'}
                    highlight={settingsContext.shadingModel === SHADING_MODELS.WIREFRAME}
                    onClick={() => {
                        settingsContext.shadingModel = SHADING_MODELS.WIREFRAME
                    }}
                    styles={{borderRadius: '0 5px 5px 0'}}>

                    <div className={'material-icons-round'}
                         style={{fontSize: '17px', color: 'var(-colorToApply)'}}>
                        language
                    </div>
                    <ToolTip>
                        <div style={{textAlign: 'left'}}>
                            <div style={{fontWeight: 'normal'}}>
                                Viewport shading:
                            </div>
                            Wireframe
                        </div>
                    </ToolTip>
                </Button>
            </div>
        </div>
    )
}

ShadingTypes.propTypes={
    settingsContext: PropTypes.object
}