import React from 'react'
import { Routes, Route } from 'react-router-dom'
import App from '../App'
import ChatPage from '../component/ChatPage'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<App />} />
            <Route path='/chat' element={<ChatPage />} />
            <Route path='/rr' element={<h2>This is tailwind</h2>} />
            <Route path='*' element={<h2>404 Page Not Found</h2>} />
        </Routes>
    )
}

export default AppRoutes
