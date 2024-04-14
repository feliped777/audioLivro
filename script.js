let utterance; // Variável global para armazenar a instância de SpeechSynthesisUtterance
let playbackPosition = 0; // Variável para armazenar a posição de reprodução atual

document.getElementById('pdfInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const fileReader = new FileReader();
    fileReader.onload = function() {
      const typedarray = new Uint8Array(this.result);
      // Carregar PDF
      pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
        // Extrair texto do PDF
        let textoPDF = '';
        const totalPaginas = pdf.numPages;
        for (let i = 1; i <= totalPaginas; i++) {
          pdf.getPage(i).then(function(pagina) {
            pagina.getTextContent().then(function(textContent) {
              textContent.items.forEach(function(textItem) {
                textoPDF += textItem.str + ' ';
              });
            }).then(function() {
              // Após extrair todo o texto, configurar o evento de reprodução de áudio
              document.getElementById('playButton').addEventListener('click', function() {
                if (textoPDF) {
                  utterance = new SpeechSynthesisUtterance(textoPDF);
                  utterance.onpause = function() {
                    playbackPosition = speechSynthesis.paused ? utterance.resumeTime : utterance.startTime;
                  };
                  speechSynthesis.speak(utterance);
                  document.getElementById('audioPlayer').style.display = 'block';
                }
              });
              // Configurar evento de pausa
              document.getElementById('pauseButton').addEventListener('click', function() {
                if (utterance && speechSynthesis.speaking) {
                  speechSynthesis.pause();
                  // Salvar a posição de reprodução atual no armazenamento local
                  localStorage.setItem('playbackPosition', utterance.resumeTime.toString());
                }
              });
              // Configurar evento de retomada
              document.getElementById('resumeButton').addEventListener('click', function() {
                if (utterance && speechSynthesis.paused) {
                  // Verificar se há uma posição de reprodução armazenada no armazenamento local
                  const savedPosition = localStorage.getItem('playbackPosition');
                  if (savedPosition) {
                    // Usar a posição armazenada
                    utterance.resumeTime = parseFloat(savedPosition);
                  }
                  speechSynthesis.resume();
                }
              });
            });
          });
        }
      });
    };
    fileReader.readAsArrayBuffer(file);
  }
});

// Avançar na reprodução
document.getElementById('forwardButton').addEventListener('click', function() {
  if (utterance && speechSynthesis.speaking) {
    utterance.resumeTime += 10; // Avança 10 segundos
  }
});

// Retroceder na reprodução
document.getElementById('backwardButton').addEventListener('click', function() {
  if (utterance && speechSynthesis.speaking) {
    utterance.resumeTime -= 10; // Retrocede 10 segundos
  }
});

// Verificar se há uma posição de reprodução armazenada no armazenamento local ao carregar a página
window.addEventListener('load', function() {
  const savedPosition = localStorage.getItem('playbackPosition');
  if (savedPosition) {
    playbackPosition = parseFloat(savedPosition);
  }
});

document.getElementById('pdfInput').addEventListener('change', function(event) {
  // Resto do código permanece igual...
});

// Evento de pausa
document.getElementById('pauseButton').addEventListener('click', function() {
  if (utterance && speechSynthesis.speaking) {
    speechSynthesis.pause();
    // Salvar a posição de reprodução atual no armazenamento local
    localStorage.setItem('playbackPosition', utterance.resumeTime.toString());
  }
});

// Evento de retomada
document.getElementById('resumeButton').addEventListener('click', function() {
  if (utterance && speechSynthesis.paused) {
    // Verificar se há uma posição de reprodução armazenada no armazenamento local
    const savedPosition = localStorage.getItem('playbackPosition');
    if (savedPosition) {
      // Usar a posição armazenada
      utterance.resumeTime = parseFloat(savedPosition);
    }
    speechSynthesis.resume();
  }
});

document.getElementById('forwardButton').addEventListener('click', function() {
    if (utterance && speechSynthesis.speaking) {
      utterance.resumeTime += 10; // Avança 10 segundos
      // Salvar a posição de reprodução atual no armazenamento local
      localStorage.setItem('playbackPosition', utterance.resumeTime.toString());
    }
  });
  
  document.getElementById('backwardButton').addEventListener('click', function() {
    if (utterance && speechSynthesis.speaking) {
      utterance.resumeTime -= 10; // Retrocede 10 segundos
      // Salvar a posição de reprodução atual no armazenamento local
      localStorage.setItem('playbackPosition', utterance.resumeTime.toString());
    }
  });
  
