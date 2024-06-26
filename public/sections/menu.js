class Menu extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">
            <img src="images/Logo.png" alt="" width="25%"  class="d-inline-block align-text-top">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="index.html">Inicio</a>
                </li>
                <li class="nav-item dropdown "> <!-- Agregamos la clase ml-2 para agregar un margen a la izquierda -->
                    <div class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="authDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Autenticación
                        </a>
                        <div class="dropdown-menu" aria-labelledby="authDropdown">
                            <a class="dropdown-item green-foc" href="login.html">Iniciar Sesión</a>
                            <a class="dropdown-item green-foc" href="signup.html">Regístrarse</a>
                            <a class="dropdown-item green-foc" onclick="salir()">Cerrar Sesión</a>
                        </div>
                    </div>
                </li>
                <li class="nav-item opciones mr-16">
                    <div class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="optionsDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Opciones
                        </a>
                        <div class="dropdown-menu" aria-labelledby="optionsDropdown">
                            <a class="dropdown-item green-foc" href="addInvestigation.html">Agregar Investigación</a>
                            <a class="dropdown-item green-foc" href="researchWork.html">Investigaciones</a>
                            <a class="dropdown-item green-foc" href="student.html">Agregar Estudiante</a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</nav>`;
  }
}

customElements.define("menu-component", Menu);
