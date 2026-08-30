const signupForm = document.getElementById("signupForm");

(async () => {
    const { data } = await db.auth.getSession();

    if (data.session) {
        location.href = "index.html";
    }
})();

signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nickname = document.getElementById("nickname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const passwordCheck = document.getElementById("passwordCheck").value;

    if (!nickname) {
        alert("닉네임을 입력해주세요.");
        return;
    }

    if (password.length < 6) {
        alert("비밀번호는 6자 이상이어야 합니다.");
        return;
    }

    if (password !== passwordCheck) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }
alert("회원가입 시작");
    const { error } = await db.auth.signUp({
        email,
        password,
        options: {
            data: {
                nickname: nickname
            }
        }
    });
alert("signUp 실행");
    if (error) {
        alert(error.message);
        return;
    }

    alert("회원가입이 완료되었습니다.");

    location.href = "login.html";

});
