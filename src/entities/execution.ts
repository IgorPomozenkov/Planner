/* eslint-disable prettier/prettier */
import User from '../entities/user';

export default class Execution {
    id: number;
    plannedDate: Date;
    executionDate: Date;
    user: User;
}