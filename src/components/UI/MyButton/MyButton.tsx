import React from 'react';
import style from './MyButton.module.css'

const MpInput = ({children, ...props}: any) => {
    return (
        <button {...props} className={style.MpButton}>{children}</button>
    );
};

export default MpInput;