'use client'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from '@/styles/Form.module.scss'
import { signUpWithEmail,FirebaseResult } from '@/lib/firebase/apis/auth'
import { Gender } from '@/lib/firebase/types/user'

type formInputs = {
    username:string
    email: string
    password: string
    confirm: string
    dateOfBirth: string
    gender?: Gender
    photoURL: string
}
/** サインアップ画面
 * @screenname SignUpScreen
 * @description ユーザの新規登録を行う画面
 */
export default function SignUpScreen() {
    const router = useRouter()
    const { 
        handleSubmit, 
        register,
        setError,
        getValues,
        formState: { errors, isSubmitting }
    } = useForm<formInputs>()
    const [password, setPassword] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [notification, setNotification] = useState<{ message: string, status: 'success' | 'error' | null }>({ message: '', status: null });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const ext = file.name.split(".").pop();
            if (!["png", "jpg", "jpeg"].includes(ext?.toLowerCase() || "")) {
                setError("photoURL", {
                    type: "manual",
                    message: "有効なファイル形式を選択してください (.png, .jpg, .jpeg)"
                });
            }
        }
    };
    
    const onSubmit = handleSubmit(async (data) => {
        if (selectedFile) {
            await signUpWithEmail({
                username: data.username,
                email: data.email,
                password: data.password,
                dateOfBirth: data.dateOfBirth,
                file: selectedFile,
                gender: data.gender,
                photoURL: ''
            }).then((res: FirebaseResult) => {
                if (res.isSuccess) {
                  setNotification({ message: res.message, status: 'success' });
                } else {
                  setNotification({ message: res.message, status: 'error' });
                }
              }
          )
        } else {
            setNotification({ message: "プロフィール画像が選択されていません", status: 'error' });
        }
    })
    const passwordClick = () => setPassword(!password)
    const confirmClick = () => setConfirm(!confirm)
    const [isAgreedToTerms, setIsAgreedToTerms] = useState(false);
    return(
        <div className={styles.flexContainer}>
            <div className={styles.vstack}>
                <h1>新規登録</h1>
                <form onSubmit={onSubmit}>
                    <div className={styles.vstackInner}>
                        <div className={errors.username ? `${styles.formControl} ${styles.invalid}` : styles.formControl}>
                            <label htmlFor='username'>お名前</label>
                            <input 
                                id='username'
                                {...register('username', {
                                    required: '必須項目です',
                                    maxLength: {
                                        value: 10,
                                        message: '10文字以内で入力してください',
                                    }
                                })}
                            />
                            {errors.username && 
                                <span className={styles.errorMessage}>
                                    {errors.username.message}
                                </span>
                            }
                        </div>
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
                                    pattern: {
                                        value:
                                        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@+[a-zA-Z0-9-]+\.+[a-zA-Z0-9-]+$/,
                                        message: 'メールアドレスの形式が違います',
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
                                    type={password ? 'text' : 'password'}
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
                                        pattern: {
                                            value: /^(?=.*[A-Z])[0-9a-zA-Z]*$/,
                                            message:
                                            '半角英数字かつ少なくとも1つの大文字を含めてください',
                                        },
                                    })}
                                />
                                <button onClick={passwordClick}>
                                    {password ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {errors.password && 
                                <span className={styles.errorMessage}>
                                    {errors.password.message}
                                </span>
                            }
                        </div>
                        <div className={errors.confirm ? `${styles.formControl} ${styles.invalid}` : styles.formControl}>
                            <label htmlFor='confirm'>パスワード確認</label>
                            <div className={styles.inputGroup}>
                                <input
                                    type={confirm ? 'text' : 'password'}
                                    {...register('confirm', {
                                        required: '必須項目です',
                                        minLength: {
                                            value: 8,
                                            message: '8文字以上で入力してください',
                                        },
                                        maxLength: {
                                            value: 50,
                                            message: '50文字以内で入力してください',
                                        },
                                        pattern: {
                                            value: /^(?=.*[A-Z])[0-9a-zA-Z]*$/,
                                            message:
                                            '半角英数字かつ少なくとも1つの大文字を含めてください',
                                        },
                                        validate: (value) =>
                                        value === getValues('password') ||
                                        'パスワードが一致しません',
                                    })}
                                />
                                <button onClick={confirmClick}>
                                    {confirm ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {errors.confirm && 
                                <span className={styles.errorMessage}>
                                    {errors.confirm.message}
                                </span>
                            }
                        </div>
                        <div className={errors.dateOfBirth ? `${styles.formControl} ${styles.invalid}` : styles.formControl}>
                            <label htmlFor='dateOfBirth'>誕生日</label>
                            <input 
                                id='dateOfBirth'
                                type='date' // 日付型の入力欄を使用
                                {...register('dateOfBirth', {
                                    required: '必須項目です',
                                })}
                            />
                            {errors.dateOfBirth && 
                                <span className={styles.errorMessage}>
                                    {errors.dateOfBirth.message}
                                </span>
                            }
                        </div>
                        <div className={styles.formControl}>
                            <label htmlFor='gender'>性別</label>
                            <select 
                                id='gender'
                                {...register('gender')} // バリデーションは不要ですが、後で追加することもできます
                            >
                                <option value="">選択してください</option>
                                <option value="male">男性</option>
                                <option value="female">女性</option>
                            </select>
                        </div>
                        <div className={styles.formControl}>
                            <label htmlFor='photoURL'>プロフィール画像</label>
                            <input
                                type='file'
                                id='photoURL'
                                accept='.png, .jpg, .jpeg'
                                {...register('photoURL')}
                                onChange={handleFileChange}
                            />
                            {errors.photoURL && 
                                <span className={styles.errorMessage}>
                                    {errors.photoURL.message}
                                </span>
                            }
                        </div>
                        <div className={styles.formControl}>
                            <input 
                                type='checkbox' 
                                id='agreement' 

                                checked={isAgreedToTerms} 
                                onChange={() => setIsAgreedToTerms(!isAgreedToTerms)}
                            />
                            <label htmlFor='agreement'><NextLink href="/path-to-your-terms-page">利用規約</NextLink>に同意します</label>
                        </div>
                        <button className={styles.loginBtn} type='submit' disabled={!isAgreedToTerms}>
                            新規登録
                        </button>
                        <NextLink href='/signin' className={styles.signupLink}>
                            <button className={styles.signupBtn}>ログインはこちらから</button>
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

