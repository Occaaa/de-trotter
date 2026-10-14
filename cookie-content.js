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

acceptButton.addEventListener("click", function () {
  posthog.opt_out_capturing();
  banner.hidden = true;
});

updateCookiebanner();