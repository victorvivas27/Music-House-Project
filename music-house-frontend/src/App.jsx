import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './components/Pages/Home'
import { Instrument } from './components/Pages/Instrument'
import { Instruments } from './components/Pages/Instruments'
import { About } from './components/Pages/About'
import { Contact } from './components/Pages/Contact'
import { ContextProvider } from './components/utils/global.context'
import { AgregarInstrumento } from './components/Pages/Admin/AgregarInstrumento'
import { EditarInstrumento } from './components/Pages/Admin/EditarInstrumento'
import { Usuarios } from './components/Pages/Admin/Usuarios'
import CrearUsuario from './components/Pages/CrearUsuario'
import EditUser from './components/Form/formUsuario/EditUser'
import { Categories } from './components/Pages/Admin/categories'
import { AgregarCategoria } from './components/Pages/Admin/AgregarCategoria'
import { EditarCategoria } from './components/Pages/Admin/EditarCategoria'
import { Favorites } from './components/Pages/Favorites'
import { ConfirmBooking } from './components/Pages/ConfirmBooking'
import { HeaderVisibilityProvider } from './components/utils/context/HeaderVisibilityGlobal'
import { AuthContextProvider } from './components/utils/context/AuthGlobal'
import AuthPage from './components/Pages/AuthPage'
import { NotFoundPage } from './components/Pages/NotFound'
import { ServerError } from './components/Pages/ServerError'
import { ProtectedRoute } from './components/common/routes/ProtectedRoute'
import MisReservas from './components/Pages/MisReservas'
import {
  AdminLayout,
  UserLayout,
  UserLayoutWithoutHeaderFooter,
  AdminLayoutWithoutHeaderFooter
} from './components/Layout/Layout'
import { Theme } from './components/Pages/Admin/Theme'
import { AgregarTheme } from './components/Pages/Admin/AgregarThem'
import { EditarTheme } from './components/Pages/Admin/EditarTheme'
//import { jwtDecode } from 'jwt-decode'

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <HeaderVisibilityProvider>
          <AuthContextProvider>
            <ContextProvider>
              <Routes>
                <Route path="/autentificacion" element={<AuthPage />} />
                <Route element={<UserLayoutWithoutHeaderFooter />}>
                  <Route path="/editarUsuario/:id" element={<EditUser />} />
                </Route>
                <Route element={<UserLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/instrument/:id" element={<Instrument />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/reservations" element={<MisReservas />} />
                    <Route
                      path="/confirmBooking"
                      element={<ConfirmBooking />}
                    />
                  </Route>
                </Route>
                <Route element={<AdminLayout />}>
                  <Route element={<ProtectedRoute role="ADMIN" />}>
                    <Route path="/instruments" element={<Instruments />} />
                    <Route path="/usuarios" element={<Usuarios />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/theme" element={<Theme />} />
                    <Route path="/agregarTheme" element={<AgregarTheme />} />
                    <Route path="/editarTheme/:id" element={<EditarTheme />} />
                    <Route
                      path="/agregarInstrumento"
                      element={<AgregarInstrumento />}
                    />
                    <Route
                      path="/editarInstrumento/:id"
                      element={<EditarInstrumento />}
                    />
                    <Route
                      path="/agregarCategoria"
                      element={<AgregarCategoria />}
                    />
                    <Route
                      path="/editarCategoria/:id"
                      element={<EditarCategoria />}
                    />
                  </Route>
                </Route>
                <Route element={<AdminLayoutWithoutHeaderFooter />}>
                  <Route element={<ProtectedRoute role="ADMIN" />}>
                    <Route path="/agregarUsuario" element={<CrearUsuario />} />
                  </Route>
                </Route>
                <Route path="/noDisponible" element={<ServerError />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </ContextProvider>
          </AuthContextProvider>
        </HeaderVisibilityProvider>
      </BrowserRouter>
      )
    </>
  )
}
