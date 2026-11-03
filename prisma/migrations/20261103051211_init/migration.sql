-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('video', 'photos', 'both');

-- CreateEnum
CREATE TYPE "MediaCategory" AS ENUM ('Concerts', 'Weddings', 'Corporate', 'Sports', 'Other');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('Live', 'Draft', 'Hidden');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('New', 'Quoted', 'Confirmed', 'Completed');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'staff');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'staff',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "MediaCategory" NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'video',
    "eventDate" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "videoUrl" TEXT,
    "duration" TEXT,
    "photoCount" INTEGER NOT NULL DEFAULT 0,
    "photos" TEXT[],
    "cameraCount" INTEGER NOT NULL DEFAULT 4,
    "featuredOnHome" BOOLEAN NOT NULL DEFAULT false,
    "autoCompress" BOOLEAN NOT NULL DEFAULT true,
    "addWatermark" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublishStatus" NOT NULL DEFAULT 'Live',
    "fileSizeMB" DOUBLE PRECISION NOT NULL DEFAULT 45.0,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "visualTheme" TEXT NOT NULL DEFAULT 'stage-beams',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaItem" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSizeMB" DOUBLE PRECISION NOT NULL,
    "duration" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingRequest" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "eventType" TEXT NOT NULL,
    "eventDate" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "cameraSetup" TEXT NOT NULL,
    "liveStream" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'New',
    "quotedAmount" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePackage" (
    "id" TEXT NOT NULL,
    "tierName" TEXT NOT NULL,
    "cameraCount" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "priceLKR" TEXT NOT NULL,
    "features" TEXT[],
    "highlighted" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicePackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientRole" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "avatarColor" TEXT NOT NULL DEFAULT '#E8332B',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "heroBadge" TEXT NOT NULL DEFAULT 'MULTI-CAMERA PRODUCTION',
    "heroHeadline" TEXT NOT NULL DEFAULT 'Every angle. Every moment. Live.',
    "heroSubheadline" TEXT NOT NULL DEFAULT 'Concerts, weddings, corporate events and sports — filmed with up to 12 cameras in 4K and streamed in real time to audiences anywhere.',
    "heroVideoUrl" TEXT NOT NULL DEFAULT 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    "eventsFilmed" TEXT NOT NULL DEFAULT '850+',
    "cameraSetups" TEXT NOT NULL DEFAULT '12',
    "liveViewers" TEXT NOT NULL DEFAULT '1.2M',
    "yearsInProduction" TEXT NOT NULL DEFAULT '10 yrs',
    "showPackagePrices" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT NOT NULL DEFAULT '+94 77 037 7342',
    "whatsappNumber" TEXT NOT NULL DEFAULT '94770377342',
    "email" TEXT NOT NULL DEFAULT 'hello@liveimage.lk',
    "address" TEXT NOT NULL DEFAULT 'Dehiwala / Colombo, Sri Lanka',
    "facebookUrl" TEXT NOT NULL DEFAULT 'https://facebook.com/LIVEIMAGE.lk',
    "facebookPersonalUrl" TEXT NOT NULL DEFAULT 'https://facebook.com/sadaruwanvideo',
    "youtubeUrl" TEXT NOT NULL DEFAULT 'https://youtube.com/@liveimagelk',
    "instagramUrl" TEXT NOT NULL DEFAULT 'https://instagram.com/liveimagelk',
    "tiktokUrl" TEXT NOT NULL DEFAULT 'https://tiktok.com/@liveimagelk',
    "clientLogos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "MediaItem" ADD CONSTRAINT "MediaItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "MediaProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
