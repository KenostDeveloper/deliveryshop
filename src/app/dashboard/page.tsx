'use client'
import styles from './profile.module.css'
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Loading from "@/components/Helps/Loading";



export default function Profile() {

    const [loading, setLoading] = useState(true)
    const {data: session, update} = useSession();


    useEffect(() => {
        if(typeof(session) == "object"){
            setLoading(false)
            console.log(session)
        }
    }, [session]);


    if(loading){
        return <Loading/>
    }

    if(session == null){
        return (
            <div>Вы не авторизированы</div>
        )
    }

    return (
        <div className={styles.ListPost}>

        </div>
    )
}
