document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const modal = document.getElementById('eventModal');
  const eventNameInput = document.getElementById('eventName');
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const saveEventBtn = document.getElementById('saveEventBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    selectable: true,
    events: '/events',
    select: function (info) {
      // Affiche la popup
      modal.style.display = 'block';

      // Définit les dates de début et de fin dans le formulaire
      startDateInput.value = info.startStr;
      endDateInput.value = info.endStr; 
      eventNameInput.value = '';
      eventNameInput.focus();

      // Sauvegarde de l'événement
      saveEventBtn.onclick = function () {
        const eventName = eventNameInput.value;
        if (eventName) {
          // Ajoute l'événement au calendrier
          calendar.addEvent({
            title: eventName,
            start: startDateInput.value,
            end: endDateInput.value,
          });

          // Envoie l'événement au serveur
          fetch('/addEvent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: eventName,
              start: startDateInput.value,
              end: endDateInput.value,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log('Event saved:', data);
              modal.style.display = 'none'; // Ferme la popup
            })
            .catch((error) => {
              console.error('Error saving event:', error);
              alert('Une erreur est survenue lors de l\'enregistrement.');
            });
        } else {
          alert('Veuillez entrer un nom pour l\'événement.');
        }
      };
    },
  });

  // Fermer la popup
  closeModalBtn.onclick = function () {
    modal.style.display = 'none';
  };

  calendar.render();
});
