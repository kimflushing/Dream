// =========================
// Dream Archive
// dream.js (1/6)
// =========================

const params = new URLSearchParams(location.search);
const dreamId = params.get("id");

let user = null;
let dream = null;

// -------------------------
// 시작
// -------------------------

window.addEventListener("DOMContentLoaded", async () => {

    await checkLogin();

    await loadDream();

    bindTabs();

    bindButtons();

});

// -------------------------
// 로그인 확인
// -------------------------

async function checkLogin() {

const { data } = await db.auth.getUser();
    if (!data.user) {

        location.href = "login.html";
        return;

    }

    user = data.user;

}

// -------------------------
// 버튼 이벤트
// -------------------------

function bindButtons() {

    document.getElementById("backBtn").onclick = () => {

        location.href = "index.html";

    };

    document.getElementById("saveBtn").onclick = saveDream;

    document.getElementById("changeImage").onclick = () => {

        document.getElementById("mainImage").click();

    };

    document.getElementById("mainImage").onchange = previewImage;

}

// -------------------------
// 탭
// -------------------------

function bindTabs() {

    const tabs = document.querySelectorAll(".tab");

    const contents = document.querySelectorAll(".tabContent");

    tabs.forEach(tab => {

        tab.onclick = () => {

            tabs.forEach(t => t.classList.remove("active"));

            contents.forEach(c => c.classList.remove("active"));

            tab.classList.add("active");

            document
                .getElementById(tab.dataset.tab)
                .classList.add("active");

        };

    });

}

// -------------------------
// 드림 불러오기
// -------------------------

async function loadDream() {

const { data, error } = await db
        .from("dreams")

        .select("*")

        .eq("id", dreamId)

        .single();

    if (error) {

        alert(error.message);

        location.href = "index.html";

        return;

    }

    dream = data;

    fillData();

}

// -------------------------
// 화면 채우기
// -------------------------

function fillData() {

    document.title = dream.name;

    document.getElementById("dreamTitle").textContent = dream.name;

    document.getElementById("dreamName").value = dream.name || "";

    document.getElementById("intro").value = dream.intro || "";

    document.getElementById("startDate").value =
        dream.start_date || "";

    document.getElementById("previewImage").src =
        dream.image || "default.png";

    updateDDay();

}

// -------------------------
// D-Day
// -------------------------

function updateDDay() {

    const value =
        document.getElementById("startDate").value;

    if (!value) {

        document.getElementById("dday").textContent =
            "D+0";

        return;

    }

    const start = new Date(value);

    const today = new Date();

    const diff = Math.floor(

        (today - start) /

        (1000 * 60 * 60 * 24)

    );

    document.getElementById("dday").textContent =
        `D+${diff}`;

}

document
.getElementById("startDate")
.addEventListener("change", updateDDay);
// =========================
// dream.js (2/6)
// 이미지 / 저장
// =========================

let selectedImage = null;

// -------------------------
// 이미지 미리보기
// -------------------------

function previewImage(e){

    const file = e.target.files[0];

    if(!file) return;

    selectedImage = file;

    const reader = new FileReader();

    reader.onload = function(){

        document.getElementById("previewImage").src =
            reader.result;

    };

    reader.readAsDataURL(file);

}

// -------------------------
// Storage 업로드
// -------------------------

async function uploadImage(file){

    if(!file){

        return dream.image;

    }

    const fileName =
        `${user.id}/${Date.now()}_${file.name}`;

await db.storage
        .from("dream-image")

        .upload(fileName,file);

    if(error){

        alert(error.message);

        return dream.image;

    }

    const { data } = db.storage

        .from("dream-image")

        .getPublicUrl(fileName);

    return data.publicUrl;

}

// -------------------------
// 저장
// -------------------------

async function saveDream(){

    showLoading();

    const imageUrl =
        await uploadImage(selectedImage);

    const updateData = {

        name:
        document.getElementById("dreamName").value,

        intro:
        document.getElementById("intro").value,

        start_date:
        document.getElementById("startDate").value,

        image:imageUrl,

        character_name:
        document.getElementById("characterName").value,

        height:
        document.getElementById("height").value,

        birthday:
        document.getElementById("birthday").value,

        age:
        document.getElementById("age").value,

        mbti:
        document.getElementById("mbti").value,

        job:
        document.getElementById("job").value,

        appearance:
        document.getElementById("appearanceText").value,

        world_name:
        document.getElementById("worldName").value,

        group_name:
        document.getElementById("group").value,

        ability:
        document.getElementById("ability").value,

        setting_text:
        document.getElementById("settingText").value,

        story:
        document.getElementById("storyText").value

    };

const { error } = await db
        .from("dreams")

        .update(updateData)

        .eq("id",dreamId)

        .eq("user_id",user.id);

    hideLoading();

    if(error){

        alert(error.message);

        return;

    }

    toast("저장되었습니다.");

    dream = {

        ...dream,

        ...updateData

    };

}
// =========================
// dream.js (3/6)
// 관계 / AU / 커미션
// =========================

