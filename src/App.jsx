import { Link, Route, Routes, useLocation } from 'react-router-dom';
import ProductosList from './routes/ProductosList.jsx';
import NuevoProducto from './routes/NuevoProducto.jsx';

export default function App() {
  const location = useLocation();

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-light border-bottom">
        <div className="container">
          <Link className="navbar-brand" to="/">Productos</Link>
          <div className="ms-auto">
            {location.pathname !== '/nuevo' && (
              <Link className="btn btn-primary" to="/nuevo">Añadir</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<ProductosList />} />
          <Route path="/nuevo" element={<NuevoProducto />} />
        </Routes>
      </main>
    </div>
  );
}
