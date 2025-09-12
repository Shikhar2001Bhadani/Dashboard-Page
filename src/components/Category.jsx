import React, { useState } from 'react'
import Widget from './widget'
import AddWidgetModal from './AddWidgetModal'

export default function Category({ category }) {
  const [open, setOpen] = useState(false)

  const handleEmptyWidgetClick = () => {
    setOpen(true)
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{category.title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.widgets.map(w => (
          <Widget 
            key={w.id} 
            categoryId={category.id} 
            widget={w} 
            onEmptyClick={w.type === 'empty' && w.name === '' ? handleEmptyWidgetClick : null}
          />
        ))}
      </div>
      <AddWidgetModal open={open} onClose={() => setOpen(false)} category={category} />
    </div>
  )
}
