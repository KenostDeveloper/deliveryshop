const editorJsHtml = require("editorjs-html");
const EditorJsToHtml = editorJsHtml();

export default function PreviewRenderer ({ data }:any) {
    const html = EditorJsToHtml.parse(data)
    return (
        <div className="prose max-w-full" key={data.time}>
            {html.map((item:any, index:any) => {
                if (typeof item === "string") {
                    return (
                        <div dangerouslySetInnerHTML={{ __html: item }} key={index}></div>
                    );
                }
                return item;
            })}
        </div>
    );
};