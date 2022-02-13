import React, {useContext, useEffect, useMemo, useState} from "react";
import styles from "./styles/Selector.module.css";
import {Button, Dropdown, DropdownOptions, ToolTip} from "@f-ui/core";
import SelectorItem from "./SelectorItem";
import PropTypes from "prop-types";
import Search from "../search/Search";
import QuickAccessProvider from "../../pages/project/hook/QuickAccessProvider";

export default function Selector(props) {
    const [state, setState] = useState({})
    const [searchString, setSearchString] = useState('')
    const quickAccess = useContext(QuickAccessProvider)

    const getType = () => {
        switch (props.type) {
            case 'image':
                return quickAccess.images
            case 'material':
                return quickAccess.materials
            case 'mesh':
                return quickAccess.meshes
            default:
                return []
        }
    }
    const content = useMemo(() => {
        const filtered = getType().filter(e => e.name.toLowerCase().includes(searchString))

        if (filtered.length > 0)
            return filtered.map((t, i) => (
                <React.Fragment key={'texture-' + t.name + '-' + i}>
                    <Button
                        className={styles.button}
                        variant={state.id === t.registryID ? 'minimal-horizontal' : undefined}
                        highlight={state.id === t.registryID}
                        onClick={() => {
                            setState(t)
                            props.handleChange(t)
                        }}
                    >
                        <SelectorItem data={{
                            ...t,
                            blob: t.preview
                        }}
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
    }, [quickAccess.images, quickAccess.meshes, state, searchString])

    useEffect(() => {
        setState((typeof props.selected === 'object' && Object.keys(props.selected).length > 0) ? props.selected : {
            name: 'Empty texture'
        })
    }, [props.selected])

    return (

        <Dropdown wrapperClassname={styles.modal} className={styles.button}>
            <SelectorItem
                data={{
                    ...state,
                    blob: state.preview
                }}
            />
            <DropdownOptions>
                <div className={styles.searchWrapper}>
                    <Search searchString={searchString} setSearchString={setSearchString} width={'100%'}/>
                    <Button onClick={() => quickAccess.refresh()} className={styles.refreshButton}>
                        <span className={'material-icons-round'} style={{fontSize: '1rem'}}>refresh</span>

                        <ToolTip content={'Refresh files'}/>
                    </Button>
                </div>
                {content}
            </DropdownOptions>
        </Dropdown>
    )
}

Selector.propTypes = {
    type: PropTypes.oneOf(['image', 'mesh']),
    handleChange: PropTypes.func,
    selected: PropTypes.object
}