'use client'
import NextLink from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from '@/styles/Form.module.scss'
import update from '@/styles/Update.module.scss'
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
    const { 
        handleSubmit, 
        register,
        formState: { errors } 
    } = useForm<formInputs>()
    const [show, setShow] = useState<boolean>(false)
    const [notification, setNotification] = useState<{ message: string, status: 'success' | 'error' | null }>({ message: '', status: null });
    const closeNotification = () => {
        setNotification({ ...notification, status: null });
    };
    
    const onSubmit = handleSubmit(async (data) => {
        await signInWithEmail({ 
            email: data.email, 
            password: data.password 
        }).then((res: FirebaseResult) => {
            if (res.isSuccess) {
                setNotification({ message: res.message, status: 'success' });
                setTimeout(() => {
                    window.location.href = '/';
                }, 500);
            } else {
                setNotification({ message: res.message, status: 'error' });
            }
        })
    })
    return(
        <div className={`${styles.flexContainer} ${update.firstView}`}>
            <div className={styles.vstack}>
                <h1>
                    <picture>
                        <source srcSet='/form/pi_login_logo.webp' type="image/webp" />
                        <Image
                            src='/form/pi_login_logo.jpg'
                            alt='ログイン'
                            width={200}
                            height={200}
                            className={update.logo}
                        />
                    </picture>
                </h1>
                <form onSubmit={onSubmit}>
                    <div className={styles.vstackInner}>
                        <div className={errors.email ? `${styles.formControl} ${styles.invalid}` : styles.formControl}>
                            <label htmlFor='email'>メールアドレス</label>
                            <input 
                                id='email'
                                {...register('email', {
                                    required: '必須項目です',
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
                                    id='password'
                                    type={show ? 'text' : 'password'}
                                    {...register('password', {
                                        required: '必須項目です',
                                    })}
                                />
                                <button className={styles.show} type='button' onClick={() => setShow(!show)}>
                                {show ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {errors.password && 
                                <span className={styles.errorMessage}>
                                    {errors.password.message}
                                </span>
                            }
                        </div>
                        <button className={styles.loginBtn} type='submit'>
                            ログイン
                        </button>
                        <NextLink href='/signup' className={styles.signupLink}>
                            <button className={styles.signupBtn}>新規登録はこちらから</button>
                        </NextLink>
                    </div>
                </form>
                {notification.status && (
                    <div className={`notification ${notification.status}`}>
                        <div className='box'>
                            <span onClick={closeNotification}></span>
                            {notification.message}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}