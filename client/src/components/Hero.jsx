import heroImg from '../assets/hero.webp';
import '../styles/catalogo.css';

const Hero = ({ onVerCatalogo }) => {
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
        <button type="button" className="btn btn-primario hero-cta" onClick={onVerCatalogo}>
          Ver catálogo
        </button>
      </div>
    </section>
  );
};

export default Hero;
