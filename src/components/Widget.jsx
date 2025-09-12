import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { useDashboard } from '../context/DashboardContext'

export default function Widget({ categoryId, widget, onEmptyClick }) {
  const { removeWidgetFromCategory } = useDashboard()

  const renderChart = () => {
    if (widget.type === 'donut') {
      return (
        <div className="flex items-center justify-between h-48">
          {/* Donut Chart */}
          <div className="relative flex-shrink-0">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={widget.data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  startAngle={90}
                  endAngle={450}
                >
                  {widget.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{widget.total}</div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex-1 ml-6">
            <div className="space-y-2">
              {widget.data.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (widget.type === 'horizontalBar') {
      const totalValue = widget.data.reduce((sum, item) => sum + item.value, 0)
      
      return (
        <div className="space-y-4">
          {/* Title */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{widget.name}</h3>
            <div className="text-lg font-semibold text-gray-800">{widget.total}</div>
          </div>
          
          {/* Horizontal Bar Chart */}
          <div className="space-y-3">
            <div className="relative">
              <div className="flex h-6 bg-gray-200 rounded-full overflow-hidden">
                {widget.data.map((item, index) => {
                  const percentage = (item.value / totalValue) * 100
                  return (
                    <div
                      key={index}
                      className="h-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  )
                })}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-4 justify-center">
              {widget.data.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (widget.type === 'empty' && widget.name === '') {
      return (
        <div 
          className="flex items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
          onClick={onEmptyClick}
        >
          <button className="text-gray-500 hover:text-gray-700 text-sm font-medium">
            + Add Widget
          </button>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500">
        <div className="mb-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-sm">{widget.content}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      {widget.name && (
        <div className="flex justify-between items-center mb-4">
          <h5 className="font-semibold text-gray-800 text-sm">{widget.name}</h5>
          <button
            onClick={() => removeWidgetFromCategory(categoryId, widget.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <div className="flex-1">{renderChart()}</div>
    </div>
  )
}
