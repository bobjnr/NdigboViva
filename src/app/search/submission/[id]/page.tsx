import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getSubmissionById } from '@/lib/submission-database';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Users, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const submission = await getSubmissionById(id);

  if (!submission) {
    return { title: 'Record Not Found' };
  }

  return {
    title: `${submission.data.fullName} | Ndigbo Viva Ancestry`,
    description: `View the submitted ancestry record of ${submission.data.fullName}.`,
  };
}

export default async function SubmissionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const submission = await getSubmissionById(id);

  if (!submission) {
    notFound();
  }

  const d = submission.data;
  const locationParts = [
    d.originVillage || d.village,
    d.originTown || d.town,
    d.originLocalGovernmentArea || d.localGovernmentArea,
    d.originState || d.state,
  ].filter(Boolean);
  const locationString = locationParts.join(', ');

  const getStatusBadge = () => {
    switch (submission.status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-1.5" />
            Rejected
          </span>
        );
      case 'NEEDS_CLARIFICATION':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
            <AlertCircle className="w-4 h-4 mr-1.5" />
            Needs Info
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Clock className="w-4 h-4 mr-1.5" />
            Pending Verification
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/search"
          className="inline-flex items-center text-sm text-gray-500 hover:text-amber-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Search
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-amber-600 to-amber-800 flex items-center justify-end px-6">
            {getStatusBadge()}
          </div>

          <div className="px-8 pb-8 pt-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{d.fullName}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <section>
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Origins</h2>
                  <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                    {locationString && (
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Ancestral Home</p>
                          <p className="text-sm text-gray-600">{locationString}</p>
                        </div>
                      </div>
                    )}
                    {(d.originKindred || d.kindred) && (
                      <div className="flex items-start">
                        <Users className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Kindred</p>
                          <p className="text-sm text-gray-600">{d.originKindred || d.kindred}</p>
                        </div>
                      </div>
                    )}
                    {(d.originUmunna || d.umunna) && (
                      <div className="flex items-start">
                        <Users className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Umunna (Family)</p>
                          <p className="text-sm text-gray-600">{d.originUmunna || d.umunna}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section>
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Record Info</h2>
                  <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Status</p>
                        <p className="text-sm text-gray-600">
                          {d.isDeceased ? 'Deceased' : 'Living'}
                        </p>
                      </div>
                    </div>
                    {submission.submittedAt && (
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Submitted</p>
                          <p className="text-sm text-gray-600">
                            {format(
                              (submission.submittedAt as { toDate?: () => Date; seconds?: number }).toDate?.() ??
                                (submission.submittedAt && 'seconds' in submission.submittedAt
                                  ? new Date((submission.submittedAt as { seconds: number }).seconds * 1000)
                                  : new Date()),
                              'MMM d, yyyy'
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                    {d.gender && d.gender !== 'UNKNOWN' && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">Gender</p>
                        <p className="text-sm text-gray-600">{d.gender}</p>
                      </div>
                    )}
                  </div>
                </section>

                {submission.status === 'PENDING' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm text-amber-800">
                      This record is awaiting verification by our team. Once verified, it will be published to the public registry.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {d.story && (
              <section className="mt-8 pt-8 border-t border-gray-100">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Biography</h2>
                <div className="prose prose-sm text-gray-600">
                  <p>{d.story}</p>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
