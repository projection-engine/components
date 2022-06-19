import React, {useContext, useDeferredValue, useEffect, useMemo, useState} from "react"
import styles from "./styles/Selector.module.css"
import {Button, Dropdown, DropdownOptions, DropdownProvider, Icon, ToolTip} from "@f-ui/core"
import SelectorItem from "./SelectorItem"
import PropTypes from "prop-types"
import Search from "../search/Search"
import QuickAccessProvider from "../../project/providers/QuickAccessProvider"
import EN from "../../static/locale/EN"

export default function Selector(props) {
    const [state, setState] = useState({})

    const quickAccess = useContext(QuickAccessProvider)

    const getType = () => {
        switch (props.type) {
        case "image":
            return quickAccess.images
        case "material":
            return quickAccess.materials
        case "mesh":
            return quickAccess.meshes
        case "script":
            return quickAccess.scripts
        default:
            return []
        }
    }
   
    useEffect(() => {
        let name = EN.COMPONENTS.SELECTOR.EMPTY,
            data = (typeof props.selected === "object" && Object.keys(props.selected).length > 0) ? props.selected : quickAccess[props.type + "s"]?.find(e => e.registryID === props.selected)
        setState(data ? data : {name})
    }, [props.selected])
    const [className, setClassName] = useState("")
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
                    const transfer = JSON.parse(e.dataTransfer.getData("text"))[0]
                    const filtered = getType().find(f => f.registryID === transfer)
                    if (filtered) {
                        setState(filtered)
                        props.handleChange(() => setState({name: EN.COMPONENTS.SELECTOR.EMPTY}))
                    }
                } catch (e) {
                    alert.pushAlert("Error loading file", "error")
                }
                setClassName("")
            }}
            onDragLeave={() => {
                setClassName("")
            }}>
            <Dropdown
                hideArrow={true}
                wrapperClassname={styles.modal}
                className={[styles.button, className, props.children  !== undefined ? styles.noPadding : "" ].join(" ")}
                styles={{height: "100%"}}
            >

                {props.children ? props.children :
                    <SelectorItem
                        type={props.type}
                        path={document.fileSystem.path}
                        data={state}
                    />
                }
                <DropdownOptions>
                    <Options
                        handleChange={props.handleChange}
                        type={props.type}
                        images={quickAccess.images}
                        meshes={quickAccess.meshes}
                        selected={props.selected}
                        getType={getType}
                        setState={setState}
                        state={state}
                        autoClose={props.autoClose}
                    />
                </DropdownOptions>
            </Dropdown>
        </div>
    )
}

Selector.propTypes = {
    autoClose: PropTypes.bool,
    children: PropTypes.node,
    type: PropTypes.oneOf(["image", "mesh", "material", "script"]),
    handleChange: PropTypes.func,
    selected: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
}

function Options(props){
    const {autoClose, handleChange, type, images, meshes, selected, getType, setState, state} = props
    const [searchString, setSearchString] = useState("")
    const dropdownContext = useContext(DropdownProvider)
    const search = useDeferredValue(searchString)
    const content = useMemo(() => {
        let filtered = getType()
            .filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
        
        if (filtered.length > 0)
            return filtered.map((t, i) => (
                <React.Fragment key={"texture-" + t.name + "-" + i}>
                    <button
                        className={styles.button}
                        data-highlight={`${state.registryID === t.registryID}`}
                        onClick={() => {
                            setState(t)
                            handleChange(t, () => setState({name: "Empty"}), () => dropdownContext.setOpen(false))

                            if(autoClose)
                                dropdownContext.setOpen(false)
                        }}
                    >
                        <SelectorItem
                            path={document.fileSystem.path}
                            type={type}
                            data={t}
                        />
                    </button>
                </React.Fragment>
            ))
        else
            return (
                <div className={styles.nothing}>
                    <Icon styles={{fontSize: "2rem"}}>folder</Icon>
                    {EN.COMPONENTS.SELECTOR.NOTHING}
                </div>
            )
    }, [ images, meshes, selected, state, search])

    return (
        <>
            <div className={styles.searchWrapper}>
                <Search searchString={searchString} setSearchString={setSearchString} width={"100%"}/>
                {type === "material" ?
                    <Button
                        className={styles.resetButton}
                        variant={"outlined"}
                        onClick={() => {
                            handleChange(undefined, () => setState({name: "Empty"}), () => dropdownContext.setOpen(false))
                        }}
                    >
                        <Icon >clear</Icon>
                        <ToolTip content={EN.COMPONENTS.SELECTOR.DEFAULT_MATERIAL}/>
                    </Button>
                    : null}
                {type === "script" ?
                    <Button 
                        className={styles.resetButton}
                        onClick={() => {
                            handleChange(undefined, () => setState({name: "Empty"}), () => dropdownContext.setOpen(false))
                        }}
                    >
                        <Icon >clear</Icon>
                        <ToolTip content={EN.COMPONENTS.SELECTOR.REMOVE_SCRIPT}/>
                    </Button>
                    : null}
            </div>
            <div className={styles.contentWrapper}>
                {content}
            </div>
        </>
    )
}
Options.propTypes={
    autoClose: PropTypes.bool,
    handleChange: PropTypes.func,
    type: PropTypes.string,
    images: PropTypes.array,
    meshes: PropTypes.array,
    selected: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    getType: PropTypes.func,
    setState: PropTypes.func,
    state: PropTypes.object
}