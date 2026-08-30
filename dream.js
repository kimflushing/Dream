// ==========================
// Supabase Check
// ==========================

if (!window.supabase) {
    alert("Supabase를 불러오지 못했습니다.");
}

// ==========================
// Elements
// ==========================

const tabs = document.querySelectorAll(".tab");
const pages = document.querySelectorAll(".tabContent");

const saveBtn = document.getElementById("saveBtn");
const toast = document.getElementById("toast");

const loading = document.getElementById("loadingScreen");

const settingModal = document.getElementById("settingModal");

const viewer = document.getElementById("imageViewer");
const viewerImage = document.getElementById("viewerImage");

// ==========================
// Tab
// ==========================

tabs.forEach(tab=>{

tab.onclick=()=>{

tabs.forEach(t=>t.classList.remove("active"));

pages.forEach(p=>p.classList.remove("active"));

tab.classList.add("active");

document
.getElementById(tab.dataset.tab)
.classList.add("active");

};

});

// ==========================
// Toast
// ==========================

function showToast(text){

toast.textContent=text;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},1800);

}

// ==========================
// Loading
// ==========================

function showLoading(){

loading.classList.add("show");

}

function hideLoading(){

loading.classList.remove("show");

}
// ==========================
// D-Day
// ==========================

const startDate = document.getElementById("startDate");
const dday = document.getElementById("dday");

function updateDday(){

if(!startDate.value){

dday.textContent="D+0";

return;

}

const start=new Date(startDate.value);

const today=new Date();

start.setHours(0,0,0,0);

today.setHours(0,0,0,0);

const diff=Math.floor(

(today-start)/(1000*60*60*24)

);

if(diff>=0){

dday.textContent=`D+${diff}`;

}else{

dday.textContent=`D${diff}`;

}

}

startDate.addEventListener("change",updateDday);

updateDday();



// ==========================
// Main Image Preview
// ==========================

const imageInput=document.getElementById("mainImage");

const preview=document.getElementById("previewImage");

imageInput?.addEventListener("change",e=>{

const file=e.target.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=()=>{

preview.src=reader.result;

};

reader.readAsDataURL(file);

});



// ==========================
// Image Viewer
// ==========================

preview.onclick=()=>{

viewer.classList.add("show");

viewerImage.src=preview.src;

};

document

.getElementById("closeViewer")

.onclick=()=>{

viewer.classList.remove("show");

};

viewer.onclick=e=>{

if(e.target===viewer){

viewer.classList.remove("show");

}

};



// ==========================
// HOME
// ==========================

document

.getElementById("backBtn")

.onclick=()=>{

location.href="index.html";

};



// ==========================
// Setting Modal
// ==========================

const settingBtn=document.getElementById("settingBtn");

const closeSetting=document.getElementById("closeSetting");

settingBtn.onclick=()=>{

settingModal.classList.add("show");

};

closeSetting.onclick=()=>{

settingModal.classList.remove("show");

};

settingModal.onclick=e=>{

if(e.target===settingModal){

settingModal.classList.remove("show");

}

};
// ==========================
// Auto Save
// ==========================

const STORAGE_KEY = "dreamArchive";

const saveTime = document.getElementById("lastSaveTime");

function collectData(){

return{

archiveType:document.getElementById("archiveType").value,

dreamName:document.getElementById("dreamName").value,

startDate:document.getElementById("startDate").value,

intro:document.getElementById("intro").value,

characterName:document.getElementById("characterName").value,

height:document.getElementById("height").value,

birthday:document.getElementById("birthday").value,

age:document.getElementById("age").value,

mbti:document.getElementById("mbti").value,

job:document.getElementById("job").value,

appearanceText:document.getElementById("appearanceText").value,

worldName:document.getElementById("worldName").value,

group:document.getElementById("group").value,

ability:document.getElementById("ability").value,

settingText:document.getElementById("settingText").value,

storyText:document.getElementById("storyText").value,

image:preview.src

};

}

function saveLocal(){

localStorage.setItem(

STORAGE_KEY,

JSON.stringify(collectData())

);

const now=new Date();

const time=now.toLocaleString("ko-KR");

if(saveTime){

saveTime.textContent=time;

}

showToast("저장되었습니다.");

}

function loadLocal(){

const raw=localStorage.getItem(STORAGE_KEY);

if(!raw) return;

const data=JSON.parse(raw);

document.getElementById("archiveType").value=data.archiveType||"dream";

document.getElementById("dreamName").value=data.dreamName||"";

document.getElementById("startDate").value=data.startDate||"";

document.getElementById("intro").value=data.intro||"";

document.getElementById("characterName").value=data.characterName||"";

document.getElementById("height").value=data.height||"";

document.getElementById("birthday").value=data.birthday||"";

document.getElementById("age").value=data.age||"";

document.getElementById("mbti").value=data.mbti||"";

document.getElementById("job").value=data.job||"";

document.getElementById("appearanceText").value=data.appearanceText||"";

document.getElementById("worldName").value=data.worldName||"";

document.getElementById("group").value=data.group||"";

document.getElementById("ability").value=data.ability||"";

document.getElementById("settingText").value=data.settingText||"";

document.getElementById("storyText").value=data.storyText||"";

if(data.image){

preview.src=data.image;

}

updateDday();

}

