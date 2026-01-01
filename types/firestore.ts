/**
 * TypeScript interfaces for Firestore collections
 * Urban Living - Property Management Platform
 */

/**
 * User Document Interface
 * Collection: users
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'tenant';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Building Document Interface
 * Collection: buildings
 */
export interface Building {
  id: string;
  slug: string; // Unique identifier for URL (e.g., "tower-heights-mumbai")
  name: string;
  address: string;
  ownerId: string; // Reference to users collection
  description?: string;
  imageUrl?: string;
  amenities?: string[];
  ownerName?: string; // Owner's display name
  ownerPhone?: string; // Owner's contact phone
  ownerWhatsApp?: string; // Owner's WhatsApp number
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Unit Type Options
 */
export type UnitType = '1RK' | '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'PG-Bed' | 'Studio';

/**
 * Unit Status Enum
 */
export enum UnitStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE'
}

/**
 * Unit Document Interface
 * Collection: units
 */
export interface Unit {
  id: string;
  buildingId: string; // Reference to buildings collection
  type: UnitType; // e.g., "1BHK", "2BHK", "Studio"
  rent: number;
  deposit?: number; // Security deposit amount
  status: UnitStatus;
  description?: string;
  floor?: number;
  unitNumber?: string;
  area?: number; // in sq ft
  amenities?: string[];
  images?: string[]; // Array of image URLs
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Type guard to check if a value is a valid UnitStatus
 */
export function isValidUnitStatus(status: string): status is UnitStatus {
  return Object.values(UnitStatus).includes(status as UnitStatus);
}
