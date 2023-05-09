import type { AWS } from '@serverless/typescript';

import createEvent from '@functions/events/createEvent';
import getEvent from '@functions/events/getEvent';
import getEvents from '@functions/events/getEvents';
import deleteEvent from '@functions/events/deleteEvent';
import updateEvent from '@functions/events/updateEvent';
import createAttendee from '@functions/attendees/createAttendee';

const serverlessConfiguration: AWS = {
  service: 'serverless-venue-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    region: 'eu-west-2',
    runtime: 'nodejs18.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      TABLE_NAME: '${self:resources.Resources.VenueTable.Properties.TableName}'
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['dynamodb:PutItem', 'dynamodb:GetItem', 'dynamodb:Query', 'dynamodb:DeleteItem'],
        Resource: [
          {
            'Fn::GetAtt': ['VenueTable', 'Arn'],
          },
          {
            'Fn::Sub': '${VenueTable.Arn}/index/*',
          },
        ],
      },
    ],
  },
  // import the function via paths
  functions: { createEvent, getEvent, getEvents, deleteEvent, updateEvent, createAttendee },
  package: { individually: true },
  resources: {
    Resources: {
      VenueTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:service}-${sls:stage}-venue-table',
          AttributeDefinitions: [
            { AttributeName: 'PK', AttributeType: 'S' },
            { AttributeName: 'SK', AttributeType: 'S' },
            { AttributeName: 'id', AttributeType: 'S' },
          ],
          KeySchema: [
            { AttributeName: 'PK', KeyType: 'HASH' },
            { AttributeName: 'SK', KeyType: 'RANGE' },
          ],
          LocalSecondaryIndexes: [
            {
              IndexName: 'IdIndex',
              KeySchema: [
                { AttributeName: 'PK', KeyType: 'HASH' },
                { AttributeName: 'id', KeyType: 'RANGE' },
              ],
              Projection: {
                ProjectionType: 'ALL',
              },
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
          StreamSpecification: {
            StreamViewType: 'NEW_AND_OLD_IMAGES',
          },
        },
      },
      GatewayResponseValidationError: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
          ResponseType: 'BAD_REQUEST_BODY',
          ResponseParameters: {
            'gatewayresponse.header.Content-Type': "'application/json'",
          },
          ResponseTemplates: {
            'application/json': '{"message": "Invalid request body", "errors": $context.error.validationErrorString}',
          },
          StatusCode: 400,
        },
      },
    },
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
