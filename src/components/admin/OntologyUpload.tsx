'use client'

import { useMemo, useRef, useState } from 'react'
import { FileText, Shield, Upload } from 'lucide-react'

type PreviewStatus = 'create' | 'update' | 'conflict' | 'invalid'

type PreviewRow = {
  rowNumber: number
  status: PreviewStatus
  message: string
  raw: Record<string, string | undefined>
  entity?: {
    id: string
    type: string
    parentId?: string
    displayName?: string
  }
  selectable: boolean
}

type PreviewResponse = {
  success: boolean
  batchId: string
  rows: PreviewRow[]
  counts: Record<PreviewStatus | 'ready', number>
  error?: string
}

const TEMPLATE_ROWS = [
  {
    type: 'CLAN',
    name: 'DIOHA',
    displayName: 'Dioha',
    country: 'Nigeria',
    state: 'Anambra',
    lga: 'Aguata',
    town: 'Achina',
    clan: '',
    village: '',
    hamlet: '',
    kindred: '',
    isPublic: 'true',
    sortOrder: '10',
    code: '',
  },
  {
    type: 'VILLAGE',
    name: 'ELEKECHEM',
    displayName: 'Elekchem',
    country: 'Nigeria',
    state: 'Anambra',
    lga: 'Aguata',
    town: 'Achina',
    clan: 'DIOHA',
    village: '',
    hamlet: '',
    kindred: '',
    isPublic: 'true',
    sortOrder: '20',
    code: '',
  },
  {
    type: 'HAMLET',
    name: 'AMA EZI',
    displayName: 'Ama Ezi',
    country: 'Nigeria',
    state: 'Anambra',
    lga: 'Aguata',
    town: 'Achina',
    clan: 'DIOHA',
    village: 'ELEKECHEM',
    hamlet: '',
    kindred: '',
    isPublic: 'true',
    sortOrder: '30',
    code: '',
  },
  {
    type: 'KINDRED',
    name: 'UMU OKPARA',
    displayName: 'Umu Okpara',
    country: 'Nigeria',
    state: 'Anambra',
    lga: 'Aguata',
    town: 'Achina',
    clan: 'DIOHA',
    village: 'ELEKECHEM',
    hamlet: 'AMA EZI',
    kindred: '',
    isPublic: 'true',
    sortOrder: '40',
    code: '',
  },
  {
    type: 'EXTENDED_FAMILY',
    name: 'OKAFOR HOUSE',
    displayName: 'Okafor House',
    country: 'Nigeria',
    state: 'Anambra',
    lga: 'Aguata',
    town: 'Achina',
    clan: 'DIOHA',
    village: 'ELEKECHEM',
    hamlet: 'AMA EZI',
    kindred: 'UMU OKPARA',
    isPublic: 'true',
    sortOrder: '50',
    code: '',
  },
]

function statusClasses(status: PreviewStatus): string {
  switch (status) {
    case 'create':
      return 'bg-green-100 text-green-800'
    case 'update':
      return 'bg-blue-100 text-blue-800'
    case 'conflict':
      return 'bg-amber-100 text-amber-800'
    case 'invalid':
      return 'bg-red-100 text-red-800'
  }
}

