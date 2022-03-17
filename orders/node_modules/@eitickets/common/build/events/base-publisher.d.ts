import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';
interface Event {
    subject: Subjects;
    data: any;
}
export declare abstract class Publisher<T extends Event> {
    private client;
    abstract subject: T['subject'];
    constructor(client: Stan);
    publish(data: T['data']): Promise<void>;
}
export {};
