import styles from "./styles/Projects.module.css";
import PropTypes from 'prop-types'
import React, {useState} from "react";
import Card from "./components/Card";
import {Button} from "@f-ui/core";

export default function Projects(props) {
    const [variant, setVariant] = useState('cell')
    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>
                Your projects
              <div style={{display: 'flex', gap: '4px'}}>
                  <Button
                      className={styles.button}
                      variant={'outlined'}
                      onClick={() => props.onLoad()}>
                      Load project
                  </Button>
                  <Button
                      className={styles.button}
                      variant={'filled'}
                      onClick={() => props.onNew()}>
                      New project
                  </Button>
              </div>
            </div>
            <div className={styles.content}>
                {props.projects.map((p, i)=> (
                <React.Fragment key={p.id}>
                    <Card
                        onClick={() => props.redirect('/project?id=' + p.id)}
                        variant={variant}
                        data={p} index={i}
                        onRename={newName  => {
                            props.renameProject(newName)
                        }}
                        onDelete={() => {
                            props.deleteProject(p.id)
                        }}/>
                </React.Fragment>
                ))}
            </div>
        </div>

    )
}

Projects.propTypes = {
    deleteProject: PropTypes.func.isRequired,
    onLoad: PropTypes.func,
    onNew: PropTypes.func,
    refresh: PropTypes.func,
    renameProject: PropTypes.func.isRequired,
    load: PropTypes.object,
    redirect: PropTypes.func,
    projects: PropTypes.array,
    setProjects: PropTypes.func
}