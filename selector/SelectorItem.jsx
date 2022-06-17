import PropTypes from "prop-types"
import styles from "./styles/SelectorItem.module.css"
import React, {useMemo} from "react"
import Preview from "../preview/Preview"
import FileSystem from "../../project/utils/files/FileSystem"
import {Icon} from "@f-ui/core"

export default function SelectorItem(props) {
    const p = useMemo(() => {
        return props.path + FileSystem.sep + "previews" + FileSystem.sep + props.data.registryID + ".preview"
    }, [props.data?.registryID])
    const icon = useMemo(() => {
        switch (props.type) {
        case "mesh":
            return <Preview iconStyles={{fontSize: "2rem"}} path={p} className={styles.image} fallbackIcon={"view_in_ar"}/>
        case "image":
            return (
                <Preview iconStyles={{fontSize: "1.6rem"}} path={p} className={styles.image} fallbackIcon={"image"}/>
            )
        case "material":
            return <Preview iconStyles={{fontSize: "2rem"}} path={p} className={styles.image} fallbackIcon={"texture"}/>
        case "script":
            return <Icon  styles={{fontSize: "2rem", color: "var(--pj-color-secondary)"}}>javascript</Icon>
        default:
            return
        }
    }, [props.type, props.data])

    return (
        <div className={styles.wrapper}>
            {icon}
            <label className={styles.label} title={props.data.name}>
                {props.data.name?.replace("." + props.type, "")}
            </label>
        </div>
    )
}
SelectorItem.propTypes = {
    path: PropTypes.string,
    type: PropTypes.oneOf(["image", "mesh", "material", "script"]),
    data: PropTypes.object
}