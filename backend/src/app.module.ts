import { Module } from '@nestjs/common';
import { HealthCheckModulle } from './healthCheck/healthCheck.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCheck } from './healthCheck/healthCheck.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ChatGateway } from './Chat/chat.gateway';
import { ChatMuteUserModule } from './Chat/chat-mute-user.module';
import * as dotenv from 'dotenv';
import { ChatMuteUser } from './Chat/chat-mute-user.entity';

dotenv.config();

const options: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'postgres', //Container name in docker-compose.
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [HealthCheck, ChatMuteUser],
  synchronize: true,
};

@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    HealthCheckModulle,
    ChatMuteUserModule,
  ],
  providers: [ChatGateway],
})
export class AppModule {}
