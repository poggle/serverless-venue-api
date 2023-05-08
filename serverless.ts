import type { AWS } from '@serverless/typescript';

import createEvent from '@functions/events/createEvent';

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
    },
  },
  // import the function via paths
  functions: { createEvent },
  package: { individually: true },
  resources: {
    Resources: {
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
