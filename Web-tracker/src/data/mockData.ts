// AME Tracking System Data Structures — Empty State Initializer

export interface ShippingPiece {
  srNo: number;
  downloadNo: string;
  jobId: string;
  pieceNo: string;
  qrCode: string;
  sourceFlag: string;
  scanStatus: string;
  scanDateTime: string | null;
}

export const INITIAL_SHIPPING_PIECES: ShippingPiece[] = [];

export interface TrackingActivity {
  id: string;
  time: string;
  pieceNo: string;
  jobId: string;
  status: string;
}

export const INITIAL_TRACKING_ACTIVITY: TrackingActivity[] = [];

export const INITIAL_IMPORT_HISTORY: any[] = [];

export interface TransitItem {
  transitId: string;
  transitNumber: string;
  vehicleType: string;
  driver: string;
  status: string;
  lastUpdated: string;
}

export const INITIAL_TRANSITS: TransitItem[] = [];
