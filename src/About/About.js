import "./About.css";
import { Fragment, useState } from "react";
import axios from "axios";

const About = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const submitSuggestion = () => {
    axios
      .post("/suggest", {
        name,
        phone,
        suggestion
      })
      .then(() => {
        setName('');
        setPhone('');
        setSuggestion('');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Fragment>
      <nav class="navbar nav-first navbar-dark bg-dark">
        <div class="container">
          <a class="navbar-brand" href="#">
            <img src="./assets/imgs/logo.png" alt="crossroads" />
          </a>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a class="nav-link text-primary" href="#home">
                Reserva con nosotros al: <span class="pl-2 text-muted">0979700737</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-primary" href="#home">
                Encuentranos en:{" "}
                <span class="pl-2 text-muted">
                  Loja, 24 de Mayo entre Miguel Riofrio y Azuay
                </span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <nav class="nav-second navbar custom-navbar navbar-expand-sm navbar-dark bg-dark sticky-top">
        <div class="container">
          <button
            class="navbar-toggler ml-auto"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item">
                <a class="nav-link" href="#about">
                  Acerca de nosotros
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#service">
                  Especiales
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#team">
                  Nuestro equipo
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#testmonial">
                  Guia The Crossroads
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#suggestions">
                  Sugerencias
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <header class="header">
        <div class="overlay">
          <img src="./assets/imgs/logo.png" alt="crossroads" class="logo" />
          <h1 class="subtitle">Bienvenido a nuestro Restaurante</h1>
          <h1 class="title">The Crossroads Loja</h1>
          <a class="btn btn-primary mt-3" href="#mainmenu">
            Ver Menú
          </a>
        </div>
      </header>

      <section id="about">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-6">
              <h6 class="section-subtitle">Horarios de apertura</h6>
              <h3 class="section-title">Horarios de atención</h3>
              <p class="mb-1 font-weight-bold">
                Martes - Miercoles :{" "}
                <span class="font-weight-normal pl-2 text-muted">
                  04:00 pm - 10:00 pm
                </span>
              </p>
              <p class="mb-1 font-weight-bold">
                Jueves :{" "}
                <span class="font-weight-normal pl-2 text-muted">
                  04:00 pm - 10:00 pm / Medianoche
                </span>
              </p>
              <p class="mb-1 font-weight-bold">
                Friday - Saturday :{" "}
                <span class="font-weight-normal pl-2 text-muted">
                  04:00 pm - Medianoche
                </span>
              </p>

              <a href="#mainmenu" class="btn btn-primary btn-sm w-md mt-4">
                Ver Menú
              </a>
            </div>
            <div class="col-md-6">
              <div class="row">
                <div class="col">
                  <img
                    alt="crossroads"
                    src="./assets/imgs/about-1.jpg"
                    class="w-100 rounded shadow"
                  />
                </div>
                <div class="col">
                  <img
                    alt="crossroads"
                    src="./assets/imgs/about-2.jpg"
                    class="w-100 rounded shadow"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="section-devider my-6 transparent"></div>
          <div class="row align-items-center">
            <div class="col-md-6">
              <h6 class="section-subtitle">La gran historia</h6>
              <h3 class="section-title">Nuestra aventura culinaria</h3>
              <p>
                Procesamos el jugo de caña con el objetivo de brindarte nuevas
                experiencias a tu paladar contamos con una amplia variedad de
                micheladas / michecañas y picadas en tablita, y como si fuera
                poco ofrecemos bebidas adaptadas al clima de nuestra ciudad
              </p>
            </div>
            <div class="col-md-6 order-1 order-sm-first">
              <div class="row">
                <div class="col">
                  <img
                    alt="crossroads"
                    src="./assets/imgs/about-3.jpg"
                    class="w-100 rounded shadow"
                  />
                </div>
                <div class="col">
                  <img
                    alt="crossroads"
                    src="./assets/imgs/about-4.jpg"
                    class="w-100 rounded shadow"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="service" class="pattern-style-4 has-overlay">
        <div class="container raise-2">
          <h6 class="section-subtitle text-center">Mejores platillos</h6>
          <h3 class="section-title mb-6 pb-3 text-center">
            Platillos especiales
          </h3>
          <div class="row">
            <div class="col-md-6 mb-4">
              <a href="javascrip:void(0)" class="custom-list">
                <div class="img-holder">
                  <img src="./assets/imgs/dish-1.jpg" alt="crossroads" />
                </div>
                <div class="info">
                  <div class="head clearfix">
                    <h5 class="title float-left">Alitas crossroads</h5>
                    <p class="float-right text-primary">$5</p>
                  </div>
                  <div class="body">
                    <p>
                      (5 alitas de pollo horneadas en salsa BBQ/Queso/Búfalo +
                      papas rústicas)
                    </p>
                  </div>
                </div>
              </a>
            </div>
            <div class="col-md-6 mb-4">
              <a href="javascrip:void(0)" class="custom-list">
                <div class="img-holder">
                  <img src="./assets/imgs/dish-2.jpg" alt="crossroads" />
                </div>
                <div class="info">
                  <div class="head clearfix">
                    <h5 class="title float-left">Chicharroads</h5>
                    <p class="float-right text-primary">$5</p>
                  </div>
                  <div class="body">
                    <p>
                      (200gr de panceta de cerdo confitada + papas rústicas +
                      Salsa chimichurri de la casa)
                    </p>
                  </div>
                </div>
              </a>
            </div>
            <div class="col-md-6 mb-4">
              <a href="javascrip:void(0)" class="custom-list">
                <div class="img-holder">
                  <img src="./assets/imgs/dish-3.jpg" alt="crossroads" />
                </div>
                <div class="info">
                  <div class="head clearfix">
                    <h5 class="title float-left">Crosstillas</h5>
                    <p class="float-right text-primary">$6</p>
                  </div>
                  <div class="body">
                    <p>
                      (250gr de costilla de cerdo horneada en salsa
                      BBQ/Queso/Búfalo/Maracuyá + papas rústicas)
                    </p>
                  </div>
                </div>
              </a>
            </div>
            <div class="col-md-6 mb-4">
              <a href="javascrip:void(0)" class="custom-list">
                <div class="img-holder">
                  <img src="./assets/imgs/dish-4.jpg" alt="crossroads" />
                </div>
                <div class="info">
                  <div class="head clearfix">
                    <h5 class="title float-left">Micheladas / Michecañas</h5>
                    <p class="float-right text-primary">$3 - $4.50</p>
                  </div>
                  <div class="body">
                    <p>
                      Deliciosas bebidas basadas en cerveza + jugo de caña /
                      maracuyá / tajín / limón / sal
                    </p>
                  </div>
                </div>
              </a>
            </div>
            <div class="col-md-6 mb-4">
              <a href="javascrip:void(0)" class="custom-list">
                <div class="img-holder">
                  <img src="./assets/imgs/dish-5.jpg" alt="crossroads" />
                </div>
                <div class="info">
                  <div class="head clearfix">
                    <h5 class="title float-left">
                      Jarra Guarapo / Crossroads / Michecaña
                    </h5>
                    <p class="float-right text-primary">$6 - $8</p>
                  </div>
                  <div class="body">
                    <p>Jarras de nuestras bebidas más populares</p>
                  </div>
                </div>
              </a>
            </div>
            <div class="col-md-6 mb-4">
              <a href="javascrip:void(0)" class="custom-list">
                <div class="img-holder">
                  <img src="./assets/imgs/dish-6.jpg" alt="crossroads" />
                </div>
                <div class="info">
                  <div class="head clearfix">
                    <h5 class="title float-left">Copa de Vino hervido</h5>
                    <p class="float-right text-primary">$3</p>
                  </div>
                  <div class="body">
                    <p>Vino hervido con especias, limón y dulzor agregado</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="mainmenu" class="has-img-bg">
        <div class="container">
          <h6 class="section-subtitle text-center">Piqueos y bebidas</h6>
          <h3 class="section-title mb-6 text-center">Menú Principal</h3>
          <div class="card bg-light">
            <div class="card-body px-4 pb-4 text-center">
              <div class="row text-left">
                <div class="col-md-6 my-4">
                  <a
                    href="#"
                    class="pb-3 mx-3 d-block text-dark text-decoration-none border border-left-0 border-top-0 border-right-0"
                  >
                    <div class="d-flex">
                      <div class="flex-grow-1">
                        Alitas crossroads
                        <p class="mt-1 mb-0">
                          (5 alitas de pollo horneadas en salsa BBQ/Queso/Búfalo
                          + papas rústicas)
                        </p>
                      </div>
                      <h6 class="float-right text-primary">$5</h6>
                    </div>
                  </a>
                </div>
                <div class="col-md-6 my-4">
                  <a
                    href="#"
                    class="pb-3 mx-3 d-block text-dark text-decoration-none border border-left-0 border-top-0 border-right-0"
                  >
                    <div class="d-flex">
                      <div class="flex-grow-1">
                        Chicharroads
                        <p class="mt-1 mb-0">
                          (200gr de panceta de cerdo confitada + papas rústicas
                          + Salsa chimichurri de la casa)
                        </p>
                      </div>
                      <h6 class="float-right text-primary">$5</h6>
                    </div>
                  </a>
                </div>
                <div class="col-md-6 my-4">
                  <a
                    href="#"
                    class="pb-3 mx-3 d-block text-dark text-decoration-none border border-left-0 border-top-0 border-right-0"
                  >
                    <div class="d-flex">
                      <div class="flex-grow-1">
                        Crosstillas
                        <p class="mt-1 mb-0">
                          (250gr de costilla de cerdo horneada en salsa
                          BBQ/Queso/Búfalo/Maracuyá + papas rústicas)
                        </p>
                      </div>
                      <h6 class="float-right text-primary">$6</h6>
                    </div>
                  </a>
                </div>
                <div class="col-md-6 my-4">
                  <a
                    href="#"
                    class="pb-3 mx-3 d-block text-dark text-decoration-none border border-left-0 border-top-0 border-right-0"
                  >
                    <div class="d-flex">
                      <div class="flex-grow-1">
                        Michecañas
                        <p class="mt-2 mb-0">
                          Deliciosas bebidas basadas en cerveza + jugo de caña /
                          tajín
                        </p>
                      </div>
                      <h6 class="float-right text-primary">$3.50</h6>
                    </div>
                  </a>
                </div>
                <div class="col-md-6 my-4">
                  <a
                    href="#"
                    class="pb-3 mx-3 d-block text-dark text-decoration-none border border-left-0 border-top-0 border-right-0"
                  >
                    <div class="d-flex">
                      <div class="flex-grow-1">
                        Jarra Crossroads
                        <p class="mt-2 mb-0">Jarras de Guarapo + Licor</p>
                      </div>
                      <h6 class="float-right text-primary">$8</h6>
                    </div>
                  </a>
                </div>
                <div class="col-md-6 my-4">
                  <a
                    href="#"
                    class="pb-3 mx-3 d-block text-dark text-decoration-none border border-left-0 border-top-0 border-right-0"
                  >
                    <div class="d-flex">
                      <div class="flex-grow-1">
                        Copa de Vino hervido
                        <p class="mt-2 mb-0">
                          Vino hervido con especias, limón y dulzor agregado
                        </p>
                      </div>
                      <h6 class="float-right text-primary">$3</h6>
                    </div>
                  </a>
                </div>
              </div>
              <a href="/menu" class="btn btn-primary mt-4">
                Descargar menú detallado
              </a>
            </div>
          </div>
        </div>
      </section>
      <section id="team">
        <div class="container">
          <h6 class="section-subtitle text-center">Gran Equipo</h6>
          <h3 class="section-title mb-5 text-center">Personal Talentoso</h3>
          <div class="row">
            <div class="col-md-6 my-3">
              <div class="team-wrapper text-center">
                <img
                  src="./assets/imgs/chef-1.jpg"
                  class="circle-120 rounded-circle mb-3 shadow"
                  alt="crossroads"
                />
                <h5 class="my-3">Cross</h5>
                <p>
                  Chef independiente, graduado en la UTPL, aprendiz del chef Mauricio Artieda fundador de la carrera de gastronomía
                </p>
              </div>
            </div>
            <div class="col-md-6 my-3">
              <div class="team-wrapper text-center">
                <img
                  src="./assets/imgs/chef-2.jpg"
                  class="circle-120 rounded-circle mb-3 shadow"
                  alt="crossroads"
                />
                <h5 class="my-3">Claudia</h5>
                <p>
                  Magister en Direccion de Hoteles y empresas de Restauracion
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testmonial" class="pattern-style-3">
        <div class="container">
          <h6 class="section-subtitle text-center">
            Necesitas un tutorial de Crossroads?
          </h6>
          <h3 class="section-title mb-5 text-center">
            Guia para disfrutar de The Crossroads
          </h3>

          <div class="row">
            <div class="col-md-4 my-3 my-md-0">
              <div class="card">
                <div class="card-body">
                  <div class="media align-items-center mb-3">
                    <div class="media-body">
                      <h6 class="mt-1 mb-0">1. Elige tu combo</h6>
                      <small class="text-muted mb-0">Piqueo + Bebida</small>
                    </div>
                  </div>
                  <p class="mb-0">
                    Deleitate con nuestra perfecta combinacion de bebidas y
                    piqueos para consentir tu paladar, una Crosstilla de
                    Maracuya + una Michecaña puede ser un buen comienzo
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-4 my-3 my-md-0">
              <div class="card">
                <div class="card-body">
                  <div class="media align-items-center mb-3">
                    <div class="media-body">
                      <h6 class="mt-1 mb-0">2. Toma el control de la musica</h6>
                      <small class="text-muted mb-0">Billie Jean</small>
                    </div>
                  </div>
                  <p class="mb-0">
                    Escanea el codigo QR presente en el menu y envia via
                    Whatsapp el nombre de la cancion/artista que mas sea de tu
                    agrado, nuestro bot se encargara de guiarte en el proceso
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-4 my-3 my-md-0">
              <div class="card">
                <div class="card-body">
                  <div class="media align-items-center mb-3">
                    <div class="media-body">
                      <h6 class="mt-1 mb-0">3. Deja que todo fluya</h6>
                      <small class="text-muted mb-0">
                        The Crossroads es lo Maximo!
                      </small>
                    </div>
                  </div>
                  <p class="mb-0">
                    Tu combinacion de sabor, bebida y musica volara tus sentidos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="suggestions" class="bg-white">
        <div class="container">
          <h6 class="section-subtitle text-center">
            Cuentanos tu experiencia!
          </h6>
          <h3 class="section-title mb-5 text-center">
            Dejanos tus sugerencias
          </h3>

          <div class="row align-items-center">
            <div class="col-md-6 d-none d-md-block">
              <img
                src="./assets/imgs/contact.jpg"
                alt="crossroads"
                class="w-100 rounded shadow"
              />
            </div>
            <div class="col-md-6">
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Tu nombre (opcional)"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
                <div class="form-group">
                  <input
                    type="tel"
                    class="form-control"
                    name="phone"
                    placeholder="Tu telefono (opcional)"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                  />
                </div>
                <div class="form-group">
                  <textarea
                    type="text"
                    class="form-control"
                    name="suggestion"
                    placeholder="Escribe tu sugerencia aquí"
                    onChange={(e) => setSuggestion(e.target.value)}
                    value={suggestion}
                  />
                </div>
                <button onClick={submitSuggestion} class="btn btn-primary btn-block">
                  Enviar sugerencia
                </button>
                <small class="form-text text-muted mt-3">
                  Nosotros no enviamos Spam a nuestros clientes, el numero de
                  telefono será usado unicamente como metodo de identificación
                  interna{" "}
                </small>
            </div>
          </div>
        </div>
      </section>

      <div class="py-4 border border-lighter border-bottom-0 border-left-0 border-right-0 bg-dark">
        <div class="container">
          <div class="row justify-content-between align-items-center text-center">
            <div class="col-md-3 text-md-left mb-3 mb-md-0">
              <img
                src="./assets/imgs/logo.png"
                width="100"
                alt="crossroads"
                class="mb-0"
              />
            </div>
          </div>
        </div>
      </div>
      <footer class="border border-dark border-left-0 border-right-0 border-bottom-0 p-4 bg-dark">
        <div class="container">
          <div class="row align-items-center text-center text-md-left">
            <div class="col">
              <p class="mb-0 small">
                &copy; Date,{" "}
                <a href="https://www.devcrud.com" target="_blank">
                  DevCrud
                </a>{" "}
                All rights reserved{" "}
              </p>
            </div>
            <div class="d-none d-md-block">
              <h6 class="small mb-0">
                <a href="javascript:void(0)" class="px-2">
                  <i class="ti-facebook"></i>
                </a>
                <a href="javascript:void(0)" class="px-2">
                  <i class="ti-twitter"></i>
                </a>
                <a href="javascript:void(0)" class="px-2">
                  <i class="ti-instagram"></i>
                </a>
                <a href="javascript:void(0)" class="px-2">
                  <i class="ti-google"></i>
                </a>
              </h6>
            </div>
          </div>
        </div>
      </footer>
      <script src="./assets/vendors/jquery/jquery-3.4.1.js"></script>
      <script src="./assets/vendors/bootstrap/bootstrap.bundle.js"></script>
      <script src="./assets/vendors/bootstrap/bootstrap.affix.js"></script>
      <script src="./assets/js/pigga.js"></script>
    </Fragment>
  );
};

export { About };
