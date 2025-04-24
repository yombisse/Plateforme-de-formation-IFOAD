// Charger un composant HTML dans une cible spécifique
/**
 * Charge un composant HTML dans un élément cible
 * @param {string} fichier - Chemin vers le fichier HTML à charger
 * @param {string} idCible - ID de l'élément où insérer le contenu
 * @param {function} callback - Fonction à exécuter après le chargement
 */
function chargerComposant(fichier, idCible, callback = null) {
  fetch(fichier)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erreur ${response.status} lors du chargement de ${fichier}`);
      }
      return response.text();
    })
    .then(html => {
      const cible = document.getElementById(idCible);
      if (!cible) {
        throw new Error(`Élément cible #${idCible} non trouvé`);
      }
      
      cible.innerHTML = html;
      
      // Exécute le callback si fourni
      if (typeof callback === 'function') {
        try {
          callback();
        } catch (e) {
          console.error('Erreur dans le callback:', e);
        }
      }
    })
    .catch(error => {
      console.error('Erreur de chargement:', error);
      const cible = document.getElementById(idCible);
      if (cible) {
        cible.innerHTML = `<div class="alert alert-danger">Erreur de chargement: ${error.message}</div>`;
      }
    });
}

/**
 * Affiche le contenu d'une section dans la fenêtre modale
 * @param {string} id - ID de la section à afficher
 */
function afficherContenu(id) {
  // Masquer toutes les sections
  document.querySelectorAll('.contenu-section').forEach(section => {
    section.classList.add('d-none');
  });

  // Trouver et afficher la section demandée
  const section = document.getElementById(id);
  if (!section) {
    console.error(`Section #${id} non trouvée`);
    return;
  }

  // Cloner le contenu pour éviter les problèmes de référence
  const contenu = section.cloneNode(true);
  contenu.classList.remove('d-none');

  // Injecter dans le modal
  const placeholder = document.getElementById('content-placeholder');
  if (placeholder) {
    placeholder.innerHTML = '';
    placeholder.appendChild(contenu);

    // Afficher le modal Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('content-window'), {
      backdrop: 'static',
      keyboard: false
    });
    modal.show();
  }
}

/**
 * Ferme la fenêtre modale
 */
function fermerContenu() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('content-window'));
  if (modal) {
    modal.hide();
  }
  
  // Optionnel: Vider le contenu après un délai
  setTimeout(() => {
    const placeholder = document.getElementById('content-placeholder');
    if (placeholder) placeholder.innerHTML = '';
  }, 300);
}

