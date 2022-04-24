import PropTypes from "prop-types";
import usePreview from "./usePreview";
import {useState} from "react";

export default function Preview(props){
    const ref= usePreview(props.path)
    const [error, setError] = useState(false)

    return (
        <>
            <img draggable={false}  ref={ref} className={props.className} style={{...props.styles, ...{display: error ? 'none' : undefined}}} alt={''} onError={() => setError(true)} onLoad={() => setError(false)} />
            <span className={['material-icons-round', props.iconClassname].join(' ')} style={{...props.iconStyles, ...{display: !error ? 'none' : undefined}}}>{props.fallbackIcon ? props.fallbackIcon : 'image'}</span>
            {error ? props.children : null}
        </>
    )
}

Preview.propTypes={
    children: PropTypes.node,
    iconClassname: PropTypes.string,
    iconStyles: PropTypes.object,

    classname: PropTypes.string,
    styles: PropTypes.object,

    path: PropTypes.string,
    fallbackIcon: PropTypes.string
}