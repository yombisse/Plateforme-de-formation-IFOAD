function afficherContenu(id) {
  try {
    // 1. Cacher toutes les sections de contenu
    document.querySelectorAll(".contenu-section").forEach(section => {
      section.classList.add('d-none');
    });

    // 2. Trouver la section demandée
    const section = document.getElementById(id);
    if (!section) {
      console.error('Section non trouvée:', id);
      return;
    }

    // 3. Cloner le contenu pour éviter les problèmes de référence
    const content = section.cloneNode(true).innerHTML;

    // 4. Injecter le contenu dans le modal
    const placeholder = document.getElementById('content-placeholder');
    if (placeholder) {
      placeholder.innerHTML = content;
      
      // 5. Afficher le modal
      const modalElement = document.getElementById('content-window');
      if (modalElement) {
        // Fermer d'abord tout modal existant
        const existingModal = bootstrap.Modal.getInstance(modalElement);
        if (existingModal) {
          existingModal.hide();
        }
        
        // Créer une nouvelle instance
        const modal = new bootstrap.Modal(modalElement, {
          backdrop: 'static', // Empêche la fermeture en cliquant à l'extérieur
          keyboard: false     // Empêche la fermeture avec la touche ESC
        });
        modal.show();
      }
    }
  } catch (error) {
    console.error('Erreur dans afficherContenu:', error);
    // Afficher un message d'erreur dans le modal si possible
    const placeholder = document.getElementById('content-placeholder');
    if (placeholder) {
      placeholder.innerHTML = '<p class="text-danger">Une erreur est survenue lors du chargement du contenu.</p>';
    }
  }
}

function fermerContenu() {
  try {
    const modalElement = document.getElementById('content-window');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modal.hide();
      
      // Optionnel: Vider le contenu après l'animation de fermeture
      setTimeout(() => {
        const placeholder = document.getElementById('content-placeholder');
        if (placeholder) placeholder.innerHTML = '';
      }, 300); // Correspond à la durée de l'animation de fermeture
    }
  } catch (error) {
    console.error('Erreur dans fermerContenu:', error);
  }
}