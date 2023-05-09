import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {formatJSONErrorResponse, formatJSONResponse} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {getEventById} from "../../../repositories/event-repository";
import NotFoundError from "../../../errors/not-found-error";

const handler: ValidatedEventAPIGatewayProxyEvent<{}, {eventId: string}> = async (requestEvent) => {
  try {
    return formatJSONResponse(await getEventById(requestEvent.pathParameters.eventId), 200);
  } catch (e: unknown) {
    if (e instanceof NotFoundError) {
      return formatJSONErrorResponse(`Event not found`, 404);
    }
    throw e;
  }
};

export const main = middyfy(handler);
