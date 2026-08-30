// =========================
// Dream Archive
// =========================

let user = null;
let dreams = [];

// -------------------------
// 시작
// -------------------------

window.addEventListener("DOMContentLoaded", async () => {

    await checkLogin();

    openEvents();

    loadDreams();

});

// -------------------------
// 로그인 확인
// -------------------------

async function checkLogin(){

    const { data } = await supabase.auth.getUser();

    if(!data.user){

        location.href="login.html";
        return;

    }

    user=data.user;

}

// -------------------------
// 이벤트
// -------------------------

function openEvents(){

    document
    .getElementById("createDream")
    .onclick=openModal;

    document
    .getElementById("closeModal")
    .onclick=closeModal;

    document
    .getElementById("saveDream")
    .onclick=saveDream;

    document
    .getElementById("dreamImage")
    .onchange=previewImage;

    document
    .getElementById("searchInput")
    .oninput=searchDream;

    document
    .getElementById("settingBtn")
    .onclick=()=>{

        document
        .getElementById("settingModal")
        .style.display="flex";

    };

    document
    .getElementById("closeSetting")
    .onclick=()=>{

        document
        .getElementById("settingModal")
        .style.display="none";

    };

}

// -------------------------
// 모달
// -------------------------

function openModal(){

    document
    .getElementById("createModal")
    .style.display="flex";

}

function closeModal(){

    document
    .getElementById("createModal")
    .style.display="none";

}

// -------------------------
// 이미지 미리보기
// -------------------------

let selectedImage = null;

function previewImage(e){

    const file = e.target.files[0];

    if(!file) return;

    selectedImage = file;

    const reader = new FileReader();

    reader.onload = function(){

        const preview = document.getElementById("previewImage");

        preview.innerHTML = "";

        preview.style.backgroundImage = `url(${reader.result})`;
        preview.style.backgroundSize = "cover";
        preview.style.backgroundPosition = "center";

    }

    reader.readAsDataURL(file);

}


// -------------------------
// 이미지 업로드
// -------------------------

async function uploadImage(file){

    if(!file) return "";

    const fileName =
    `${user.id}/${Date.now()}_${file.name}`;

    const { error } =
    await supabase.storage
    .from("dream-image")
    .upload(fileName,file);

    if(error){

        alert(error.message);

        return "";

    }

    const { data } =
    supabase.storage
    .from("dream-image")
    .getPublicUrl(fileName);

    return data.publicUrl;

}



// -------------------------
// D-Day 계산
// -------------------------

function calculateDay(date){

    if(!date) return "D+0";

    const start = new Date(date);

    const today = new Date();

    const diff =
    Math.floor(
        (today-start)/(1000*60*60*24)
    );

    if(diff>=0){

        return `D+${diff}`;

    }

    return `D${diff}`;

}



// -------------------------
// 저장
// -------------------------

async function saveDream(){

    const name =
    document.getElementById("dreamName").value.trim();

    const intro =
    document.getElementById("dreamIntro").value.trim();

    const startDate =
    document.getElementById("dreamDate").value;

    if(name===""){

        alert("드림 이름을 입력해주세요.");

        return;

    }

    document
    .getElementById("loadingScreen")
    .style.display="flex";

    const imageUrl =
    await uploadImage(selectedImage);

    const { error } =
    await supabase

    .from("dreams")

    .insert({

        user_id:user.id,

        name:name,

        intro:intro,

        image:imageUrl,

        start_date:startDate

    });

    document
    .getElementById("loadingScreen")
    .style.display="none";

    if(error){

        alert(error.message);

        return;

    }

    closeModal();

    loadDreams();

}
// =========================
// 드림 목록 불러오기
// =========================

async function loadDreams(){

    const { data, error } = await supabase
    .from("dreams")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending:false });

    if(error){

        console.error(error);

        return;

    }

    dreams = data || [];

    renderDreams(dreams);

}


// =========================
// 카드 출력
// =========================

function renderDreams(list){

    const container =
    document.getElementById("dreamList");

    container.innerHTML = "";

    if(list.length===0){

        container.innerHTML=`

        <div class="emptyBox">

            <div class="emptyIcon">☁️</div>

            <h2>아직 등록된 드림이 없습니다.</h2>

            <p>첫 번째 드림을 만들어보세요.</p>

        </div>

        `;

        return;

    }

    list.forEach(dream=>{

        const template =
        document
        .getElementById("dreamCardTemplate");

        const card =
        template.content
        .cloneNode(true);

        const img =
        card.querySelector(".cardImage");

        img.src =
        dream.image ||
        "img/default/default.png";

        card.querySelector(".cardTitle")
        .textContent =
        dream.name;

        card.querySelector(".cardDay")
        .textContent =
        calculateDay(dream.start_date);

        card.querySelector(".cardIntro")
        .textContent =
        dream.intro || "";

        card.querySelector(".dreamCard")
        .onclick=()=>{

            location.href=
            `pages/dream.html?id=${dream.id}`;

        };

        container.appendChild(card);

    });

}


