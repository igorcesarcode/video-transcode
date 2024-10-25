import { useEffect } from "react";
import useSWR from "swr";
import { Video } from "../../../backend/src/types/video";

export function VideoList() {
  const { data: videos, mutate } = useSWR<Video[]>("/api/videos", {
    refreshInterval: 5000,
  });

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      mutate((currentVideos) =>
        currentVideos?.map((video) =>
          video.id === update.videoId ? { ...video, ...update } : video
        )
      );
    };

    return () => ws.close();
  }, [mutate]);

  return (
    <div className="space-y-4">
      {videos?.map((video) => (
        <div key={video.id} className="border p-4 rounded">
          <h3 className="font-medium">{video.title}</h3>
          <div className="mt-2">
            <div className="text-sm text-gray-500">Status: {video.status}</div>
            {video.status === "processing" && (
              <div className="mt-2 h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-blue-500 rounded"
                  style={{ width: `${video.progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
