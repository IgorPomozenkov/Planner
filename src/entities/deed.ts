/* eslint-disable prettier/prettier */
import Execution from '../entities/execution';

export default class Deed {
    id: number;
    description: string;
    executions: Execution[];
}