// -------------------------
// 버튼 연결
// -------------------------

document.getElementById("addRelation").onclick = addRelation;

document.getElementById("addAU").onclick = addAU;

document.getElementById("addCommission").onclick = addCommission;

// -------------------------
// 관계 추가
// -------------------------

function addRelation(){

    const card = document.createElement("div");

    card.className = "relationCard";

    card.innerHTML = `

<input class="relationName" placeholder="캐릭터 이름">

<input class="relationType" placeholder="관계">

<textarea class="relationMemo"
placeholder="설명"></textarea>

<button class="deleteRelation">
삭제
</button>

`;

    card.querySelector(".deleteRelation").onclick=()=>{

        card.remove();

    };

    document
        .getElementById("relationList")
        .appendChild(card);

}

// -------------------------
// AU 추가
// -------------------------

function addAU(){

    const card=document.createElement("div");

    card.className="auCard";

    card.innerHTML=`

<input class="auTitle"
placeholder="AU 이름">

<input class="auWorld"
placeholder="세계관">

<textarea class="auDescription"
placeholder="설명"></textarea>

<button class="deleteAU">

삭제

</button>

`;

    card.querySelector(".deleteAU").onclick=()=>{

        card.remove();

    };

    document
        .getElementById("auList")
        .appendChild(card);

}

// -------------------------
// 커미션 추가
// -------------------------

function addCommission(){

    const card=document.createElement("div");

    card.className="commissionCard";

    card.innerHTML=`

<input class="artistName"
placeholder="작가">

<input class="commissionLink"
placeholder="링크">

<textarea class="commissionMemo"
placeholder="메모"></textarea>

<button class="deleteCommission">

삭제

</button>

`;

    card.querySelector(".deleteCommission").onclick=()=>{

        card.remove();

    };

    document
        .getElementById("commissionList")
        .appendChild(card);

}

// -------------------------
// 삭제
// -------------------------

document
.getElementById("deleteDream")
.onclick = async ()=>{

    const ok=confirm("이 드림을 삭제하시겠습니까?");

    if(!ok) return;

    showLoading();

    const { error } = await db

        .from("dreams")

        .delete()

        .eq("id",dreamId)

        .eq("user_id",user.id);

    hideLoading();

    if(error){

        alert(error.message);

        return;

    }

    alert("삭제되었습니다.");

    location.href="index.html";

};
// =========================
// dream.js (4/6)
// Viewer / JSON / Auto Save
// =========================

// -------------------------
// 이미지 확대
// -------------------------

const viewer = document.getElementById("imageViewer");
const viewerImage = document.getElementById("viewerImage");

document.getElementById("previewImage").onclick = () => {

    viewer.style.display = "flex";

    viewerImage.src =
        document.getElementById("previewImage").src;

};

document.getElementById("closeViewer").onclick = () => {

    viewer.style.display = "none";

};

viewer.onclick = (e) => {

    if (e.target === viewer) {

        viewer.style.display = "none";

    }

};

// -------------------------
// JSON 백업
// -------------------------

document.getElementById("exportJSON").onclick = () => {

    const data = {

        ...dream,

        saved_at: new Date().toLocaleString()

    };

    const blob = new Blob(

        [JSON.stringify(data, null, 2)],

        {

            type: "application/json"

        }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `${dream.name}.json`;

    a.click();

    URL.revokeObjectURL(url);

    toast("JSON 백업 완료");

};

// -------------------------
// JSON 불러오기
// -------------------------

document.getElementById("importJSON").onclick = () => {

    document.getElementById("jsonFile").click();

};

document.getElementById("jsonFile").addEventListener(

    "change",

    async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        try {

            const text = await file.text();

            const json = JSON.parse(text);

            dream = {

                ...dream,

                ...json

            };

            fillData();

            toast("JSON 불러오기 완료");

        } catch {

            alert("올바른 JSON 파일이 아닙니다.");

        }

    }

);

// -------------------------
// 자동 저장
// -------------------------

let autoSaveTimer;

