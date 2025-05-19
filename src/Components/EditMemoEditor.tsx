import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "../MenuBar";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";


type Props = { 
    content:string;
    title:string;
    onSave:(html:string)=> void; //タイトルと本文両方を返す
}



const EditMemoEditor:React.FC<Props> = ({content,onSave}) => {
    //const [currentTitle,setCurrentTitle] = useState(title);
    const editor = useEditor({ //拡張機能
        extensions:[
            StarterKit,
            Placeholder.configure({
                placeholder:'ここにメモを入力してください...'
            })
            
        ],
        content,

    });
    
    //Props.contentsが変わったときに変更する
    useEffect(()=>{
        if (editor && content ){
            editor.commands.setContent(content);
            editor.commands.focus("end") //カーソル末尾へ
        }
    },[content,editor])

  return (
    <div className="flex flex-col h-full">
        {/*ツールバー */}
        <MenuBar editor={editor} />
        {/*エディター本体 */}
        <div className="flex-1 overflow-auto border rounded bg-white p-2"> {/*中身が多くなってもスクロール可能に */}
        <EditorContent editor={editor} className="focus:outline-none w-full min-h-[300px] px-2 py-1 bg-transparent border-none shadow-none" />
        </div>

    <button
    onClick={()=> {
        if (!editor) return;
        onSave(editor.getHTML());
    }}
    className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 self-end" //保存ボタンを右下に寄せる
    >
        保存
        </button>
    </div>
  );
};

export default EditMemoEditor;
