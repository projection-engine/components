import React, {useContext, useDeferredValue, useMemo, useState} from "react"
import {Button, DropdownProvider, Icon} from "@f-ui/core"
import styles from "../styles/Selector.module.css"
import EN from "../../../static/locale/EN"
import Search from "../../search/Search"
import PropTypes from "prop-types"
import Option from "./Option"

export default function Options(props){
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
                    <Option
                        type={type}
                        autoClose={autoClose}
                        setState={setState}
                        data={t}
                        handleChange={handleChange}
                        setOpen={dropdownContext.setOpen}
                        state={state}
                    />
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
                <label>
                    {type}
                </label>
                <Search searchString={searchString} setSearchString={setSearchString} width={"100%"}/>
                {type === "material" ?
                    <Button
                        className={styles.resetButton}
                        variant={"outlined"}
                        onClick={() => {
                            handleChange(undefined, () => setState({name: "Empty"}), () => dropdownContext.setOpen(false))
                        }}
                        attributes={{title: EN.COMPONENTS.SELECTOR.DEFAULT_MATERIAL}}
                    >
                        <Icon >clear</Icon>
                    </Button>
                    : null}
                {type === "script" ?
                    <Button
                        className={styles.resetButton}
                        attributes={{title: EN.COMPONENTS.SELECTOR.REMOVE_SCRIPT}}
                        onClick={() => {
                            handleChange(undefined, () => setState({name: "Empty"}), () => dropdownContext.setOpen(false))
                        }}
                    >
                        <Icon >clear</Icon>
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