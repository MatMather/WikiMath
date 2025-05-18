function inserir(simbolo) {
  document.getElementById('termo').value += simbolo;
}

function buscar() {
  const termo = document.getElementById('termo').value;
  if (!termo.trim()) return;

  fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(termo)}`)
    .then(response => response.json())
    .then(data => {
      const resultado = document.getElementById('resultado');
      if (data.extract) {
        resultado.innerHTML = `<h2>${data.title}</h2><p>${data.extract}</p>`;
        falar(data.extract);
        adicionarHistorico(termo);
      } else {
        resultado.innerHTML = `<p>Nenhuma explicação encontrada.</p>`;
      }
    })
    .catch(() => {
      document.getElementById('resultado').innerHTML = `<p>Erro ao buscar informação.</p>`;
    });
}

function falar(texto) {
  pararFala();
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'pt-BR';
  window.speechSynthesis.speak(utterance);
}

function pararFala() {
  window.speechSynthesis.cancel();
}

function adicionarHistorico(termo) {
  const historico = JSON.parse(localStorage.getItem('wikimathHistorico')) || [];
  if (!historico.includes(termo)) {
    historico.unshift(termo);
    localStorage.setItem('wikimathHistorico', JSON.stringify(historico));
  }
  atualizarHistorico();
}

function atualizarHistorico() {
  const lista = document.getElementById('listaHistorico');
  lista.innerHTML = '';
  const historico = JSON.parse(localStorage.getItem('wikimathHistorico')) || [];
  historico.forEach(termo => {
    const item = document.createElement('li');
    item.textContent = termo;
    item.onclick = () => {
      document.getElementById('termo').value = termo;
      buscar();
    };
    lista.appendChild(item);
  });
}

window.onload = atualizarHistorico;
