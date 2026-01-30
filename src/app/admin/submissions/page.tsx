'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSubmissions } from '@/lib/submission-database'
import { SubmissionRecord, SubmissionStatus } from '@/lib/submission-schema'
import { FileText, CheckCircle, XCircle, Clock, AlertCircle, Eye } from 'lucide-react'

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<SubmissionRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<SubmissionStatus | 'ALL'>('ALL')

    useEffect(() => {
        loadSubmissions()
    }, [filter])

    async function loadSubmissions() {
        setLoading(true)
        try {
            const data = await getSubmissions(filter === 'ALL' ? undefined : filter)
            setSubmissions(data)
        } catch (error) {
            console.error('Failed to load submissions', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: SubmissionStatus) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800'
            case 'APPROVED': return 'bg-green-100 text-green-800'
            case 'REJECTED': return 'bg-red-100 text-red-800'
            case 'NEEDS_CLARIFICATION': return 'bg-orange-100 text-orange-800'
        }
    }

    const getStatusIcon = (status: SubmissionStatus) => {
        switch (status) {
            case 'PENDING': return <Clock className="w-4 h-4 mr-1" />
            case 'APPROVED': return <CheckCircle className="w-4 h-4 mr-1" />
            case 'REJECTED': return <XCircle className="w-4 h-4 mr-1" />
            case 'NEEDS_CLARIFICATION': return <AlertCircle className="w-4 h-4 mr-1" />
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Genealogy Submissions</h1>
                        <p className="text-gray-600 mt-1">Review and manage incoming family history claims</p>
                    </div>
                    <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                        &larr; Back to Dashboard
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {(['ALL', 'PENDING', 'APPROVED', 'NEEDS_CLARIFICATION', 'REJECTED'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                                    ? 'bg-brand-gold text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading submissions...</div>
                    ) : submissions.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No submissions found.</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Person Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitter</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {submissions.map((sub) => (
                                    <tr key={sub.submissionId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {sub.submittedAt?.seconds
                                                ? new Date(sub.submittedAt.seconds * 1000).toLocaleDateString()
                                                : 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{sub.data.fullName}</div>
                                            <div className="text-sm text-gray-500">{sub.data.gender}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {sub.data.town}, {sub.data.state}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{sub.data.submitterEmail}</div>
                                            <div className="text-xs">{sub.data.submitterRelationship}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                                                {getStatusIcon(sub.status)}
                                                {sub.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/admin/submissions/${sub.submissionId}`}
                                                className="text-brand-gold hover:text-brand-gold-dark inline-flex items-center"
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                Review
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}
