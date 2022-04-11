import PropTypes from "prop-types";
import React, {useState} from "react";
import styles from './styles/Tabs.module.css'
import {Button} from "@f-ui/core";
import ControlProvider from "./components/ControlProvider";
import Options from "./components/Options";

export default function Tabs(props) {

    const [tabAttributes, setTabAttributes] = useState([{}])
    const childrenTabs = React.Children.toArray(props.children)


    return (
        <ControlProvider.Provider value={{
            setTabAttributes: (options, label, icon, onBeforeSwitch, canClose, tab) => {
                setTabAttributes(prev => {
                    const copy = [...prev]
                    copy[tab] = {
                        options, label, icon, onBeforeSwitch, canClose
                    }
                    return copy
                })
            },
            tab: props.tab
        }}>
            <div className={styles.wrapper}>
                <div className={styles.contentWrapper}>
                    <div className={styles.tabs}>
                        {childrenTabs.map((tab, i) => (
                            <div key={'tab-' + i}
                                 className={[styles.tabButtonWrapper, props.tab === i ? styles.currentTabButton : ''].join(' ')}>
                                <Button
                                    variant={'minimal-horizontal'}
                                    className={styles.button}
                                    highlight={props.tab === i}
                                    onClick={() => {
                                        if (props.tab !== i) {
                                            if (props.onTabSwitch)
                                                props.onTabSwitch(i, props.tab)
                                            props.setTab(i)
                                            tabAttributes.forEach(t => {
                                                if (t.onBeforeSwitch)
                                                    t.onBeforeSwitch(i)
                                            })
                                        }
                                    }}
                                >
                                    {tabAttributes[i]?.icon}
                                    <div className={styles.overflow}>
                                        {tabAttributes[i]?.label}
                                    </div>
                                </Button>
                                {tabAttributes[i]?.canClose ?
                                    <Button
                                        color={"secondary"}
                                        className={styles.closeButton}
                                        onClick={() => {
                                            if (i === props.tab) {
                                                props.setTab(i - 1)
                                                tabAttributes.forEach(t => {
                                                    if (t.onBeforeSwitch)
                                                        t.onBeforeSwitch(i - 1)
                                                })
                                            }

                                            props.handleTabClose(i - 1, props.tab)

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
                    <Options options={tabAttributes[props.tab]?.options}/>
                </div>
                {childrenTabs.map((tab, i) => (
                    <div key={'tab-child-' + i} className={styles.content}
                         style={{display: props.tab !== i ? 'none' : undefined}}>
                        {tab}
                    </div>
                ))}
            </div>
        </ControlProvider.Provider>
    )
}
Tabs.propTypes = {
    tab: PropTypes.number,
    setTab: PropTypes.func,
    children: PropTypes.node.isRequired,
    handleTabClose: PropTypes.func.isRequired,
    onTabSwitch: PropTypes.func
}