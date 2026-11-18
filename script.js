console.log("script loaded");
const form = document.getElementById("registration-form");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const data = new FormData(form);
    console.log(Object.fromEntries(data));
});