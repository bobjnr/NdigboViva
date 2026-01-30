'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllPersons } from '@/lib/person-database' // Uses 'persons' collection (SOVEREIGN) by default if I check the import
// Wait, I updated getAllPersons to use COLLECTION_NAME which IS 'persons'. Good. 
// Only search/location functions use PUBLIC_COLLECTION_NAME.
// I need to confirm logic in person-database.ts.
// getAllPersons uses COLLECTION_NAME ('persons'). Correct.

import { PersonRecord } from '@/lib/person-schema'
import { FileText, Globe, Lock, Shield } from 'lucide-react'

export default function RecordsPage() {
    const [persons, setPersons] = useState<PersonRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [publishing, setPublishing] = useState<string | null>(null)

    useEffect(() => {
        loadRecords()
    }, [])

    async function loadRecords() {
        setLoading(true)
        try {
            // Direct call to DB function (assuming client has permission or using server component pattern later)
            // For now this works as we are in 'use client' and using firebase direct
            const data = await getAllPersons(100)
            setPersons(data)
        } catch (error) {
            console.error('Failed to load records', error)
        } finally {
            setLoading(false)
        }
    }

    const handlePublish = async (personId: string) => {
        if (!confirm('Are you sure you want to publish this record to the public index?')) return

        setPublishing(personId)
        try {
            const res = await fetch('/api/admin/persons/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    personId,
                    publisherId: 'CURRENT_ADMIN_ID'
                }),
            })

            const result = await res.json()
            if (!result.success) throw new Error(result.error)

            alert('Record Published Successfully!')
            // Optionally reload or update UI state
        } catch (error) {
            alert('Error publishing: ' + (error instanceof Error ? error.message : 'Unknown error'))
        } finally {
            setPublishing(null)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Sovereign Records (Gramps Web)</h1>
                        <p className="text-gray-600 mt-1">Manage authoritative family data</p>
                    </div>
                    <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                        &larr; Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading records...</div>
                    ) : persons.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No records found.</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {persons.map((person) => (
                                    <tr key={person.identity.personId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">
                                            {person.identity.personId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{person.identity.fullName}</div>
                                            <div className="text-xs text-gray-500">{person.identity.gender}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                         ${person.verification.visibilitySetting === 'PUBLIC' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {person.verification.visibilitySetting}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">Level {person.verification.verificationLevel}</div>
                                            <div className="text-xs text-gray-500">{person.verification.verified ? 'Verified' : 'Unverified'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handlePublish(person.identity.personId)}
                                                disabled={publishing === person.identity.personId}
                                                className="text-brand-gold hover:text-brand-gold-dark inline-flex items-center"
                                            >
                                                <Globe className="w-4 h-4 mr-1" />
                                                {publishing === person.identity.personId ? 'Publishing...' : 'Publish'}
                                            </button>
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
