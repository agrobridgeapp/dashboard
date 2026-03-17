import { NextResponse } from "next/server"
import { SERVICE_TEMPLATES } from "@/lib/data/mock-data"

// GET /api/service-templates - Get all service templates
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cropType = searchParams.get("cropType")

  let filteredTemplates = [...SERVICE_TEMPLATES]

  if (cropType) {
    filteredTemplates = filteredTemplates.filter((t) => t.cropType === cropType)
  }

  return NextResponse.json({
    success: true,
    data: filteredTemplates,
    count: filteredTemplates.length,
  })
}
