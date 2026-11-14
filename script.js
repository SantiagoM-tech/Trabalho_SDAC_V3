"use strict";

/* =========================================================
   DADOS
   ========================================================= */
const AHASLIDES_URL = "https://ahaslides.com/TX0BT";

const tools = {
    visual: {
        title: "Visual Studio",
        text: "O IDE completo da Microsoft. Reúne editor, compilador, depurador e muitas outras ferramentas num só programa, o que o torna muito completo para projectos grandes.",
        ideal: "Aplicações .NET grandes e projectos completos",
        platform: "Windows (a versão para Mac foi descontinuada em 2024)",
        link: "https://visualstudio.microsoft.com/"
    },
    vscode: {
        title: "Visual Studio Code",
        text: "Um editor leve e personalizável. Começa simples e vai ganhando funcionalidades (como depuração de C#) através de extensões.",
        ideal: "Aprender, testar ideias e projectos pequenos",
        platform: "Windows, macOS e Linux",
        link: "https://code.visualstudio.com/"
    },
    rider: {
        title: "JetBrains Rider",
        text: "Um IDE da JetBrains focado em .NET. Destaca-se pela análise inteligente de código e pelas ferramentas de refatoração.",
        ideal: "Desenvolvimento .NET profissional e multiplataforma",
        platform: "Windows, macOS e Linux",
        link: "https://www.jetbrains.com/rider/"
    }
};

const quizQuestions = [
    {
        q: "Que sistema operativo usas?",
        options: [
            { text: "Windows", score: { visual: 2, vscode: 1, rider: 1 } },
            { text: "macOS ou Linux", score: { visual: 0, vscode: 2, rider: 2 } },
            { text: "Uso vários", score: { visual: 0, vscode: 2, rider: 2 } }
        ]
    },
    {
        q: "O que preferes?",
        options: [
            { text: "Ter tudo já pronto num só programa", score: { visual: 3, vscode: 0, rider: 2 } },
            { text: "Um programa leve que eu personalizo", score: { visual: 0, vscode: 3, rider: 0 } },
            { text: "Ajuda inteligente a melhorar o meu código", score: { visual: 1, vscode: 0, rider: 3 } }
        ]
    },
    {
        q: "Em que vais trabalhar?",
        options: [
            { text: "Exercícios e projectos pequenos", score: { visual: 0, vscode: 3, rider: 1 } },
            { text: "Uma aplicação grande em .NET", score: { visual: 3, vscode: 0, rider: 2 } },
            { text: "Um projecto profissional em várias plataformas", score: { visual: 0, vscode: 1, rider: 3 } }
        ]
    }
];

const quizReasons = {
    visual: "Tens um ambiente completo, com depuração avançada e tudo integrado. Ideal em Windows.",
    vscode: "É leve, simples e multiplataforma. Perfeito para começar e para ires adicionando extensões.",
    rider: "Tem análise inteligente de código e ferramentas de refatoração, tudo focado em .NET."
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =========================================================
   NAVEGAÇÃO
   ========================================================= */
const navbar = document.getElementById("navbar");
const progressBar = document.getElementById("progressBar");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

function setMenu(open) {
    mainNav.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
}
menuToggle.addEventListener("click", () => setMenu(!mainNav.classList.contains("open")));
mainNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));

/* Link activo conforme a secção visível */
const navLinks = [...mainNav.querySelectorAll("a[href^='#']:not(.nav-button)")];
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
        }
    });
}, { rootMargin: "-40% 0px -55% 0px" });

navLinks.forEach(l => {
    const target = document.querySelector(l.getAttribute("href"));
    if (target) sectionObserver.observe(target);
});

/* Animação de entrada ao fazer scroll */
const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* =========================================================
   FERRAMENTAS: PAINEL DE DETALHES
   ========================================================= */
const detailsPanel = document.getElementById("detailsPanel");
const closeBtn = document.getElementById("closeDetails");

function showDetails(key) {
    const t = tools[key];
    if (!t) return;

    document.getElementById("detailsTitle").textContent = t.title;
    document.getElementById("detailsText").textContent = t.text;
    document.getElementById("detailsIdeal").textContent = t.ideal;
    document.getElementById("detailsPlatform").textContent = t.platform;
    document.getElementById("detailsLink").href = t.link;

    detailsPanel.hidden = false;
    document.querySelectorAll(".tool-card").forEach(c => c.classList.toggle("selected", c.dataset.tool === key));
    detailsPanel.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
}

function closeDetails() {
    detailsPanel.hidden = true;
    document.querySelectorAll(".tool-card").forEach(c => c.classList.remove("selected"));
}

document.querySelectorAll("[data-open]").forEach(btn => {
    btn.addEventListener("click", () => showDetails(btn.dataset.open));
});
closeBtn.addEventListener("click", closeDetails);
document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        closeDetails();
        setMenu(false);
    }
});

/* =========================================================
   COMPARAÇÃO: DESTACAR COLUNA
   ========================================================= */
