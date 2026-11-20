console.log("script loaded");
const form = document.getElementById("registration-form");
const message = document.getElementById("form-message");
const WEBHOOK_URL = 'https://n8n-pi1.primepath.digital/webhook-test/09dd2692-cb80-4779-9ee3-3592a8671cce';
const fileInput = document.getElementById("files");
const filePickerHelp = document.getElementById("file-picker-help");

if (fileInput && filePickerHelp) fileInput.addEventListener("change", function () {
    const fileCount = fileInput.files.length;
    filePickerHelp.textContent = fileCount
        ? fileCount + (fileCount === 1 ? " file selected" : " files selected")
        : "Select one or more files from your device";
});

if (form && message) form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(form);

    if (form.dataset.formType === "upload") {
        const files = formData.getAll("files");

        if (!files.length || !(files[0] instanceof File) || !files[0].name) {
            message.style.color = "#f87171";
            message.textContent = "Select at least one file to upload.";
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;
        message.style.color = "#9ca3af";
        message.textContent = "Uploading files...";

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Webhook returned HTTP " + response.status);
            }

            message.style.color = "#6ee7b7";
            message.textContent = "Files uploaded successfully.";
            form.reset();
        } catch (error) {
            console.error("File upload failed:", error);
            message.style.color = "#f87171";
            message.textContent = "Files could not be uploaded. Please try again.";
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
        return;
    }

    const data = Object.fromEntries(formData);
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
