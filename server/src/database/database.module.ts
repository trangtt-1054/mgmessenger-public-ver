import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection, getConnectionOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const connectionOptions = await getConnectionOptions(
          process.env.NODE_ENV,
        );
        return Object.assign({ ...connectionOptions, name: 'default' });
      },
    }),
  ], //what are imported here will be accessed in the constructor. If you don't provide custom config object to forRoot, it will use the ormconfig.json by default.
  exports: [TypeOrmModule],
})
export class DatabaseModule {
  //doesn't need `private connection` because when importing above, nestjs will take care of it for us
  constructor(connection: Connection) {
    if (connection.isConnected) console.log('DB connected');
  }
}
