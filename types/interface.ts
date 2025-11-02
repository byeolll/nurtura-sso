export interface User {
    user_id: string,
    firstName: string,
    lastName: string,
    middleName?: string,
    suffix?: string,
    email: string,
    photo?: string,
    birthday?: string,
}