import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom'
import Login from './pages/Login'
import Usuarios from './pages/Usuarios'
import GerenciarUsuarios from './pages/Usuarios/Gerenciar'
import PainelEspaco from './pages/PainelEspaco'
import Notificacao from './pages/Notificacao'
import QuandoDeReserva from './pages/QuadroDeReserva'
import AdicionarEspaco from './pages/PainelEspaco/Gerenciar'
import Reservas from './pages/Reserva'
import GerenciarReserva from './pages/Reserva/Gerenciar'
export const Rotas = () => {
    
    return(
        <BrowserRouter>
            <Routes>

                <Route 
                    path='/'
                    element={<Login />}
                />

                <Route 
                    path='/usuarios'
                    element={<Usuarios />}
                />
                <Route 
                    path='/usuarios/:id'
                    element={<GerenciarUsuarios />}
                />
                <Route
                    path='/painelespaco'
                    element={<PainelEspaco />}
                />
                <Route
                    path='/painelespaco/:id'
                    element={<AdicionarEspaco />}
                />
                <Route
                    path='/reserva'
                    element={<Reservas />}
                />
                <Route 
                    path="/reserva/:id" 
                    element={<GerenciarReserva />} 
                />
                <Route
                    path='/notificacao'
                    element={<Notificacao/>}
                />
                                <Route
                    path='/quadrodereserva'
                    element={<QuandoDeReserva/>}
                />
            </Routes>
        </BrowserRouter>
    )
}