'use client'

import { useState, useEffect } from 'react'
import { genealogyDB, type GenealogyRecord } from '@/lib/genealogy-database'
import { 
  Search, 
  Download, 
  Filter, 
  Users, 
  MapPin, 
  FileText, 
  Eye,
  Trash2,
  Edit,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function GenealogyDatabaseViewer() {
  const [records, setRecords] = useState<GenealogyRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<GenealogyRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterState, setFilterState] = useState('')
  const [filterLGA, setFilterLGA] = useState('')
  const [filterTown, setFilterTown] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<GenealogyRecord | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadRecords()
  }, [])

  useEffect(() => {
    filterRecords()
  }, [records, searchTerm, filterState, filterLGA, filterTown])

  const loadRecords = () => {
    const allRecords = genealogyDB.getAllRecords()
    setRecords(allRecords)
  }

  const filterRecords = () => {
    let filtered = records

    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.town.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.kindredHamlet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.extendedFamily.some(family => 
          family.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          family.individualNames.some(name => 
            name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      )
    }

    if (filterState) {
      filtered = filtered.filter(record => record.state === filterState)
    }

    if (filterLGA) {
      filtered = filtered.filter(record => record.localGovernmentArea === filterLGA)
    }

    if (filterTown) {
      filtered = filtered.filter(record => record.town === filterTown)
    }

    setFilteredRecords(filtered)
  }

  const exportToCSV = () => {
    const csvContent = genealogyDB.exportToCSV()
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `genealogy_database_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const viewRecord = (record: GenealogyRecord) => {
    setSelectedRecord(record)
    setShowModal(true)
  }

  const getUniqueStates = () => {
    return [...new Set(records.map(record => record.state))].sort()
  }

  const getUniqueLGAs = () => {
    return [...new Set(records.map(record => record.localGovernmentArea))].sort()
  }

  const getUniqueTowns = () => {
    return [...new Set(records.map(record => record.town))].sort()
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-brand-gold" />
          Genealogy Database
        </h2>
        <p className="text-gray-600">
          View and manage genealogy records. Total records: {records.length}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, town, village, or kindred..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
              />
            </div>
          </div>
          <button
            onClick={exportToCSV}
            className="bg-brand-gold hover:bg-brand-gold-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
          >
            <option value="">All States</option>
            {getUniqueStates().map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          <select
            value={filterLGA}
            onChange={(e) => setFilterLGA(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
          >
            <option value="">All LGAs</option>
            {getUniqueLGAs().map(lga => (
              <option key={lga} value={lga}>{lga}</option>
            ))}
          </select>

          <select
            value={filterTown}
            onChange={(e) => setFilterTown(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
          >
            <option value="">All Towns</option>
            {getUniqueTowns().map(town => (
              <option key={town} value={town}>{town}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                State
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                LGA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Town
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Village
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kindred
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Family
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <tr key={record.recordId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {record.state}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.localGovernmentArea}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.town}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.village}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.kindredHamlet}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.extendedFamily.map(family => family.familyName).join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => viewRecord(record)}
                    className="text-brand-gold hover:text-brand-gold-dark mr-3"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No records found
          </h3>
          <p className="text-gray-600">
            {records.length === 0 
              ? "No genealogy records have been submitted yet."
              : "No records match your search criteria."
            }
          </p>
        </div>
      )}

      {/* Record Detail Modal */}
      {showModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Genealogy Record Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Location Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">State:</span> {selectedRecord.state}</div>
                    <div><span className="font-medium">LGA:</span> {selectedRecord.localGovernmentArea}</div>
                    <div><span className="font-medium">Town:</span> {selectedRecord.town}</div>
                    <div><span className="font-medium">Village:</span> {selectedRecord.village}</div>
                    <div><span className="font-medium">Town Quarter:</span> {selectedRecord.townQuarter}</div>
                    <div><span className="font-medium">Obi Areas:</span> {selectedRecord.obiAreas}</div>
                    <div><span className="font-medium">Clan:</span> {selectedRecord.clan}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Family Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Kindred/Hamlet:</span> {selectedRecord.kindredHamlet}</div>
                    <div><span className="font-medium">Umunna:</span> {selectedRecord.umunna}</div>
                    <div><span className="font-medium">Record ID:</span> {selectedRecord.recordId}</div>
                    <div><span className="font-medium">Created:</span> {selectedRecord.createdAt.toLocaleDateString()}</div>
                    <div><span className="font-medium">Verified:</span> 
                      {selectedRecord.verified ? (
                        <CheckCircle className="w-4 h-4 text-green-500 inline ml-1" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 inline ml-1" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Extended Family Members</h4>
                <div className="space-y-2">
                  {selectedRecord.extendedFamily.map((family, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-gray-900">{family.familyName}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {family.individualNames.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRecord.notes && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Additional Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedRecord.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
