import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import { FaCircleXmark } from 'react-icons/fa6'
interface Tab {
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
}

const Tabs = ({ tabs }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0)

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className='tabs'>
      <div className='hamburger' onClick={() => setMenuOpen(!menuOpen)}>
        <div className={`icon ${menuOpen ? 'hide' : 'show'}`}>
          <FaBars />
        </div>
        <div className={`icon ${menuOpen ? 'show' : 'hide'}`}>
          <FaCircleXmark />
        </div>
      </div>
      <div className={`tab-list ${menuOpen ? 'open' : ''}`}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`tab ${index === activeTab ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(index)
              setMenuOpen(false)
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className='tab-content'>{tabs[activeTab].content}</div>
    </div>
  )
}
export default Tabs
