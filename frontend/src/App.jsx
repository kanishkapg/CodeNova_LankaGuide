import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AppRoutes from './routes/AppRoutes'
import { AppProvider } from './utils/appContext'

export default function App(){
  return (
    <AppProvider>
      <Navbar/>
      <AppRoutes/>
      <Footer/>
    </AppProvider>
  )
}
