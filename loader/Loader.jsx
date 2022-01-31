import styles from "./styles/Loader.module.css";
import randomInRange from "../../utils/randomInRange";
import {Modal} from "@f-ui/core";
import PropTypes from "prop-types";

export default function Loader(props){
    return(
        <div className={styles.wrapper}>
            <div
                className={styles.loader}
                style={{background: props.dark ? '#303030' : 'white', color: props.dark ? 'white' : '#333333'}}
            >
                {Object.keys(props.events).map((e, i) => (
                    <div className={styles.loadInfo} key={e+'-loading-indicator-'+i}>
                        {e}
                        <div data-index={`${i}`} className={styles.loaderBar} style={{background: props.dark ? '#111111' : ' #ced4da',}}>
                            <div className={styles.loading} style={{
                                animationDelay: `${i * 100}ms`,
                                '--animationSpeed': randomInRange(2, 1) + 's'}}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
Loader.propTypes={
    events: PropTypes.object,
    dark: PropTypes.bool
}