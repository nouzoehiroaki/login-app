export type Gender = 'male' | 'female';
export type User = {
    id: string;
    username: string;
    email: string;
    profileIconURL: string;
    dateOfBirth: Date;
    gender: Gender;
};