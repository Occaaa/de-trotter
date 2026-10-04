document.addEventListener("DOMContentLoaded", () => {
  const floatingBtn = document.querySelector('.inschrijven-a.header');
  const wandelingSec = document.getElementById('wandeling');
  const footerSec = document.getElementById('footer');

  if (floatingBtn && wandelingSec && footerSec) {
    function updateButtonVisibility() {
      const wandelingRect = wandelingSec.getBoundingClientRect();
      const footerRect = footerSec.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Zichtbaar zodra #wandeling in de buurt/in beeld komt
      const isPastWandeling = wandelingRect.top <= (windowHeight * 0.8);

      // Blijft zichtbaar totdat de bovenkant van de footer de top van het scherm bereikt (~100px waar de knop hangt)
      // Dus NIET al wanneer de footer onderaan het scherm verschijnt!
      const isBeforeFooter = footerRect.top > 100;

      if (isPastWandeling && isBeforeFooter) {
        floatingBtn.classList.add('is-visible');
      } else {
        floatingBtn.classList.remove('is-visible');
      }
    }

    window.addEventListener('scroll', updateButtonVisibility, { passive: true });
    window.addEventListener('resize', updateButtonVisibility);
    updateButtonVisibility();
  }
});



const targetDate = new Date(Date.UTC(2027, 0, 17, 11, 0, 0)); // 12u00 Belgische wintertijd
let reloadStarted = false;

function updateCountdown() {
    const now = new Date();

    if (now >= targetDate) {
        document.getElementById("countdown").textContent =
            "De Trotter II kan elk moment onthuld worden...";

        if (!reloadStarted) {
            reloadStarted = true;
            setTimeout(() => {
                location.reload();
            }, 5 * 60 * 1000);
        }

        return;
    }

    // 1. Berekening van volledige maanden
    let tempDate = new Date(now);
    let months = 0;

    while (true) {
        let nextMonth = new Date(tempDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        if (nextMonth <= targetDate) {
            months++;
            tempDate = nextMonth;
        } else {
            break;
        }
    }

    // 2. Resterende tijd na aftrek van de maanden
    let difference = targetDate.getTime() - tempDate.getTime();

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    
    // Meervoud/enkelvoud spelling
    const monthsText = months === 1 ? "maand" : "maanden";
    const daysText = days === 1 ? "dag" : "dagen";
    const minutesText = minutes === 1 ? "minuut" : "minuten";

    // Dynamic HTML output
    document.getElementById("countdown").innerHTML = `
        <h4>
            Onthulling in
            <span>${months}</span> ${monthsText},
            <span>${days}</span> ${daysText},
            <span>${hours}</span> uur,
            <span>${minutes}</span> ${minutesText}
        </h4>
    `;
}

updateCountdown();
setInterval(updateCountdown, 1000);