loadLocal();



// ==========================
// Auto Save Event
// ==========================

document

.querySelectorAll("input, textarea, select")

.forEach(el=>{

el.addEventListener("input",saveLocal);

el.addEventListener("change",saveLocal);

});



// ==========================
// Save Button
// ==========================

saveBtn.onclick=()=>{

saveLocal();

};
// ==========================
// Relation
// ==========================

const relationList = document.getElementById("relationList");
const relationTemplate = document.getElementById("relationTemplate");

document.getElementById("addRelation").onclick = () => {

const card = relationTemplate.content.cloneNode(true);

const deleteBtn = card.querySelector(".deleteRelation");

deleteBtn.onclick = e => {

e.target.closest(".relationCard").remove();

saveLocal();

};

const image = card.querySelector(".relationPreview");

const input = card.querySelector(".relationPhoto");

image.onclick = () => input.click();

input.onchange = () => {

const file = input.files[0];

if(!file) return;

const reader = new FileReader();

reader.onload = () => {

image.src = reader.result;

saveLocal();

};

reader.readAsDataURL(file);

};

card.querySelectorAll("input,textarea").forEach(el=>{

el.oninput = saveLocal;

});

relationList.appendChild(card);

saveLocal();

};



// ==========================
// Timeline
// ==========================

const timelineList = document.getElementById("timelineList");

const timelineTemplate = document.getElementById("timelineTemplate");

document.getElementById("addTimeline").onclick = () => {

const card = timelineTemplate.content.cloneNode(true);

card.querySelector(".deleteTimeline").onclick = e => {

e.target.closest(".timelineCard").remove();

saveLocal();

};

card.querySelectorAll("input,textarea").forEach(el=>{

el.oninput = saveLocal;

});

timelineList.appendChild(card);

saveLocal();

};



// ==========================
// Relation Image Viewer
// ==========================

document.addEventListener("click",e=>{

if(e.target.classList.contains("relationPreview")){

viewer.classList.add("show");

viewerImage.src=e.target.src;

}

});



// ==========================
// Timeline Auto Save
// ==========================

new MutationObserver(()=>{

saveLocal();

}).observe(relationList,{

childList:true

});

new MutationObserver(()=>{

saveLocal();

}).observe(timelineList,{

childList:true

});
// ==========================
// AU
// ==========================

const auList = document.getElementById("auList");
const auTemplate = document.getElementById("auTemplate");

document.getElementById("addAU").onclick = () => {

const card = auTemplate.content.cloneNode(true);

const preview = card.querySelector(".auPreview");
const imageInput = card.querySelector(".auImage");

preview.onclick = () => imageInput.click();

imageInput.onchange = () => {

const file = imageInput.files[0];

if(!file) return;

const reader = new FileReader();

reader.onload = () => {

preview.src = reader.result;

saveLocal();

};

reader.readAsDataURL(file);

};

const galleryInput = card.querySelector(".auGallery");
const gallery = card.querySelector(".galleryPreview");

galleryInput.onchange = () => {

gallery.innerHTML = "";

[...galleryInput.files].forEach(file=>{

const reader = new FileReader();

reader.onload = () => {

const img = document.createElement("img");

img.src = reader.result;

img.onclick = ()=>{

viewer.classList.add("show");

viewerImage.src = img.src;

};

gallery.appendChild(img);

};

reader.readAsDataURL(file);

});

saveLocal();

};

card.querySelector(".deleteAU").onclick = e => {

e.target.closest(".auCard").remove();

saveLocal();

};

card.querySelectorAll("input,textarea").forEach(el=>{

el.oninput = saveLocal;

});

auList.appendChild(card);

saveLocal();

};

// ==========================
// AU Viewer
// ==========================

document.addEventListener("click",e=>{

if(e.target.classList.contains("auPreview")){

viewer.classList.add("show");

viewerImage.src=e.target.src;

}

});

// ==========================
// AU Auto Save
// ==========================

new MutationObserver(()=>{

saveLocal();

}).observe(auList,{

childList:true

});
// ==========================
// Commission
// ==========================

const commissionList = document.getElementById("commissionList");
const commissionTemplate = document.getElementById("commissionTemplate");

