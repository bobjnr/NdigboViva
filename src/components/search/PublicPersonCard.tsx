import Link from 'next/link';
import { CheckCircle2, MapPin } from 'lucide-react';
import { PublicPersonRecord } from '@/lib/public-person-schema';

interface PublicPersonCardProps {
    person: PublicPersonRecord;
}

export default function PublicPersonCard({ person }: PublicPersonCardProps) {
    // Construct location string from available lineage data
    const locations = [
        person.lineage.village,
        person.lineage.town,
        person.lineage.state
    ].filter(Boolean).join(', ');

    return (
        <Link
            href={`/search/record/${person.identity.personId}`}
            className="block group bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-amber-200 transition-all duration-200"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                        {person.identity.fullName}
                    </h3>

                    {person.identity.alternateNames && person.identity.alternateNames.length > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                            Also known as: {person.identity.alternateNames.join(', ')}
                        </p>
                    )}

                    <div className="flex items-center mt-3 text-gray-600 space-x-4">
                        {locations && (
                            <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-1.5 text-amber-500" />
                                {locations}
                            </div>
                        )}
                    </div>

                    {(person.cultural?.titles && person.cultural.titles.length > 0) && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {person.cultural.titles.slice(0, 3).map((title, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700"
                                >
                                    {title}
                                </span>
                            ))}
                            {person.cultural.titles.length > 3 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600">
                                    +{person.cultural.titles.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-end space-y-2">
                    {person.verification.verified && (
                        <div className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Verified
                        </div>
                    )}
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        {person.identity.personId}
                    </span>
                </div>
            </div>
        </Link>
    );
}
