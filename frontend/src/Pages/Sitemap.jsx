import React from 'react'
import { Link } from 'react-router-dom'

const Sitemap = () => {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/cars', label: 'Browse Cars' },
    { to: '/owner/add-car', label: 'List Your Car' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/help', label: 'Help Center' },
    { to: '/terms', label: 'Terms & Conditions' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/insurance', label: 'Insurance' },
    { to: '/faq', label: 'FAQs' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-4">Sitemap</h1>
      <ul className="list-disc ml-6 space-y-2">
        {links.map(link => (
          <li key={link.to}><Link className="text-blue-600 hover:underline" to={link.to}>{link.label}</Link></li>
        ))}
      </ul>
    </div>
  )
}

export default Sitemap


