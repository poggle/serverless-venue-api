import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {formatJSONErrorResponse} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {deleteEvent, getEventById} from "../../../repositories/event-respository";
import NotFoundError from "../../../errors/not-found-error";

const handler: ValidatedEventAPIGatewayProxyEvent<{}, {eventId: string}> = async (requestEvent) => {
  try {
    const event = await getEventById(requestEvent.pathParameters.eventId);
    await deleteEvent(event);
    return {body: '', statusCode: 204};
  } catch (e: unknown) {
    if (e instanceof NotFoundError) {
      return formatJSONErrorResponse(`Event not found`, 404);
    }
    throw e;
  }
};

export const main = middyfy(handler);
