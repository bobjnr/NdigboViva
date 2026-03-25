import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPersonById } from '@/lib/person-database';
import { PublicPersonRecord } from '@/lib/public-person-schema';
import Link from 'next/link';
import { ArrowLeft, Share2, MapPin, Calendar, Users, ShieldCheck, Flag, GitBranch } from 'lucide-react';
import RegistryTreeEmbed from '@/components/RegistryTreeEmbed';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const person = await getPersonById(resolvedParams.id);

    if (!person) {
        return { title: 'Record Not Found' };
    }

    return {
        title: `${person.identity.fullName} | Ndigbo Viva Ancestry`,
        description: `View the ancestry record of ${person.identity.fullName} from ${person.lineage?.town ?? ''}, ${person.lineage?.state ?? ''}.`,
    };
}

export default async function RecordPage({ params }: PageProps) {
    const resolvedParams = await params;
    const person = await getPersonById(resolvedParams.id);

    if (!person) {
        notFound();
    }

    // SAFETY CHECK: Ensure record is public-viewable
    // This logic mimics the one in publishPerson to be double-safe at runtime
    if ((person.verification?.verificationLevel ?? 0) < 2 && person.verification?.visibilitySetting !== 'PUBLIC') {
        // In a real app, we might redirect to a 'Request Access' page
        // For now, treat as 404
        notFound();
    }

    const publicPerson = person as unknown as PublicPersonRecord;

    const locationString = [
        person.lineage?.village,
        person.lineage?.town,
        person.lineage?.localGovernmentArea,
        person.lineage?.state
    ].filter(Boolean).join(', ');

    return (
        <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Navigation */}
                <Link
                    href="/search"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-amber-700 mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Search
                </Link>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Banner (Optional - could use a pattern) */}
                    <div className="h-32 bg-gradient-to-r from-amber-700 to-amber-900 relative">
                        <div className="absolute top-4 right-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/20 text-white text-xs font-medium backdrop-blur-sm">
                                <ShieldCheck className="w-3 h-3 mr-1" />
                                Verified Record
                            </span>
                        </div>
                    </div>

                    <div className="px-8 pb-8">
                        {/* Profile Image & Name */}
                        <div className="relative -mt-16 mb-6 flex flex-col sm:flex-row items-end sm:items-end gap-6">
                            <div className="h-32 w-32 rounded-xl bg-white p-1 shadow-md">
                                {person.identity.photoUrl ? (
                                    <img
                                        src={person.identity.photoUrl}
                                        alt={person.identity.fullName}
                                        className="h-full w-full object-cover rounded-lg bg-gray-100"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-stone-100 rounded-lg flex items-center justify-center text-stone-300">
                                        <Users className="h-12 w-12" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 pb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{person.identity.fullName}</h1>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {person.cultural?.titles?.map((title, i) => (
                                        <span key={i} className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                                            {title}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button className="mb-2 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">

                            {/* Column 1: Identity & Origins */}
                            <div className="space-y-6">
                                <section>
                                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Origins</h2>
                                    <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                                        <div className="flex items-start">
                                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Ancestral Home</p>
                                                <p className="text-sm text-gray-600">{locationString}</p>
                                            </div>
                                        </div>
                                        {person.lineage?.umunna && (
                                            <div className="flex items-start">
                                                <Users className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Umunna (Family)</p>
                                                    <p className="text-sm text-gray-600">{person.lineage?.umunna}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Life Events</h2>
                                    <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                                        <div className="flex items-start">
                                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Status</p>
                                                <p className="text-sm text-gray-600">
                                                    {person.lifeEvents?.isDeceased ? 'Deceased' : 'Living'}
                                                </p>
                                            </div>
                                        </div>
                                        {person.lifeEvents?.deathDate && (
                                            <div className="flex items-start">
                                                <div className="ml-8">
                                                    <p className="text-sm font-medium text-gray-900">Passed On</p>
                                                    <p className="text-sm text-gray-600">{person.lifeEvents.deathDate}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>

                            {/* Column 2: Biography & Verification */}
                            <div className="space-y-6">
                                {person.documentation?.story && (
                                    <section>
                                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Biography</h2>
                                        <div className="prose prose-sm text-gray-600">
                                            <p>{person.documentation?.story}</p>
                                        </div>
                                    </section>
                                )}

                                <section>
                                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Verification Badge</h2>
                                    <div className="border border-green-200 bg-green-50 rounded-xl p-4 flex items-center">
                                        <ShieldCheck className="w-8 h-8 text-green-600 mr-4" />
                                        <div>
                                            <p className="text-sm font-bold text-green-900">Verified Ancestry Record</p>
                                            <p className="text-xs text-green-700 mt-0.5">
                                                This record has been verified by community elders and administrators.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section className="flex flex-wrap gap-3">
                                    <Link
                                        href={`/genealogy/person/${person.identity.personId}`}
                                        className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-900 transition-colors"
                                    >
                                        <GitBranch className="w-4 h-4 mr-2" />
                                        View family tree
                                    </Link>
                                    {publicPerson.registryUrl && (
                                        <>
                                            <a
                                                href={publicPerson.registryUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors"
                                            >
                                                <Share2 className="w-4 h-4 mr-2" />
                                                View in official registry
                                            </a>
                                            <p className="text-xs text-gray-500 w-full mt-1">
                                                This record is also in the Igbo genealogy registry (e.g. Gramps Web). Opens in a new tab.
                                            </p>
                                        </>
                                    )}
                                </section>

                                {publicPerson.registryUrl && (
                                    <section className="mt-8 pt-8 border-t border-gray-100">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Family tree in official registry</h2>
                                        <p className="text-sm text-gray-600 mb-4">
                                            The registry (Gramps Web) family tree for this person is shown below. If it does not load, use &quot;Open in new tab&quot; above.
                                        </p>
                                        <RegistryTreeEmbed
                                            registryUrl={publicPerson.registryUrl}
                                            registryLabel="official registry (Gramps Web)"
                                            height={560}
                                        />
                                    </section>
                                )}

                                <section className="pt-8 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>Identify an error?</span>
                                        <Link
                                            href={`/genealogy/submit?correction=${person.identity.personId}`}
                                            className="flex items-center text-amber-600 hover:text-amber-700 font-medium"
                                        >
                                            <Flag className="w-4 h-4 mr-1.5" />
                                            Submit Correction
                                        </Link>
                                    </div>
                                </section>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
