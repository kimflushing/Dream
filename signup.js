// =========================
// Dream Archive Signup
// =========================

// 이미 로그인되어 있으면 메인으로 이동
(async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
        location.href = "index.html";
    }
})();

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nickname = document.getElementById("nickname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const passwordCheck = document.getElementById("passwordCheck").value;

    const button = signupForm.querySelector("button");

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

    button.disabled = true;
    button.textContent = "가입 중...";

    try {
        alert("회원가입 시작");
        
        alert("signUp 실행");

        const { error } = await supabase.auth.signUp({

            email,
            password,

            options: {

                data: {

                    nickname: nickname

                }

            }

        });
alert("signUp 완료");
        if (error) {

            alert(error.message);

            button.disabled = false;
            button.textContent = "회원가입";

            return;

        }

        alert(
`회원가입이 완료되었습니다!

이메일 인증 후 로그인해주세요.`
        );

        location.href = "login.html";

    } catch (err) {

        alert(err.message);

        button.disabled = false;
        button.textContent = "회원가입";

    }

});