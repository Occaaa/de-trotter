//INSCHRIJVINGSKNOP
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



//AUTOMATISCHE SPONSORS
const CLOUD_NAME = "pc9fhedb";
const SPONSOR_TAG = "trotter_sponsor";
const sponsorBalk = document.getElementById("sponsorbalk");

async function laadSponsors() {
    if (!sponsorBalk) {
        console.error("De sponsorbalk werd niet gevonden.");
        return;
    }

    try {
        // Haal de sponsorlogo's op uit Cloudinary
        const response = await fetch(
            `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${SPONSOR_TAG}.json`
        );
        if (!response.ok) {
            throw new Error(`Cloudinary fout: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data.resources)) {
            throw new Error("Ongeldige gegevens ontvangen van Cloudinary.");
        }
        const sponsors = data.resources;

        // Verwijder de laadmelding
        const laadMelding = sponsorBalk.querySelector(".sponsor-loading");
        if (laadMelding) {
            laadMelding.remove();
        }

        // Controleer of er sponsors zijn
        if (sponsors.length === 0) {
            sponsorBalk.append("Er zijn momenteel geen sponsors.");
            return;
        }

        // Sorteer op Public ID (bijvoorbeeld 01_, 02_, 10_)
        sponsors.sort((a, b) =>
            a.public_id.localeCompare(b.public_id, undefined, {
                numeric: true,
                sensitivity: "base"
            })
        );

        // Voeg elk sponsorlogo toe
        sponsors.forEach(sponsor => {
            const afbeelding = document.createElement("img");
            afbeelding.src =
                `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${sponsor.public_id}.${sponsor.format}`;
            afbeelding.alt = 
                sponsor.public_id
                    .replace(/^\d+_/, "")
                    .replace(/[_-]/g, " ") + " - sponsor van De Trotter";

            afbeelding.loading = "lazy";
            afbeelding.decoding = "async";

            // Haal de website op uit de Cloudinary-metadata

            const website = sponsor.context?.custom?.website?.trim();

            // Controleer of het websiteadres geldig is
            let geldigeWebsite = null;
            if (website) {
                try {
                    const url = new URL(website);

                    if (url.protocol === "https:" || url.protocol === "http:") {
                        geldigeWebsite = url.href;
                    }
                } catch (error) {
                    console.warn(
                        `Ongeldig websiteadres voor ${sponsor.public_id}:`,
                        website
                    );
                }
            }

            // Maak het logo klikbaar als er een website is
            if (geldigeWebsite) {
                const link = document.createElement("a");
                link.href = geldigeWebsite;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.setAttribute(
                    "aria-label",
                    `Bezoek de website van ${afbeelding.alt}`
                );
                link.appendChild(afbeelding);
                sponsorBalk.appendChild(link);
            } else {
                // Geen website ingevuld: toon enkel het logo
                sponsorBalk.appendChild(afbeelding);
            }
        });

    } catch (error) {
        console.error("Sponsors konden niet geladen worden:", error);
        const laadMelding = sponsorBalk.querySelector(".sponsor-loading");
        if (laadMelding) {
            laadMelding.textContent =
                "De sponsorlogo's konden momenteel niet geladen worden.";
        }
    }
}

// Start het laden van de sponsors
laadSponsors();




//COUNTDOWN
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
