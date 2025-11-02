"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { callBinaryApi } from "@/utils/api";

function ImageGeneratorPage() {
  // Auth hooks
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();

  // State hooks
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Check authentication
  if (authLoading) return <p className="p-4">Loading...</p>;
  if (!token) {
    router.push('/login');
    return null;
  }


  async function generateImage() {
    setLoading(true);
    setErr(null);
    setImageUrl(null);
    try {
      const res = await callBinaryApi(
        "post",
        "/api/v1/generate-image",
        { prompt: prompt, width: 600, height: 600 }
      );
      // convert blob → object URL
      const url = URL.createObjectURL(res);
      setImageUrl(url);
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'message' in e) {
        setErr((e as { message?: string }).message || "Unknown error");
      } else {
        setErr("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "32px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        AI Image Generator
      </h1>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write Anything for create image"
          style={{
            flex: 1,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />
        <button
          onClick={generateImage}
          disabled={loading || !prompt.trim()}
          style={{
            padding: "10px 16px",
            borderRadius: 6,
            background: loading ? "#ccc" : "#111",
            color: "#fff",
          }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {err && <p style={{ color: "red", marginTop: 12 }}>{err}</p>}

      {imageUrl && (
        <div style={{ marginTop: 20, position: 'relative', width: '100%', height: '600px' }}>
          <Image
            src={imageUrl}
            alt="Generated"
            fill
            style={{ objectFit: 'contain', borderRadius: 10 }}
            unoptimized // This is needed for blob URLs
          />
        </div>
      )}
    </div>
  );
}

export default ImageGeneratorPage;
