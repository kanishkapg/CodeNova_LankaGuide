import React from 'react'

export default function PaymentsPage(){
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold">Payments</h2>
      <p className="text-gray-600">View and manage your payments. (Demo: static content)</p>
      <div className="mt-4 bg-white border rounded-3xl p-4">
        <div className="text-sm text-gray-600">No payments yet.</div>
      </div>
    </div>
  )
}
