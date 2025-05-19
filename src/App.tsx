import { useEffect, useState } from "react";
import EditMemoEditor from "./Components/EditMemoEditor"; //メモの右側のエディタ部分
import { Grab, Plus } from "lucide-react"; //lucidは軽量なフレームワーク
import { createMemo, getAllMemos, updateMemo, deleteMemo } from "./api/memos" //Firestreとのcrudをまとめた関数群
import { Delete } from 'lucide-react';




import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
//Dnd（ドラッグアンドドロップ用の基本コンポーネントやユーティリティを読み込む）

import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
//並び替え可能にするためのキット

import { CSS } from "@dnd-kit/utilities";
//ドラッグ中のcss変形を可能にするユーティリティ

// App.tsx
import type { Memo } from "./types";
//types.tsからの型定義をインポート


interface SortableItemProps {
  id: string;          // アイテムの一意なID
  title: string;                // アイテムのタイトル
  createdAt: string;            // 作成日時
  updateAt?: string;             // 更新日時
  selected: boolean;            // 選択されているかどうか
  onClick: () => void;          // クリック時の処理
  onDelete: () => void;         // 削除時の処理
}

// SortableItemコンポーネントの定義
const SortableItem: React.FC<SortableItemProps> = ({ //Propsをオブジェクト分割代入している
  id,
  title,
  createdAt,
  updateAt,
  selected,
  onClick,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id.toString() });//この要素をドラッグ可能にする

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "default",
    backgroundColor: selected ? "#bfdbfe" : "white",
    padding: "8px",
    borderRadius: "6px",
    marginBottom: "6px",
    boxShadow: isDragging ? "0 2px 8px rgba(0,0,0,0.15)" : undefined,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  return (
    <div
      ref={setNodeRef} //このdivがdrag可能であるということを通知
      style={style}
      className="select-none"
      onClick={onClick} // メモを選択した時の処理
    >
      <div className="font-bold">{title}</div>
      <div className="text-xs text-gray-500">
        作成: {createdAt}
        {updateAt && <div>更新: {updateAt}</div>}
      </div>

      <div className="flex justify-end items-center space-x-2 mt-1">
        {/* 削除ボタン */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // 親のonClickを防ぐ
            onDelete(); //削除処理を実行
          }}
          className="text-red-500 hover:underline text-sm"
          aria-label="Delete memo"
        >
          <Delete/>
        </button>

        {/* ドラッグハンドル（三本線） */}
        <div
          {...attributes}
          {...listeners}
          style={{ cursor: "grab", padding: "4px" }}
          title="ドラッグして並べ替え"
          onClick={(e) => e.stopPropagation()} // クリック時にメモ切り替えされないようにする
        >
          <Grab />
        </div>
      </div>
    </div>
  );
};



//認証状態の監視
// App.tsx の中で
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from './firebase';
import Login from "./login";




