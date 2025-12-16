'use client'

import { useParams } from 'next/navigation'
import FamilyTreeViewer from '@/components/FamilyTreeViewer'

export default function FamilyTreePage() {
  const params = useParams()
  const personId = params.personId as string

  return (
    <div className="container mx-auto px-4 py-8">
      <FamilyTreeViewer personId={personId} />
    </div>
  )
}

