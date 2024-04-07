import React from 'react';
import styles from './UI.module.css'


const Title = ({text, margin, ...props}:any) => {
    return (
        <h2 {...props} className={margin == false? `${styles.title}` : `${styles.title} ${styles.margin}`}>{text}</h2>
    );
};

export default Title;