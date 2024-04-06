import React from 'react';
import Link from "next/link";
import style from './SitebarLink.module.css'

interface ISitebarLink{
    ancore: string,
    icon: React.JSX.Element,
    href: string
}

const SitebarLink = (props: ISitebarLink) => {
    return (
        <Link className={style.sitebarLink} href={props.href}>{props.icon}{props.ancore}</Link>
    );
};

export default SitebarLink;