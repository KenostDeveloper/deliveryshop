import React, {useState} from 'react';
import style from '/AddPost.module.css'
import Modal from "@/components/Modal/Modal";
import dynamic from "next/dynamic";
import PreviewRenderer from "@/components/AddPost/PriviewRenderer";

const EditorBlock = dynamic(() => import("@/components/EditorJS/EditorJS"), {
    ssr: false,
});


const AddPost = ({createPost, setCreatePost}: any) => {
    const [data, setData] = useState<any>();

    return (
        <Modal active={createPost} setActive={setCreatePost}>
            <EditorBlock data={data} onChange={setData} holder="editorjs-container" />
        </Modal>
    );
};

export default AddPost;