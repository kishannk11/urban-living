import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchBuildingData } from '@/lib/fetchBuildingData';
import BuildingHeader from '@/components/public/BuildingHeader';
import UnitsGrid from '@/components/public/UnitsGrid';
import ScanTracker from '@/components/ScanTracker';

interface PageProps {
    params: Promise<{ slug: string }>;
}

/**
 * Generate metadata for SEO and social sharing
 * This runs before the page renders and sets the page title, description, and OpenGraph tags
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const { building } = await fetchBuildingData(slug);

    if (!building) {
        return {
            title: 'Building Not Found - Urban Living',
            description: 'The property you are looking for does not exist.',
        };
    }

    const title = `${building.name} - Urban Living`;
    const description = building.description || `Property located at ${building.address}`;
    const images = building.imageUrl ? [building.imageUrl] : [];

    return {
        title,
        description,
        openGraph: {
            title: building.name,
            description,
            images,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: building.name,
            description,
            images,
        },
    };
}

/**
 * Building Page - Server Component
 * 
 * Renders the public-facing building page with server-side data fetching
 * for improved SEO and faster initial load times.
 */
export default async function BuildingPage({ params }: PageProps) {
    const { slug } = await params;
    const { building, units } = await fetchBuildingData(slug);

    // If building not found, show Next.js 404 page
    if (!building) {
        notFound();
    }

    return (
        <div>
            {/* Scan Tracker - Client component for analytics */}
            <ScanTracker buildingId={building.id} />

            {/* Building Header - Server component */}
            <BuildingHeader building={building} />

            {/* Units Grid - Client component for modal interactivity */}
            <UnitsGrid units={units} building={building} />
        </div>
    );
}
