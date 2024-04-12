"use client";

import Profile from "@/components/Profile/Profile";
import styles from "./profile.module.scss";
import { useState } from "react";
import { useSession } from "next-auth/react";
import NotFound from "@/components/NotFound/NotFound";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [isEdit, setIsEdit] = useState(false);

    if (session?.user.role !== "BUYER") {
        return <NotFound />;
    }

    return <Profile isEdit={isEdit} setIsEdit={setIsEdit} isSeller={false} />;
}
