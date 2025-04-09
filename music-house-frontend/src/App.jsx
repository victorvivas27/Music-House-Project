import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HeaderVisibilityProvider } from "./components/utils/context/HeaderVisibilityGlobal"
import { AuthProvider } from "./components/utils/context/AuthProvider"
import { ContextProvider } from "./components/utils/global.context"
import AuthPage from "./Pages/AuthPage"
import { AdminLayout, AdminLayoutWithoutHeaderFooter, UserLayout, UserLayoutWithoutHeaderFooter } from "./components/Layout/Layout"
import EditUser from "./components/Form/usuario/EditUser"
import { Home } from "./Pages/Home"
import Perfil from "./Pages/Perfil"
import { About } from "./Pages/About"
import { Instrument } from "./Pages/Instrument"
import { ProtectedRoute } from "./components/common/routes/ProtectedRoute"
import { Favorites } from "./Pages/Favorites"
import MisReservas from "./Pages/MisReservas"
import { ROLE_ADMIN } from "./components/utils/roles/constants"
import Instruments from "./Pages/Instruments"
import { Usuarios } from "./Pages/Admin/Usuarios"
import { Categories } from "./Pages/Admin/Categories"
import { Theme } from "./Pages/Admin/Theme"
import { AgregarTheme } from "./Pages/Admin/AgregarThem"
import { EditarTheme } from "./Pages/Admin/EditarTheme"
import { AgregarInstrumento } from "./Pages/Admin/AgregarInstrumento"
import { EditarInstrumento } from "./Pages/Admin/EditarInstrumento"
import { AgregarCategoria } from "./Pages/Admin/AgregarCategoria"
import { EditarCategoria } from "./Pages/Admin/EditarCategoria"
import CrearUsuario from "./Pages/CrearUsuario"
import { ServerError } from "./Pages/ServerError"
import { NotFoundPage } from "./Pages/NotFound"




export const App = () => {
  return (
    <>
      <BrowserRouter>
        <HeaderVisibilityProvider>
          <AuthProvider>
            <ContextProvider>
              <Routes>
                <Route path="/autentificacion" element={<AuthPage />} />
                <Route element={<UserLayoutWithoutHeaderFooter />}>
                  <Route path="/editarUsuario/:id" element={<EditUser />} />
                </Route>
                <Route element={<UserLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/perfil/:id" element={<Perfil />} />
                  <Route path="/about" element={<About />} />
                 
                  <Route path="/instrument/:id" element={<Instrument />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/reservations" element={<MisReservas />} />
                    
                  </Route>
                </Route>
                <Route element={<AdminLayout />}>
                  <Route element={<ProtectedRoute role={ROLE_ADMIN} />}>
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
                  <Route element={<ProtectedRoute role={ROLE_ADMIN} />}>
                    <Route path="/agregarUsuario" element={<CrearUsuario />} />
                  </Route>
                </Route>
                <Route path="/noDisponible" element={<ServerError />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </ContextProvider>
          </AuthProvider>
        </HeaderVisibilityProvider>
      </BrowserRouter>
    </>
  )
}
