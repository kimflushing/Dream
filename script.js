alert("script 시작");
// =========================
// Dream Archive
// script.js (1)
// =========================

let user = null;
let dreams = [];
let selectedImage = null;

// -------------------------
// 시작
// -------------------------

window.addEventListener("DOMContentLoaded", async () => {

    await checkLogin();

    bindEvents();

    await loadDreams();

});

// -------------------------
// 로그인 확인
// -------------------------

async function checkLogin() {

    const { data } = await supabase.auth.getUser();

    if (!data.user) {

        location.href = "login.html";
        return;

    }

    user = data.user;

}

// -------------------------
// 이벤트
// -------------------------

function bindEvents() {

    alert("bindEvents 실행");

    console.log(document.getElementById("logoutBtn"));
    console.log(document.getElementById("createDream"));

    document.getElementById("logoutBtn").onclick = logout;

    document.getElementById("searchInput").oninput = searchDream;

    document.getElementById("createDream").onclick = openModal;

    document.getElementById("closeModal").onclick = closeModal;

}

// -------------------------
// 로그아웃
// -------------------------

async function logout() {

    alert("로그아웃 함수 실행");

    const ok = confirm("로그아웃 하시겠습니까?");

    if (!ok) return;

    await supabase.auth.signOut();

    location.href = "login.html";

}

// -------------------------
// 드림 목록
// -------------------------

async function loadDreams() {

    const { data, error } = await supabase

        .from("dreams")

        .select("*")

        .eq("user_id", user.id)

        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error(error);

        return;

    }

    dreams = data || [];

    renderDreams(dreams);

}

// -------------------------
// 카드 출력
// -------------------------

function renderDreams(list) {

    const container =
        document.getElementById("dreamList");

    container.innerHTML = "";

    if (list.length === 0) {

        container.innerHTML = `

<div class="emptyBox">

<h2>☁️</h2>

<p>

아직 등록된 드림이 없습니다.

</p>

</div>

`;

        return;

    }

    list.forEach(dream => {

        const template =
            document.getElementById("dreamCardTemplate");

        const card =
            template.content.cloneNode(true);

        card.querySelector(".cardImage").src =
            dream.image || "default.png";

        card.querySelector(".cardTitle").textContent =
            dream.name;

        card.querySelector(".cardIntro").textContent =
            dream.intro || "";

        card.querySelector(".cardDay").textContent =
            getDDay(dream.start_date);

        card.querySelector(".dreamCard").onclick = () => {

            location.href =
                `dream.html?id=${dream.id}`;

        };

        container.appendChild(card);

    });

}

// -------------------------
// 검색
// -------------------------

function searchDream() {

    const keyword =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const result =
        dreams.filter(d =>

            d.name.toLowerCase().includes(keyword)

        );

    renderDreams(result);

}

// -------------------------
// D-Day
// -------------------------

function getDDay(date) {

    if (!date) return "D+0";

    const start = new Date(date);

    const today = new Date();

    const diff = Math.floor(

        (today - start) /

        (1000 * 60 * 60 * 24)

    );

    return `D+${diff}`;

}
// =========================
// Dream 생성 (9-2)
// =========================

// -------------------------
// 모달 열기
// -------------------------

function openModal() {

    alert("모달 열기");

    document.getElementById("createModal").style.display = "flex";

}

// -------------------------
// 모달 닫기
// -------------------------

function closeModal() {

    document.getElementById("createModal").style.display = "none";

    document.getElementById("dreamName").value = "";
    document.getElementById("dreamIntro").value = "";
    document.getElementById("dreamDate").value = "";
    document.getElementById("dreamImage").value = "";

    document.getElementById("previewImage").style.backgroundImage = "";

    selectedImage = null;

}

// -------------------------
// 이벤트 추가
// -------------------------

document.getElementById("saveDream").onclick = saveDream;

document.getElementById("dreamImage").onchange = previewImage;


// -------------------------
// 이미지 미리보기
// -------------------------

function previewImage(e){

    const file = e.target.files[0];

    if(!file) return;

    selectedImage = file;

    const reader = new FileReader();

    reader.onload = function(){

        const preview = document.getElementById("previewImage");

        preview.style.backgroundImage = `url(${reader.result})`;

        preview.style.backgroundSize = "cover";

        preview.style.backgroundPosition = "center";

    };

    reader.readAsDataURL(file);

}

// -------------------------
// Storage 업로드
// -------------------------

