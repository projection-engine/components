import PropTypes from "prop-types";
import styles from './styles/SelectorItem.module.css'
import {useMemo} from "react";

export default function SelectorItem(props) {
    const icon = useMemo(() => {
        switch (props.type) {
            case 'mesh':
                return <span className={'material-icons-round'} style={{fontSize: '2rem'}}>view_in_ar</span>
            case 'image':
                return props.data.blob ?
                    <img src={props.data.blob} alt={props.data.name} className={styles.image}/>
                    :
                    <span className={'material-icons-round'} style={{fontSize: '2rem'}}>image</span>

            case 'material':
                return <span className={'material-icons-round'} style={{fontSize: '2rem'}}>texture</span>

            case 'script':
                return <span className={'material-icons-round'} style={{fontSize: '2rem'}}>engineering</span>
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
    type: PropTypes.oneOf(['image', 'mesh', 'material', 'script']),
    data: PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.string,
        blob: PropTypes.string,
        creationDate: PropTypes.string,
        fallback: PropTypes.bool
    })
}