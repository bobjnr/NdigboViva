'use client'

import GenealogyForm from '@/components/GenealogyForm'
import type { GenealogyFormSubmission } from '@/lib/genealogy-database'

export default function FormCheckPage() {
  const handleSubmit = (data: GenealogyFormSubmission) => {
    void data
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-5xl rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Form Check</h1>
        <GenealogyForm onSubmit={handleSubmit} />
      </div>
    </main>
  )
}
