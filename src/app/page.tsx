/* eslint-disable */
'use client'
import NextLink from 'next/link'
import { logout as logoutFunction } from '@/lib/firebase/apis/auth'
import UserGuard from '../lib/firebase/apis/user-guard'
import { useEffect } from 'react'
import { useAuth } from '../lib/firebase/context/auth'
import styles from '@/styles/Page.module.scss'
import { differenceInDays, addYears, isBefore, parseISO } from 'date-fns'
import Image from 'next/image'
function daysUntilBirthday(dateOfBirthString: any) {
    const today = new Date();
    const birthday = parseISO(dateOfBirthString); 
    const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
    if (isBefore(thisYearBirthday, today)) {
        const nextYearBirthday = addYears(thisYearBirthday, 1);
        return differenceInDays(nextYearBirthday, today);
    }
    return differenceInDays(thisYearBirthday, today);
}
export default function HomeScreen() {
    const user = useAuth();
    useEffect(() => {
        console.log(user);
    }, [user]);
    const days = daysUntilBirthday(user?.dateOfBirth);
    return (
        <UserGuard>
            <main className={styles.main}>
                <div className={styles.wrap}>
                    <h1>
                        {user?.username ? 
                            <>ようこそ！<span>{user.username}</span>さん</> 
                            : 'ユーザー情報がありません'
                        }
                    </h1>
                    <div className={styles.greetingBox}>
                        <p>
                            ご覧いただき誠にありがとうございます。<br />
                            こちらのソースコードは
                            <span>
                                <NextLink href='https://github.com/nouzoehiroaki/login-app' className={styles.githubLink} target='_blank' rel='noopener noreferrer'>
                                    https://github.com/nouzoehiroaki/login-app
                                </NextLink>
                            </span>
                            になります。
                        </p>
                        <p>
                            早速ですが、エンジニアである僕のもう一つの姿を紹介します。
                        </p>
                    </div>
                    <div className={styles.box}>
                        <h2>
                            KGE THE SHADOWMEN
                        </h2>
                        <div className={styles.summary}>
                            <p>
                            知る人ぞ知る、JAPANESE HIPHOPシーン屈指のフロウ巧者。
                            2009年 1st Album "NEWGIGANTE"をリリース。
                            その後、Beat Maker HIMUKIとの共作、LOCAL FAMILYを皮切りに、3枚のAlbumをリリース。
                            MUROの"DA CREATOR"より"AYO BLUES"や、GAGLEの "VG+"より"舌炎上"、"VANTA BLACK"より"和背負い"に客演。
                            徐々にその名を浸透させている。
                            カゲザシャドメンと読む。
                            </p>
                        </div>
                    </div>
                    <div className={styles.box}>
                        <h2>
                            これまでのメディア出演
                        </h2>
                        <ul>
                            <li>
                            SPACE SHOWER TV 「BIG BANG」
                            </li>
                            <li>
                            日本テレビ「シュガーヒルストリート」
                            </li>
                            <li>
                            NHK-BS 「J-MELO Japanese HipHop Special」
                            </li>
                            <li>
                            テレビ朝日「フリースタイルダンジョン」
                            </li>
                        </ul>
                    </div>
                    <div className={styles.box}>
                        <h2>
                            ラジオ出演
                        </h2>
                        <ul>
                            <li>
                            東京FM「サイプレス上野の日本語ラップキラッ!」
                            </li>
                            <li>
                            Fm yokohama「SKY-HIのACT-A-FOOL」
                            </li>
                        </ul>
                    </div>
                    <div className={styles.box}>
                        <h2>
                            参考リンク
                        </h2>
                        <ul>
                            <li>
                            <NextLink href='https://kgetheshadowmen.com/' className={styles.githubLink} target='_blank' rel='noopener noreferrer'>
                                Official WebSite
                            </NextLink>
                            </li>
                            <li>
                            <NextLink href='https://ja.wikipedia.org/wiki/KGE_THE_SHADOWMEN' className={styles.githubLink} target='_blank' rel='noopener noreferrer'>
                                Wikipedia
                            </NextLink>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.box}>
                        <div className={styles.images}>
                        {user?.photoURL && 
                            <img src={user.photoURL} alt='ユーザーのプロフィール画像' />
                        }
                        </div>
                        <h3>最後までお読みいただきありがとうございましたm(_ _)m</h3>
                    </div>
                    <div className={styles.logout}>
                        <button onClick={logoutFunction}>ログアウト</button>
                    </div>
                </div>
            </main>
        </UserGuard>
    )
}