import PropTypes from "prop-types"
import styles from "./styles/Search.module.css"
import React, {useEffect, useRef} from "react"
import {Icon} from "@f-ui/core"
import KEYS from "../../project/engine/data/KEYS"
import useLocalization from "../../global/useLocalization"

const DELAY = 250
export default function Search(props) {
    const ref = useRef()
    let timeout
    const onChange = (input) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            props.setSearchString(input.value)
        }, DELAY)
    }

    useEffect(() => {
        if(props.searchString)
            ref.current.value=props.searchString
    }, [props.searchString])

    const translate = useLocalization("COMPONENTS", "SEARCH")
    return (
        <div className={styles.wrapper} style={{width: props.width, height: props.height ? props.height : undefined, padding: props.noPadding ? "0" : undefined}}>
            {props.noIcon ? null : <Icon styles={{width: "1rem", height: "1rem", fontSize: "1rem"}}>search</Icon>}
            <input
                ref={ref}
                placeholder={props.noPlaceHolder ? null : translate("SEARCH")}
                className={styles.input}
                onChange={e => {
                    if(!props.noAutoSubmit)
                        onChange(e.target)
                }}
                onKeyDown={e => {
                    if(e.code === KEYS.Enter)
                        props.setSearchString(e.target.value)
                }}
            />
        </div>
    )
}

Search.propTypes = {
    height: PropTypes.string,
    noAutoSubmit: PropTypes.bool,
    noIcon: PropTypes.bool,
    noPlaceHolder: PropTypes.bool,
    width: PropTypes.string,
    searchString: PropTypes.string,
    setSearchString: PropTypes.func,
    noPadding: PropTypes.bool
}

