import Link from 'next/link';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, Clock, AlertCircle, MapPin } from 'lucide-react';
import { SearchResult } from '@/lib/search-service';

interface SearchResultCardProps {
    result: SearchResult;
}

export default function SearchResultCard({ result }: SearchResultCardProps) {
    // Construct location string
    const locations = [
        result.village,
        result.town,
        result.state
    ].filter(Boolean).join(', ');

    // Status badge for submissions
    const getStatusBadge = () => {
        if (result.source === 'published') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Published
                </span>
            );
        }

        switch (result.status) {
            case 'APPROVED':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Approved
                    </span>
                );
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                    </span>
                );
            case 'NEEDS_CLARIFICATION':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Needs Info
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </span>
                );
        }
    };

    return (
        <div className="block group bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-amber-200 transition-all duration-200">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                            {result.fullName}
                        </h3>
                        {getStatusBadge()}
                    </div>

                    {result.alternateNames && result.alternateNames.length > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                            Also known as: {result.alternateNames.join(', ')}
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

                    {result.submittedAt && (
                        <p className="text-xs text-gray-400 mt-2">
                            Submitted: {format(result.submittedAt, 'MMM d, yyyy')}
                        </p>
                    )}
                </div>

                <div className="flex flex-col items-end space-y-2">
                    {result.isDeceased && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Deceased
                        </span>
                    )}
                    {result.gender && result.gender !== 'UNKNOWN' && (
                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            {result.gender}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
