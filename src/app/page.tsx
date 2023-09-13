'use client'
import NextLink from 'next/link'
import { logout as logoutFunction } from '@/lib/firebase/apis/auth'
import UserGuard from '../lib/firebase/apis/user-guard'
import { useEffect } from 'react'
import { useAuth } from '../lib/firebase/context/auth'
import styles from '@/styles/Page.module.scss'
import { differenceInDays, addYears, isBefore, parseISO } from 'date-fns'
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
                            下記、改善できそうな点を記載します
                        </p>
                    </div>
                    <div className={styles.box}>
                        <h2>
                            改善できる点
                        </h2>
                        <ul>
                            <li>
                                プロフィール画像を任意にして、設定しない人はnoimageにする
                            </li>
                            <li>コンポーネントで部品分けする</li>
                            <li>Scssの設計をもう少し簡素化する</li>
                            <li>
                                Jest等を使い、テストコードの実装法についてキャッチアップしていきたい
                            </li>
                        </ul>
                    </div>
                    <div className={styles.box}>
                        <h2>
                            反省点
                        </h2>
                        <ul>
                            <li>
                                全体的なキャッチアップに時間がかかり、ギリギリになってしまった
                            </li>
                            <li>
                                Next.js 13.2のバージョンアップにより、わからない部分がまだまだたくさんある（useRouterたHEADなど）
                            </li>
                            <li>
                                最後にlinterやformatterを設定し、fixさせたかったが、時間が足りなかった
                            </li>
                            <li>
                                作業途中に色んな改善すべき点を見出すも、忘れてしまう。
                            </li>
                        </ul>
                    </div>
                    <div className={styles.box}>
                        <h2>
                            まとめ
                        </h2>
                        <div className={styles.summary}>
                            <p>
                                フロントエンドとしての実力の低さを思い知ったが、日々キャッチアップしていくことで少しずつ前に進めるんだと実感し、とても有意義な課題作成の時間だった。<br />
                                今後ともアプリ開発に勤しんでいきたい。（どうでも良かっらたすみません）
                            </p>
                        </div>
                    </div>
                    <div className={styles.box}>
                        <h2>
                            最後に
                        </h2>
                        <div className={styles.box}>
                            <div className={styles.dateOfBirth}>
                            {user?.dateOfBirth && (
                                <p>
                                    <span>{days}</span>
                                    日後は{user.username}さんの誕生日です！
                                </p>
                            )}
                                <p>ささやかではありますが、僕からのプレゼントです。</p>
                                <p>
                                    アップロードしてくれたプロフィール画像を額に入れ、表示します！
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.box}>
                        <div className={styles.images}>
                        {user?.photoURL && 
                            <img src={user.photoURL} alt="ユーザーのプロフィール画像" />
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