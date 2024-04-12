'use client'
import styles from './profile.module.scss'
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Loading from "@/components/Helps/Loading";
import NotFound from '@/components/NotFound/NotFound';



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
    if(session.user.role !== "SELLER") {
        return (
            <NotFound />
        )
    }

    return (
        <div className={styles.ListPost}>

        </div>
    )
}
