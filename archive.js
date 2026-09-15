// =======================================
// Character Archive
// archive.js
// =======================================

let user = null;
let archives = [];
let currentFilter = "all";

// ----------------------
// 시작
// ----------------------

window.addEventListener("DOMContentLoaded", async () => {

    await checkLogin();

    bindButtons();

    bindFilters();

    await loadArchives();

});

// ----------------------
// 로그인 확인
// ----------------------

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

// ----------------------
// 버튼
// ----------------------

function bindButtons(){

    document.getElementById("logoutBtn").onclick = logout;

    document.getElementById("themeBtn").onclick = ()=>{

        document.getElementById("themeModal").style.display="flex";

    };

    document.getElementById("closeTheme").onclick = ()=>{

        document.getElementById("themeModal").style.display="none";

    };

    document.getElementById("addCharacter").onclick = ()=>{

        document.getElementById("createModal").style.display="flex";

    };

    document.getElementById("closeModal").onclick = ()=>{

        document.getElementById("createModal").style.display="none";

    };

}
// ----------------------
// 아카이브 불러오기
// ----------------------

async function loadArchives(){

    const { data, error } = await db

        .from("archives")

        .select("*")

        .eq("user_id", user.id)

        .order("created_at", { ascending:false });

    if(error){

        alert(error.message);

        return;

    }

    archives = data || [];

    renderCards();

}

// ----------------------
// 카드 그리기
// ----------------------

function renderCards(){

    const container = document.getElementById("cardContainer");

    container.innerHTML = "";

    let list = archives;

    if(currentFilter !== "all"){

        list = archives.filter(a => a.type === currentFilter);

    }

    if(list.length === 0){

        container.innerHTML = `
        <p style="
        text-align:center;
        color:#888;
        padding:60px;">
        아직 아무것도 없습니다.
        </p>
        `;

        return;

    }

    list.forEach(item=>{

        const card=document.createElement("div");

        card.className="archiveCard";

        card.innerHTML=`

        <img src="${item.cover || "default.png"}">

        <div class="archiveInfo">

            <h2>${item.title || "제목 없음"}</h2>

            <p>${typeName(item.type)}</p>

            <span>${item.intro || ""}</span>

        </div>

        `;

        card.onclick=()=>{

            location.href=
            `detail.html?id=${item.id}`;

        };

        container.appendChild(card);

    });

}

// ----------------------
// 타입 이름
// ----------------------

function typeName(type){

    switch(type){

        case "dream":
            return "드림";

        case "pair":
            return "페어";

        case "oc":
            return "자캐";

        default:
            return "";

    }

}
// ----------------------
// 필터
// ----------------------

function bindFilters(){

    const filters=document.querySelectorAll(".filter");

    filters.forEach(btn=>{

        btn.onclick=()=>{

            filters.forEach(f=>f.classList.remove("active"));

            btn.classList.add("active");

            currentFilter=btn.dataset.type;

            renderCards();

        };

    });

}

// ----------------------
// 로그아웃
// ----------------------

async function logout(){

    await db.auth.signOut();

    location.href="login.html";

}
// ----------------------
// 새 아카이브 만들기
// ----------------------

document.querySelectorAll(".createType").forEach(btn=>{

    btn.onclick = async ()=>{

        const type = btn.dataset.type;

        const title = prompt("제목을 입력하세요.");

        if(!title) return;

        const { data, error } = await db

            .from("archives")

            .insert({

                user_id:user.id,

                type:type,

                title:title,

                intro:"",

                cover:"",

                theme:"pink"

            })

            .select()

            .single();

        if(error){

            alert(error.message);

            return;

        }

        archives.unshift(data);

        renderCards();

        document.getElementById("createModal").style.display="none";

        location.href=`detail.html?id=${data.id}`;

    };

});
