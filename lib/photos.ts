import sharp from "sharp";
import { prisma } from "@/lib/db";
import type { GalleryPhoto } from "@/lib/wedding-config";

const THUMB_WIDTH = 700;
const FULL_WIDTH = 1920;
const OUTPUT_MIME_TYPE = "image/jpeg";

export type PhotoSummary = {
  id: string;
  alt: string;
  order: number;
  createdAt: Date;
};

const summarySelect = { id: true, alt: true, order: true, createdAt: true } as const;

export function listPhotos(): Promise<PhotoSummary[]> {
  return prisma.photo.findMany({
    select: summarySelect,
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function listGalleryPhotos(): Promise<GalleryPhoto[]> {
  const photos = await listPhotos();
  return photos.map((photo) => ({
    src: `/api/photos/${photo.id}/thumb`,
    fullSrc: `/api/photos/${photo.id}/full`,
    alt: photo.alt || "Wedding gallery photo",
  }));
}

export async function getPhotoVariant(
  id: string,
  variant: "thumb" | "full",
): Promise<{ data: Buffer; mimeType: string } | null> {
  const photo = await prisma.photo.findUnique({
    where: { id },
    select: { thumbData: true, fullData: true, mimeType: true },
  });

  if (!photo) return null;

  return {
    data: Buffer.from(variant === "thumb" ? photo.thumbData : photo.fullData),
    mimeType: photo.mimeType,
  };
}

export async function createPhoto(input: { data: Buffer; alt?: string }): Promise<PhotoSummary> {
  const image = sharp(input.data).rotate();
  const [thumbData, fullData] = await Promise.all([
    image.clone().resize({ width: THUMB_WIDTH, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toBuffer(),
    image.clone().resize({ width: FULL_WIDTH, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer(),
  ]);

  const maxOrder = await prisma.photo.aggregate({ _max: { order: true } });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;

  return prisma.photo.create({
    data: {
      thumbData,
      fullData,
      mimeType: OUTPUT_MIME_TYPE,
      alt: input.alt?.trim() ?? "",
      order: nextOrder,
    },
    select: summarySelect,
  });
}

export async function updatePhotoAlt(id: string, alt: string): Promise<PhotoSummary> {
  return prisma.photo.update({ where: { id }, data: { alt }, select: summarySelect });
}

export async function deletePhoto(id: string): Promise<void> {
  await prisma.photo.delete({ where: { id } });
}

export async function movePhoto(id: string, direction: "up" | "down"): Promise<void> {
  const photos = await listPhotos();
  const index = photos.findIndex((photo) => photo.id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= photos.length) return;

  const current = photos[index];
  const swapWith = photos[swapIndex];

  await prisma.$transaction([
    prisma.photo.update({ where: { id: current.id }, data: { order: swapWith.order } }),
    prisma.photo.update({ where: { id: swapWith.id }, data: { order: current.order } }),
  ]);
}
