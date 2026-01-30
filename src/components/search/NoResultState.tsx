import Link from 'next/link';
import { UserPlus, SearchX } from 'lucide-react';

interface NoResultStateProps {
    searchTerm: string;
}

export default function NoResultState({ searchTerm }: NoResultStateProps) {
    return (
        <div className="text-center py-16 px-4">
            <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchX className="h-10 w-10 text-gray-400" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No public record found for "{searchTerm}"
            </h3>

            <p className="text-gray-500 max-w-md mx-auto mb-8">
                We couldn't find a verified public record matching this name. This person might not be in our database yet, or their record might be private.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                    href="/genealogy/submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Submit Information
                </Link>
                <Link
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                    Contact Archive
                </Link>
            </div>
        </div>
    );
}
