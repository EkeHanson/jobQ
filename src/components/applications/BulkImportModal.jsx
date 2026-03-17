import { useState, useCallback } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XMarkIcon, ArrowUpTrayIcon, DocumentArrowDownIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import * as XLSX from 'xlsx'
import applicationService from '../../services/applications'

const STATUS_OPTIONS = ['saved', 'applied', 'assessment', 'interview', 'offer', 'rejected', 'accepted', 'withdrawn']
const SOURCE_OPTIONS = ['linkedin', 'indeed', 'jobberman', 'glassdoor', 'company_website', 'referral', 'recruiter', 'other']

export default function BulkImportModal({ isOpen, onClose, onImportComplete }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        '.xlsx',
        '.xls'
      ]
      const fileExt = selectedFile.name.split('.').pop().toLowerCase()
      
      if (!['xlsx', 'xls'].includes(fileExt)) {
        setError('Please upload an Excel file (.xlsx or .xls)')
        return
      }
      
      setFile(selectedFile)
      setError(null)
      setImportResult(null)
    }
  }

  const handleDownloadTemplate = useCallback(() => {
    // Create template data
    const templateData = [
      {
        'Job Title': 'Software Engineer',
        'Company Name': 'Acme Corp',
        'Status': 'applied',
        'Applied Date': '2024-01-15',
        'Deadline': '2024-02-15',
        'Source': 'linkedin',
        'Notes': 'Applied via LinkedIn',
        'Follow-up Date': '2024-01-20',
        'Description': 'Job description here',
        'Requirements': 'Requirements here'
      },
      {
        'Job Title': 'Product Manager',
        'Company Name': 'Tech Inc',
        'Status': 'saved',
        'Applied Date': '',
        'Deadline': '',
        'Source': 'company_website',
        'Notes': 'Found on company career page',
        'Follow-up Date': '',
        'Description': '',
        'Requirements': ''
      }
    ]

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(templateData)

    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // Job Title
      { wch: 20 }, // Company Name
      { wch: 12 }, // Status
      { wch: 12 }, // Applied Date
      { wch: 12 }, // Deadline
      { wch: 18 }, // Source
      { wch: 30 }, // Notes
      { wch: 12 }, // Follow-up Date
      { wch: 30 }, // Description
      { wch: 30 }, // Requirements
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'Applications Template')

    // Download file
    XLSX.writeFile(wb, 'jobq_applications_template.xlsx')
  }, [])

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload')
      return
    }

    setUploading(true)
    setError(null)
    setImportResult(null)

    try {
      const response = await applicationService.bulkImport(file)
      setImportResult(response.data)
      
      // Refresh applications list
      if (onImportComplete) {
        onImportComplete()
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to import applications. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setError(null)
    setImportResult(null)
    onClose()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    Bulk Import Applications
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Download Template */}
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start gap-3">
                    <DocumentArrowDownIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-blue-900">Need a template?</h4>
                      <p className="text-xs text-blue-700 mt-1">
                        Download our Excel template to ensure your data is formatted correctly.
                      </p>
                      <button
                        onClick={handleDownloadTemplate}
                        className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 underline"
                      >
                        Download Template
                      </button>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Excel File
                  </label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    file ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <ArrowUpTrayIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      {file ? (
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      ) : (
                        <>
                          <p className="text-sm text-gray-600">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            XLSX or XLS (max. 10MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 rounded-lg flex items-start gap-2">
                    <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Import Result */}
                {importResult && (
                  <div className="mb-4 p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex items-start gap-3">
                      <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-green-900">Import Complete!</h4>
                        <p className="text-xs text-green-700 mt-1">
                          Successfully imported {importResult.successful_rows} applications
                          {importResult.failed_rows > 0 && `, ${importResult.failed_rows} failed`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {uploading ? 'Importing...' : 'Import'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
