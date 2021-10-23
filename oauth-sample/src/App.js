import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Login from './componentes/login/login';
import ListarUsuarios from './componentes/usuarios/usuarios';
import Ventas from './componentes/ventas/ventas';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login">
            <Login></Login>
          </Route>
          <Route path="/listarUsuarios">
            <ListarUsuarios></ListarUsuarios>
          </Route>
          <Route path="/ventas">
            <Ventas></Ventas>
          </Route>
          <Route path="*">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
