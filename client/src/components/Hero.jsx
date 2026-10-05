import heroImg from '../assets/hero.png';
// catalogo.css trae .btn y .btn-primario (ver el comentario en ProductDetail).
import '../styles/catalogo.css';

// Banner de bienvenida arriba del catálogo. Es el destino del link "Inicio".
// La imagen se pasa como variable CSS para que el degradado que asegura el
// contraste del texto quede definido en el CSS y no acá.
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
