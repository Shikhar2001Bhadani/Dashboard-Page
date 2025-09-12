import React from 'react'
import { PieChart, Pie, Cell, Tooltip, BarChart, XAxis, YAxis, Bar, ResponsiveContainer } from 'recharts'
import { useDashboard } from '../context/DashboardContext'

const COLORS = ['#0f62fe', '#fa4d56', '#42be65', '#ff832b']

export default function Widget({ categoryId, widget }) {
  const { removeWidgetFromCategory } = useDashboard()

  const renderChart = () => {
    if (widget.type === 'donut') {
      return (
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={widget.data} dataKey="value" nameKey="name" outerRadius={60}>
              {widget.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )
    }

    if (widget.type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={widget.data}>
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#0f62fe" />
          </BarChart>
        </ResponsiveContainer>
      )
    }

    return <p className="text-gray-500 text-sm">{widget.content || "No Data"}</p>
  }

  return (
    <div className="bg-white shadow rounded-xl p-4 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h5 className="font-semibold text-gray-700 text-sm">{widget.name}</h5>
        <button
          onClick={() => removeWidgetFromCategory(categoryId, widget.id)}
          className="text-gray-400 hover:text-red-500"
        >
          ✕
        </button>
      </div>
      <div className="flex-1">{renderChart()}</div>
    </div>
  )
}
