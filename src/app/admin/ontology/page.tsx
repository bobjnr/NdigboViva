import Link from 'next/link'
import { redirect } from 'next/navigation'
import OntologyUpload from '@/components/admin/OntologyUpload'
import { requireAdminSession } from '@/lib/admin-auth'

export default async function AdminOntologyPage() {
  const access = await requireAdminSession()

  if (!access.ok) {
    if (access.status === 401) {
      redirect('/auth/login?callbackUrl=/admin/ontology')
    }

    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Access denied</h1>
          <p className="mt-3 text-gray-600">
            Your signed-in account is not in the `ADMIN_EMAILS` allowlist for ontology uploads.
          </p>
          <Link href="/admin" className="mt-6 inline-block text-sm font-medium text-brand-gold hover:text-brand-gold-dark">
            Return to admin dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-gold">Data Management</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Ontology Bulk Upload</h1>
            <p className="mt-2 max-w-3xl text-gray-600">
              Upload field-collected ancestry structure into the Firestore ontology collection, preview every row, and commit only the safe additions or updates.
            </p>
          </div>
          <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            &larr; Back to Dashboard
          </Link>
        </div>

        <OntologyUpload />
      </div>
    </div>
  )
}
