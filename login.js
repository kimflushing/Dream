// =========================
// Dream Archive Login
// =========================

// 이미 로그인되어 있으면 메인으로 이동
(async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
        location.href = "index.html";
    }
})();

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const button = loginForm.querySelector("button");

    if (!email || !password) {
        alert("이메일과 비밀번호를 입력해주세요.");
        return;
    }

    button.disabled = true;
    button.textContent = "로그인 중...";

    try {

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert(error.message);

            button.disabled = false;
            button.textContent = "로그인";

            return;
        }

        button.textContent = "로그인 성공!";

        setTimeout(() => {
            location.href = "index.html";
        }, 700);

    } catch (err) {

        alert(err.message);

        button.disabled = false;
        button.textContent = "로그인";

    }

});