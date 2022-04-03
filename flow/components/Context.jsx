import PropTypes from "prop-types";
import {useEffect, useMemo, useState} from "react";
import styles from '../styles/Context.module.css'
import Search from "../../search/Search";

export default function Context(props) {
    const [searchString, setSearchString] = useState('')

    const trigger = useMemo(() => {
        let type = -1
        if (props.selected) {
            let t = props.selected.getAttribute('data-board')
            if (!t) {
                t = props.selected.getAttribute('data-node')
                type = 1
            }
            if (!t) {
                t = props.selected.getAttribute('data-link')
                type = 2
            }
            if (!t) {
                t = props.selected.getAttribute('data-group')
                type = 3
            }

            if (!t)
                type = -1
            else if (t && type === -1) type = 0
        }
        return type
    }, [props.selected])
    const nodes = useMemo(() => {

        return props.availableNodes.filter(a => {

            if (typeof a.label === "object") {
                return (typeof a.label.props.children === "object" ? a.label.props.children.join('') : a.label.props.children).toLowerCase().includes(searchString.toLowerCase())
            } else
                return a.label.toLowerCase().includes(searchString.toLowerCase())
        })
    }, [props.availableNodes, searchString])

    useEffect(() => {
        props.handleClose()
    }, [props.scale])

    return (
        <div className={styles.wrapper} style={{height: trigger === 0 ? '650px' : undefined}}>
            {trigger >= 0 ?
                trigger === 0 ?
                    <>
                        <header className={styles.headerWrapper}>
                            <h1 className={styles.header}>
                                Available nodes

                            </h1>
                            <Search width={'100%'} searchString={searchString} setSearchString={setSearchString}/>
                        </header>
                        {nodes.map((a, i) => (
                            <button
                                key={a.dataTransfer + '-option-context'}
                                className={styles.option}
                                style={{background: i % 2 === 0 ? 'var(--fabric-background-secondary)' : undefined}}
                                onClick={(e) => {
                                    props.onSelect(a.dataTransfer, e)
                                    props.handleClose()
                                }}>
                                {a.label}
                            </button>
                        ))}
                    </>
                    :
                    <>
                        <button
                            className={styles.option}
                            style={{border: 'none', display: trigger === 2 ? 'none' : undefined}}
                            onClick={() => {
                                if (trigger === 3)
                                    props.deleteGroup()
                                else
                                    props.deleteNode()
                                props.handleClose()
                            }}>
                            <span className={'material-icons-round'}>delete</span>
                            {trigger === 1 ? 'Delete Node' : 'Delete comment'}
                        </button>

                        <button
                            className={styles.option}
                            style={{border: 'none', display: trigger === 1 || trigger === 3 ? 'none' : undefined}}
                            onClick={() => {
                                props.deleteLink()
                                props.handleClose()
                            }}>
                            <span className={'material-icons-round'}>link_off</span>
                            Break link
                        </button>
                    </>
                : null
            }
        </div>
    )
}

Context.propTypes = {
    deleteGroup: PropTypes.func,
    scale: PropTypes.number,
    deleteLink: PropTypes.func,
    deleteNode: PropTypes.func,
    handleClose: PropTypes.func,
    availableNodes: PropTypes.array,
    onSelect: PropTypes.func,
    selected: PropTypes.object,
}

