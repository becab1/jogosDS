const menu = document.getElementById("menu");
const jogo = document.getElementById("jogo");
const gameOver = document.getElementById("gameOver");

const btnJogar = document.getElementById("btnJogar");
const btnNovamente = document.getElementById("btnNovamente");

const pontuacaoElemento = document.getElementById("pontuacao");
const recordeElemento = document.getElementById("recorde");
const pontuacaoFinal = document.getElementById("pontuacaoFinal");
const recordeFinal = document.getElementById("recordeFinal");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const tamanho = 30;
const quantidade = canvas.width / tamanho;

let cobrinha;
let comida;
let direcao;
let proximaDirecao;
let pontuacao;
let recorde = Number(localStorage.getItem("snakeRecorde")) || 0;
let intervalo;

recordeElemento.textContent = recorde;

function iniciarJogo() {
    menu.classList.add("escondido");
    gameOver.classList.add("escondido");
    jogo.classList.remove("escondido");

    cobrinha = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direcao = { x: 1, y: 0 };
    proximaDirecao = { x: 1, y: 0 };
    pontuacao = 0;

    pontuacaoElemento.textContent = pontuacao;
    recordeElemento.textContent = recorde;

    criarComida();

    clearInterval(intervalo);
    intervalo = setInterval(atualizar, 110);

    desenhar();
}

function criarComida() {
    let localValido = false;

    while (!localValido) {
        comida = {
            x: Math.floor(Math.random() * quantidade),
            y: Math.floor(Math.random() * quantidade)
        };

        localValido = !cobrinha.some(
            parte => parte.x === comida.x && parte.y === comida.y
        );
    }
}

function atualizar() {
    direcao = proximaDirecao;

    const cabeca = {
        x: cobrinha[0].x + direcao.x,
        y: cobrinha[0].y + direcao.y
    };

    
    if (
        cabeca.x < 0 ||
        cabeca.x >= quantidade ||
        cabeca.y < 0 ||
        cabeca.y >= quantidade
    ) {
        finalizarJogo();
        return;
    }

    
    const bateuNoCorpo = cobrinha.some(
        parte => parte.x === cabeca.x && parte.y === cabeca.y
    );

    if (bateuNoCorpo) {
        finalizarJogo();
        return;
    }

    cobrinha.unshift(cabeca);

    
    if (cabeca.x === comida.x && cabeca.y === comida.y) {
        pontuacao++;
        pontuacaoElemento.textContent = pontuacao;

        if (pontuacao > recorde) {
            recorde = pontuacao;
            localStorage.setItem("snakeRecorde", recorde);
            recordeElemento.textContent = recorde;
        }

        criarComida();
    } else {
        cobrinha.pop();
    }

    desenhar();
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    ctx.strokeStyle = "rgba(0, 255, 136, 0.06)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= quantidade; i++) {
        ctx.beginPath();
        ctx.moveTo(i * tamanho, 0);
        ctx.lineTo(i * tamanho, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * tamanho);
        ctx.lineTo(canvas.width, i * tamanho);
        ctx.stroke();
    }

    
    ctx.fillStyle = "#ff0055";
    ctx.shadowColor = "#ff0055";
    ctx.shadowBlur = 18;

    ctx.fillRect(
        comida.x * tamanho + 5,
        comida.y * tamanho + 5,
        tamanho - 10,
        tamanho - 10
    );

    
    cobrinha.forEach((parte, indice) => {
        ctx.fillStyle = indice === 0 ? "#ffffff" : "#00ff88";

        ctx.shadowColor = "#00ff88";
        ctx.shadowBlur = 12;

        ctx.fillRect(
            parte.x * tamanho + 2,
            parte.y * tamanho + 2,
            tamanho - 4,
            tamanho - 4
        );
    });

    ctx.shadowBlur = 0;
}

function finalizarJogo() {
    clearInterval(intervalo);

    pontuacaoFinal.textContent = pontuacao;
    recordeFinal.textContent = recorde;

    jogo.classList.add("escondido");
    gameOver.classList.remove("escondido");
}

function mudarDirecao(novaDirecao) {

    if (
        novaDirecao.x === -direcao.x &&
        novaDirecao.y === -direcao.y
    ) {
        return;
    }

    proximaDirecao = novaDirecao;
}

document.addEventListener("keydown", (evento) => {

    const teclas = {

        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },

        w: { x: 0, y: -1 },
        W: { x: 0, y: -1 },

        s: { x: 0, y: 1 },
        S: { x: 0, y: 1 },

        a: { x: -1, y: 0 },
        A: { x: -1, y: 0 },

        d: { x: 1, y: 0 },
        D: { x: 1, y: 0 }
    };

    if (teclas[evento.key]) {

        evento.preventDefault();

        mudarDirecao(teclas[evento.key]);
    }
});

btnJogar.addEventListener("click", iniciarJogo);

btnNovamente.addEventListener("click", iniciarJogo);