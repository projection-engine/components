import styles from "./styles/Styles.module.css"
import PropTypes from "prop-types"
import {Accordion, AccordionSummary} from "@f-ui/core"
import React from "react"

export default function AccordionTemplate(props) {
    return (
        <Accordion
            className={styles.accordion}
            contentClassName={styles.content}
            contentStyles={{display: props.type ? props.type : "grid", gap: "4px"}}>
            <AccordionSummary className={styles.summary}>
                <label className={styles.overflow}>{props.title}</label>
            </AccordionSummary>
            {props.children}
        </Accordion>
    )
}
AccordionTemplate.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    type: PropTypes.oneOf(["flex", "grid"])
}