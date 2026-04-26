import {
  Module,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckController } from './health-check.controller';
import { SetupModule } from './setup/setup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    SetupModule,
  ],
  controllers: [HealthCheckController],
  providers: [],
})
export class AppModule {}

