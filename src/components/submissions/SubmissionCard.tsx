import Link from 'next/link';
import { format } from 'date-fns';
import { Clock, CheckCircle2, XCircle, AlertCircle, MapPin, Calendar, FileText, Eye } from 'lucide-react';
import { SubmissionRecord, SubmissionStatus } from '@/lib/submission-schema';

interface SubmissionCardProps {
    submission: SubmissionRecord;
}

export default function SubmissionCard({ submission }: SubmissionCardProps) {
    const { data, status, submittedAt, submissionId } = submission;

    // Status Badge Logic
    const getStatusBadge = (status: SubmissionStatus) => {
        switch (status) {
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
                        Info Needed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Review
                    </span>
                );
        }
    };

    // Date formatting
    const submittedDate = submittedAt?.seconds
        ? format(new Date(submittedAt.seconds * 1000), 'MMM d, yyyy')
        : 'Unknown Date';

    // Location string
    const location = [
        data.village,
        data.town,
        data.state
    ].filter(Boolean).join(', ');

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col md:flex-row justify-between gap-4">

                {/* Main Content */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                            {data.fullName}
                        </h3>
                        <div className="md:hidden">
                            {getStatusBadge(status)}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600 mb-3">
                        {location && (
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                                {location}
                            </div>
                        )}
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                            Submitted: {submittedDate}
                        </div>
                    </div>

                    {/* Additional Info Snippet */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="font-mono">{submissionId}</span>
                        {data.gender && (
                            <>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>{data.gender}</span>
                            </>
                        )}
                        {data.isDeceased && (
                            <>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>Deceased</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Status Column (Desktop) */}
                <div className="hidden md:flex flex-col items-end justify-between min-w-[120px]">
                    {getStatusBadge(status)}
                    <Link
                        href={status === 'APPROVED' && submission.convertedPersonId
                            ? `/search/record/${submission.convertedPersonId}`
                            : `/search/submission/${submissionId}`}
                        className="text-sm text-brand-gold hover:text-amber-700 font-medium mt-auto inline-flex items-center"
                    >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                    </Link>
                </div>
            </div>

            {/* Rejection/Feedback Reason */}
            {status === 'REJECTED' && submission.rejectionReason && (
                <div className="mt-4 p-3 bg-red-50 text-red-800 text-sm rounded-lg border border-red-100">
                    <strong>Reason for rejection:</strong> {submission.rejectionReason}
                </div>
            )}
            {status === 'NEEDS_CLARIFICATION' && submission.adminNotes && (
                <div className="mt-4 p-3 bg-amber-50 text-amber-800 text-sm rounded-lg border border-amber-100">
                    <strong>Note from editor:</strong> {submission.adminNotes}
                </div>
            )}

            {/* View link (mobile) */}
            <div className="mt-4 md:hidden pt-3 border-t border-gray-100">
                <Link
                    href={status === 'APPROVED' && submission.convertedPersonId
                        ? `/search/record/${submission.convertedPersonId}`
                        : `/search/submission/${submissionId}`}
                    className="text-sm text-brand-gold hover:text-amber-700 font-medium inline-flex items-center"
                >
                    <Eye className="w-4 h-4 mr-1" />
                    View this record
                </Link>
            </div>
        </div>
    );
}
