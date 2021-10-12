import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
import { PubSub } from 'graphql-subscriptions';
import jwt_decode from 'jwt-decode';

const pubsub = new PubSub();
@Module({
  //pay attention to the order of modules imported
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthModule,
    GraphQLModule.forRoot({
      playground: true,
      debug: true,
      //code first approach (look at the code and generate schemas for u)
      autoSchemaFile: true,
      installSubscriptionHandlers: true, //enable subscription
      subscriptions: {
        //https://docs.nestjs.com/graphql/subscriptions#authentication-over-websocket
        //NOTE: There is a bug in subscriptions-transport-ws that allows connections to skip the onConnect phase (read more). You should not assume that onConnect was called when the user starts a subscription, and always check that the context is populated.
        'subscriptions-transport-ws': {
          onConnect: (connectionParams) => {
            let auth0UserId: string;
            const token = connectionParams.Authorization.split('Bearer ')[1];
            if (token) {
              const decoded = jwt_decode(token);
              const { sub } = decoded as any;
              auth0UserId = sub;
            }
            return { auth0UserId, pubsub };
          },
        },
      },
      context: (ctx) => {
        const { req, res, payload } = ctx;
        let token: string;
        let auth0UserId: string;
        if (req?.headers.authorization) {
          token = req?.headers.authorization.split('Bearer ')[1];
        }
        if (token) {
          const decoded = jwt_decode(token);
          const { sub } = decoded as any;
          auth0UserId = sub;
        }
        return {
          req,
          res,
          payload,
          auth0UserId,
          pubsub,
        };
      },
    }),
    ComponentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
