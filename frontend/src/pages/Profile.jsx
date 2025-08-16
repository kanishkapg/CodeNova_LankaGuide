import React, { useState } from 'react'
import { useApp } from '../utils/appContext'

const Input = ({ label, ...props }) => (
  <label className="block text-sm">
    <div className="mb-1 text-gray-600">{label}</div>
    <input {...props} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-200"/>
  </label>
)

export default function ProfilePage(){
  const { user } = useApp()
  const [form, setForm] = useState({ name: user?.username || '', email: '', phone: '' })
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-green-600 text-white grid place-items-center text-xl font-bold">{(user?.username?.[0]||'U').toUpperCase()}</div>
        <div>
          <div className="text-2xl font-bold">{user?.username || 'User'}</div>
          <div className="text-gray-500 text-sm">Manage your profile information.</div>
        </div>
      </div>
      <div className="mt-6 bg-white border rounded-3xl p-4">
        <div className="grid md:grid-cols-2 gap-3">
          <Input label="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <Input label="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
          <Input label="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
        </div>
        <div className="mt-3 flex justify-end">
          <button className="px-4 py-2 rounded-xl bg-green-600 text-white">Save changes</button>
        </div>
      </div>
    </div>
  )
}
