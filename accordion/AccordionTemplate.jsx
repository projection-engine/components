import styles from './styles/Styles.module.css'
import PropTypes from "prop-types";
import {Accordion, AccordionSummary} from "@f-ui/core";

export default function AccordionTemplate(props) {
    return (
        <Accordion
            className={styles.accordion}
            contentClassName={styles.content}
            contentStyles={{display: props.type, gap: '4px'}}>
            <AccordionSummary className={styles.summary}>
                {props.title}
            </AccordionSummary>
            {props.children}
        </Accordion>
    )
}
AccordionTemplate.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    type: PropTypes.oneOf(['flex', 'grid'])
}