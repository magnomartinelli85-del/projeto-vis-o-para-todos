const raiz = document.documentElement;
const corpo = document.body;
let tamanhoFonte = 100;
let leituraAtiva = false;

const limitar = (valor, minimo, maximo) => Math.min(Math.max(valor, minimo), maximo);

function aplicarTamanho() {
  raiz.style.setProperty("--tamanho-fonte", `${tamanhoFonte}%`);
}

document.getElementById("aumentarFonte").addEventListener("click", () => {
  tamanhoFonte = limitar(tamanhoFonte + 10, 80, 140);
  aplicarTamanho();
});

document.getElementById("diminuirFonte").addEventListener("click", () => {
  tamanhoFonte = limitar(tamanhoFonte - 10, 80, 140);
  aplicarTamanho();
});

document.getElementById("contraste").addEventListener("click", (evento) => {
  const ativo = corpo.classList.toggle("alto-contraste");
  evento.currentTarget.setAttribute("aria-pressed", String(ativo));
});

document.getElementById("ouvir").addEventListener("click", (evento) => {
  if (!("speechSynthesis" in window)) {
    alert("Este navegador não oferece leitura em voz alta.");
    return;
  }

  if (leituraAtiva) {
    speechSynthesis.cancel();
    leituraAtiva = false;
    evento.currentTarget.textContent = "Ouvir página";
    evento.currentTarget.setAttribute("aria-pressed", "false");
    return;
  }

  const fala = new SpeechSynthesisUtterance(document.getElementById("conteudo").innerText);
  fala.lang = "pt-BR";
  fala.rate = 1;
  fala.onend = () => {
    leituraAtiva = false;
    evento.currentTarget.textContent = "Ouvir página";
    evento.currentTarget.setAttribute("aria-pressed", "false");
  };
  leituraAtiva = true;
  evento.currentTarget.textContent = "Parar leitura";
  evento.currentTarget.setAttribute("aria-pressed", "true");
  speechSynthesis.speak(fala);
});

document.getElementById("restaurar").addEventListener("click", () => {
  tamanhoFonte = 100;
  aplicarTamanho();
  corpo.classList.remove("alto-contraste");
  document.getElementById("contraste").setAttribute("aria-pressed", "false");
  speechSynthesis?.cancel();
  leituraAtiva = false;
  const botaoOuvir = document.getElementById("ouvir");
  botaoOuvir.textContent = "Ouvir página";
  botaoOuvir.setAttribute("aria-pressed", "false");
});

const menuBotao = document.getElementById("menuBotao");
const menu = document.getElementById("menu");
menuBotao.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  menuBotao.setAttribute("aria-expanded", String(aberto));
});
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menu.classList.remove("aberto");
  menuBotao.setAttribute("aria-expanded", "false");
}));

const controleLuz = document.getElementById("controleLuz");
const painelLeitura = document.getElementById("painelLeitura");
const nivelLuz = document.getElementById("nivelLuz");
function atualizarLuz() {
  const valor = Number(controleLuz.value);
  const luminosidade = 12 + valor * .82;
  painelLeitura.style.backgroundColor = `hsl(52 90% ${luminosidade}%)`;
  painelLeitura.style.color = valor > 38 ? "#17342e" : "#ffffff";
  nivelLuz.textContent = `${valor}% de iluminação`;
}
controleLuz.addEventListener("input", atualizarLuz);
atualizarLuz();

const distancia = document.getElementById("distancia");
const obstaculo = document.getElementById("obstaculo");
const alertaSensor = document.getElementById("alertaSensor");
function atualizarSensor() {
  const valor = Number(distancia.value);
  obstaculo.style.right = `${limitar(valor * .62, 5, 62)}%`;
  alertaSensor.className = "";
  if (valor <= 25) {
    alertaSensor.textContent = `${valor} cm — BIP! Obstáculo muito próximo`;
    alertaSensor.classList.add("sensor-perigo");
  } else if (valor <= 50) {
    alertaSensor.textContent = `${valor} cm — atenção, obstáculo detectado`;
    alertaSensor.classList.add("sensor-atencao");
  } else {
    alertaSensor.textContent = `${valor} cm — caminho livre`;
    alertaSensor.classList.add("sensor-seguro");
  }
}
distancia.addEventListener("input", atualizarSensor);
atualizarSensor();

document.getElementById("quizForm").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const dados = new FormData(evento.currentTarget);
  const respostas = { q1: "a", q2: "b", q3: "c" };
  const respondidas = Object.keys(respostas).filter((questao) => dados.has(questao)).length;
  const acertos = Object.entries(respostas).filter(([questao, resposta]) => dados.get(questao) === resposta).length;
  const resultado = document.getElementById("resultadoQuiz");
  if (respondidas < 3) {
    resultado.textContent = "Responda às três perguntas antes de conferir.";
    return;
  }
  resultado.textContent = acertos === 3
    ? "Excelente! Você conectou Ciência, Robótica e Programação. 3 de 3!"
    : `Você acertou ${acertos} de 3. Revise as seções e tente novamente!`;
});
