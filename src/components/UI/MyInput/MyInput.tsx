import React from 'react';
import style from './MyInput.module.scss'

const MyInput = ({...props}) => {
    return (
        <div>
            <input className={style.MyInput} {...props}/>
            <p className={style.MyInputError}>{props?.errorText}</p>
        </div>
    );
};

export default MyInput;