import { Metadata } from 'next';
import Link from 'next/link';
import { searchAllRecords } from '@/lib/search-service';
import SearchBox from '@/components/search/SearchBox';
import SearchResultCard from '@/components/search/SearchResultCard';
import NoResultState from '@/components/search/NoResultState';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Search Ancestry Records | Ndigbo Viva',
    description: 'Search the registry of Igbo ancestry records and submissions.',
};

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const q = params.q || '';

    // Search across both submissions and published records
    const results = q ? await searchAllRecords(q) : [];

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header / Search Hero */}
            <div className="bg-white border-b border-gray-100 mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
                        Search Ancestry Records
                    </h1>
                    <p className="text-center text-gray-600 mb-6">
                        Find records by name. You can also{' '}
                        <Link href="/my-submissions" className="text-brand-gold hover:text-amber-700 font-medium inline-flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            view your own records
                        </Link>
                        {' '}if you’ve submitted any.
                    </p>
                    <SearchBox />
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {/* Results Info */}
                {q && (
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-sm font-medium text-gray-500">
                            {results.length} result{results.length !== 1 && 's'} for <span className="text-gray-900 font-bold">"{q}"</span>
                        </h2>
                    </div>
                )}

                {/* Results Grid */}
                <div className="space-y-4">
                    {q && results.length > 0 ? (
                        results.map((result) => (
                            <SearchResultCard key={result.id} result={result} />
                        ))
                    ) : q ? (
                        <NoResultState searchTerm={q} />
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <p>Type a name above to begin your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
