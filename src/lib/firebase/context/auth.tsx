/** @jsxImportSource react */
// use client
"use client"
import { 
    onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc,setDoc } from 'firebase/firestore';
import { auth,db } from '@/lib/firebase/config'
import { User } from '../types/user';
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
type UserContextType = User | null | undefined;
const AuthContext = createContext<UserContextType>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserContextType>();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // ログインしていた場合、ユーザーコレクションからユーザーデータを参照
                const ref = doc(db, `users/${firebaseUser.uid}`);
                const snap = await getDoc(ref);
        
                if (snap.exists()) {
                  // ユーザーデータを取得して格納
                  const appUser = (await getDoc(ref)).data() as User;
                  setUser(appUser);
                } else {
                  // ユーザーが未作成の場合、新規作成して格納
                  const appUser: User = {
                    id: firebaseUser.uid,
                    username: firebaseUser.displayName!,
                    profileIconURL: firebaseUser.photoURL!,
                    email: firebaseUser.email!,
                    dateOfBirth: new Date(),
                    gender:'male'
                  };
        
                  // Firestoreにユーザーデータを保存
                  setDoc(ref, appUser).then(() => {
                    // 保存に成功したらコンテクストにユーザーデータを格納
                    setUser(appUser);
                  });
                }
              } else {
                // ログインしていない場合、ユーザー情報を空にする
                setUser(null);
              }
              return unsubscribe;
        });
    }, []);
    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);