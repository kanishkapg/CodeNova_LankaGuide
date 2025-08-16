import React from 'react'

const Input = ({ label, ...props }) => (
  <label className="block text-sm">
    <div className="mb-1 text-gray-600">{label}</div>
    <input {...props} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-200"/>
  </label>
)

export default function ContactPage(){
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-6 items-start">
      <div>
        <h2 className="text-2xl font-bold">Contact Us</h2>
        <p className="text-gray-600">If you have questions, our team is here to help.</p>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">463, Sri Jayawardenepura Kotte</div>
          <div className="flex items-center gap-2">+94 11 123 4567</div>
          <div className="flex items-center gap-2">support@lankaguide.gov.lk</div>
        </div>
      </div>
      <div className="bg-white border rounded-3xl p-4">
        <div className="grid gap-3">
          <Input label="Your name"/>
          <Input label="Email"/>
          <label className="block text-sm">
            <div className="mb-1 text-gray-600">Message</div>
            <textarea className="w-full p-2 border rounded-xl min-h-[120px]"/>
          </label>
          <div className="flex justify-end"><button className="px-4 py-2 rounded-xl bg-green-600 text-white">Send</button></div>
        </div>
      </div>
    </div>
  )
}
