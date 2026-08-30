const loginForm = document.getElementById("loginForm");

(async () => {
    const { data } = await db.auth.getSession();

    if (data.session) {
        location.href = "index.html";
    }
})();

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const { error } = await db.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert(error.message);
        return;
    }

    location.href = "index.html";

});