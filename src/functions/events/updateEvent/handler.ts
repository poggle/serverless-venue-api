import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {formatJSONErrorResponse, formatJSONResponse} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import {getEventById, saveEvent, updateEvent} from "../../../repositories/event-repository";
import deserialiser from "./deserialiser";
import NotFoundError from "../../../errors/not-found-error";

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema, {eventId: string}> = async (requestEvent) => {
  const event = deserialiser(requestEvent.body);

  if (event.id !== requestEvent.pathParameters.eventId) {
    return formatJSONErrorResponse('Event id conflicts with url', 409);
  }

  try {
    await updateEvent(event);
    return formatJSONResponse(event, 200);
  } catch (e: unknown) {
    if (e instanceof NotFoundError) {
      return formatJSONErrorResponse(`Event not found`, 404);
    }
    throw e;
  }
};

export const main = middyfy(handler);
