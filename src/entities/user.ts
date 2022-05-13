/* eslint-disable prettier/prettier */
export default class User {
    id: number;
    name: string;
    password: string;
    avatar: string;
    static id: number;
    static password: string;
    static avatar: string;

    constructor(id: number, name: string, password: string, avatar: string) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.avatar = avatar;
    }
}
