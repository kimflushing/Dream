// ==========================
// 로그인
// ==========================

const loginForm = document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const email=document.getElementById("email").value.trim();

const password=document.getElementById("password").value;

const {error}=await supabase.auth.signInWithPassword({

email,
password

});

if(error){

alert(error.message);
return;

}

// 성공 애니메이션

document.querySelector(".loginCard").classList.add("loginSuccess");

document.querySelector("button").classList.add("success");

setTimeout(()=>{

location.href="index.html";

},900);

});

}



// ==========================
// 회원가입
// ==========================

const signupForm=document.getElementById("signupForm");

if(signupForm){

signupForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const nickname=document.getElementById("nickname").value.trim();

const email=document.getElementById("email").value.trim();

const password=document.getElementById("password").value;

const passwordCheck=document.getElementById("passwordCheck").value;

if(password!==passwordCheck){

alert("비밀번호가 일치하지 않습니다.");

return;

}

const {error}=await supabase.auth.signUp({

email,

password,

options:{

data:{

nickname

}

}

});

if(error){

alert(error.message);

return;

}

alert("회원가입이 완료되었습니다.\n이메일 인증 후 로그인해주세요.");

location.href="login.html";

});

}