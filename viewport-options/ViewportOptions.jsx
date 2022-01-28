import PropTypes from "prop-types";
import styles from "./styles/VO.module.css";
import {Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import Range from "../range/Range";

export default function ViewportOptions(props) {
    return (
        <div className={styles.options}>

            <Dropdown className={styles.optionWrapper} variant={'outlined'} justify={'start'} align={'bottom'}>
                <span className={'material-icons-round'}>more_vert</span>
                <DropdownOptions>
                    <DropdownOption option={{
                        label: 'Show FPS',
                        icon: props.hook.fps ? <span style={{fontSize: '1.2rem'}} className={'material-icons-round'}>check</span> : undefined,
                        onClick: () => props.hook.setFps(!props.hook.fps),
                        shortcut: 'ctrl + shift + h'
                    }}/>

                    <DropdownOption option={{
                        label: 'Fullscreen',
                        icon: props.hook.fullscreen ? <span style={{fontSize: '1.2rem'}} className={'material-icons-round'}>check</span> : undefined,
                        onClick: () => props.hook.setFullscreen(!props.hook.fullscreen),
                        shortcut: 'F'
                    }}/>

                    <div className={styles.dividerWrapper}>
                        Viewport
                        <div className={styles.divider}/>
                    </div>
                    <div className={styles.rangeWrapper}>
                        <div className={styles.rangeLabel}>
                            Fov
                        </div>
                        <Range value={props.hook.fov * 180 / 3.14}
                               handleChange={e => props.hook.setFov(e * 3.14 / 180)}/>
                    </div>
                    <div className={styles.rangeWrapper}>
                        <div className={styles.rangeLabel}>
                            Resolution
                        </div>
                        <Range value={props.hook.res}
                               handleChange={e => props.hook.setRes(e)}/>
                    </div>

                </DropdownOptions>
            </Dropdown>

            <div
                className={styles.optionWrapper}
                style={{justifyContent: 'center', display: !props.hook.fps ? 'none' : undefined}}
                title={'Frames per second'}
                id={props.id + '-frames'}
            />
        </div>
    )
}
ViewportOptions.propTypes = {
    hook: PropTypes.object,
    id: PropTypes.string
}