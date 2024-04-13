"use client";

import Profile from "@/components/Profile/Profile";
import styles from "./profile.module.scss";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import NotFound from "@/components/NotFound/NotFound";
import Loading from "@/components/Helps/Loading";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof session == "object") {
            setIsLoading(false);
        }
    }, [session]);

    if (isLoading) {
        return <Loading />;
    }

    if (session?.user.role !== "BUYER") {
        return <NotFound />;
    }

    return <Profile isEdit={isEdit} setIsEdit={setIsEdit} isSeller={false} isLoading={isLoading} />;
}
