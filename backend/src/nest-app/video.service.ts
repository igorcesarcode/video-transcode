import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { Queue } from "bull";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { videos } from "../database/migrations/001_create_videos";
import { Video } from "../types/video";

@Injectable()
export class VideoService {
  private readonly db;
  private readonly s3 = new S3();

  constructor(@InjectQueue("video-processing") private videoQueue: Queue) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.db = drizzle(pool);
  }

  async createVideo(title: string, file: Express.Multer.File): Promise<Video> {
    // Upload to S3
    const originalKey = `uploads/${Date.now()}-${file.originalname}`;
    await this.s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: originalKey,
        Body: file.buffer,
      })
      .promise();

    // Create database record
    const [video] = await this.db
      .insert(videos)
      .values({
        title,
        originalUrl: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${originalKey}`,
        status: "waiting",
      })
      .returning();

    // Add to processing queue
    await this.videoQueue.add("transcode", {
      videoId: video.id,
      inputPath: video.originalUrl,
      outputPath: `processed/${video.id}.mp4`,
    });

    return video as Video;
  }

  async updateStatus(
    videoId: string,
    status: Video["status"],
    progress?: number
  ) {
    await this.db
      .update(videos)
      .set({ status, progress, updatedAt: new Date() })
      .where(eq(videos.id, videoId));

    // Publish status update to Redis
    const redisClient = this.videoQueue.client;
    await redisClient.publish(
      "video-status",
      JSON.stringify({
        videoId,
        status,
        progress,
      })
    );
  }

  async getVideoStatus(videoId: string): Promise<Video> {
    const [video] = await this.db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId));
    return video as Video;
  }
}