document.getElementById("addCommission").onclick = () => {

const card = commissionTemplate.content.cloneNode(true);

const preview = card.querySelector(".commissionPreview");
const imageInput = card.querySelector(".commissionImage");

preview.onclick = () => imageInput.click();

imageInput.onchange = () => {

const file = imageInput.files[0];

if(!file) return;

const reader = new FileReader();

reader.onload = () => {

preview.src = reader.result;

saveLocal();

};

reader.readAsDataURL(file);

};

// ==========================
// Gallery
// ==========================

const galleryInput = card.querySelector(".commissionGalleryInput");
const gallery = card.querySelector(".commissionGalleryPreview");

galleryInput.onchange = () => {

gallery.innerHTML = "";

[...galleryInput.files].forEach(file=>{

const reader = new FileReader();

reader.onload = () => {

const img = document.createElement("img");

img.src = reader.result;

img.onclick = ()=>{

viewer.classList.add("show");

viewerImage.src = img.src;

};

gallery.appendChild(img);

};

reader.readAsDataURL(file);

});

saveLocal();

};

// ==========================
// Delete
// ==========================

card.querySelector(".deleteCommission").onclick = e => {

e.target.closest(".commissionCard").remove();

saveLocal();

};

// ==========================
// Auto Save
// ==========================

card.querySelectorAll("input,textarea").forEach(el=>{

el.oninput = saveLocal;

});

commissionList.appendChild(card);

saveLocal();

};

// ==========================
// Preview Viewer
// ==========================

document.addEventListener("click",e=>{

if(e.target.classList.contains("commissionPreview")){

viewer.classList.add("show");

viewerImage.src=e.target.src;

}

});

// ==========================
// Auto Observe
// ==========================

new MutationObserver(()=>{

saveLocal();

}).observe(commissionList,{

childList:true

});
// ==========================
// Supabase Save
// ==========================

async function saveSupabase(){

if(typeof supabase==="undefined") return;

showLoading();

try{

const data=collectData();

await supabase
.from("archives")
.upsert([{
id:1,
data:data,
updated_at:new Date().toISOString()
}]);

showToast("☁️ 클라우드 저장 완료");

}catch(err){

console.error(err);

showToast("저장 실패");

}

hideLoading();

}



// ==========================
// Supabase Load
// ==========================

async function loadSupabase(){

if(typeof supabase==="undefined") return;

showLoading();

try{

const {data,error}=await supabase

.from("archives")

.select("*")

.eq("id",1)

.single();

if(error){

hideLoading();

return;

}

if(data){

Object.entries(data.data).forEach(([key,value])=>{

const el=document.getElementById(key);

if(el){

el.value=value;

}

});

if(data.data.image){

preview.src=data.data.image;

}

updateDday();

showToast("☁️ 불러오기 완료");

}

}catch(e){

console.error(e);

}

hideLoading();

}



// ==========================
// Save Button
// ==========================

saveBtn.onclick=async()=>{

saveLocal();

await saveSupabase();

};



// ==========================
// JSON Export
// ==========================

document.getElementById("exportJSON").onclick=()=>{

const blob=new Blob(

[JSON.stringify(collectData(),null,2)],

{type:"application/json"}

);

const a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="dream_archive.json";

a.click();

showToast("JSON 백업 완료");

};



// ==========================
// JSON Import
// ==========================

document.getElementById("importJSON").onclick=()=>{

document.getElementById("jsonFile").click();

};

document.getElementById("jsonFile").onchange=e=>{

const file=e.target.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=()=>{

const data=JSON.parse(reader.result);

Object.entries(data).forEach(([key,val])=>{

const el=document.getElementById(key);

if(el){

el.value=val;

}

});

if(data.image){

preview.src=data.image;

}

updateDday();

saveLocal();

showToast("복원 완료");

};

reader.readAsText(file);

};
// ==========================
// Delete Archive
// ==========================

const deleteBtn = document.getElementById("deleteDream");
const deleteModal = document.getElementById("deleteModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

deleteBtn.onclick = () => {

deleteModal.classList.add("show");

};

cancelDelete.onclick = () => {

deleteModal.classList.remove("show");

};

confirmDelete.onclick = async () => {

localStorage.removeItem(STORAGE_KEY);

if(typeof supabase!=="undefined"){

try{

await supabase

.from("archives")

.delete()

.eq("id",1);

}catch(e){

console.log(e);

}

}

location.reload();

};



// ==========================
// Auto Load
// ==========================

window.addEventListener("load",async()=>{

loadLocal();

await loadSupabase();

updateDday();

});



// ==========================
// Auto Save
// ==========================

setInterval(()=>{

saveLocal();

saveSupabase();

},30000);



// ==========================
// Save Before Exit
// ==========================

window.addEventListener("beforeunload",()=>{

saveLocal();

saveSupabase();

});



// ==========================
// Keyboard Save
// ==========================

document.addEventListener("keydown",e=>{

if(e.ctrlKey&&e.key==="s"){

e.preventDefault();

saveLocal();

saveSupabase();

showToast("저장 완료");

}

});



// ==========================
// Initialize
// ==========================

updateDday();

showToast("Dream Archive Ready");

console.log("Dream Archive Loaded.");