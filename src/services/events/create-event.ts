import {NewEvent} from "../../types/event";
import {saveEvent} from "../../repositories/event-repository";
import ValidationError from "../../errors/validation-error";

export default async (newEvent: NewEvent) => {

    if (newEvent.startTime > newEvent.endTime) {
        throw new ValidationError('Event startTime can not be after the event endTime');
    }

    return saveEvent(newEvent);
}