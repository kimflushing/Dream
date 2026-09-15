// =========================
// Dream Archive
// dream.js (1/6)
// =========================

const params = new URLSearchParams(location.search);
const dreamId = params.get("id");

let user = null;
let dream = null;
let selectedImage = null;

window.addEventListener("DOMContentLoaded", async () => {

    try {

        await checkLogin();

        await loadDream();

        bindTabs();

        bindButtons();

        updateDDay();

    } catch (e) {

        alert(e.message);

    }

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

    user=data.user;

}

// -------------------------
// 버튼
// -------------------------

function bindButtons(){

    document.getElementById("backBtn").onclick=()=>{

        location.href="index.html";

    };

    document.getElementById("saveBtn").onclick=saveDream;

    document.getElementById("changeImage").onclick=()=>{

        document.getElementById("mainImage").click();

    };

    document.getElementById("mainImage").onchange=previewImage;

}

// -------------------------
// 탭
// -------------------------

function bindTabs(){

    const tabs=document.querySelectorAll(".tab");

    const contents=document.querySelectorAll(".tabContent");

    tabs.forEach(tab=>{

        tab.onclick=()=>{

            tabs.forEach(t=>t.classList.remove("active"));

            contents.forEach(c=>c.classList.remove("active"));

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

async function loadDream(){

    const { data,error } = await db

    .from("dreams")

    .select("*")

    .eq("id",dreamId)

    .eq("user_id",user.id)

    .single();

    if(error){

        alert(error.message);

        location.href="index.html";

        return;

    }

    dream=data;

    fillData();

}

// -------------------------
// 화면 채우기
// -------------------------

function fillData(){

    document.title=dream.name||"Dream";

    document.getElementById("dreamTitle").textContent=dream.name||"";

    document.getElementById("dreamName").value=dream.name||"";

    document.getElementById("intro").value=dream.intro||"";

    document.getElementById("startDate").value=dream.start_date||"";

    document.getElementById("previewImage").src=dream.image||"default.png";

    document.getElementById("characterName").value=dream.character_name||"";

    document.getElementById("height").value=dream.height||"";

    document.getElementById("birthday").value=dream.birthday||"";

    document.getElementById("age").value=dream.age||"";

    document.getElementById("mbti").value=dream.mbti||"";

    document.getElementById("job").value=dream.job||"";

    document.getElementById("appearanceText").value=dream.appearance||"";

    document.getElementById("worldName").value=dream.world_name||"";

    document.getElementById("group").value=dream.group_name||"";

    document.getElementById("ability").value=dream.ability||"";

    document.getElementById("settingText").value=dream.setting_text||"";

    document.getElementById("storyText").value=dream.story||"";

    updateDDay();

}

// -------------------------
// D-Day
// -------------------------

function updateDDay(){

    const value=document.getElementById("startDate").value;

    if(!value){

        document.getElementById("dday").textContent="D+0";

        return;

    }

    const start=new Date(value);

    const today=new Date();

    const diff=Math.floor((today-start)/(1000*60*60*24));

    document.getElementById("dday").textContent=`D+${diff}`;

}

document.getElementById("startDate").addEventListener("change",updateDDay);
// =========================
// dream.js (2/6)
// 이미지 / 저장
// =========================

// -------------------------
// 이미지 미리보기
// -------------------------

function previewImage(e){

    const file = e.target.files[0];

    if(!file) return;

    selectedImage = file;

    const reader = new FileReader();

    reader.onload = () => {

        document.getElementById("previewImage").src = reader.result;

    };

    reader.readAsDataURL(file);

}

// -------------------------
// Storage 업로드
// -------------------------

async function uploadImage(file){

    if(!file){

        return dream.image || "";

    }

    const fileName =
        `${user.id}/${Date.now()}_${file.name}`;

    const { error } = await db.storage
        .from("dream-image")
        .upload(fileName, file, {
            upsert:true
        });

    if(error){

        alert("이미지 업로드 실패\n"+error.message);

        return dream.image || "";

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

    try{

        const imageUrl = await uploadImage(selectedImage);

        const updateData={

            name:document.getElementById("dreamName").value,

            intro:document.getElementById("intro").value,

            image:imageUrl,

            start_date:document.getElementById("startDate").value,

            character_name:document.getElementById("characterName").value,

            height:document.getElementById("height").value,

            birthday:document.getElementById("birthday").value,

            age:document.getElementById("age").value,

            mbti:document.getElementById("mbti").value,

            job:document.getElementById("job").value,

            appearance:document.getElementById("appearanceText").value,

            world_name:document.getElementById("worldName").value,

            group_name:document.getElementById("group").value,

            ability:document.getElementById("ability").value,

            setting_text:document.getElementById("settingText").value,

            story:document.getElementById("storyText").value

        };

        const { error } = await db
            .from("dreams")
            .update(updateData)
            .eq("id",dreamId)
            .eq("user_id",user.id);

        if(error){

            alert(error.message);

            return;

        }

        dream = {
            ...dream,
            ...updateData
        };

        toast("저장되었습니다.");

    }catch(e){

        alert(e.message);

    }finally{

        hideLoading();

    }

}
// =========================
// dream.js (3/6)
// 관계 / AU / 삭제
// =========================

// 관계
document.getElementById("addRelation").onclick = addRelation;

// AU
document.getElementById("addAU").onclick = addAU;

// 커미션
document.getElementById("addCommission").onclick = addCommission;

// -------------------------
// 관계 추가
// -------------------------

function addRelation(){

    const card=document.createElement("div");

    card.className="relationCard";

    card.innerHTML=`

<input class="relationName" placeholder="캐릭터 이름">

<input class="relationType" placeholder="관계">

<textarea class="relationMemo" placeholder="설명"></textarea>

<button class="deleteRelation">삭제</button>

`;

    card.querySelector(".deleteRelation").onclick=()=>{

        card.remove();

    };

    document.getElementById("relationList").appendChild(card);

}

// -------------------------
// AU
// -------------------------

function addAU(){

    const card=document.createElement("div");

    card.className="auCard";

    card.innerHTML=`

<input class="auTitle" placeholder="AU 이름">

<input class="auWorld" placeholder="세계관">

<textarea class="auDescription" placeholder="설명"></textarea>

<button class="deleteAU">삭제</button>

`;

    card.querySelector(".deleteAU").onclick=()=>{

        card.remove();

    };

    document.getElementById("auList").appendChild(card);

}

// -------------------------
// 커미션
// -------------------------

function addCommission(){

    const card=document.createElement("div");

    card.className="commissionCard";

    card.innerHTML=`

<input class="artistName" placeholder="작가">

<input class="commissionLink" placeholder="링크">

<textarea class="commissionMemo" placeholder="메모"></textarea>

<button class="deleteCommission">삭제</button>

`;

    card.querySelector(".deleteCommission").onclick=()=>{

        card.remove();

    };

    document.getElementById("commissionList").appendChild(card);

}

// -------------------------
// 삭제
// -------------------------

document.getElementById("deleteDream").onclick=async()=>{

    if(!confirm("이 드림을 삭제하시겠습니까?")) return;

    showLoading();

    try{

        const { error } = await db

            .from("dreams")

            .delete()

            .eq("id",dreamId)

            .eq("user_id",user.id);

        if(error){

            alert(error.message);

            return;

        }

        alert("삭제되었습니다.");

        location.href="index.html";

    }finally{

        hideLoading();

    }

};
