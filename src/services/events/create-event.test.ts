import {EventCategory, NewEvent} from '../../types/event';
import {saveEvent} from '../../repositories/event-repository';
import ValidationError from '../../errors/validation-error';
import createEvent from './create-event';

jest.mock('../../repositories/event-repository', () => ({
    saveEvent: jest.fn(),
}));

const mockNewEvent: NewEvent = {
    startTime: new Date('2023-06-01T09:00:00Z'),
    endTime: new Date('2023-06-01T10:00:00Z'),
    name: 'Event',
    description: 'Event description',
    isDraft: false,
    isCancelled: false,
    category: EventCategory.concert
}

describe('createEvent', () => {
    beforeEach(() => {
        (saveEvent as jest.Mock).mockClear();
    });

    it('should throw a ValidationError if startTime is after endTime', async () => {
        const newEvent: NewEvent = {
            ...mockNewEvent,
            startTime: new Date('2023-06-01T10:00:00Z'),
            endTime: new Date('2023-06-01T09:00:00Z'),
            name: 'Invalid Event',
        };

        await expect(createEvent(newEvent)).rejects.toThrow(ValidationError);
        await expect(createEvent(newEvent)).rejects.toThrow(
            'Event startTime can not be after the event endTime',
        );
        expect(saveEvent).not.toHaveBeenCalled();
    });

    it('should call saveEvent with the correct data if startTime is before endTime', async () => {
        const newEvent: NewEvent = {
            ...mockNewEvent,
            name: 'Valid Event',
        };

        (saveEvent as jest.Mock).mockResolvedValue(newEvent);

        const result = await createEvent(newEvent);

        expect(saveEvent).toHaveBeenCalledTimes(1);
        expect(saveEvent).toHaveBeenCalledWith(newEvent);
        expect(result).toEqual(newEvent);
    });
});