async function uploadImage(file){

    if(!file) return "";

    const fileName = `${user.id}/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage

        .from("dream-image")

        .upload(fileName,file);

    if(error){

        alert(error.message);

        return "";

    }

    const { data } = supabase.storage

        .from("dream-image")

        .getPublicUrl(fileName);

    return data.publicUrl;

}

// -------------------------
// 저장
// -------------------------

async function saveDream(){

    const name = document.getElementById("dreamName").value.trim();

    const intro = document.getElementById("dreamIntro").value.trim();

    const startDate = document.getElementById("dreamDate").value;

    if(name===""){

        alert("드림 이름을 입력해주세요.");

        return;

    }

    showLoading();

    const imageUrl = await uploadImage(selectedImage);

    const { error } = await supabase

        .from("dreams")

        .insert({

            user_id:user.id,

            name:name,

            intro:intro,

            image:imageUrl,

            start_date:startDate

        });

    hideLoading();

    if(error){

        alert(error.message);

        return;

    }

    toast("드림이 저장되었습니다.");

    closeModal();

    await loadDreams();

}
// =========================
// script.js (9-3)
// JSON / Toast / Loading / Setting
// =========================

// -------------------------
// 설정창
// -------------------------

const settingBtn = document.getElementById("settingBtn");
const settingModal = document.getElementById("settingModal");

settingBtn.onclick = () => {

    settingModal.style.display = "flex";

};

document.getElementById("closeSetting").onclick = () => {

    settingModal.style.display = "none";

};

// -------------------------
// Toast
// -------------------------

function toast(message){

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

// -------------------------
// Loading
// -------------------------

function showLoading(){

    document.getElementById("loadingScreen").style.display="flex";

}

function hideLoading(){

    document.getElementById("loadingScreen").style.display="none";

}

// -------------------------
// ESC로 모달 닫기
// -------------------------

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        closeModal();

        settingModal.style.display="none";

    }

});

// -------------------------
// JSON 백업
// -------------------------

document.getElementById("backupBtn").onclick = backupJSON;

async function backupJSON(){

    const text = JSON.stringify(dreams,null,2);

    const blob = new Blob([text],{

        type:"application/json"

    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "DreamArchiveBackup.json";

    a.click();

    URL.revokeObjectURL(url);

    toast("백업이 완료되었습니다.");

}

// -------------------------
// JSON 복원
// -------------------------

document.getElementById("restoreBtn").onclick = ()=>{

    document.getElementById("restoreFile").click();

};

document.getElementById("restoreFile").addEventListener("change",restoreJSON);

async function restoreJSON(e){

    const file = e.target.files[0];

    if(!file) return;

    const text = await file.text();

    let data;

    try{

        data = JSON.parse(text);

    }catch{

        alert("JSON 파일이 아닙니다.");

        return;

    }

    if(!Array.isArray(data)){

        alert("잘못된 파일입니다.");

        return;

    }

    showLoading();

    for(const dream of data){

        await supabase

            .from("dreams")

            .insert({

                user_id:user.id,

                name:dream.name,

                intro:dream.intro,

                image:dream.image,

                start_date:dream.start_date

            });

    }

    hideLoading();

    toast("복원이 완료되었습니다.");

    loadDreams();

}
// =========================
// script.js (9-4)
// 삭제 / 수정 / 실시간 새로고침
// =========================

// -------------------------
// 드림 삭제
// -------------------------

async function deleteDream(id){

    const ok = confirm("정말 삭제하시겠습니까?");

    if(!ok) return;

    showLoading();

    const { error } = await supabase

        .from("dreams")

        .delete()

        .eq("id",id)

        .eq("user_id",user.id);

    hideLoading();

    if(error){

        alert(error.message);

        return;

    }

    toast("삭제되었습니다.");

    loadDreams();

}

// -------------------------
// 드림 수정
// -------------------------

async function updateDream(id,data){

    showLoading();

    const { error } = await supabase

        .from("dreams")

        .update(data)

        .eq("id",id)

        .eq("user_id",user.id);

    hideLoading();

    if(error){

        alert(error.message);

        return false;

    }

    toast("수정되었습니다.");

    await loadDreams();

    return true;

}

// -------------------------
// 이미지 변경
// -------------------------

async function changeDreamImage(id,file){

    const image = await uploadImage(file);

    if(!image) return;

    await updateDream(id,{

        image:image

    });

}

// -------------------------
// 카드 다시 그리기
// -------------------------

async function refreshDreamList(){

    await loadDreams();

}

// -------------------------
// 실시간 동기화
// -------------------------

supabase

.channel("dreams")

.on(

"postgres_changes",

{

event:"*",

schema:"public",

table:"dreams"

},

payload=>{

console.log("변경 감지",payload);

loadDreams();

}

)

.subscribe();

// -------------------------
// 새로고침 버튼(F5)
// -------------------------

window.addEventListener("focus",()=>{

loadDreams();

});

// -------------------------
// 모달 바깥 클릭
// -------------------------

window.addEventListener("click",(e)=>{

const modal=document.getElementById("createModal");

if(e.target===modal){

closeModal();

}

const setting=document.getElementById("settingModal");

if(e.target===setting){

setting.style.display="none";

}

});

// -------------------------
// 이미지 없는 경우
// -------------------------

document.addEventListener("error",(e)=>{

if(e.target.tagName==="IMG"){

e.target.src="default.png";

}

},true);

// -------------------------
// 완료
// -------------------------

console.log("Dream Archive Loaded");
alert("script 끝");
