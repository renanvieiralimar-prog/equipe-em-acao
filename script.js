let dadosDoJogo = {};
let equipeSelecionada = []; // Agora vai guardar os objetos completos dos profissionais selecionados

async function iniciarJogo() {
    try {
        const resposta = await fetch('dados.json');
        dadosDoJogo = await resposta.json();
        console.log("Banco de dados JSON sincronizado com sucesso!");
    } catch (erro) {
        console.error("Erro ao carregar o JSON:", erro);
    }
}

function proximoCaso() {
    if (!dadosDoJogo.casosClinicos) return;

    // Como agora focamos apenas em um caso fixo, pegamos o índice 0
    const caso = dadosDoJogo.casosClinicos[0];

    document.getElementById("caso-titulo").innerText = caso.titulo;
    document.getElementById("caso-descricao").innerText = caso.descricao;
    document.getElementById("caso-nivel").innerText = "Complexidade: " + caso.nivel;

    // Reseta estados
    document.getElementById("desafio-texto").innerText = "";
    equipeSelecionada = [];
    document.getElementById("detalhes-funcoes").innerHTML = "<i>Nenhum profissional selecionado ainda.</i>";

    renderizarProfissionais();
}

function renderizarProfissionais() {
    const container = document.getElementById("lista-profissionais");
    container.innerHTML = "";

    dadosDoJogo.profissionais.forEach(prof => {
        const botao = document.createElement("button");
        botao.className = "btn";
        botao.innerText = prof.nome;
        botao.onclick = () => alternarProfissional(prof, botao);
        container.appendChild(botao);
    });
}

function alternarProfissional(prof, botao) {
    // Procura se o profissional já está na lista buscando pelo nome
    const index = equipeSelecionada.findIndex(item => item.nome === prof.nome);

    if (index === -1) {
        // Adiciona à equipe
        equipeSelecionada.push(prof);
        botao.style.backgroundColor = "#ffca28";
        botao.style.color = "#000";
        botao.style.fontWeight = "bold";
    } else {
        // Remove da equipe
        equipeSelecionada.splice(index, 1);
        botao.style.backgroundColor = "#007acc";
        botao.style.color = "#fff";
        botao.style.fontWeight = "normal";
    }

    atualizarPainelDescricoes();
}

function atualizarPainelDescricoes() {
    const containerAbas = document.getElementById("detalhes-funcoes");

    if (equipeSelecionada.length === 0) {
        containerAbas.innerHTML = "<i>Nenhum profissional selecionado ainda.</i>";
        return;
    }

    containerAbas.innerHTML = ""; // Limpa o painel

    // Renderiza o nome do profissional e a atribuição dele na caixa de texto
    equipeSelecionada.forEach(prof => {
        const divItem = document.createElement("div");
        divItem.className = "item-funcao";
        divItem.innerHTML = `<strong>📍 ${prof.nome}:</strong> ${prof.funcao}`;
        containerAbas.appendChild(divItem);
    });
}

function introduzirDesafio() {
    if (document.getElementById("caso-titulo").innerText.includes("Clique no botão")) {
        alert("Por favor, inicie o caso clínico primeiro!");
        return;
    }
    const indiceAleatorio = Math.floor(Math.random() * dadosDoJogo.desafios.length);
    document.getElementById("desafio-texto").innerText = "🚨 ALERTA: " + dadosDoJogo.desafios[indiceAleatorio];
}

window.onload = iniciarJogo;