// =========================
// 검색
// =========================

function searchDream(){

    const keyword =
    document
    .getElementById("searchInput")
    .value
    .toLowerCase();

    const result =
    dreams.filter(d=>{

        return d.name
        .toLowerCase()
        .includes(keyword);

    });

    renderDreams(result);

}
// =========================
// 로그아웃
// =========================

document
.getElementById("logoutBtn")
.onclick = async ()=>{

    await supabase.auth.signOut();

    location.href="login.html";

};



// =========================
// JSON 백업
// =========================

document
.getElementById("backupBtn")
.onclick = ()=>{

    const json =
    JSON.stringify(dreams,null,2);

    const blob =
    new Blob(
        [json],
        {
            type:"application/json"
        }
    );

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href=url;

    a.download="DreamArchive_Backup.json";

    a.click();

    URL.revokeObjectURL(url);

};



// =========================
// JSON 복원
// =========================

document
.getElementById("restoreBtn")
.onclick=()=>{

    document
    .getElementById("restoreFile")
    .click();

};

document
.getElementById("restoreFile")
.onchange=restoreJSON;



async function restoreJSON(e){

    const file=e.target.files[0];

    if(!file) return;

    const text=
    await file.text();

    const json=
    JSON.parse(text);

    for(const dream of json){

        delete dream.id;

        delete dream.created_at;

        delete dream.updated_at;

        dream.user_id=user.id;

        await supabase
        .from("dreams")
        .insert(dream);

    }

    toast("복원이 완료되었습니다.");

    loadDreams();

}



// =========================
// 토스트
// =========================

function toast(message){

    const t=
    document
    .getElementById("toast");

    t.innerHTML=message;

    t.classList.add("show");

    setTimeout(()=>{

        t.classList.remove("show");

    },2500);

}



// =========================
// 로딩
// =========================

function showLoading(){

    document
    .getElementById("loadingScreen")
    .style.display="flex";

}

function hideLoading(){

    document
    .getElementById("loadingScreen")
    .style.display="none";

}
// =========================
// 드림 삭제
// =========================

async function deleteDream(id){

    const ok = confirm("정말 삭제하시겠습니까?");

    if(!ok) return;

    showLoading();

    const { error } = await supabase
    .from("dreams")
    .delete()
    .eq("id", id);

    hideLoading();

    if(error){

        alert(error.message);

        return;

    }

    toast("삭제되었습니다.");

    loadDreams();

}



// =========================
// 드림 수정
// =========================

async function updateDream(id,data){

    showLoading();

    const { error } = await supabase
    .from("dreams")
    .update(data)
    .eq("id",id);

    hideLoading();

    if(error){

        alert(error.message);

        return;

    }

    toast("저장되었습니다.");

    loadDreams();

}



// =========================
// 자동 저장
// =========================

const inputs=document.querySelectorAll(

"#dreamName,#dreamIntro,#dreamDate"

);

inputs.forEach(input=>{

    input.addEventListener("input",()=>{

        localStorage.setItem(

            "draftDream",

            JSON.stringify({

                name:document.getElementById("dreamName").value,

                intro:document.getElementById("dreamIntro").value,

                date:document.getElementById("dreamDate").value

            })

        );

    });

});



// =========================
// 임시 저장 불러오기
// =========================

(function(){

    const draft=

    JSON.parse(

        localStorage.getItem("draftDream")

    );

    if(!draft) return;

    document.getElementById("dreamName").value=

    draft.name || "";

    document.getElementById("dreamIntro").value=

    draft.intro || "";

    document.getElementById("dreamDate").value=

    draft.date || "";

})();



// =========================
// 저장 완료 후 임시삭제
// =========================

function clearDraft(){

    localStorage.removeItem("draftDream");

}



// =========================
// 페이지 애니메이션
// =========================

window.onload=()=>{

    document.body.classList.add("loaded");

};



// =========================
// ESC 닫기
// =========================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        closeModal();

        document
        .getElementById("settingModal")
        .style.display="none";

    }

});



// =========================
// 모달 밖 클릭
// =========================

window.onclick=(e)=>{

    const create=

    document.getElementById("createModal");

    const setting=

    document.getElementById("settingModal");

    if(e.target===create){

        closeModal();

    }

    if(e.target===setting){

        setting.style.display="none";

    }

};