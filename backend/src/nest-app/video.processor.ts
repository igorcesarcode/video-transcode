import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { exec } from "child_process";
import { promisify } from "util";
import { VideoService } from "./video.service";

const execAsync = promisify(exec);

@Processor("video-processing")
export class VideoProcessor {
  private readonly logger = new Logger(VideoProcessor.name);

  constructor(private readonly videoService: VideoService) {}

  @Process("transcode")
  async handleTranscode(job: Job) {
    const { videoId, inputPath, outputPath } = job.data;

    try {
      await this.videoService.updateStatus(videoId, "processing");

      const command = `docker run --rm \
        -v "${inputPath}:/input.mp4" \
        -v "${outputPath}:/output.mp4" \
        jrottenberg/ffmpeg \
        -i /input.mp4 -codec:v libx264 -crf 23 /output.mp4`;

      await execAsync(command);

      await this.videoService.updateStatus(videoId, "completed");
      this.logger.log(`Transcoding completed for video ${videoId}`);
    } catch (error) {
      this.logger.error(`Transcoding failed for video ${videoId}:`, error);
      await this.videoService.updateStatus(videoId, "failed");
      throw error;
    }
  }
}
