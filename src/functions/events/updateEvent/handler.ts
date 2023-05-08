import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {formatJSONErrorResponse, formatJSONResponse} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import {getEventById, saveEvent} from "../../../repositories/event-respository";
import deserialiser from "./deserialiser";
import NotFoundError from "../../../errors/not-found-error";

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema, {eventId: string}> = async (requestEvent) => {
  const event = deserialiser(requestEvent.body);

  if (event.id !== requestEvent.pathParameters.eventId) {
    return formatJSONErrorResponse('Event id conflicts with url', 409);
  }

  try {
    await getEventById(event.id);
  } catch (e: unknown) {
    if (e instanceof NotFoundError) {
      return formatJSONErrorResponse(`Event not found`, 404);
    }
    throw e;
  }

  await saveEvent(event);
  return formatJSONResponse(event, 200);
};

export const main = middyfy(handler);