const table = document.querySelector(".comparison-table");
table.querySelectorAll("[data-col]").forEach(cell => {
    cell.addEventListener("mouseenter", () => { table.dataset.hover = cell.dataset.col; });
    cell.addEventListener("click", () => {
        table.dataset.hover = table.dataset.hover === cell.dataset.col ? "" : cell.dataset.col;
    });
});
table.addEventListener("mouseleave", () => { table.dataset.hover = ""; });

/* =========================================================
   LABORATÓRIO C# (SIMULAÇÃO)
   ========================================================= */
const labForm = document.getElementById("labForm");
const nameInput = document.getElementById("userName");
const liveName = document.getElementById("liveName");
const output = document.getElementById("output");
let typingTimer = null;

nameInput.addEventListener("input", () => {
    liveName.textContent = nameInput.value || "...";
});

function runCode() {
    clearInterval(typingTimer);
    const nome = nameInput.value.trim();
    output.textContent = "";

    // Simula: if (nome != "") Console.WriteLine("Olá, " + nome);
    if (nome === "") {
        const msg = document.createElement("span");
        msg.className = "output-muted";
        msg.textContent = "(sem saída: a condição nome != \"\" é falsa)";
        output.appendChild(msg);
        return;
    }

    const line = "Olá, " + nome;
    if (reduceMotion) {
        output.textContent = line;
        return;
    }

    let i = 0;
    output.classList.add("typed");
    typingTimer = setInterval(() => {
        output.textContent = line.slice(0, ++i);
        if (i >= line.length) {
            clearInterval(typingTimer);
            output.classList.remove("typed");
        }
    }, 45);
}

labForm.addEventListener("submit", e => {
    e.preventDefault();
    runCode();
});

/* =========================================================
   QUIZ: QUAL FERRAMENTA ESCOLHER
   ========================================================= */
const quizBody = document.getElementById("quizBody");
const quizBar = document.getElementById("quizBar");
let quizStep = 0;
let quizScores = { visual: 0, vscode: 0, rider: 0 };

function renderQuestion() {
    const item = quizQuestions[quizStep];
    quizBar.style.width = (quizStep / quizQuestions.length) * 100 + "%";
    quizBody.innerHTML = "";

    const step = document.createElement("p");
    step.className = "quiz-step";
    step.textContent = `PERGUNTA ${quizStep + 1} / ${quizQuestions.length}`;

    const q = document.createElement("h3");
    q.className = "quiz-question";
    q.textContent = item.q;

    const list = document.createElement("div");
    list.className = "quiz-options";

    item.options.forEach(opt => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "quiz-option";
        b.textContent = opt.text;
        b.addEventListener("click", () => {
            Object.keys(quizScores).forEach(k => { quizScores[k] += opt.score[k]; });
            quizStep++;
            quizStep < quizQuestions.length ? renderQuestion() : renderResult();
        });
        list.appendChild(b);
    });

    quizBody.append(step, q, list);
}

function renderResult() {
    quizBar.style.width = "100%";
    const best = Object.keys(quizScores).reduce((a, b) => (quizScores[b] > quizScores[a] ? b : a));
    const t = tools[best];

    quizBody.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "quiz-result";

    const eyebrow = document.createElement("span");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "A TUA FERRAMENTA";

    const title = document.createElement("h3");
    title.textContent = t.title;

    const text = document.createElement("p");
    text.textContent = quizReasons[best] + " Lembra-te: não existe uma ferramenta perfeita, só a certa para cada projecto.";

    const actions = document.createElement("div");
    actions.className = "quiz-actions";

    const more = document.createElement("a");
    more.className = "primary-button";
    more.href = t.link;
    more.target = "_blank";
    more.rel = "noopener noreferrer";
    more.textContent = "Ver site oficial ↗";

    const again = document.createElement("button");
    again.type = "button";
    again.className = "secondary-button";
    again.textContent = "Repetir quiz";
    again.addEventListener("click", () => {
        quizStep = 0;
        quizScores = { visual: 0, vscode: 0, rider: 0 };
        renderQuestion();
    });

    actions.append(more, again);
    wrap.append(eyebrow, title, text, actions);
    quizBody.appendChild(wrap);
}

renderQuestion();

/* =========================================================
   DESAFIO: LINK E QR CODE
   ========================================================= */
document.getElementById("ahaslidesButton").href = AHASLIDES_URL;

(function loadQr() {
    const area = document.getElementById("qrArea");
    const img = new Image();
    img.alt = "Código QR para o desafio no AhaSlides";
    img.src = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&data=" + encodeURIComponent(AHASLIDES_URL);
    // Só substitui o texto se a imagem carregar; senão fica o placeholder com o link
    img.onload = () => {
        area.textContent = "";
        area.appendChild(img);
    };
})();

/* =========================================================
   HERO: CONTADORES
   ========================================================= */
document.querySelectorAll("[data-count]").forEach(el => {
    const target = Number(el.dataset.count);
    if (reduceMotion || target < 1) return;
    let n = 0;
    el.textContent = "00";
    const timer = setInterval(() => {
        n++;
        el.textContent = String(n).padStart(2, "0");
        if (n >= target) clearInterval(timer);
    }, 350);
});
