class SpecialNavbar extends HTMLElement {
   connectedCallback() {
      this.innerHTML = `<nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">Navbar</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
         <li class="nav-item active">
           <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
         </li>
         <li class="nav-item">
           <a class="nav-link" href="#">Features</a>
         </li>
         <li class="nav-item">
           <a class="nav-link" href="#">Pricing</a>
         </li>
         <li class="nav-item">
           <a class="nav-link disabled" href="#">Disabled</a>
         </li>
        </ul>
      </div>
    </nav>`;
   }
}

class SpecialFooter extends HTMLElement {
   connectedCallback() {
      this.innerHTML = `<footer class="site-footer">
         <div class="footer-content">
            <p>&copy; 2025 VELTORA. ALL rights reserved</p>
            <ul class="footer-links">
               <li><a href="#features">Features</a></li>
               <li><a href="#gallery">Gallery</a></li>
               <li><a href="#home">Home</a></li>
            </ul>
         </div>
      </footer>`;
   }
}

// customElements.define("special-navbar", SpecialNavbar);
// customElements.define("special-footer", SpecialFooter);
