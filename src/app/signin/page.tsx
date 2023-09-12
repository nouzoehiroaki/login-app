'use client'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from '@/styles/signup.module.scss'
import { signInWithEmail,FirebaseResult } from '@/lib/firebase/apis/auth'


type formInputs = {
    email: string
    password: string
}
/** サインイン画面
 * @screenname SignInScreen
 * @description ユーザのサインインを行う画面
 */
export default function SignInScreen() {
    const router = useRouter()
    const { 
        handleSubmit, 
        register,
        formState: { errors, isSubmitting } 
    } = useForm<formInputs>()
    const [show, setShow] = useState<boolean>(false)
    const [notification, setNotification] = useState<{ message: string, status: 'success' | 'error' | null }>({ message: '', status: null });
    
    const onSubmit = handleSubmit(async (data) => {
        await signInWithEmail({ 
            email: data.email, 
            password: data.password 
        }).then((res: FirebaseResult) => {
            if (res.isSuccess) {
                setNotification({ message: res.message, status: 'success' });
                router.push('/');
            } else {
                setNotification({ message: res.message, status: 'error' });
            }
        })
    })
    return(
        <div className={styles.flexContainer}>
            <div className={styles.vstack}>
                <h1>ログイン</h1>
                <form onSubmit={onSubmit}>
                    <div className={styles.vstackInner}>
                        <div className={errors.email ? `${styles.formControl} ${styles.invalid}` : styles.formControl}>
                            <label htmlFor='email'>メールアドレス</label>
                            <input 
                                id='email'
                                {...register('email', {
                                    required: '必須項目です',
                                    maxLength: {
                                        value: 50,
                                        message: '50文字以内で入力してください',
                                    },
                                })}
                            />
                            {errors.email && 
                                <span className={styles.errorMessage}>
                                    {errors.email.message}
                                </span>
                            }

                        </div>
                        <div className={errors.password ? `${styles.formControl} ${styles.invalid}` : styles.formControl}>
                            <label htmlFor='password'>パスワード</label>
                            <div className={styles.inputGroup}>
                                <input 
                                    type={show ? 'text' : 'password'}
                                    {...register('password', {
                                        required: '必須項目です',
                                        minLength: {
                                            value: 8,
                                            message: '8文字以上で入力してください',
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: '50文字以内で入力してください',
                                        },
                                    })}
                                 />
                                <button onClick={() => setShow(!show)}>
                                {show ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {errors.password && 
                                <span className={styles.errorMessage}>
                                    {errors.password.message}
                                </span>
                            }
                        </div>
                        <button className={styles.loginBtn}>ログイン</button>
                        <NextLink href='/signup' className={styles.signupLink}>
                            <button className={styles.signupBtn}>新規登録はこちらから</button>
                        </NextLink>
                    </div>
                </form>
                {notification.status && (
                    <div className={`notification ${notification.status}`}>
                        {notification.message}
                    </div>
                )}
            </div>
        </div>
    )
}