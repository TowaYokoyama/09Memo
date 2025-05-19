import { Bold, Italic, List, Redo, Undo } from "lucide-react";


const MenuBar = ({editor}:{editor:any}) => {
    if (!editor) return null;


  return (
    <div className="flex space-x-2 mb-2">
      <button 
      onClick={()=> editor.chain().focus().toggleBold().run()}
      className={`p-1 rounded ${editor.isActive('bold') ? 'bg-gray-300':""} `}
      aria-label="太字"
      >
        <Bold size={16} />
        </button>
        <button 
        onClick={()=> editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded ${editor.isActive('Italic') ? 'bg-gray-300':""} `}
        aria-label="太字"
        >
        <Italic size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
        aria-label="太字"
      >
        <List size={16} />
      </button>
      <button onClick={() => editor.chain().focus().undo().run()} className="p-1 rounded" aria-label="太字">
        <Undo size={16} />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} className="p-1 rounded" aria-label="太字">
        <Redo size={16} />
      </button>
      
    </div>
  )
}

export default MenuBar