const App: React.FC = () => {
  const [sortOption, setSortOption] = useState("newest");
  const [memos, setMemo] = useState<Memo[]>([]);
  const [newtitle, setNewTitle] = useState<string>("");
  const [selectedMemoId, setSelectedMemoId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // DnD-kit sensors
  const sensors = useSensors(useSensor(PointerSensor));

  const selectedMemo = memos.find((memo) => memo.id === selectedMemoId);

  //初回読み込みでFirestoreからデータを取得
  useEffect(()=>{
    const fetchMemos = async() => {
      const fetched = await getAllMemos(); //getALlMemosはfirestoreにある全メモをとってくる自作API関数
      setMemo(fetched); //ステートに保存
      if (fetched.length>0) setSelectedMemoId(fetched[0].id);
    };
    fetchMemos();
  },[]);

  const AddMemo = async() => {
    if (newtitle.trim() === "") return; //メモ欄が空白だったら中止
    const now = new Date().toLocaleString(); //現在日時を取得

    const id = await createMemo("", newtitle); // Firestoreに保存してIDを取得

    const newMemo: Memo = {
      id,
      title: newtitle,
      content: "",
      createdAt: now,
      updateAt: now,
    };
    
    //await createMemo(newMemo);//追加
    setMemo((prev) => [...prev, newMemo]); //既存の配列に追加
    setNewTitle(""); //入力欄をクリア
    setSelectedMemoId(newMemo.id); //作成したメモを選択状態に
  };

  const DeleteMemo = async(id: string) => {
    await deleteMemo(id); //firestoreから削除
    setMemo((prev) => prev.filter((memo) => memo.id !== id));//ローカルからも除外
    if (selectedMemoId === id) setSelectedMemoId(null); //削除氏らメモが選択中なら選択解除
  };

  const SaveMemoWithHtml = async(id: string, html: string) => {
    const now = new Date().toLocaleString(); //保存時間


    setMemo((prev) =>
      prev.map((memo) => 
        (memo.id === id ? { ...memo, content: html, updateAt: now } : memo)//もし現在の状態と同じidであるならばオブジェクトを渡す
  )
    );
    await updateMemo(id,html, selectedMemo?.title?? "")//Firestoreに反映
  };
  

  // 並び替え処理（ただし手動並び替えはこのソート無視）
  const sortedMemos =
    sortOption !== "manual"
      ? [...memos].sort((a, b) => {
          switch (sortOption) {
            case "newest":
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "oldest":
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "titleAsc":
              return a.title.localeCompare(b.title);
            case "titleDesc":
              return b.title.localeCompare(a.title);
            default:
              return 0;
          }
        })
      : memos; // 手動並びはmemosそのまま

  const filteredMemos = sortedMemos.filter(
    (memo) =>
      memo.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      memo.content.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // @dnd-kitのドラッグ終了時の処理
  const handleDragEnd = (event:any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = memos.findIndex((memo) => memo.id === active.id);
      const newIndex = memos.findIndex((memo) => memo.id === over.id);
      const newMemos = arrayMove(memos, oldIndex, newIndex);
      setMemo(newMemos);
      setSortOption("manual"); // 手動並びに切り替え
    }
  };

  const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });
  return () => unsubscribe();
}, []);
 


  if (!user) {
  return <Login />;
}


  return (
  
    <div className="flex h-screen">
      {/* 左カラム */}
      <aside className="w-1/4 bg-gray-100 p-4 space-y-2">
        <div className="relative w-full max-w-xs">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="relative py-3 ps-4 pr-14 w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600"
            aria-label="並び替え"
          >
            <option value="">並び順を選択...</option>
            <option value="newest">新しい順</option>
            <option value="oldest">古い順</option>
            <option value="titleAsc">タイトル A→Z</option>
            <option value="titleDesc">タイトル Z→A</option>
            <option value="manual">手動並び替え</option>
          </select>
        </div>

        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">メモアプリ</h2>

          <button
            onClick={AddMemo}
            className="text-blue-500 hover:text-blue-700"
            title="新しいメモを追加"
          >
            <Plus size={20} />
          </button>
        </div>

        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="検索..."
          className="border rounded mb-2 p-2 w-full"
        />

        <input
          type="text"
          value={newtitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={async(e) => {
            if (e.key === "Enter") {
              await AddMemo();//非同期で呼ぶ
            }
          }}
          placeholder="新しいメモ"
          className="border rounded p-2 mb-2 w-full"
        />
        {/*ログアウトボタンを左上に作る */}
        <button
  onClick={() => signOut(auth)}
  className="text-sm text-gray-600 underline hover:text-red-500"
>
  ログアウト
</button>


        {/* ドラッグ＆ドロップ可能リスト */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={filteredMemos.map((m) => m.id.toString())} strategy={verticalListSortingStrategy}>
            {filteredMemos.map((memo) => (
              <SortableItem
                key={memo.id}
                id={memo.id}
                title={memo.title}
                createdAt={memo.createdAt}
                updateAt={memo.updateAt}
                selected={selectedMemoId === memo.id}
                onClick={() =>
                   setSelectedMemoId(memo.id)}
                onDelete={() => DeleteMemo(memo.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </aside>

      {/* 右カラム */}
      <main className="flex-1 p-4 overflow-y-auto h-full">
        {selectedMemo ? (
          <EditMemoEditor
            title={selectedMemo.title}
            key={selectedMemo.id}
            content={selectedMemo.content}
            onSave={(html) => SaveMemoWithHtml(selectedMemo.id, html)}
          />
        ) : (
          <p className="text-gray-400">←メモを選択してください</p>
        )}
      </main>
    </div>
  );
};

export default App;
