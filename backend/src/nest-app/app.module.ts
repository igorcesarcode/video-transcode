import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { VideoModule } from "./video.module";

@Module({
  imports: [ConfigModule.forRoot(), VideoModule],
})
export class AppModule {}
