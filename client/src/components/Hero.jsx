import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.webp';
import '../styles/catalogo.css';

const Hero = () => {
  return (
    <section
      id="inicio"
      className="hero"
      style={{ '--hero-img': `url(${heroImg})` }}
    >
      <div className="hero-contenido">
        <p className="hero-volanta">Muebles de autor · Hechos en Argentina</p>
        <h1 className="hero-titulo">Madera noble para toda la vida</h1>
        <p className="hero-texto">
          Diseños inspirados en nuestros paisajes, fabricados a mano en maderas
          nativas.
        </p>
        <Link to="/productos" className="btn btn-primario hero-cta">
          Ver catálogo
        </Link>
      </div>
    </section>
  );
};

export default Hero;
