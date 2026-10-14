
(() => {
  const banner = document.getElementById("cookie-banner");
  const acceptButton = document.getElementById("cookie-accept");
  const rejectButton = document.getElementById("cookie-reject");

  if (!banner || !acceptButton || !rejectButton) {
    console.error("Cookiebanner: vereiste HTML-elementen ontbreken.");
    return;
  }

  let initialized = false;
  let attempts = 0;
  const maxAttempts = 80;
  const retryDelay = 250;

  function initializeConsent() {
    if (initialized) return;

    // Wacht tot de echte PostHog-bibliotheek geladen is.
    if (
      !window.posthog ||
      window.posthog.__loaded !== true ||
      typeof window.posthog.get_explicit_consent_status !== "function"
    ) {
      return;
    }

    let status;

    try {
      status = window.posthog.get_explicit_consent_status();
    } catch (error) {
      console.error("PostHog-consentstatus kon niet worden gelezen.", error);
      return;
    }

    if (!["pending", "granted", "denied"].includes(status)) {
      console.warn("Onbekende PostHog-consentstatus:", status);
      return;
    }

    initialized = true;
    banner.hidden = status !== "pending";
  }

  function waitForPostHog() {
    initializeConsent();

    if (initialized) return;

    attempts += 1;

    if (attempts < maxAttempts) {
      window.setTimeout(waitForPostHog, retryDelay);
    } else {
      // Geen bevestigde toestemming? Toon de banner.
      banner.hidden = false;
      console.error(
        "PostHog is niet tijdig geladen. De cookiebanner blijft zichtbaar."
      );
    }
  }

  acceptButton.addEventListener("click", () => {
    if (
      !window.posthog ||
      window.posthog.__loaded !== true ||
      typeof window.posthog.opt_in_capturing !== "function"
    ) {
      banner.hidden = false;
      return;
    }

    window.posthog.opt_in_capturing();
    banner.hidden = true;
  });

  rejectButton.addEventListener("click", () => {
    if (
      !window.posthog ||
      window.posthog.__loaded !== true ||
      typeof window.posthog.opt_out_capturing !== "function"
    ) {
      banner.hidden = false;
      return;
    }

    window.posthog.opt_out_capturing();
    banner.hidden = true;
  });

  waitForPostHog();
})();
