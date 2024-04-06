import React from 'react';
import style from './Modal.module.css'
import MpPlus from "@/components/Icons/MpPlus";

const Modal = ({active, setActive, children}: any) => {
    return (
        <div className={active ? `${style.modal} ${style.active}` : style.modal} onClick={() => setActive(false)}>
            <div className={style.modal__content} onClick={(e) => e.stopPropagation()}>
                <div onClick={() => setActive(false)} className={style.modal__close}><MpPlus/></div>
                {children}
            </div>
        </div>
    );
};

export default Modal;