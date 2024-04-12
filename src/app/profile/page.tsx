"use client";

import Profile from "@/components/Profile/Profile";
import styles from "./profile.module.scss";
import { useState } from "react";

export default function ProfilePage() {

    const [isEdit, setIsEdit] = useState(false);

    return (
        <Profile isEdit={isEdit} setIsEdit={setIsEdit} />
    )
}