export default function OntologyUpload() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState('')
  const [csvText, setCsvText] = useState('')
  const [preview, setPreview] = useState<PreviewResponse | null>(null)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isCommitting, setIsCommitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const readyRows = useMemo(
    () => preview?.rows.filter((row) => row.selectable).map((row) => row.rowNumber) ?? [],
    [preview]
  )

  function resetPreview() {
    setPreview(null)
    setSelectedRows([])
    setMessage(null)
  }

  async function loadFile(file?: File | null) {
    if (!file) return
    resetPreview()
    setFileName(file.name)

    const lowerName = file.name.toLowerCase()
    if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
      const XLSX = await import('xlsx')
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]

      if (!firstSheetName) {
        setCsvText('')
        setMessage({ type: 'error', text: 'The uploaded spreadsheet does not contain any sheets.' })
        return
      }

      const firstSheet = workbook.Sheets[firstSheetName]
      const convertedCsv = XLSX.utils.sheet_to_csv(firstSheet, { blankrows: false })
      setCsvText(convertedCsv)
      return
    }

    setCsvText(await file.text())
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    await loadFile(event.target.files?.[0])
  }

  async function handleTemplateDownload() {
    const XLSX = await import('xlsx')
    const worksheet = XLSX.utils.json_to_sheet(TEMPLATE_ROWS)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ontology Upload')

    const output = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([output], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'ontology-upload-template.xlsx'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  async function handlePreview() {
    if (!csvText.trim()) {
      setMessage({ type: 'error', text: 'Choose a CSV file before previewing.' })
      return
    }

    setIsPreviewing(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/ontology/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'preview', csvText, fileName }),
      })

      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Preview failed.')
      }

      setPreview(result)
      setSelectedRows(result.rows.filter((row: PreviewRow) => row.selectable).map((row: PreviewRow) => row.rowNumber))
      setMessage({ type: 'success', text: 'Preview generated. Review the rows below before committing.' })
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Preview failed.' })
    } finally {
      setIsPreviewing(false)
    }
  }

  async function handleCommit() {
    if (!preview || selectedRows.length === 0) {
      setMessage({ type: 'error', text: 'Select at least one valid row before committing.' })
      return
    }

    setIsCommitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/ontology/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'commit',
          batchId: preview.batchId,
          csvText,
          fileName,
          selectedRowNumbers: selectedRows,
        }),
      })

      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Commit failed.')
      }

      setMessage({ type: 'success', text: `Committed ${result.committedCount} ontology row(s) successfully.` })
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Commit failed.' })
    } finally {
      setIsCommitting(false)
    }
  }

  function toggleRow(rowNumber: number) {
    setSelectedRows((current) =>
      current.includes(rowNumber)
        ? current.filter((value) => value !== rowNumber)
        : [...current, rowNumber].sort((a, b) => a - b)
    )
  }

  function toggleAllReadyRows() {
    setSelectedRows((current) => (current.length === readyRows.length ? [] : readyRows))
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 text-emerald-700" />
          <div>
            <h2 className="text-lg font-semibold text-emerald-950">Ontology Upload Guardrails</h2>
            <p className="mt-2 text-sm text-emerald-900">
              This tool imports deep ancestry structure into the Firestore ontology collection. Supported types are
              <span className="font-medium"> CLAN, VILLAGE, HAMLET, KINDRED, and EXTENDED_FAMILY</span>.
              Upload a spreadsheet exported from Google Sheets or Excel. Nuclear family and person records stay manual.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Upload Spreadsheet</h3>
              <p className="mt-1 text-sm text-gray-600">Preview first, then commit only the ready rows.</p>
            </div>
            <button
              type="button"
              onClick={handleTemplateDownload}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
            >
              Download Template
            </button>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              void loadFile(event.dataTransfer.files?.[0])
            }}
            className="mt-6 flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition hover:border-brand-gold hover:bg-amber-50"
          >
            <FileText className="h-9 w-9 text-brand-gold" />
            <span className="mt-4 text-base font-medium text-gray-900">
              {fileName ? fileName : 'Choose an ontology spreadsheet'}
            </span>
            <span className="mt-2 text-sm text-gray-600">Upload an `.xlsx`, `.xls`, or `.csv` file for preview before any data is written.</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePreview}
              disabled={isPreviewing || !csvText.trim()}
              className="inline-flex items-center rounded-lg bg-brand-gold px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FileText className="mr-2 h-4 w-4" />
              {isPreviewing ? 'Previewing...' : 'Preview Upload'}
            </button>
            <button
              type="button"
              onClick={handleCommit}
              disabled={isCommitting || !preview || selectedRows.length === 0}
              className="inline-flex items-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isCommitting ? 'Committing...' : `Commit ${selectedRows.length} Row(s)`}
            </button>
          </div>

          {message && (
            <div
              className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 ring-1 ring-green-200'
                  : 'bg-red-50 text-red-800 ring-1 ring-red-200'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">CSV Rules</h3>
          <ul className="mt-4 space-y-3 text-sm text-gray-700">
            <li><span className="font-medium">Required:</span> `type` and `name`.</li>
            <li><span className="font-medium">Optional:</span> `parentId` if the ancestor columns are complete.</li>
            <li><span className="font-medium">Ancestor chain:</span> `country,state,lga,town,clan,village,hamlet,kindred`.</li>
            <li><span className="font-medium">Preview statuses:</span> `create`, `update`, `conflict`, `invalid`.</li>
            <li><span className="font-medium">Commitable rows:</span> only `create` and `update` rows can be selected.</li>
          </ul>
        </div>
      </div>

      {preview && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Preview Results</h3>
              <p className="mt-1 text-sm text-gray-600">Review each row before committing it to the ontology collection.</p>
            </div>
            <button
              type="button"
              onClick={toggleAllReadyRows}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
            >
              {selectedRows.length === readyRows.length ? 'Clear Ready Rows' : 'Select All Ready Rows'}
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-5">
            {(['create', 'update', 'conflict', 'invalid', 'ready'] as const).map((key) => (
              <div key={key} className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-200">
                <div className="text-xs uppercase tracking-wide text-gray-500">{key}</div>
                <div className="mt-2 text-2xl font-semibold text-gray-900">{preview.counts[key]}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Select</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Row</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Display Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Parent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {preview.rows.map((row) => (
                  <tr key={row.rowNumber} className="align-top">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.rowNumber)}
                        disabled={!row.selectable}
                        onChange={() => toggleRow(row.rowNumber)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">{row.rowNumber}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">{row.entity?.type || row.raw.type || '-'}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{row.entity?.displayName || row.raw.name || '-'}</td>
                    <td className="px-4 py-4 text-xs text-gray-600"><code>{row.entity?.id || '-'}</code></td>
                    <td className="px-4 py-4 text-xs text-gray-600"><code>{row.entity?.parentId || '-'}</code></td>
                    <td className="px-4 py-4 text-sm text-gray-700">{row.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
