'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSubmissionById } from '@/lib/submission-database'
import { SubmissionRecord } from '@/lib/submission-schema'
import {
    ArrowLeft, CheckCircle, XCircle, AlertCircle,
    MapPin, User, FileText, Share2, Calendar
} from 'lucide-react'

export default function SubmissionDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [submission, setSubmission] = useState<SubmissionRecord | null>(null)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [adminNotes, setAdminNotes] = useState('')

    useEffect(() => {
        if (params.id) {
            loadSubmission(params.id as string)
        }
    }, [params.id])

    async function loadSubmission(id: string) {
        // In a real app we might fetch via API to avoid direct DB access in client component if using strict RLS
        // checking if we can use the server action or api. 
        // For now we'll fetch via API call to our own internal API or just import logical wrapper if it was a server component.
        // Since this is 'use client', we should probably use an API route to fetch data if we want to be clean, 
        // or use the firebase directly if authorized. Given previous patterns, direct is mostly fine for now,
        // but let's assume we read from the same GET route pattern or just reuse the logic.
        // actually getSubmissionById is imported from lib/submission-database which uses firebase direct.
        // This assumes the user is authenticated as admin in Firebase.
        try {
            const data = await getSubmissionById(id)
            setSubmission(data)
            if (data?.adminNotes) setAdminNotes(data.adminNotes)
        } catch (error) {
            console.error('Failed to load submission', error)
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async () => {
        if (!confirm('Are you sure you want to approve this submission? This will create a permanent Person Record.')) return

        setProcessing(true)
        try {
            const res = await fetch('/api/admin/submissions/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submissionId: submission?.submissionId,
                    reviewerId: 'CURRENT_ADMIN_ID' // In real app, get from session
                }),
            })

            const result = await res.json()
            if (!result.success) throw new Error(result.error)

            alert('Submission Approved!')
            router.refresh()
            loadSubmission(params.id as string)
        } catch (error) {
            alert('Error approving submission: ' + (error instanceof Error ? error.message : 'Unknown error'))
        } finally {
            setProcessing(false)
        }
    }

    const handleUpdateStatus = async (status: 'REJECTED' | 'NEEDS_CLARIFICATION') => {
        if (!adminNotes && status === 'NEEDS_CLARIFICATION') {
            alert('Please add notes explaining what clarification is needed.')
            return
        }

        setProcessing(true)
        try {
            const res = await fetch('/api/admin/submissions/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submissionId: submission?.submissionId,
                    status,
                    notes: adminNotes,
                    reviewerId: 'CURRENT_ADMIN_ID'
                }),
            })

            const result = await res.json()
            if (!result.success) throw new Error(result.error)

            alert(`Submission marked as ${status}`)
            router.refresh()
            loadSubmission(params.id as string)
        } catch (error) {
            alert('Error updating status: ' + (error instanceof Error ? error.message : 'Unknown error'))
        } finally {
            setProcessing(false)
        }
    }

    if (loading) return <div className="p-8 text-center">Loading...</div>
    if (!submission) return <div className="p-8 text-center">Submission not found</div>

    const { data } = submission

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/submissions" className="text-gray-500 hover:text-gray-700">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {data.fullName}
                            </h1>
                            <p className="text-sm text-gray-500">
                                submitted by {data.submitterEmail} on {new Date(submission.submittedAt.seconds * 1000).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold 
                ${submission.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                submission.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                    submission.status === 'NEEDS_CLARIFICATION' ? 'bg-orange-100 text-orange-800' :
                                        'bg-yellow-100 text-yellow-800'}`}>
                            {submission.status}
                        </span>
                        {submission.status === 'PENDING' && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleUpdateStatus('REJECTED')}
                                    disabled={processing}
                                    className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                                >
                                    <XCircle className="w-4 h-4 mr-2" /> Reject
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={processing}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Identity */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <User className="w-5 h-5 mr-2 text-gray-400" /> Identity
                            </h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{data.fullName}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{data.gender}</dd>
                                </div>
                                {data.alternateNames && (
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Alternate Names</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{data.alternateNames.join(', ')}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {/* Lineage */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Share2 className="w-5 h-5 mr-2 text-gray-400" /> Lineage
                            </h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">State of Origin</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{data.state}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">LGA</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{data.localGovernmentArea}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Town</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{data.town}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Village</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{data.village}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Kindred</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{data.kindred}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Umunna</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{data.umunna}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Life Events (Optional) */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-gray-400" /> Life Events
                            </h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{data.isDeceased ? 'Deceased' : 'Living'}</dd>
                                </div>
                            </dl>
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Admin Actions Panel */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Controls</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Reviewer Notes
                                    </label>
                                    <textarea
                                        rows={4}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold sm:text-sm"
                                        placeholder="Internal notes or reasons for rejection..."
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                    />
                                </div>

                                {submission.status === 'PENDING' && (
                                    <button
                                        onClick={() => handleUpdateStatus('NEEDS_CLARIFICATION')}
                                        className="w-full flex justify-center items-center px-4 py-2 border border-orange-300 text-orange-700 rounded-md hover:bg-orange-50"
                                    >
                                        <AlertCircle className="w-4 h-4 mr-2" /> Request Clarification
                                    </button>
                                )}

                                {submission.status === 'APPROVED' && (
                                    <div className="p-3 bg-green-50 rounded text-sm text-green-800">
                                        <p className="font-semibold">Approved</p>
                                        <p>Person ID: {submission.convertedPersonId || 'Linked'}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submitter Info */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Info</h3>
                            <dl className="space-y-3">
                                <div>
                                    <dt className="text-xs font-medium text-gray-500 uppercase">Email</dt>
                                    <dd className="text-sm text-gray-900">{data.submitterEmail}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-gray-500 uppercase">Phone</dt>
                                    <dd className="text-sm text-gray-900">{data.submitterPhone || 'N/A'}</dd>
                                </div>
                            </dl>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
