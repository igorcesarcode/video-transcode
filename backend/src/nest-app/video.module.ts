import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { VideoController } from "./video.controller";
import { VideoProcessor } from "./video.processor";
import { VideoService } from "./video.service";

@Module({
  imports: [
    MulterModule.register({
      dest: "./uploads",
    }),
    BullModule.registerQueue({
      name: "video-processing",
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      },
    }),
  ],
  controllers: [VideoController],
  providers: [VideoService, VideoProcessor],
})
export class VideoModule {}
