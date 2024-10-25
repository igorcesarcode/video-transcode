import { useState } from "react";
import { useForm } from "react-hook-form";

export function VideoUpload() {
  const { register, handleSubmit } = useForm();
  const [uploading, setUploading] = useState(false);

  const onSubmit = async (data: any) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("file", data.file[0]);

    try {
      await fetch("/api/videos", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          {...register("title")}
          className="mt-1 block w-full rounded-md border-gray-300"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Video File</label>
        <input
          type="file"
          {...register("file")}
          accept="video/*"
          className="mt-1 block w-full"
        />
      </div>
      <button
        type="submit"
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload Video"}
      </button>
    </form>
  );
}
