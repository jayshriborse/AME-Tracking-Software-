import { Platform } from 'react-native'
import * as FileSystem from 'expo-file-system'
import { apiRequest, API_BASE_URL } from '@/services/api'
import { getAccessToken } from '@/services/auth-storage'
import type { ClientOrderGroup, ScanPreview, ScanSuccess, TransitSummary } from '@/types/api'

export async function createTransit(vehicleNumber?: string) {
  return apiRequest<TransitSummary>('/api/transits', {
    method: 'POST',
    body: vehicleNumber ? JSON.stringify({ vehicleNumber: vehicleNumber.trim() }) : undefined,
  })
}

export async function updateVehicleNumber(transitId: string, vehicleNumber: string) {
  return apiRequest<{ id: number; vehicleNumber: string }>(`/api/transits/${transitId}/vehicle`, {
    method: 'POST',
    body: JSON.stringify({ vehicleNumber: vehicleNumber.trim() }),
  })
}

export async function listTransits(params?: { status?: string }) {
  const query = params?.status ? `?status=${params.status}` : ''
  return apiRequest<{
    items: TransitSummary[]
    total: number
  }>(`/api/transits${query}`)
}

export async function listTransitsGrouped() {
  return apiRequest<ClientOrderGroup[]>('/api/transits/grouped')
}

export async function getTransit(id: string) {
  return apiRequest<
    TransitSummary & {
      transitProducts: Array<{
        id: string
        scannedAt: string
        product: {
          id: string
          pieceNumber: string
          fitting: string | null
          job: {
            code: string
            project: { code: string; client: { name: string } }
          }
        }
      }>
      grouped: Array<{
        client: string
        projects: Array<{
          project: string
          products: Array<{
            productId: string
            pieceNumber: string
            fitting: string | null
            jobCode: string
            scannedAt: string
          }>
        }>
      }>
      summary: { products: number; clients: number; projects: number }
    }
  >(`/api/transits/${id}`)
}

export async function previewTransitScan(transitId: string, qrCode: string) {
  return apiRequest<ScanPreview>(`/api/transits/${transitId}/scan/preview`, {
    method: 'POST',
    body: JSON.stringify({ qrCode }),
  })
}

export async function scanTransitProduct(
  transitId: string,
  qrCode: string,
  requestId: string,
) {
  return apiRequest<ScanSuccess>(`/api/transits/${transitId}/scan`, {
    method: 'POST',
    body: JSON.stringify({ qrCode, requestId, source: 'Mobile scan' }),
  })
}

export async function uploadTruckPhoto(transitId: string, uri: string) {
  const token = await getAccessToken()
  const uploadUrl = `${API_BASE_URL}/api/transits/${transitId}/photo`

  if (Platform.OS !== 'web' && typeof FileSystem.uploadAsync === 'function') {
    const uploadResult = await FileSystem.uploadAsync(uploadUrl, uri, {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'photo',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        Accept: 'application/json',
      },
    })

    let body: any
    try {
      body = JSON.parse(uploadResult.body)
    } catch {
      throw new Error(`Upload failed with status ${uploadResult.status}`)
    }

    if (!body.success) {
      throw new Error(body.error?.message || 'Failed to upload truck photo')
    }
    return body.data as TransitSummary
  }

  // Web and standard Blob/File fallback
  const filename = uri.split('/').pop() || `truck-${Date.now()}.jpg`
  const match = /\.(\w+)$/.exec(filename)
  const type = match ? `image/${match[1]}` : 'image/jpeg'

  const res = await fetch(uri)
  const blob = await res.blob()
  const file = typeof File !== 'undefined'
    ? new File([blob], filename, { type: blob.type || type })
    : blob

  const form = new FormData()
  form.append('photo', file as any)

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      Accept: 'application/json',
    },
    body: form,
  })

  const body = await response.json()
  if (!body.success) {
    throw new Error(body.error?.message || 'Failed to upload truck photo')
  }
  return body.data as TransitSummary
}

export async function completeTransit(transitId: string) {
  return apiRequest<TransitSummary & { productsLoaded: number }>(
    `/api/transits/${transitId}/complete`,
    { method: 'POST' },
  )
}
