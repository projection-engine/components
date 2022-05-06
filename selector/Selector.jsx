import React, {useContext, useEffect, useMemo, useState} from "react";
import styles from "./styles/Selector.module.css";
import {Button, Dropdown, DropdownOptions, ToolTip} from "@f-ui/core";
import SelectorItem from "./SelectorItem";
import PropTypes from "prop-types";
import Search from "../search/Search";
import QuickAccessProvider from "../../project/hooks/QuickAccessProvider";

export default function Selector(props) {
    const [state, setState] = useState({})
    const [searchString, setSearchString] = useState('')
    const [currentSort, setCurrentSort] = useState()
    const quickAccess = useContext(QuickAccessProvider)

    const getType = () => {
        switch (props.type) {
            case 'image':
                return quickAccess.images
            case 'material':
                return quickAccess.materials
            case 'mesh':
                return quickAccess.meshes
            case 'script':
                return quickAccess.scripts
            default:
                return []
        }
    }
    const content = useMemo(() => {
        let filtered = getType()
            .filter(e => e.name.toLowerCase().includes(searchString))
        if(currentSort)
            filtered = filtered.sort((a,b) => (a.name > b.name) ? (currentSort === `up` ? 1 : -1) : ((b.name > a.name) ? (currentSort === `up` ? -1 : 1) : 0))

        if (filtered.length > 0)
            return filtered.map((t, i) => (
                <React.Fragment key={'texture-' + t.name + '-' + i}>
                    <Button
                        className={styles.button}
                        variant={state.registryID === t.registryID ? 'filled' : undefined}
                        highlight={state.registryID === t.registryID}
                        onClick={() => {
                            setState(t)
                            props.handleChange(t)
                        }}
                    >
                        <SelectorItem
                            path={quickAccess.fileSystem.path}
                            type={props.type}
                            data={t}
                        />
                    </Button>
                </React.Fragment>
            ))
        else
            return (
                <div className={styles.nothing}>
                    <span style={{fontSize: '2rem'}} className={'material-icons-round'}>folder</span>
                    Nothing found
                </div>
            )
    }, [currentSort, quickAccess.images, quickAccess.meshes, state, searchString, props.selected])

    useEffect(() => {
        let name = 'Empty',
            data = (typeof props.selected === 'object' && Object.keys(props.selected).length > 0) ? props.selected : quickAccess[props.type + 's']?.find(e => e.registryID === props.selected)

        setState(data ? data : {name})
    }, [props.selected])
    const [className, setClassName] = useState('')
    return (
        <div
            className={styles.content}
            onDragOver={e => {
                e.preventDefault()
                setClassName(styles.hovered)
            }}

            onDrop={e => {
                e.preventDefault()

                try {
                    const transfer = JSON.parse(e.dataTransfer.getData('text'))[0]
                    const filtered = getType().find(f => f.registryID === transfer)
                    if (filtered) {
                        props.handleChange(filtered)
                        setState(filtered)
                    }
                } catch (e) {
                }
                setClassName('')
            }}
            onDragLeave={e => {
                setClassName('')
            }}>
            <Dropdown
                wrapperClassname={styles.modal}
                className={[styles.button, className].join(' ')}>
                <SelectorItem
                    type={props.type}
                    path={quickAccess.fileSystem.path}
                    data={state}
                />
                <DropdownOptions>
                    <div className={styles.searchWrapper}>
                        <Button
                            className={styles.resetButton}
                            variant={"outlined"}
                            onClick={() => {
                                setCurrentSort(prev => {
                                    switch (prev) {
                                        case 'up':
                                            return undefined
                                        case undefined:
                                            return 'down'
                                        case 'down':
                                            return 'up'
                                        default:
                                            return prev
                                    }
                                })
                            }}
                        >
                            <span style={{
                                color: !currentSort ? '#999999' : undefined,
                                transform: currentSort === 'up' ? undefined : 'rotate(180deg)'
                            }} className={'material-icons-round'}>arrow_upward</span>
                        </Button>
                        <Search searchString={searchString} setSearchString={setSearchString} width={'100%'}/>
                        {props.type === 'material' ?
                            <Button className={styles.resetButton} variant={"outlined"}
                                    onClick={() => props.handleChange()}>
                                <span className={'material-icons-round'}>clear</span>
                                <ToolTip content={'Default material'}/>
                            </Button>
                            : null}
                        {props.type === 'script' ?
                            <Button className={styles.resetButton} variant={"outlined"}
                                    onClick={() => props.handleChange()}>
                                <span className={'material-icons-round'}>clear</span>
                                <ToolTip content={'Remove script'}/>
                            </Button>
                            : null}
                    </div>

                    {content}
                </DropdownOptions>
            </Dropdown>
        </div>
    )
}

Selector.propTypes = {

    type: PropTypes.oneOf(['image', 'mesh', 'material', 'script']),
    handleChange: PropTypes.func,
    selected: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
}