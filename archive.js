// =========================
// Character Archive
// archive.js (1/6)
// =========================

let user = null;
let characters = [];
let currentFilter = "all";

// -------------------------
// 시작
// -------------------------

window.addEventListener("DOMContentLoaded", async () => {

    await checkLogin();

    await loadCharacters();

    bindButtons();

    applyTheme();

});

// -------------------------
// 로그인 확인
// -------------------------

async function checkLogin(){

    const { data, error } = await db.auth.getUser();

    if(error){

        alert(error.message);
        return;

    }

    if(!data.user){

        location.href="login.html";
        return;

    }

    user = data.user;

}

// -------------------------
// 캐릭터 불러오기
// -------------------------

async function loadCharacters(){

    const { data, error } = await db

        .from("dreams")

        .select("*")

        .eq("user_id", user.id)

        .order("created_at",{
            ascending:false
        });

    if(error){

        alert(error.message);
        return;

    }

    characters = data || [];

    renderCharacters();

}
// =========================
// archive.js (2/6)
// 카드 생성
// =========================

// -------------------------
// 카드 출력
// -------------------------

function renderCharacters(){

    const container = document.getElementById("cardContainer");

    container.innerHTML = "";

    let list = characters;

    if(currentFilter !== "all"){

        list = characters.filter(c=>c.type===currentFilter);

    }

    list.forEach(createCard);

}

// -------------------------
// 카드 생성
// -------------------------

function createCard(character){

    const card = document.createElement("div");

    card.className = "characterCard";

    const image = character.image || "default.png";

    const intro = character.intro || "";

    const typeText = getTypeName(character.type);

    const dday = getDDay(character.start_date);

    card.innerHTML = `

<img
class="characterImage"
src="${image}"
onerror="this.src='default.png'">

<div class="characterBody">

<div class="characterType">

${typeText}

</div>

<h2 class="characterName">

${character.name || "이름 없음"}

</h2>

<p class="characterIntro">

${intro}

</p>

<div class="characterBottom">

<span class="dday">

${dday}

</span>

<button
class="shareBtn"
type="button">

🔗

</button>

</div>

</div>

`;

    // 카드 클릭
    card.onclick = ()=>{

        location.href =
        `detail.html?id=${character.id}`;

    };

    // 공유 버튼
    card.querySelector(".shareBtn").onclick=(e)=>{

        e.stopPropagation();

        copyShareLink(character.id);

    };

    document
    .getElementById("cardContainer")
    .appendChild(card);

}

// -------------------------
// 타입 이름
// -------------------------

function getTypeName(type){

    if(type==="dream") return "드림";

    if(type==="pair") return "페어";

    if(type==="oc") return "자캐";

    return "기타";

}

// -------------------------
// D-Day
// -------------------------

function getDDay(date){

    if(!date) return "-";

    const start = new Date(date);

    const today = new Date();

    const diff =
    Math.floor(
        (today-start)/(1000*60*60*24)
    );

    return `D+${diff}`;

}
// =========================
// archive.js (3/6)
// 필터 / 생성 / 모달
// =========================

// -------------------------
// 버튼 연결
// -------------------------

function bindButtons(){

    // 로그아웃
    document.getElementById("logoutBtn").onclick = logout;

    // +
    document.getElementById("addCharacter").onclick = ()=>{

        document
        .getElementById("createModal")
        .classList.add("show");

    };

    // 닫기
    document.getElementById("closeModal").onclick = ()=>{

        document
        .getElementById("createModal")
        .classList.remove("show");

    };

    // 필터
    document.querySelectorAll(".filter").forEach(btn=>{

        btn.onclick=()=>{

            document
            .querySelectorAll(".filter")
            .forEach(b=>b.classList.remove("active"));

            btn.classList.add("active");

            currentFilter=btn.dataset.type;

            renderCharacters();

        };

    });

    // 생성 버튼
    document.querySelectorAll(".createType").forEach(btn=>{

        btn.onclick=()=>{

            createCharacter(btn.dataset.type);

        };

    });

}

// -------------------------
// 새 캐릭터
// -------------------------

