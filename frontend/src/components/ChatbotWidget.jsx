import React, { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { classNames } from '../utils/helpers'

export default function ChatbotWidget(){
  const [messages, setMessages] = useState([{ from:'bot', text:"Hi! I'm Guidey. How can I help you today?" }])
  const [input, setInput] = useState('')
  const endRef = useRef(null)
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}) }, [messages])
  const send = () => {
    if(!input.trim()) return
    const q = input.trim()
    setMessages(m => [...m, {from:'user', text:q}])
    setInput('')
    setTimeout(() => {
      const lower = q.toLowerCase()
      let reply = "Sorry, I'm a demo bot. Try asking about working visa extension, payments, or appointments."
      if (lower.includes('visa') || lower.includes('extension')) reply = "For Working Visa Extension: you'll need a passport photo, a letter from your employer, and to book an appointment. Go to Departments → Immigration & Emigration → Working Visa Extension."
      if (lower.includes('payment')) reply = 'Payments vary by nationality and extension period. In the form steps, pick your nationality and duration to see the exact fee.'
      if (lower.includes('appointment')) reply = 'You can pick a convenient time slot during the “Appointment” step of the service form.'
      setMessages(m => [...m, {from:'bot', text: reply}])
    }, 400)
  }
  return (
    <div className="rounded-3xl border shadow-inner p-4 bg-gray-50">
      <div className="h-64 overflow-auto rounded-2xl bg-white border p-3 space-y-2">
        {messages.map((m,i)=>(
          <div key={i} className={classNames('flex', m.from==='user' ? 'justify-end' : 'justify-start')}>
            <div className={classNames('max-w-[75%] px-3 py-2 rounded-2xl text-sm', m.from==='user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-100 rounded-bl-none')}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef}/>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} className="flex-1 p-2 rounded-xl border" placeholder="Ask about a service..."/>
        <button onClick={send} className="px-3 py-2 rounded-xl bg-green-600 text-white inline-flex items-center gap-2"><Send className="w-4 h-4"/> Send</button>
      </div>
    </div>
  )
}
