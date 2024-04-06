import React from 'react';
import styles from './UI.module.css'


const Title = ({text, margin}:any) => {
    return (
        <h2 className={margin == false? `${styles.title}` : `${styles.title} ${styles.margin}`}>{text}</h2>
    );
};

export default Title;