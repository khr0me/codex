import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg"];

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = "." + file.name.split(".").pop()?.toLowerCase();

  if (!ALLOWED_TYPES.includes(file.type) || !ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      { error: "Only PNG, JPG, and JPEG images are allowed" },
      { status: 400 }
    );
  }

  const filename = `${randomUUID()}${ext}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
