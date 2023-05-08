export interface Event {
    id: string;
    name: string;
    description: string;
    startTime: Date;
    endTime: Date;
    category: string;
    status: string;
}

export type NewEvent = Omit<Event, 'id'>;