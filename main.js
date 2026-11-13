document.documentElement.classList.add("js");

// Revela seções ao rolar
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const sibs = [...e.target.parentElement.children].filter((el) => el.classList.contains("reveal"));
    e.target.style.transitionDelay = Math.min(sibs.indexOf(e.target), 5) * 70 + "ms";
    e.target.classList.add("in");
    io.unobserve(e.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Borda do menu e botão fixo no celular
const nav = document.querySelector(".nav");
const sticky = document.querySelector(".sticky-cta");
const final = document.querySelector(".final");
const onScroll = () => {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 8);
  const nearEnd = final.getBoundingClientRect().top < window.innerHeight;
  sticky.classList.toggle("show", y > 600 && !nearEnd);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Calculadora de comissão
const brl = (v) => "R$ " + Math.round(v).toLocaleString("pt-BR");
const fat = document.getElementById("fat");
const com = document.getElementById("com");
const PLANO = 89.9;
const calc = () => {
  const f = +fat.value, c = +com.value;
  const valor = (f * c) / 100;
  document.getElementById("fatOut").textContent = brl(f);
  document.getElementById("comOut").textContent = c + "%";
  document.getElementById("resCom").textContent = brl(valor);
  document.getElementById("resSave").textContent = brl(Math.max(0, valor - PLANO));
};
fat.addEventListener("input", calc);
com.addEventListener("input", calc);
calc();

document.getElementById("ano").textContent = new Date().getFullYear();
