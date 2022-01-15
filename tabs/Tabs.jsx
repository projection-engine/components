import PropTypes from "prop-types";
import {useMemo, useState} from "react";
import styles from './styles/Tabs.module.css'
import {Button} from "@f-ui/core";
import ControlProvider from "./components/ControlProvider";

export default function Tabs(props) {
    const [options, setOptions] = useState([])
    const tabs = useMemo(() => {
        setOptions([])
        return props.tabs.filter(t => t.open)
    }, [props.tabs])
    const getButton = (option) => {
        return (
            <Button onClick={option.onClick} className={styles.option}>
                {option.icon}
                {option.label}
            </Button>
        )
    }
    return (
        <ControlProvider.Provider value={{
            setOptions: setOptions
        }}>
            <div className={styles.wrapper}>
                <div className={styles.contentWrapper}>
                    <div className={styles.tabs}>
                        {tabs.map((tab, i) => (
                            <div key={'tab-' + i}
                                 className={[styles.tabButtonWrapper, props.tab === i ? styles.currentTabButton : ''].join(' ')}>
                                <Button
                                    variant={'minimal-horizontal'}
                                    className={styles.button}
                                    highlight={props.tab === i}
                                    onClick={() => {
                                        if (props.tab !== i) {
                                            props.onBeforeTabSwitch(i)
                                            props.setTab(i)
                                        }
                                    }}
                                >
                                    {tab.icon}
                                    <div className={styles.label}>
                                        {tab.label}
                                    </div>
                                </Button>
                                {tab.canClose ?
                                    <Button
                                        color={"secondary"}
                                        className={styles.closeButton}
                                        onClick={() => {
                                            if (props.tab === i)
                                                props.setTab(i - 1)
                                            tab.handleClose()

                                        }}
                                    >
                                        <span className={'material-icons-round'}>close</span>
                                    </Button>
                                    :
                                    null
                                }
                            </div>
                        ))}
                    </div>
                    <div className={styles.options}>
                        {options.length > 0 ? options.map(option => getButton(option)) : props.fallbackOptions.map(option => getButton(option))}
                    </div>
                </div>
                {tabs.map((tab, i) => (
                    <div key={'tab-child-' + i} className={styles.content}
                         style={{display: props.tab !== i ? 'none' : undefined}}>
                        {tab.children}
                    </div>
                ))}
            </div>
        </ControlProvider.Provider>
    )
}
Tabs.propTypes = {
    fallbackOptions: PropTypes.arrayOf(PropTypes.shape({
        onClick: PropTypes.func,
        icon: PropTypes.node,
        label: PropTypes.string
    })),
    onBeforeTabSwitch: PropTypes.func.isRequired,
    tabs: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.node,
        label: PropTypes.string,
        children: PropTypes.node,
        open: PropTypes.bool,
        canClose: PropTypes.bool,
        handleClose: PropTypes.func
    })).isRequired,
    tab: PropTypes.number,
    setTab: PropTypes.func
}