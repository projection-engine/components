import styles from '../styles/Available.module.css'
import {Button, ToolTip, useListData} from "@f-ui/core";

import Search from "../../search/Search";
import {useMemo, useState} from "react";
import PropTypes from "prop-types";

export default function Available(props) {
    const [searchString, setSearchString] = useState('')
    const nodes = useMemo(() => {
        return props.allNodes.filter(i => {
            if (typeof i.label === "object")
                return i.label.props.children.includes(searchString)
            else
                return i.label.includes(searchString)
        })
    }, [searchString])
    return (
        <div className={styles.wrapper}>
            <label className={styles.header}>
                Available nodes
                <Search width={'100%'} noPadding={true} height={'20px'} searchString={searchString} setSearchString={setSearchString}/>
            </label>

            <div className={styles.content}>
                {nodes.map((d, i) => (
                    <div
                        className={styles.option}
                        draggable={true}
                        title={d.tooltip}
                        style={{background: i%2 === 0 ? 'var(--fabric-background-secondary)' : undefined}}
                        onDragStart={e => e.dataTransfer.setData('text', d.dataTransfer)}>
                        <div className={styles.icon}>
                            {d.icon}
                        </div>
                        {d.label}
                    </div>
                ))}
            </div>
        </div>
    )
}

Available.propTypes={
    allNodes: PropTypes.array
}