import styles from './styles/GlobalOptions.module.css'
import {Dropdown} from "@f-ui/core";
export default function GlobalOptions(props){
    return (
        <div className={styles.wrapper}>
            <Dropdown >
                File
            </Dropdown>
            <Dropdown >
                Editor
            </Dropdown>
            <Dropdown >
                Help
            </Dropdown>
        </div>
    )
}
Options.propTypes={

}