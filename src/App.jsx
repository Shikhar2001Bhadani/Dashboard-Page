import React, { useState } from 'react'
import { useDashboard } from './context/DashboardContext'
import Category from './components/Category'
import Header from './components/Header'
import AddWidgetModal from './components/AddWidgetModal'

export default function App() {
  const { getFilteredDashboard, searchWidgets } = useDashboard()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  const dashboard = getFilteredDashboard()

  const handleAddWidget = () => {
    setShowAddModal(true)
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleSearch = (term) => {
    searchWidgets(term)
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setShowAddModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={handleSearch}
        onAddWidget={handleAddWidget}
        onRefresh={handleRefresh}
      />
      
      <main className="px-6 py-6">
        {dashboard.categories.map(cat => (
          <Category key={cat.id} category={cat} />
        ))}
        
        {dashboard.categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No widgets found matching your search.</p>
          </div>
        )}
      </main>

      <AddWidgetModal 
        open={showAddModal} 
        onClose={() => {
          setShowAddModal(false)
          setSelectedCategory(null)
        }} 
        category={selectedCategory || dashboard.categories[0]} 
      />
    </div>
  )
}
