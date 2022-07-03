import PropTypes from "prop-types"
import styles from "./styles/Search.module.css"
import React from "react"
import EN from "../../static/locale/EN"
import {Icon} from "@f-ui/core"

const DELAY = 500
export default function Search(props) {
    let timeout
    const onChange = (input) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            console.log("on submit")
            props.setSearchString(input.value)
        }, DELAY)
    }
    return (
        <div className={styles.wrapper} style={{width: props.width, padding: props.noPadding ? "0" : undefined}}>
            <Icon styles={{fontSize: "1rem"}}>search</Icon>
            <input
                placeholder={EN.COMPONENTS.SEARCH.SEARCH}
                className={styles.input}
                onChange={e => onChange(e.target)}
            />
        </div>
    )
}

Search.propTypes = {
    width: PropTypes.string,
    searchString: PropTypes.string,
    setSearchString: PropTypes.func,
    noPadding: PropTypes.bool
}

