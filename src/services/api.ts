/* eslint-disable prettier/prettier */
import User from '../entities/user';
import axios from 'axios';
import { userLogin } from '@/store/currentUser/reducer';
import NewDeed from '@/entities/newDeed';
import Execution from '@/entities/execution';

export default class API {

    baseUrl = 'https://geekplanner2.azurewebsites.net/';
    token = '';
    userId = 0;
    userName = '';
    password = '';
    reauthTries = 0;

    getConfig() { return { headers: { token: this.token } } }

    fromatDate(date) {
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        return `${da}-${mo}-${ye}`;
    }

    async getUser(id: number) {
        let response;

        try {
            response = await axios.get(this.baseUrl + 'User?id=' + id, this.getConfig());
        } catch (error) {
            if (error.response.status === 401 && this.reauthTries < 10) {
                this.reauthTries++;
                this.login(this.userName, this.password);
                return this.getUser(id);
            } else
                console.log(error);
        }

        if (response === undefined) {
            return undefined;
        }

        const user = response.data[0];
        if (user.avatar.startsWith('/')) {
            user.avatar = this.baseUrl + user.avatar;
        }

        return user;
    }

    async login(name: string, pass: string) {
        const response = await axios.post(this.baseUrl + 'User/login', { name: name, password: pass })
            .catch(function (error) {
                if (error.response.status === 404) {
                    alert('Неверный пользователь или пароль');
                }
            });

        if (response === undefined) {
            return undefined;
        }

        const authUserData = response.data;

        this.userName = name;
        this.token = authUserData.token;
        this.userId = authUserData.id;
        this.password = pass;

        const userDto = await this.getUser(authUserData.id);

        this.reauthTries = 0;

        return new User(authUserData.id, userDto.name, this.password, userDto.avatar);
    }

    async getDeeds(userId: number) {
        let response;

        try {
            response = await axios.get(
                `${this.baseUrl}events?userId=${userId}`,
                this.getConfig());
        } catch (error) {
            if (error.response.status === 401 && this.reauthTries < 10) {
                this.reauthTries++;
                this.login(this.userName, this.password); //await userLogin
                return this.getDeeds(userId);
            } else
                console.log(error);
        }

        if (response === undefined) {
            return undefined;
        }

        const result = response.data;

        //console.log(result);

        return result;
    }

    async addDeed(deed: NewDeed) {
        let response;

        try {
            deed.id = undefined;
            response = await axios.post(
                `${this.baseUrl}events`,
                deed,
                this.getConfig());
        } catch (error) {
            if (error.response.status === 401 && this.reauthTries < 10) {
                this.reauthTries++;
                this.login(this.userName, this.password);
                return this.addDeed(deed);
            } else
                console.log(error);
        }

        if (response === undefined) {
            return undefined;
        }

        const result = response.data;

        //console.log(result);

        return result;
    }

    async editDeed(deed: NewDeed) {
        let response;

        try {
            response = await axios.put(
                `${this.baseUrl}events`,
                deed,
                this.getConfig());
        } catch (error) {
            if (error.response.status === 401 && this.reauthTries < 10) {
                this.reauthTries++;
                this.login(this.userName, this.password);
                return this.editDeed(deed);
            } else
                console.log(error);
        }

        if (response === undefined) {
            return undefined;
        }

        const result = response.data;

        //console.log(result);

        return result;
    }

    async deleteDeed(id: number) {
        let response;

        try {
            response = await axios.delete(
                `${this.baseUrl}events?id=${id}`,
                this.getConfig());
        } catch (error) {
            if (error.response.status === 401 && this.reauthTries < 10) {
                this.reauthTries++;
                this.login(this.userName, this.password);
                return this.deleteDeed(id);
            } else
                console.log(error);
        }

        if (response === undefined) {
            return undefined;
        }

        const result = response.data;

        //console.log(result);

        return result;
    }

    async register(name: string, pass: string) {
        const response = await axios.post(this.baseUrl + 'User/register',
            {
                name: name,
                password: pass,
                avatar: '' //'https://www.vokrug.tv/pic/person/2/b/f/4/2bf448098b7badf3b37e87c510da29bc.jpeg'
            })
            .catch(function (error) {

                alert(error);
            });

        return response.data;
    }

    async uploadAvatar(data: FormData) {
        const response = await axios.post(this.baseUrl + 'User/avatar?userId=' + this.userId, data, this.getConfig())
            .catch(function (error) {
                alert(error);
            });

        if (response.data.avatar.startsWith('/')) {
            response.data.avatar = this.baseUrl + response.data.avatar;
        }

        return response.data;
    }
}
