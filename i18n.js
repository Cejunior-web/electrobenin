const translations = {
  fr: {
    nav_home: "Accueil",
    nav_catalog: "Catalogue",
    nav_tracking: "Suivi",
    nav_contact: "Contact",

    hero_title: "Votre Partenaire Électronique au Bénin",
    hero_subtitle: "Arduino, capteurs, modules et outils de qualité",
    btn_explore: "Explorer le catalogue",

    cart_title: "Mon Panier",
    contact_title: "Nous Contacter",
    tracking_title: "Suivi de Commande",

    fullname: "Nom complet",
    tel: "Téléphone (optionnel)",
    email: "Email",
    password: "Mot de passe",
    login: "Se connecter",
    register: "S'inscrire"
  },
  en: {
    nav_home: "Home",
    nav_catalog: "Catalog",
    nav_tracking: "Tracking",
    nav_contact: "Contact",

    hero_title: "Your Electronics Partner in Benin",
    hero_subtitle: "Arduino, sensors, modules and quality tools",
    btn_explore: "Browse catalog",

    cart_title: "My Cart",
    contact_title: "Contact Us",
    tracking_title: "Order Tracking",

    fullname: "Full name",
    tel: "Phone (optional)",
    email: "Email",
    password: "Password",
    login: "Sign in",
    register: "Sign up"
  }
};

function injectLangSwitcher() {
  if (document.querySelector(".lang-switch")) return;

  const switcher = document.createElement("div");
  switcher.className = "lang-switch";
  switcher.innerHTML = `
    <button class="lang-btn" data-lang="fr">FR</button>
    <button class="lang-btn" data-lang="en">EN</button>
  `;

  Object.assign(switcher.style, {
    position: "fixed",
    top: "15px",
    right: "20px",
    zIndex: "9999",
    display: "flex",
    gap: "6px"
  });

  document.body.appendChild(switcher);
}

function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  injectLangSwitcher();

  const savedLang = localStorage.getItem("lang") || "fr";
  setLanguage(savedLang);

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setLanguage(btn.dataset.lang);
    });
  });
});
