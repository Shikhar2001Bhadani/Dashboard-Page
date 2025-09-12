import React, { useState } from 'react'
import { useDashboard } from '../context/DashboardContext'

const WIDGET_TEMPLATES = {
  cspm: [
    { id: 'cloudAccounts', name: 'Cloud Accounts', type: 'donut', description: 'Monitor cloud account connections' },
    { id: 'riskAssessment', name: 'Cloud Account Risk Assessment', type: 'donut', description: 'Assess security risks across accounts' },
    { id: 'complianceStatus', name: 'Compliance Status', type: 'horizontalBar', description: 'Track compliance metrics' },
    { id: 'resourceInventory', name: 'Resource Inventory', type: 'empty', description: 'View resource details' }
  ],
  cwpp: [
    { id: 'namespaceAlerts', name: 'Top 5 Namespace Specific Alerts', type: 'empty', description: 'Monitor namespace-specific security alerts' },
    { id: 'workloadAlerts', name: 'Workload Alerts', type: 'empty', description: 'Track workload security issues' },
    { id: 'containerSecurity', name: 'Container Security', type: 'horizontalBar', description: 'Monitor container vulnerabilities' },
    { id: 'runtimeProtection', name: 'Runtime Protection', type: 'donut', description: 'Track runtime security events' }
  ],
  image: [
    { id: 'imageRisk', name: 'Image Risk Assessment', type: 'horizontalBar', description: 'Assess container image vulnerabilities' },
    { id: 'imageSecurity', name: 'Image Security Issues', type: 'horizontalBar', description: 'Monitor image security problems' },
    { id: 'imageScan', name: 'Image Scan Results', type: 'donut', description: 'View scan results summary' },
    { id: 'registryStatus', name: 'Registry Status', type: 'empty', description: 'Check registry health' }
  ],
  ticket: [
    { id: 'openTickets', name: 'Open Tickets', type: 'donut', description: 'Track open support tickets' },
    { id: 'ticketPriority', name: 'Ticket Priority Distribution', type: 'horizontalBar', description: 'Monitor ticket priorities' },
    { id: 'resolutionTime', name: 'Resolution Time', type: 'empty', description: 'Track average resolution times' },
    { id: 'ticketTrends', name: 'Ticket Trends', type: 'horizontalBar', description: 'Analyze ticket patterns' }
  ]
}

// Map tab IDs to category IDs
const TAB_TO_CATEGORY_MAP = {
  cspm: 'cspm',
  cwpp: 'cwpp', 
  image: 'registry', // Image widgets go to Registry Scan category
  ticket: 'ticket'
}

export default function AddWidgetModal({ open, onClose, category }) {
  const { addWidgetsToCategory } = useDashboard()
  const [activeTab, setActiveTab] = useState('cspm')
  const [selectedWidgets, setSelectedWidgets] = useState([])

  if (!open) return null

  const handleWidgetToggle = (widget) => {
    setSelectedWidgets(prev => {
      const isSelected = prev.some(w => w.id === widget.id)
      if (isSelected) {
        return prev.filter(w => w.id !== widget.id)
      } else {
        return [...prev, widget]
      }
    })
  }

  const handleConfirm = () => {
    if (selectedWidgets.length === 0) return

    // Get the correct category ID based on the active tab
    const targetCategoryId = TAB_TO_CATEGORY_MAP[activeTab]

    const widgetsToAdd = selectedWidgets.map(widget => {
      const baseWidget = WIDGET_TEMPLATES[activeTab].find(w => w.id === widget.id)
      let newWidget

      if (baseWidget.type === 'donut') {
        newWidget = {
          id: `${baseWidget.id}_${Date.now()}`,
          name: baseWidget.name,
          type: 'donut',
          total: '0 Total',
          data: [
            { name: 'Sample 1', value: 1, color: '#0f62fe' },
            { name: 'Sample 2', value: 1, color: '#d1d5db' }
          ]
        }
      } else if (baseWidget.type === 'horizontalBar') {
        newWidget = {
          id: `${baseWidget.id}_${Date.now()}`,
          name: baseWidget.name,
          type: 'horizontalBar',
          total: '0 Total Items',
          data: [
            { name: 'Critical', value: 0, color: '#8b0000' },
            { name: 'High', value: 0, color: '#fa4d56' },
            { name: 'Medium', value: 0, color: '#ff832b' }
          ]
        }
      } else {
        newWidget = {
          id: `${baseWidget.id}_${Date.now()}`,
          name: baseWidget.name,
          type: 'empty',
          content: 'No data available'
        }
      }

      return newWidget
    })

    addWidgetsToCategory(targetCategoryId, widgetsToAdd)
    setSelectedWidgets([])
    onClose()
  }

  const tabs = [
    { id: 'cspm', label: 'CSPM' },
    { id: 'cwpp', label: 'CWPP' },
    { id: 'image', label: 'Image' },
    { id: 'ticket', label: 'Ticket' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 h-full bg-white shadow-xl w-96 max-w-md flex flex-col">
        {/* Header */}
        <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
          <h4 className="text-lg font-semibold">Add Widget</h4>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Description */}
        <div className="px-6 py-4 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            Personalise your dashboard by adding the following widget
          </p>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="flex space-x-6 border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Widget List */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          <div className="space-y-3">
            {WIDGET_TEMPLATES[activeTab].map(widget => (
              <div key={widget.id} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id={widget.id}
                  checked={selectedWidgets.some(w => w.id === widget.id)}
                  onChange={() => handleWidgetToggle(widget)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label htmlFor={widget.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                    {widget.name}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">{widget.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedWidgets.length === 0}
            className="px-4 py-2 text-sm bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
