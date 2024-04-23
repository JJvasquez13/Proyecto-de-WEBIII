class Footer extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<div class="footer-container">
                <div class="footer-section">
                    <strong>Contacto:</strong><br/>
                    Email: ctp.ricardocastrobeer@mep.go.cr <br />
                    Página Oficial:&nbsp;<a class="link-auth" href="https://drea.mep.go.cr/circuito-09/colegio-tecnico-profesional-ricardo-castro-beer">https://drea.mep.go.cr</a><br />
                    Teléfono: 2427-7051 <br />
                    <a class="link-auth" href="about.html">Sobre Nosotros</a>
                </div>

               
                
                <div class="footer-section">
                    Plataforma para subir trabajos de investigación<br/>
                    para el CTP Ricardo Castro Beer!<br/>
                    © 2024 CTP RCB All Rights Reserved
                </div>

                <div class="footer-section">
                    <a href="https://www.facebook.com/CTPRCB" class="social-icon"><i class="fa fa-2x fa-facebook"></i></a>
                    <a href="https://twitter.com/CTPRCB" class="social-icon"><i class="fa fa-2x fa-twitter"></i></a>
                    <a href="https://www.youtube.com/@CTPRCB" class="social-icon"><i class="fa fa-2x fa-youtube" ></i></a>
                    <a href="https://www.instagram.com/CTPRCB" class="social-icon"><i class="fa fa-2x fa-instagram"></i></a>
                </div>
            </div>`;
  }
}

customElements.define("footer-component", Footer);
