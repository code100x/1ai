import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { MODELS } from './types';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '1AI API',
      version: '1.0.0',
      description: 'A comprehensive AI chat platform with multi-model support, authentication, and billing',
      contact: {
        name: '1AI Team',
        url: 'https://github.com/your-repo/1ai',
        email: 'support@1ai.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.1ai.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /auth/signin endpoint'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique user identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            credits: {
              type: 'integer',
              description: 'Available credits for API usage'
            },
            isPremium: {
              type: 'boolean',
              description: 'Premium subscription status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Message: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            conversationId: {
              type: 'string',
              format: 'uuid'
            },
            content: {
              type: 'string',
              description: 'Message content'
            },
            role: {
              type: 'string',
              enum: ['user', 'assistant'],
              description: 'Message sender role'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Conversation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            messages: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Message'
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Execution: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            title: {
              type: 'string',
              description: 'Execution title'
            },
            type: {
              type: 'string',
              enum: ['CONVERSATION', 'ARTICLE_SUMMARIZER'],
              description: 'Type of execution'
            },
            userId: {
              type: 'string',
              format: 'uuid'
            },
            externalId: {
              type: 'string',
              format: 'uuid',
              nullable: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Model: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Model identifier',
              example: 'google/gemini-2.5-flash'
            },
            name: {
              type: 'string',
              description: 'Human-readable model name',
              example: 'Gemini 2.5 Flash'
            },
            isPremium: {
              type: 'boolean',
              description: 'Whether model requires premium subscription'
            }
          }
        },
        PaymentHistory: {
          type: 'object',
          properties: {
            paymentId: {
              type: 'string',
              format: 'uuid'
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'SUCCESS', 'FAILED']
            },
            paymentMethod: {
              type: 'string'
            },
            amount: {
              type: 'number',
              format: 'float'
            },
            currency: {
              type: 'string'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Subscription: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            planId: {
              type: 'string'
            },
            currency: {
              type: 'string'
            },
            startDate: {
              type: 'string',
              format: 'date-time'
            },
            endDate: {
              type: 'string',
              format: 'date-time'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ArticleSummarizer: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            article: {
              type: 'string',
              description: 'Original article text'
            },
            summary: {
              type: 'string',
              description: 'Generated summary'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            success: {
              type: 'boolean',
              example: false
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'AI Chat',
        description: 'AI conversation and chat endpoints'
      },
      {
        name: 'Billing',
        description: 'Payment and subscription management'
      },
      {
        name: 'Apps',
        description: 'AI-powered applications and tools'
      },
      {
        name: 'Executions',
        description: 'Execution history and management'
      }
    ]
  },
  apis: ['./routes/*.ts', './routes/apps/*.ts'],
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };

export const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #3b82f6 }
  `,
  customSiteTitle: "1AI API Documentation",
  customfavIcon: "/favicon.ico"
};
