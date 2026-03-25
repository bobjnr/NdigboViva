'use client';

import { useState, useEffect } from 'react';
import type { OntologyEntity } from './ontology-types';
import type { OntologyType } from './ontology-types';

/**
 * Fetches ontology children from the API for use in dropdowns.
 * Returns { data, loading }. Use when parentId and type are set (e.g. after importing political CSVs).
 */
export function useOntologyChildren(
  parentId: string | null,
  type: OntologyType
): { data: OntologyEntity[]; loading: boolean } {
  const [data, setData] = useState<OntologyEntity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!parentId || !type) {
      setData([]);
      return;
    }
    setLoading(true);
    const params = new URLSearchParams({ parentId, type });
    fetch(`/api/ontology/children?${params}`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.success && Array.isArray(res.data)) setData(res.data);
        else setData([]);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [parentId, type]);

  return { data, loading };
}