document.querySelectorAll("input, textarea").forEach(input => {

    input.addEventListener("input", () => {

        clearTimeout(autoSaveTimer);

        autoSaveTimer = setTimeout(() => {

            saveDream();

        }, 1200);

    });

});

// -------------------------
// Ctrl + S 저장
// -------------------------

document.addEventListener("keydown", (e) => {

    if (e.ctrlKey && e.key === "s") {

        e.preventDefault();

        saveDream();

    }

});

// -------------------------
// 설정창 닫기
// -------------------------

document.getElementById("closeSetting").onclick = () => {

    document.getElementById("settingModal").style.display = "none";

};

window.addEventListener("click", (e) => {

    const modal = document.getElementById("settingModal");

    if (e.target === modal) {

        modal.style.display = "none";

    }

});
// =========================
// dream.js (5/6)
// 실시간 / Toast / Loading
// =========================

// -------------------------
// 실시간 동기화
// -------------------------

db
.channel("dream-update")
.on(
    "postgres_changes",
    {
        event: "*",
        schema: "public",
        table: "dreams"
    },
    async (payload) => {

        if (payload.new?.id != dreamId) return;

        await loadDream();

        console.log("실시간 업데이트");

    }
)
.subscribe();

// -------------------------
// Toast
// -------------------------

function toast(message){

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

// -------------------------
// Loading
// -------------------------

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

// -------------------------
// 마지막 저장 시간
// -------------------------

function updateSaveTime(){

    const time = new Date();

    const text =
        time.toLocaleTimeString("ko-KR",{

            hour:"2-digit",
            minute:"2-digit"

        });

    const target =
        document.getElementById("lastSaveTime");

    if(target){

        target.textContent=text;

    }

}

// -------------------------
// 저장 함수 보강
// -------------------------

const originalSaveDream = saveDream;

saveDream = async function(){

    await originalSaveDream();

    updateSaveTime();

};

// -------------------------
// 페이지 이탈 확인
// -------------------------

let changed=false;

document
.querySelectorAll("input,textarea")
.forEach(el=>{

    el.addEventListener("input",()=>{

        changed=true;

    });

});

window.addEventListener("beforeunload",(e)=>{

    if(!changed) return;

    e.preventDefault();

    e.returnValue="";

});

// -------------------------
// 저장 후 상태 초기화
// -------------------------

function saveCompleted(){

    changed=false;

    updateSaveTime();

}

// -------------------------
// 시작
// -------------------------

updateSaveTime();

console.log("Dream Detail Loaded");
// =========================
// dream.js (6/6)
// 최종 마무리
// =========================

// -------------------------
// 갤러리 자동 생성
// -------------------------

function refreshGallery(){

    const gallery =
        document.getElementById("galleryGrid");

    if(!gallery) return;

    gallery.innerHTML="";

    const images=[];

    if(dream?.image){

        images.push(dream.image);

    }

    document
    .querySelectorAll(".relationPreview,.auPreview,.commissionPreview")
    .forEach(img=>{

        if(img.src && !img.src.includes("default.png")){

            images.push(img.src);

        }

    });

    images.forEach(src=>{

        const image=document.createElement("img");

        image.src=src;

        image.loading="lazy";

        image.onclick=()=>{

            viewer.style.display="flex";

            viewerImage.src=src;

        };

        gallery.appendChild(image);

    });

}

// -------------------------
// 이미지 오류 처리
// -------------------------

document.addEventListener("error",(e)=>{

    if(e.target.tagName==="IMG"){

        e.target.src="default.png";

    }

},true);

// -------------------------
// 모바일 메뉴 스크롤
// -------------------------

const tabMenu=document.querySelector(".tabMenu");

if(tabMenu){

    let startX=0;

    tabMenu.addEventListener("touchstart",(e)=>{

        startX=e.touches[0].clientX;

    });

    tabMenu.addEventListener("touchmove",(e)=>{

        const move=startX-e.touches[0].clientX;

        tabMenu.scrollLeft+=move;

        startX=e.touches[0].clientX;

    });

}

// -------------------------
// ESC
// -------------------------

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        viewer.style.display="none";

        const modal=document.getElementById("settingModal");

        if(modal){

            modal.style.display="none";

        }

    }

});

// -------------------------
// 저장 후 갤러리 갱신
// -------------------------

const oldSave=saveDream;

saveDream=async function(){

    await oldSave();

    refreshGallery();

    saveCompleted();

};

// -------------------------
// 첫 실행
// -------------------------

refreshGallery();

console.log("Dream Archive Ready 🚀");
