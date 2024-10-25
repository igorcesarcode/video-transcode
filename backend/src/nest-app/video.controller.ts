import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { VideoService } from "./video.service";

@Controller("video")
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadVideo(
    @Body("title") title: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!title || !file) {
      throw new BadRequestException("Title and file are required");
    }
    return this.videoService.createVideo(title, file);
  }

  @Get("status/:videoId")
  async getVideoStatus(@Param("videoId") videoId: string) {
    const video = await this.videoService.getVideoStatus(videoId);
    if (!video) {
      throw new NotFoundException("Video not found");
    }
    return video;
  }
}
