import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer(){
  return (
    <footer className="mt-12 border-t">
      <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-gray-600 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} LankaGuide. All rights reserved.</div>
        <div className="flex gap-4">
          <Link to="/contact" className="underline">Support</Link>
          <a className="underline" href="#">Privacy</a>
          <a className="underline" href="#">Terms</a>
        </div>
      </div>
    </footer>
  )
}
