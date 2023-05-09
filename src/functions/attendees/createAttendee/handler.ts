import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {formatJSONErrorResponse, formatJSONResponse} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import {saveAttendee} from "../../../repositories/attendee-repository";
import {getEventById} from "../../../repositories/event-repository";
import NotFoundError from "../../../errors/not-found-error";

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema, {eventId: string}> = async (requestEvent) => {
  const newAttendee = requestEvent.body;

  if (newAttendee.eventId !== requestEvent.pathParameters.eventId) {
    return formatJSONErrorResponse('Event id conflicts with url', 409);
  }

  try {
    const event = await getEventById(newAttendee.eventId);
    if (event.isDraft) {
      return formatJSONErrorResponse(`Event not found`, 404);
    }
  } catch (e: unknown) {
    if (e instanceof NotFoundError) {
      return formatJSONErrorResponse(`Event not found`, 404);
    }
    throw e;
  }

  const event = await saveAttendee(newAttendee);
  return formatJSONResponse(event, 201);
};

export const main = middyfy(handler);
