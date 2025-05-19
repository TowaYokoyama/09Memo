
import { db } from "../firebase"; // firebase.tsのパスに合わせて変更
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

import type { Memo } from "../types";


//c

const memosCollectionRef = collection(db,"memos");

export const createMemo = async(content:string, title:string):Promise<string>=>{
    const newMemo={
        content,
        title,
        createdAt:new Date(),
    };
    const docRef=await addDoc(memosCollectionRef, newMemo);
    return docRef.id;
};



//r

export const getAllMemos = async():Promise<Memo[]>=>{
    const querySnapShot =await getDocs(memosCollectionRef);
      return querySnapShot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title ?? "",
      content: data.content ?? "",
      createdAt: data.createAt?.toDate?.().toLocaleString() ?? "",
      updateAt: data.updateAt?.toDate?.().toLocaleString() ?? undefined,
    };
    });
};

//u

export const updateMemo = async(id:string,content:string,title:string):Promise<void>=>{
    const memoRef =doc(db, "memos",id);
    await updateDoc(memoRef, {
        content,
        title,
        updateAt:new Date(),
    });
};

//d

export const deleteMemo = async(id:string):Promise<void>=>{
    const memoRef = doc(db,"memos",id);
    await deleteDoc(memoRef);
};