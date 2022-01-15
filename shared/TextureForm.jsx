import React, {useMemo, useState} from "react";
import styles from "./Form.module.css";
import {Button, Modal} from "@f-ui/core";
import ImageVisualizer from "../visualizer/ImageVisualizer";
import PropTypes from "prop-types";

export default function TextureForm(props) {
    const [state, setState] = useState((typeof props.classObject === 'object') ? props.classObject : {})
    const [open, setOpen] = useState(false)
    const content = useMemo(() => {
        return props.availableTextures.map((t, i) => (
            <React.Fragment key={'texture-'+t.name + '-' + i}>
                <Button
                    className={styles.button}
                    variant={state.id === t.id ? 'minimal-horizontal' : undefined}
                    highlight={state.id === t.id}
                    onClick={() => {
                        setState(t)
                        props.handleChange(t)
                    }}
                >
                    <ImageVisualizer data={t}/>
                </Button>
            </React.Fragment>
        ))
    }, [props.availableTextures, state])
    return (
        <div className={styles.wrapper} style={{position: 'relative'}}>

            <Button
                className={styles.button}

                    highlight={open}
                    onClick={() => setOpen(true)}>
                <ImageVisualizer data={state}/>
            </Button>
            <Modal open={open} blurIntensity={0}
                   variant={"fit"}
                   handleClose={() => setOpen(false)}
                   className={styles.modal}
            >
                {content}
            </Modal>

        </div>
    )
}

TextureForm.propTypes = {
    availableTextures: PropTypes.array.isRequired,
    handleChange: PropTypes.func,
    classObject: PropTypes.object
}