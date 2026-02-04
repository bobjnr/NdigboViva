import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth-config';
import { getUserSubmissions } from '@/lib/submission-database';
import SubmissionCard from '@/components/submissions/SubmissionCard';
import { Metadata } from 'next';
import { PlusCircle, FileText } from 'lucide-react';

export const metadata: Metadata = {
    title: 'My Submissions | Ndigbo Viva',
    description: 'Track the status of your ancestry record submissions.',
};

export default async function MySubmissionsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect('/api/auth/signin?callbackUrl=/my-submissions');
    }

    const userEmail = session.user.email;
    const submissions = await getUserSubmissions(userEmail);

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                My Submissions
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Track and manage your contributed ancestry records.
                            </p>
                        </div>
                        <Link
                            href="/get-started"
                            className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-gold hover:bg-amber-600 shadow-sm transition-colors"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Submission
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {submissions.length > 0 ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <span>Showing {submissions.length} record{submissions.length !== 1 && 's'}</span>
                            <span>Sorted by newest</span>
                        </div>

                        {submissions.map((submission) => (
                            <SubmissionCard key={submission.submissionId} submission={submission} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 mb-6">
                            <FileText className="h-8 w-8 text-amber-500" />
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-gray-900">No submissions yet</h3>
                        <p className="mt-1 text-gray-500 max-w-sm mx-auto">
                            You haven't submitted any ancestry records yet. Start preserving your heritage today.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/get-started"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-gold hover:bg-amber-600"
                            >
                                <PlusCircle className="-ml-1 mr-2 h-4 w-4" />
                                Create First Record
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
