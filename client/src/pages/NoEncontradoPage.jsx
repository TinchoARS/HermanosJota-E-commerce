import { Link } from 'react-router-dom';
import '../styles/catalogo.css';

const NoEncontradoPage = () => (
  <section className="catalogo-estado" role="alert">
    <h1 className="catalogo-titulo">Página no encontrada</h1>
    <p>La dirección que abriste no existe.</p>
    <Link to="/" className="btn btn-secundario">Ir al inicio</Link>
  </section>
);

export default NoEncontradoPage;
