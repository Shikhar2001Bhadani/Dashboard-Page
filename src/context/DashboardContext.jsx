import React, { createContext, useContext, useEffect, useState } from 'react'
import initialJSON from '../data/dashboard.json'

const DashboardContext = createContext()

export const DashboardProvider = ({ children }) => {
  const [dashboard, setDashboard] = useState(() => {
    const saved = localStorage.getItem('cnapp_dashboard')
    return saved ? JSON.parse(saved) : initialJSON
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    localStorage.setItem('cnapp_dashboard', JSON.stringify(dashboard))
  }, [dashboard])

  const addWidgetsToCategory = (categoryId, widgetsToAdd) => {
    setDashboard(prev => {
      const categories = prev.categories.map(cat => {
        if (cat.id !== categoryId) return cat
        return { ...cat, widgets: [...cat.widgets, ...widgetsToAdd] }
      })
      return { ...prev, categories }
    })
  }

  const removeWidgetFromCategory = (categoryId, widgetId) => {
    setDashboard(prev => {
      const categories = prev.categories.map(cat => {
        if (cat.id !== categoryId) return cat
        return { ...cat, widgets: cat.widgets.filter(w => w.id !== widgetId) }
      })
      return { ...prev, categories }
    })
  }

  const searchWidgets = (term) => {
    setSearchTerm(term)
  }

  const getFilteredDashboard = () => {
    if (!searchTerm.trim()) return dashboard

    const filteredCategories = dashboard.categories.map(category => ({
      ...category,
      widgets: category.widgets.filter(widget => 
        widget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (widget.content && widget.content.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })).filter(category => category.widgets.length > 0)

    return { ...dashboard, categories: filteredCategories }
  }

  return (
    <DashboardContext.Provider value={{ 
      dashboard, 
      setDashboard, 
      addWidgetsToCategory, 
      removeWidgetFromCategory,
      searchWidgets,
      getFilteredDashboard,
      searchTerm
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => useContext(DashboardContext)
