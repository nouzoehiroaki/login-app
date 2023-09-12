import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth'
import { auth, db, storage } from '@/lib/firebase/config'
import { doc, setDoc } from 'firebase/firestore'
import { Gender } from '@/lib/firebase/types/user'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'


/** firebaseの処理結果 */
export type FirebaseResult = {
    isSuccess: boolean
    message: string
}

/** firebaseのエラー */
type FirebaseError = {
    code: string
    message: string
    name: string
}

const isFirebaseError = (e: Error): e is FirebaseError => {
    return 'code' in e && 'message' in e
}

/**
 * EmailとPasswordでサインイン
 * @param email
 * @param password
 * @returns Promise<FirebaseResult>
 */
export const signInWithEmail = async (args: {
    email: string
    password: string
}) : Promise<FirebaseResult> => {
    let result: FirebaseResult = { isSuccess: false, message: '' }
    try {
        const user = await signInWithEmailAndPassword(
            auth,
            args.email,
            args.password
        )
        if (user) {
            result = { isSuccess: true, message: 'ログインに成功しました' }
        }
    } catch (error) {
        if (
            error instanceof Error &&
            isFirebaseError(error) &&
            error.code === 'auth/user-not-found'
        ){
            result = { isSuccess: false, message: 'ユーザが見つかりませんでした' }
        }else if (
            error instanceof Error &&
            isFirebaseError(error) &&
            error.code === 'auth/wrong-password'
        ){
            result = { isSuccess: false, message: 'パスワードが間違っています' }
        }else {
            result = { isSuccess: false, message: 'ログインに失敗しました' }
        }
    }
    return result
}


/**
 * ユーザーネームとEmailとPasswordと誕生日とアイコンでサインアップ
 * @param username
 * @param email
 * @param password
 * @param dateOfBirth
 * @param photoURL
 * @param gender
 * @returns Promise<FirebaseResult>
 */

/**
 * ファイルをFirebase Storageにアップロード
 * @param file 
 * @returns Promise<string> - ファイルのダウンロードURL
 */

const uploadFileToFirebase = async (file: File): Promise<string> => {
    const storageRef = ref(storage, 'user-icons/' + file.name);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
}

type SignUpWithEmailArgs = {
    username: string;
    email: string;
    password: string;
    dateOfBirth: string;
    photoURL: string;
    gender?: Gender;
};
export const signUpWithEmail = async (args: SignUpWithEmailArgs & { file: File }): Promise<FirebaseResult> => {
    let result: FirebaseResult = { isSuccess: false, message: '' }
    try {
        const user = await createUserWithEmailAndPassword(
            auth,
            args.email,
            args.password
        )
        if (user) {
            const photoURL = await uploadFileToFirebase(args.file);
            
            const userDoc = doc(db, 'users', user.user.uid);
            await setDoc(userDoc, {
                username: args.username,
                email: args.email,
                dateOfBirth: args.dateOfBirth,
                gender: args.gender,
                photoURL: photoURL
            });
            result = { isSuccess: true, message: '新規登録に成功しました' }
        }
    } catch (error) {
        if (
            error instanceof Error &&
            isFirebaseError(error) &&
            error.code === 'auth/email-already-in-use'
        ){
            result = {
                isSuccess: false,
                message: 'メールアドレスが既に使用されています',
            }
        } else {
            result = { isSuccess: false, message: '新規登録に失敗しました' }
        }
    }
    return result
}

/**
 * ログアウト処理
 * @returns Promise<FirebaseResult>
 */

export const logout = async (): Promise<FirebaseResult> => {
    let result: FirebaseResult = { isSuccess: false, message: '' }
    
    await signOut(auth)
        .then(() => {
            result = { isSuccess: true, message: 'ログアウトしました' }
        })
        .catch((error) => {
            result = { isSuccess: false, message: error.message }
        })
    return result
}
