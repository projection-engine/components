import PropTypes from "prop-types"
import styles from "./styles/Search.module.css"
import React from "react"
import EN from "../../static/locale/EN"
import {Icon} from "@f-ui/core"

export default function Search(props) {

    return (
        <div className={styles.wrapper} style={{width: props.width, height: props.size === "big" ? "30px" : undefined, minHeight: props.size === "big" ? "30px" : props.height, maxHeight: props.height, padding: props.noPadding ? "0" : undefined}}>
            <div className={styles.inputWrapper}>
                <Icon styles={{fontSize: "1rem"}}>search</Icon>
                <input
                    placeholder={EN.COMPONENTS.SEARCH.SEARCH}
                    className={styles.input}
                    onChange={e => props.setSearchString(e.target.value)}
                    value={props.searchString}/>
            </div>
        </div>
    )
}

Search.propTypes = {
    size: PropTypes.oneOf(["big", "default"]),
    width: PropTypes.string,
    height: PropTypes.string,
    searchString: PropTypes.string,
    setSearchString: PropTypes.func,
    noPadding: PropTypes.bool
}

