import PropTypes from "prop-types";
import styles from './styles/SelectorItem.module.css'
import {useMemo} from "react";
import Preview from "../preview/Preview";

export default function SelectorItem(props) {
    const p = useMemo(() => {
        return props.path + '\\previews\\' + props.data.registryID + '.preview'
    }, [props.data?.registryID])
    const icon = useMemo(() => {
        switch (props.type) {
            case 'mesh':
                return <span className={'material-icons-round'} style={{fontSize: '2rem'}}>view_in_ar</span>
            case 'image':
                return (
                    <Preview iconStyles={{fontSize: '1.6rem'}} path={p} className={styles.image}/>
                )
            case 'material':
                return <span className={'material-icons-round'} style={{fontSize: '2rem'}}>texture</span>
            case 'script':
                return <span className={'material-icons-round'} style={{fontSize: '1.5rem'}}>code</span>
            default:
                return
        }
    }, [props.type, props.data])

    return (
        <div className={styles.wrapper}>
            {icon}
            <label className={styles.label} title={props.data.name}>
                {props.data.name?.replace('.' + props.type, '')}
            </label>
        </div>
    )
}
SelectorItem.propTypes = {
    path: PropTypes.string,
    type: PropTypes.oneOf(['image', 'mesh', 'material', 'script']),
    data: PropTypes.shape({
        name: PropTypes.string,
        registryID: PropTypes.string,
        blob: PropTypes.string,
        creationDate: PropTypes.string,
        fallback: PropTypes.bool
    })
}