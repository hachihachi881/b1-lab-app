import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);  //ユーザの状態を感知するためのstateを用意
  const [loading, setLoading] = useState(true);  //ユーザの状態を感知するためのstateを用意。初期値はtrue。ユーザの状態を感知するまではローディング中とする

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {  //ユーザの状態を感知するための関数。ユーザの状態が変わるたびに呼び出される。引数には現在のユーザの情報が渡される
      setUser(u);  
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  return { user, loading };
};