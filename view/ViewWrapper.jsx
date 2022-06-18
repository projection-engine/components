import PropTypes from "prop-types"
import styles from "./ViewWrapper.module.css"
import {Button, Icon} from "@f-ui/core"
import React, {useContext, useId, useMemo, useRef, useState} from "react"
import ResizableBar from "../resizable/ResizableBar"
import Search from "../search/Search"
import {createFolder} from "../../project/components/hierarchy/utils/hiearchyUtils"
import Hierarchy from "../../project/components/hierarchy/Hierarchy"
import ComponentEditor from "../../project/components/component/ComponentEditor"

const ViewWrapperProvider = React.createContext(false)
export default function ViewWrapper(props){
    const id = useId()
    const SIZE = props.content.length
    const [hidden, setHidden] = useState(false)
    const ref = useRef()
 
    
    return (
        <ViewWrapperProvider.Provider value={hidden}>
            <ResizableBar
                resetTargets={{previous: true, next: false}}
                resetWhen={[hidden]}
                type={"width"}
                onResizeStart={() => {
                    if(hidden)
                        setHidden(false)
                }}
                onResizeEnd={() => {
                    if (ref.current.getBoundingClientRect().width <= 45)
                        setHidden(true)
                }}/>
            <div 
                ref={ref} 
                className={styles.wrapper}
                data-orientation={props.orientation} 
                style={{width: "300px", maxWidth: hidden ? "30px" : undefined, minWidth: hidden ? "30px" : undefined}}
            >
                {props.content.map((view, vI) => (
                    <React.Fragment key={id + "-view-"+vI} >
                        <div className={styles.view}>
                            {hidden ? (
                                <div className={styles.header}>
                                    <div className={[styles.title, styles.titleHidden].join(" ")}>
                                        {view.icon ? <div className={styles.icon}><Icon styles={{fontSize: "1.2rem"}}>{view.icon}</Icon></div> : null}
                                        <label>{view.title}</label>
                                    </div>
                                </div>
                            ) 
                                : 
                                view.content
                            }
                        </div>
                        {vI < SIZE -1 && SIZE > 1 ? <ResizableBar type={"height"}/> : null}
                    </React.Fragment>
                ))}
            </div>
        </ViewWrapperProvider.Provider>
    )
}

ViewWrapper.propTypes={
    content: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        icon: PropTypes.string,
        headerOptions: PropTypes.node,
        
        content: PropTypes.node
    })),
    orientation: PropTypes.oneOf(["vertical", "horizontal"]),
}


function Header(props){
    const {icon, title, children} = props 
    return (
        <div className={styles.header}>
            <div className={styles.title}>
                {icon ? <div className={styles.icon}><Icon styles={{fontSize: "1.2rem"}}>{icon}</Icon></div> : null}
                <label>{title}</label>
            </div>
            {children  ?
                <div className={styles.options}>
                    {children}
                </div>
                :
                null}
        </div>
    )
}
Header.propTypes={
    icon: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.node
}
ViewWrapper.Header = Header

// function View(props){
//     const view = useMemo(() => {
//         switch (props.instance){
//         case "blueprint":
//             break
//         case "hierarchy":
//             return   {
//                 title: "Hierarchy",
//                 icon: "account_tree",
//                 headerOptions:(
//                     <div style={{display: "flex", gap: "2px"}}>
//                         <Search
//                             width={"100%"}
//                             searchString={searchedEntity}
//                             setSearchString={setSearchedEntity}
//                         />
//                         <Button className={styles.button} onClick={() => createFolder()}>
//                             <Icon styles={{fontSize: "1rem"}}>create_new_folder</Icon>
//                         </Button>
//                     </div>
//                 ),
//                 content: (
//                     <Hierarchy/>
//                 )
//             }
//         case "component":
//             return {
//                 title: props.engine.selectedEntity ? props.engine.selectedEntity.name : "Component editor",
//                 icon: "category",
//                 headerOptions: props.engine.selectedEntity ?(
//                     <Button
//                         styles={{minHeight: "25px", minWidth: "25px"}}
//                         onClick={() => props.engine.setLockedEntity(props.engine.lockedEntity === props.engine.selectedEntity.id ? undefined : props.engine.selectedEntity.id)}
//                         className={styles.button}
//                         variant={props.engine.lockedEntity === props.engine.selectedEntity.id ? "filled" : undefined}
//                     >
//                         <Icon styles={{fontSize: "1rem"}}>push_pin</Icon>
//                     </Button>
//                 ) : null,
//                 content: <ComponentEditor engine={props.engine}/>
//             }
//
//         case "files":
//             return  null
//         default:
//             return null
//         }
//     }, [])
//     return (
//         <div className={styles.view}>
//             <div className={styles.header}>
//                 <div className={[styles.title, props.hidden ? styles.titleHidden : ""].join(" ")}>
//                     {view.icon ? <div className={styles.icon}><Icon styles={{fontSize: "1.2rem"}}>{view.icon}</Icon></div> : null}
//                     <label>{view.title}</label>
//                 </div>
//                 {!props.hidden && view.headerOptions  ?
//                     <div className={styles.options}>
//                         {view.headerOptions}
//                     </div>
//                     :
//                     null
//                 }
//             </div>
//             {props.hidden ? null : view.content}
//         </div>
//     )
// }
// View.propTypes={
//     engine: PropTypes.object,
//     hidden: PropTypes.bool,
//     instance: PropTypes.oneOf(["hierarchy", "component", "files", "blueprint"])
// }