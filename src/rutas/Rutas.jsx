import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from '../pages/Home'
import Register from '../pages/session/Register'
import Productos from '../rutas/Productos'

export default function Rutas() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />}/>
                    <Route path='/home' element={<Home />}/>
                    <Route path='/registrar' element={<Register />}/>
                    <Route path='/productos' element={<Productos />}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}
