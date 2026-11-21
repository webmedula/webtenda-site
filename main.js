document.documentElement.classList.add("js");

// WhatsApp para dúvidas: coloque só os números, com 55 + DDD (ex.: "5511999998888").
// Vazio = o botão não aparece.
const WHATSAPP = "5562982908000";

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
  if (nav) nav.classList.toggle("scrolled", y > 8);
  if (!sticky) return;
  const nearEnd = final ? final.getBoundingClientRect().top < window.innerHeight : false;
  const show = y > 600 && !nearEnd;
  sticky.classList.toggle("show", show);
  document.body.classList.toggle("sticky-on", show);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Menu do topo: "Soluções" abre ao clicar (e ao passar o mouse no computador);
// no celular, os três risquinhos abrem o menu inteiro.
if (nav) {
  const drop = nav.querySelector(".nav-drop");
  const dropBtn = nav.querySelector(".nav-drop-btn");
  const burger = nav.querySelector(".nav-burger");
  const setDrop = (open) => {
    if (!drop) return;
    drop.classList.toggle("open", open);
    dropBtn.setAttribute("aria-expanded", open);
  };
  const setMenu = (open) => {
    nav.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  if (dropBtn) dropBtn.addEventListener("click", (e) => { e.stopPropagation(); setDrop(!drop.classList.contains("open")); });
  if (burger) burger.addEventListener("click", () => setMenu(!nav.classList.contains("menu-open")));
  nav.querySelectorAll(".nav-menu a").forEach((a) => a.addEventListener("click", () => { setMenu(false); setDrop(false); }));
  document.addEventListener("click", (e) => { if (drop && !drop.contains(e.target)) setDrop(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (drop && drop.classList.contains("open")) { setDrop(false); dropBtn.focus(); }
    if (nav.classList.contains("menu-open")) { setMenu(false); burger.focus(); }
  });
}

// Calculadora de comissão
const brl = (v) => "R$ " + Math.round(v).toLocaleString("pt-BR");
const fat = document.getElementById("fat");
const com = document.getElementById("com");
const PLANO = 89.9;
const calc = () => {
  if (!fat || !com) return;
  const f = +fat.value, c = +com.value;
  const valor = (f * c) / 100;
  document.getElementById("fatOut").textContent = brl(f);
  document.getElementById("comOut").textContent = c + "%";
  document.getElementById("resCom").textContent = brl(valor);
  document.getElementById("resSave").textContent = brl(Math.max(0, valor - PLANO));
};
if (fat && com) {
  fat.addEventListener("input", calc);
  com.addEventListener("input", calc);
}
calc();

// Calculadora do parceiro (/parceiros/): montagem + 30% da mensalidade.
// Se mudar a comissão ou a montagem sugerida, troque aqui e nos textos de parceiros/index.html.
const COMISSAO = 0.30;
const MONTAGEM = 199;
const lojas = document.getElementById("lojas");
const brl2 = (v) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const calcParceiro = () => {
  if (!lojas) return;
  const n = +lojas.value;
  const plano = +(document.querySelector('input[name="plano"]:checked') || { value: 89.9 }).value;
  const mes = Math.floor(n * plano * COMISSAO * 100) / 100;
  document.getElementById("lojasOut").textContent = n + (n === 1 ? " loja" : " lojas");
  document.getElementById("resSetup").textContent = brl(n * MONTAGEM);
  document.getElementById("resMes").textContent = brl2(mes);
  document.getElementById("resAno").textContent = brl(n * MONTAGEM + mes * 12);
};
if (lojas) {
  lojas.addEventListener("input", calcParceiro);
  document.querySelectorAll('input[name="plano"]').forEach((r) => r.addEventListener("change", calcParceiro));
  calcParceiro();
}

// Link de parceiro: webtenda.com.br/?parceiro=MARIA. O código fica guardado por 90 dias neste navegador
// e vai junto em todos os botões de cadastro, para a loja nascer ligada ao parceiro.
(() => {
  const KEY = "wt_parceiro";
  let code = (new URLSearchParams(location.search).get("parceiro") || "").replace(/[^0-9a-z]/gi, "").toUpperCase().slice(0, 20);
  try {
    if (code) localStorage.setItem(KEY, JSON.stringify({ code, at: Date.now() }));
    else {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved && Date.now() - saved.at < 90 * 864e5) code = saved.code;
    }
  } catch (e) { /* navegador sem armazenamento: vale só nesta página */ }
  if (!code) return;
  document.querySelectorAll('a[href^="https://app.webtenda.com.br/cadastro"]').forEach((a) => {
    const url = new URL(a.href);
    url.searchParams.set("parceiro", code);
    a.href = url.toString();
  });
})();

const ano = document.getElementById("ano");
if (ano) ano.textContent = new Date().getFullYear();

// Botão flutuante do WhatsApp (mesmo número em todas as páginas)
if (WHATSAPP) {
  const p = location.pathname;
  const assunto = p.includes("/loja") ? " para loja de roupas" : p.includes("/delivery") ? " para delivery" : "";
  const msg = p.includes("/parceiros")
    ? "Olá! Vim pelo site e tenho uma dúvida sobre o programa de parceiros da WebTenda."
    : `Olá! Vim pelo site e tenho uma dúvida sobre a WebTenda${assunto}.`;
  const a = document.createElement("a");
  a.className = "wa-float";
  a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "Tirar dúvidas pelo WhatsApp");
  a.innerHTML = '<span class="wa-tip">Dúvidas? Fale com a gente</span><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#fff" d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.6L3 29l7-2.2c1.8 1 3.9 1.6 6 1.6 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.3 1.3-4-.3-.4c-1.1-1.7-1.7-3.6-1.7-5.6C5.4 9.8 10.2 5.2 16 5.2s10.6 4.6 10.6 10.4S21.8 26 16 26zm5.8-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2.1-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.8 5 .8.4 1.4.6 1.9.7.8.3 1.6.2 2.2.1.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>';
  document.body.appendChild(a);
  setTimeout(() => a.classList.add("tip-off"), 6000);
}