// Chargement initial des composants
document.addEventListener('DOMContentLoaded', () => {
  // Charger la navbar puis main.js
  chargerComposant('navbar.html', 'navbar-placeholder', () => {
    const script = document.createElement('script');
    script.src = 'main.js';
    script.onerror = () => console.error('Erreur de chargement de main.js');
    document.body.appendChild(script);
  });

  // Charger les autres composants
  chargerComposant('footer.html', 'footer-placeholder');
  chargerComposant('sidebar.html', 'sidebar-placeholder');

  // Exposer les fonctions globalement
  window.afficherContenu = afficherContenu;
  window.fermerContenu = fermerContenu;
});

  // Fonction pour afficher l'heure en temps réel
  function GetTime() {
    const time = new Date();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    const heureElement = document.getElementById('heure');
    if (heureElement) {
      heureElement.value = `${hours}:${minutes}:${seconds}`;
    }

    setTimeout(GetTime, 1000);
  }

  // Initialiser l'heure
  GetTime();


 // Variables globales
 let currentInput = '0';
 let calculationHistory = [];
 let lastResult = null;
 
 // Fonctions de base
 function updateDisplay() {
   document.getElementById('display').textContent = currentInput;
 }
 
 function addToDisplay(value) {
   if (currentInput === '0' && value !== '.') {
     currentInput = value;
   } else {
     currentInput += value;
   }
   updateDisplay();
 }
 
 function clearDisplay() {
   currentInput = '0';
   updateDisplay();
 }
 
 function backspace() {
   if (currentInput.length === 1) {
     currentInput = '0';
   } else {
     currentInput = currentInput.slice(0, -1);
   }
   updateDisplay();
 }
 
 // Fonctions scientifiques
 function squareRoot() {
   try {
     const num = parseFloat(currentInput);
     if (num < 0) {
       currentInput = 'Erreur: √ négatif';
       updateDisplay();
       setTimeout(clearDisplay, 1500);
       return;
     }
     const result = Math.sqrt(num);
     addToHistory(`√(${num})`, result);
     currentInput = formatResult(result);
     updateDisplay();
   } catch (error) {
     showError();
   }
 }
 
 function power() {
   try {
     const base = parseFloat(currentInput);
     currentInput = `${base}^`;
     updateDisplay();
     const exponent = prompt("Entrez l'exposant:", "2");
     if (exponent !== null) {
       const expNum = parseFloat(exponent);
       const result = Math.pow(base, expNum);
       addToHistory(`${base}^${expNum}`, result);
       currentInput = formatResult(result);
       updateDisplay();
     }
   } catch (error) {
     showError();
   }
 }
 
 function sin() {
   try {
     const num = parseFloat(currentInput);
     const result = Math.sin(num);
     addToHistory(`sin(${num})`, result);
     currentInput = formatResult(result);
     updateDisplay();
   } catch (error) {
     showError();
   }
 }
 
 function cos() {
   try {
     const num = parseFloat(currentInput);
     const result = Math.cos(num);
     addToHistory(`cos(${num})`, result);
     currentInput = formatResult(result);
     updateDisplay();
   } catch (error) {
     showError();
   }
 }
 
 function tan() {
   try {
     const num = parseFloat(currentInput);
     const result = Math.tan(num);
     addToHistory(`tan(${num})`, result);
     currentInput = formatResult(result);
     updateDisplay();
   } catch (error) {
     showError();
   }
 }
 
 function log() {
   try {
     const num = parseFloat(currentInput);
     if (num <= 0) {
       currentInput = 'Erreur: log ≤ 0';
       updateDisplay();
       setTimeout(clearDisplay, 1500);
       return;
     }
     const result = Math.log10(num);
     addToHistory(`log(${num})`, result);
     currentInput = formatResult(result);
     updateDisplay();
   } catch (error) {
     showError();
   }
 }
 
 function ln() {
   try {
     const num = parseFloat(currentInput);
     if (num <= 0) {
       currentInput = 'Erreur: ln ≤ 0';
       updateDisplay();
       setTimeout(clearDisplay, 1500);
       return;
     }
     const result = Math.log(num);
     addToHistory(`ln(${num})`, result);
     currentInput = formatResult(result);
     updateDisplay();
   } catch (error) {
     showError();
   }
 }
 
 function factorial() {
   try {
     const num = parseInt(currentInput);
     if (num < 0) {
       currentInput = 'Erreur: x! négatif';
       updateDisplay();
       setTimeout(clearDisplay, 1500);
       return;
     }
     if (num > 170) {
       currentInput = 'Trop grand';
       updateDisplay();
       setTimeout(clearDisplay, 1500);
       return;
     }
     let result = 1;
     for (let i = 2; i <= num; i++) {
       result *= i;
     }
     addToHistory(`${num}!`, result);
     currentInput = formatResult(result);
     updateDisplay();
   } catch (error) {
     showError();
   }
 }
 
 function addPi() {
   currentInput = currentInput === '0' ? Math.PI.toString() : currentInput + Math.PI.toString();
   updateDisplay();
 }
 
 function addE() {
   currentInput = currentInput === '0' ? Math.E.toString() : currentInput + Math.E.toString();
   updateDisplay();
 }
 
 // Calcul principal
 function calculate() {
   try {
     // Remplacer les symboles pour l'évaluation
     let expression = currentInput
       .replace(/\^/g, '**')
       .replace(/×/g, '*');
     
     const result = eval(expression);
     addToHistory(currentInput, result);
     currentInput = formatResult(result);
     lastResult = result;
     updateDisplay();
   } catch (error) {
     showError();
   }
 }
 
 // Fonctions utilitaires
 function formatResult(result) {
   // Formater les nombres très grands ou très petits
   if (Math.abs(result) > 1e12 || (Math.abs(result) < 1e-6 && result !== 0)) {
     return result.toExponential(6);
   }
   
   // Formater les nombres décimaux
   const str = result.toString();
   if (str.indexOf('.') !== -1) {
     const decimals = str.split('.')[1];
     if (decimals.length > 6) {
       return result.toFixed(6);
     }
   }
   
   return str;
 }
 
 function showError() {
   currentInput = 'Erreur';
   updateDisplay();
   setTimeout(clearDisplay, 1500);
 }
 
 function addToHistory(expression, result) {
   const historyItem = {
     expression,
     result,
     timestamp: new Date().toLocaleTimeString()
   };
   
   calculationHistory.unshift(historyItem);
   renderHistory();
   
   // Limiter l'historique à 10 éléments
   if (calculationHistory.length > 10) {
     calculationHistory.pop();
   }
 }
 
 function renderHistory() {
   const historyElement = document.getElementById('history');
   historyElement.innerHTML = '';
   
   calculationHistory.forEach(item => {
     const historyItemElement = document.createElement('div');
     historyItemElement.className = 'history-item';
     historyItemElement.innerHTML = `
       <strong>${item.expression}</strong> = ${item.result}
       <small class="text-muted float-end">${item.timestamp}</small>
     `;
     historyElement.appendChild(historyItemElement);
   });
 }
 
 function clearHistory() {
   calculationHistory = [];
   renderHistory();
 }
 
 // Initialisation
 updateDisplay();