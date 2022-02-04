import styles from '../styles/Card.module.css'
import PropTypes from "prop-types";
import {Button, Modal, ToolTip} from "@f-ui/core";
import {useState} from "react";

export default function Card(props) {
    const [open, setOpen] = useState(false)
    return (
        <div className={styles.wrapper} data-card={props.data.id} style={{animationDelay: props.index * 100 + 'ms'}}>

            <img alt={'Preview'} src={props.data.meta?.preview ? props.data.meta?.preview : './LOGO.png'}
                 className={styles.image} draggable={false}/>
            <div className={styles.label}>
                <div className={styles.labels}>
                    <div className={styles.overflow}>
                        {props.data.settings.projectName}
                    </div>
                    <div className={[styles.overflow, styles.date].join(' ')}>
                        {props.data.meta.lastModification}
                    </div>
                </div>
                <div className={styles.options}>
                    <Button variant={'outlined'} className={styles.button}
                            styles={{width: 'fit-content', position: 'absolute', left: 0}}>
                        <span style={{fontSize: '1.1rem'}} className={'material-icons-round'}>info</span>
                        <ToolTip>
                            <div className={styles.data}>
                                id:
                                <div className={styles.overflow} style={{fontWeight: 'normal'}}>{props.data.id}</div>
                            </div>
                            <div className={styles.data}>
                                Last modified:
                                <div className={styles.overflow}
                                     style={{fontWeight: 'normal'}}>{props.data.meta?.lastModification}</div>
                            </div>
                            <div className={styles.data}>
                                Creation date:
                                <div className={styles.overflow}
                                     style={{fontWeight: 'normal'}}>{props.data.meta?.creationDate}</div>
                            </div>

                            <div className={styles.dividerWrapper}>
                                Project info <div className={styles.divider}/>

                            </div>
                            <div className={styles.data}>
                                Entities:
                                <div className={styles.overflow}
                                     style={{fontWeight: 'normal'}}>{props.data.meta?.entities}</div>
                            </div>
                            <div className={styles.data}>
                                Meshes:
                                <div className={styles.overflow}
                                     style={{fontWeight: 'normal'}}>{props.data.meta?.meshes}</div>
                            </div>
                            <div className={styles.data}>
                                Materials:
                                <div className={styles.overflow}
                                     style={{fontWeight: 'normal'}}>{props.data.meta?.materials}</div>
                            </div>

                        </ToolTip>
                    </Button>

                    <Button onClick={() => props.onClick()} variant={'filled'} className={styles.button}>
                        <span className={'material-icons-round'} style={{fontSize: '1.1rem'}}>open_in_new</span>
                        Load project
                    </Button>
                    <Button variant={'outlined'} className={styles.button} onClick={() => setOpen(true)}>
                        <span  className={'material-icons-round'}>delete</span>
                        <Modal blurIntensity={0} className={styles.onDelete} variant={'fit'}
                               handleClose={() => setOpen(false)} open={open}>
                            Are you sure ?
                            <Button onClick={() => props.onDelete()} variant={'filled'}
                                    styles={{'--fabric-accent-color': '#ff5555'}} className={styles.button}>
                                <span className={'material-icons-round'}>delete</span>
                                Delete permanently
                            </Button>
                        </Modal>
                    </Button>
                </div>

            </div>

        </div>
    )
}
Card.propTypes = {
    index: PropTypes.number,
    data: PropTypes.object,
    onDelete: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.oneOf(['row', 'cell'])
}