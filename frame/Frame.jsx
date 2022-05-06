import PropTypes from "prop-types";
import styles from './styles/Frame.module.css'
import logo from '../../static/logo.png'
import React from "react"
import {Dropdown, DropdownOption, DropdownOptions} from "@f-ui/core";
import Actions from "./components/Actions";

export default function Frame(props) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.logoWrapper}>
                <img src={logo} alt={'LOGO'} className={styles.logo}/>
            </div>
            <div className={styles.divider}/>
            <label className={styles.title}>
                {props.label}
            </label>
            {props.options.map((o, i) => (
                <React.Fragment key={i + '-wrapper-frame'}>
                    <Dropdown className={styles.button}>
                        {o.label}
                        <DropdownOptions>
                            {o.options.map((oo, j) => (
                                <React.Fragment key={i + '-wrapper-frame-option-' + j}>
                                    <DropdownOption option={oo}/>
                                </React.Fragment>
                            ))}
                        </DropdownOptions>
                    </Dropdown>
                </React.Fragment>
            ))}
            <div className={styles.draggable}/>
            <Actions pageInfo={props.pageInfo}/>
        </div>
    )
}
Frame.propTypes = {
    pageInfo: PropTypes.shape({
        pageID: PropTypes.string,
        closeEvent: PropTypes.string,
        minimizeEvent: PropTypes.string,
        maximizeEvent: PropTypes.string
    }),
    label: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            onClick: PropTypes.func,
            icon: PropTypes.node
        }))
    }))
}