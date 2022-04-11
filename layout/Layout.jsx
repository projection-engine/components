import styles from './styles/Layout.module.css'
import PropTypes from "prop-types";
import React from 'react'

export default function Layout(props){
    const children = React.Children.toArray(props.children)

     return (
         <div className={styles.wrapper}>

         </div>
     )
}
Layout.propTypes={
    children: PropTypes.node,

}