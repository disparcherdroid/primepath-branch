console.log("script loaded");
const form = document.getElementById("registration-form");
const message = document.getElementById("form-message");

form.addEventListener("submit", function (event) {
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

    saveRecord("registrations", data);

    message.style.color = "#6ee7b7";
    message.textContent = "Registered successfully, " + name + "!";
    form.reset();
});
