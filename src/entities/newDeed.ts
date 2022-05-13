/* eslint-disable prettier/prettier */
export default class NewDeed {
    id: number;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    description: string;
    backgroundColor: string;
    group: string;
    userId: number;

    public constructor(init?: Partial<NewDeed>) {
        Object.assign(this, init);
    }
}