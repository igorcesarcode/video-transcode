export interface Video {
  id: string;
  title: string;
  originalUrl: string;
  convertedUrl?: string;
  status: "waiting" | "processing" | "completed" | "failed";
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}