async function createCharacter(type){

    const { data, error } = await db

        .from("dreams")

        .insert({

            user_id:user.id,

            type:type,

            name:"새 캐릭터",

            intro:"",

            image:"",

            start_date:null

        })

        .select()

        .single();

    if(error){

        alert(error.message);

        return;

    }

    location.href =
    `detail.html?id=${data.id}`;

}

// -------------------------
// 로그아웃
// -------------------------

async function logout(){

    await db.auth.signOut();

    location.href="login.html";

}
// =========================
// archive.js (4/6)
// 테마
// =========================

// -------------------------
// 테마 버튼
// -------------------------

document.getElementById("themeBtn").onclick = ()=>{

    document
    .getElementById("themeModal")
    .classList.add("show");

};

// -------------------------
// 닫기
// -------------------------

document.getElementById("closeTheme").onclick = ()=>{

    document
    .getElementById("themeModal")
    .classList.remove("show");

};

// -------------------------
// 테마 선택
// -------------------------

document.querySelectorAll(".theme").forEach(btn=>{

    btn.onclick=()=>{

        const theme=btn.dataset.theme;

        localStorage.setItem(
            "archiveTheme",
            theme
        );

        applyTheme();

        document
        .getElementById("themeModal")
        .classList.remove("show");

    };

});

// -------------------------
// 적용
// -------------------------

function applyTheme(){

    const theme=
        localStorage.getItem("archiveTheme")
        ||"pink";

    document.body.className=
        `theme-${theme}`;

}

// -------------------------
// 모달 바깥 클릭
// -------------------------

window.addEventListener("click",(e)=>{

    const create=document.getElementById("createModal");

    const theme=document.getElementById("themeModal");

    if(e.target===create){

        create.classList.remove("show");

    }

    if(e.target===theme){

        theme.classList.remove("show");

    }

});
// =========================
// archive.js (5/6)
// 공유 / Toast / 애니메이션
// =========================

// -------------------------
// 공유 링크
// -------------------------

async function copyShareLink(id){

    const url =
        `${location.origin}${location.pathname.replace("archive.html","")}share.html?id=${id}`;

    try{

        await navigator.clipboard.writeText(url);

        toast("공유 링크가 복사되었습니다.");

    }catch{

        prompt("링크를 복사하세요.",url);

    }

}

// -------------------------
// Toast
// -------------------------

function toast(message){

    let toast=document.getElementById("toast");

    if(!toast){

        toast=document.createElement("div");

        toast.id="toast";

        document.body.appendChild(toast);

    }

    toast.textContent=message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer=setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

// -------------------------
// 카드 등장 애니메이션
// -------------------------

function animateCards(){

    const cards=document.querySelectorAll(".characterCard");

    cards.forEach((card,index)=>{

        card.style.opacity="0";

        card.style.transform="translateY(25px)";

        setTimeout(()=>{

            card.style.transition=".35s";

            card.style.opacity="1";

            card.style.transform="translateY(0)";

        },index*70);

    });

}

// -------------------------
// renderCharacters 교체
// -------------------------

const originalRender = renderCharacters;

renderCharacters = function(){

    originalRender();

    animateCards();

};

// -------------------------
// 첫 실행
// -------------------------

applyTheme();

renderCharacters();
// =========================
// archive.js (6/6)
// 최종 마무리
// =========================

// -------------------------
// Realtime
// -------------------------

db.channel("archive")

.on(

"postgres_changes",

{

event:"*",

schema:"public",

table:"dreams"

},

()=>{

    loadCharacters();

}

)

.subscribe();

// -------------------------
// 이미지 오류
// -------------------------

document.addEventListener("error",(e)=>{

    if(e.target.tagName==="IMG"){

        e.target.src="default.png";

    }

},true);

// -------------------------
// 모바일 부드럽게
// -------------------------

document.documentElement.style.scrollBehavior="smooth";

// -------------------------
// ESC
// -------------------------

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        document
        .getElementById("createModal")
        .classList.remove("show");

        document
        .getElementById("themeModal")
        .classList.remove("show");

    }

});

// -------------------------
// Lazy Image
// -------------------------

document.addEventListener("DOMContentLoaded",()=>{

    document
    .querySelectorAll("img")
    .forEach(img=>{

        img.loading="lazy";

    });

});

// -------------------------
// 첫 실행
// -------------------------

applyTheme();

loadCharacters();

console.log("Character Archive Ready 🚀");