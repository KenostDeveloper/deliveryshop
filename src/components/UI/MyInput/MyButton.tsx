import React from 'react';
import style from './MyInput.module.scss'

const MyButton = ({children, ...props}: any) => {
    return (
        <button {...props} className={style.MyButton}>{children}</button>
    );
};

export default MyButton;