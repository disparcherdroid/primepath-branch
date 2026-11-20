console.log("script loaded");
const form = document.getElementById("registration-form");
const message = document.getElementById("form-message");
const WEBHOOK_URL = 'https://n8n-pi1.primepath.digital/webhook-test/09dd2692-cb80-4779-9ee3-3592a8671cce';

if (form && message) form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const name = data.fullName.trim();

    if (!/^[\p{L}][\p{L} .'-]+$/u.test(name)) {
        message.style.color = "#f87171";
        message.textContent = "Enter a valid name (letters only, at least 2 characters).";
        return;
    }

    if (!/^09\d{9}$/.test(data.phone)) {
        message.style.color = "#f87171";
        message.textContent = "Enter an 11-digit mobile number starting with 09.";
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const chosenDate = new Date(data.preferredDate + "T00:00:00");

    if (chosenDate < today) {
        message.style.color = "#f87171";
        message.textContent = "Choose today or a future date.";
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    message.style.color = "#9ca3af";
    message.textContent = "Submitting registration...";

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Webhook returned HTTP " + response.status);
        }

        message.style.color = "#6ee7b7";
        message.textContent = "Registered successfully, " + name + "!";
        form.reset();
    } catch (error) {
        console.error("Registration submission failed:", error);
        message.style.color = "#f87171";
        message.textContent = "Registration could not be submitted. Please try again.";
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
});
