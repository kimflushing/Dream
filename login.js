const loginForm = document.getElementById("loginForm");

loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        alert("로그인 시작");

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert("에러: " + error.message);
            return;
        }

        alert("로그인 성공!");

        location.href = "index.html";

    } catch (err) {
        alert("오류: " + err.message);
    }
});