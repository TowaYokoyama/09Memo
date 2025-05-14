import { useState } from "react";

type Memo ={
  id:number;
  title:string;
  content:string;
}

  const App:React.FC = () => {

  const [memos,setMemo] = useState<Memo[]>([ //useStateフックでMemos(メモ一覧)を持っている状態 Memo型の配列で
    {id:1, title:'買い物リスト',content: '牛乳\n卵\nパン'}, 
    {id:2, title:'Todoリスト',content: '牛乳\n卵\nパン'},
    {id:3, title:'日記',content: '牛乳\n卵\nパン'},
  ]);

  const [newtitle,setNewTitle] = useState<string>("");
  const [editMemoId,setEditMemoId] = useState<number | null>(null); //今編集しているメモの一時的なIDを取得
  const [editContent,setEditContent] = useState(''); //編集しているメモの一時的な内容を保存

  const AddMemo = () => {
    if(newtitle.trim() === "")return;//空文字は追加しない
    const newMemo:Memo = { //Memo型の新しい変数
      id: Date.now(), //一意に定めるために、今の時間を付けてあげて、被らせない！新しいっていうことやもんね
      title: newtitle,
      content:(''),

    };
    setMemo([...memos, newMemo]);
    setNewTitle('')//入力をクリア
  };

  const DeleteMemo = (id:number) => {
    const newMemo = memos.filter((memo)=> memo.id !== id); //条件に合うものだけを残す
    setMemo(newMemo);//新しい配列を更新
  };

  const SaveMemo = (id:number) => {  //メモ保存関数

    const updateMemo = memos.map((memo)=> 
    memo.id === id ? {...memo, content : editContent} : memo
    );
    setMemo(updateMemo);
    setEditMemoId(null);
    setEditContent('');
  }



  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">メモアプリ</h1> 
      <input
      type="text"
      value={newtitle}
      onChange={(e) => setNewTitle(e.target.value)}
      onKeyDown={(e) => {
        if(e.key === 'Enter'){
          AddMemo();
        }
      }}
      placeholder="ここに入力をしてください"
      className="border rounded p-2 mb-2 w-full"
      />

      <button //追加ボタン用
      onClick={AddMemo}
      className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        メモを追加
        </button> 


      <ul className="space-y-4">
        {memos.map((memo) => (
          <li key={memo.id} className="p-3 bg-gray-100 rounded ">
            <div className="flex justify-between items-center mb-2">
            <span className="font-bold">{memo.title}</span>
            <div className="space-x-2">
              <button
              onClick={()=>{
                setEditMemoId(memo.id); //editMemoIdに編集しているメモのIDをセット
                setEditContent(memo.content);}} //editContentに編集しているメモのコンテンツ内容をセット
                className="text-sm text-blue-500 hover:underline"
                >
              編集
            </button>
            <button
                onClick={() => DeleteMemo(memo.id)}
                className="text-sm text-red-500 hover:underline"
              >
                削除
              </button>
              </div>
              </div>

              {editMemoId === memo.id ? (
                <div>
                  <textarea
                  placeholder="メモ内容を入力"
                  value={editContent}
                  onChange={(e)=> setEditContent(e.target.value)}
                  onKeyDown={(e)=> {
                    if (e.key ==='Enter' && !e.shiftKey) {
                      e.preventDefault(); //デフォルト時の動き(改行)を止める
                      SaveMemo(memo.id);
                    }
                  }}
                  className="w-full p-2 border rounded"
                  rows={4}
                    />
                    <button
                    onClick={()=> SaveMemo(memo.id)}
                    className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      保存
                      </button>
                </div>
                ): (
                <p
                className="whitespace-pre-wrap"
                >
                  {memo.content}
                  </p>
                  )}
          </li>
          
        ))}
        
        </ul> 
      
    </div>
  );
};

export default App
