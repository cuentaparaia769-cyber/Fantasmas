// ---------- Datos de Phasmophobia ----------
const PRUEBAS = {
  emf:    { nombre: "EMF nivel 5",            ayuda: "Lector EMF" },
  spirit: { nombre: "Spirit Box",             ayuda: "Respuesta por radio" },
  uv:     { nombre: "Luz ultravioleta",       ayuda: "Huellas y marcas" },
  orbes:  { nombre: "Orbes fantasmales",      ayuda: "Cámara de vídeo" },
  escr:   { nombre: "Escritura fantasma",     ayuda: "Libro" },
  frio:   { nombre: "Temperaturas bajo cero", ayuda: "Termómetro" },
  dots:   { nombre: "D.O.T.S.",               ayuda: "Proyector" }
};

// "extra": prueba que siempre aparece además de las tres (ej. The Mimic).
// "info": qué hace el fantasma. Se rellenará en el siguiente paso.
const FANTASMAS = [
  { nombre: "Spirit",      pruebas: ["emf", "spirit", "escr"], info: "" },
  { nombre: "Wraith",      pruebas: ["emf", "spirit", "dots"], info: "" },
  { nombre: "Phantom",     pruebas: ["spirit", "uv", "dots"], info: "" },
  { nombre: "Poltergeist", pruebas: ["spirit", "uv", "escr"], info: "" },
  { nombre: "Banshee",     pruebas: ["uv", "orbes", "dots"], info: "" },
  { nombre: "Jinn",        pruebas: ["emf", "uv", "frio"], info: "" },
  { nombre: "Mare",        pruebas: ["spirit", "orbes", "escr"], info: "" },
  { nombre: "Revenant",    pruebas: ["orbes", "escr", "frio"], info: "" },
  { nombre: "Shade",       pruebas: ["emf", "escr", "orbes"], info: "" },
  { nombre: "Demon",       pruebas: ["uv", "escr", "frio"], info: "" },
  { nombre: "Yurei",       pruebas: ["orbes", "frio", "dots"], info: "" },
  { nombre: "Oni",         pruebas: ["emf", "frio", "dots"], info: "" },
  { nombre: "Yokai",       pruebas: ["spirit", "orbes", "dots"], info: "" },
  { nombre: "Hantu",       pruebas: ["uv", "orbes", "frio"], info: "" },
  { nombre: "Goryo",       pruebas: ["emf", "uv", "dots"], info: "" },
  { nombre: "Myling",      pruebas: ["emf", "uv", "escr"], info: "" },
  { nombre: "Onryo",       pruebas: ["spirit", "orbes", "frio"], info: "" },
  { nombre: "The Twins",   pruebas: ["emf", "spirit", "frio"], info: "" },
  { nombre: "Raiju",       pruebas: ["emf", "orbes", "dots"], info: "" },
  { nombre: "Obake",       pruebas: ["emf", "uv", "orbes"], info: "" },
  { nombre: "The Mimic",   pruebas: ["spirit", "uv", "frio"], extra: ["orbes"], info: "" },
  { nombre: "Moroi",       pruebas: ["spirit", "escr", "frio"], info: "" },
  { nombre: "Deogen",      pruebas: ["spirit", "escr", "dots"], info: "" },
  { nombre: "Thaye",       pruebas: ["orbes", "escr", "dots"], info: "" }
];

// Estado de cada prueba: 0 = sin marcar, 1 = encontrada, 2 = descartada
const estado = Object.fromEntries(Object.keys(PRUEBAS).map(k => [k, 0]));

const $pruebas = document.getElementById("pruebas");
const $lista = document.getElementById("lista");
const $contador = document.getElementById("contador");

function pintarPruebas() {
  $pruebas.innerHTML = "";
  for (const [id, p] of Object.entries(PRUEBAS)) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "prueba";
    b.dataset.estado = estado[id];
    const etiqueta = ["sin marcar", "encontrada", "descartada"][estado[id]];
    b.setAttribute("aria-label", p.nombre + ", " + etiqueta);
    b.innerHTML = p.nombre + "<small>" + p.ayuda + "</small>";
    b.addEventListener("click", () => {
      estado[id] = (estado[id] + 1) % 3;
      pintar();
    });
    $pruebas.appendChild(b);
  }
}

function coincide(f) {
  const todas = f.pruebas.concat(f.extra || []);
  return Object.entries(estado).every(([id, e]) =>
    e === 0 || (e === 1 && todas.includes(id)) || (e === 2 && !todas.includes(id))
  );
}

function pintarLista() {
  const visibles = FANTASMAS.filter(coincide);
  $contador.textContent = visibles.length + " de " + FANTASMAS.length + " fantasmas posibles";
  $lista.innerHTML = "";

  if (!visibles.length) {
    $lista.innerHTML = '<li class="vacio">Ningún fantasma encaja. Revisa las pruebas que has marcado.</li>';
    return;
  }

  for (const f of visibles) {
    const li = document.createElement("li");
    li.className = "fantasma";
    const pruebasHtml = f.pruebas
      .map(id => '<li class="' + (estado[id] === 1 ? "hay" : "") + '">' + PRUEBAS[id].nombre + "</li>")
      .join("");
    const extraHtml = (f.extra || [])
      .map(id => "<li>" + PRUEBAS[id].nombre + " (siempre aparece)</li>")
      .join("");
    const info = f.info || "Aún sin descripción. La añadimos en el siguiente paso.";
    li.innerHTML =
      "<h3>" + f.nombre + "</h3><ul>" + pruebasHtml + extraHtml + "</ul>" +
      "<details><summary>Qué hace</summary><p>" + info + "</p></details>";
    $lista.appendChild(li);
  }
}

function pintar() { pintarPruebas(); pintarLista(); }

document.getElementById("reiniciar").addEventListener("click", () => {
  for (const k in estado) estado[k] = 0;
  pintar();
});

pintar();
