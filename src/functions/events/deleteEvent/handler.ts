import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {deleteEvent, getEventById} from "../../../repositories/event-repository";
import NotFoundError from "../../../errors/not-found-error";

const handler: ValidatedEventAPIGatewayProxyEvent<{}, {eventId: string}> = async (requestEvent) => {
  try {
    const event = await getEventById(requestEvent.pathParameters.eventId);
    await deleteEvent(event);
    return {body: '', statusCode: 204};
  } catch (e: unknown) {
    if (e instanceof NotFoundError) {
      return {body: '', statusCode: 204};
    }
    throw e;
  }
};

export const main = middyfy(handler);
