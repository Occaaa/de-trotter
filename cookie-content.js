const banner = document.getElementById("cookie-banner");
const acceptButton = document.getElementById("cookie-accept");
const rejectButton = document.getElementById("cookie-reject");

function updateCookiebanner() {
  if (typeof posthog === "undefined") return;
  const status = posthog.get_explicit_consent_status();
  banner.hidden = status !== "pending";
}

acceptButton.addEventListener("click", function () {
  posthog.opt_in_capturing();
  banner.hidden = true;
});

rejectButton.addEventListener("click", function () {
  posthog.opt_out_capturing();
  banner.hidden = true;
});

let attempts = 0;
const maxAttempts = 20;

function retryCookiebanner() {
  attempts++;

  if (typeof posthog !== "undefined") {
    updateCookiebanner();
    return;
  }

  if (attempts < maxAttempts) {
    setTimeout(retryCookiebanner, 250);
  } else {
    // PostHog is niet op tijd geladen.
    // Toon de banner als terugvaloptie.
    banner.hidden = false;
  }
}

retryCookiebanner();
