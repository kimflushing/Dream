// ==========================================
// Dream Archive v2
// ==========================================

const $ = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);

// ==========================================
// Supabase
// ==========================================

const db = window.supabaseClient || window.supabase || null;

// ==========================================
// Elements
// ==========================================

const tabs = $$(".tab");
const pages = $$(".tabContent");

const preview = $("#previewImage");
const imageInput = $("#mainImage");

const saveBtn = $("#saveBtn");
const toast = $("#toast");

const viewer = $("#imageViewer");
const viewerImage = $("#viewerImage");

const loading = $("#loadingScreen");

const settingModal = $("#settingModal");

// ==========================================
// Toast
// ==========================================

function toastMessage(text){

toast.textContent=text;

toast.classList.add("show");

clearTimeout(window.toastTimer);

window.toastTimer=setTimeout(()=>{

toast.classList.remove("show");

},1800);

}

// ==========================================
// Loading
// ==========================================

function loadingOn(){

loading.classList.add("show");

}

function loadingOff(){

loading.classList.remove("show");

}

// ==========================================
// Tab
// ==========================================

tabs.forEach(tab=>{

tab.onclick=()=>{

tabs.forEach(t=>t.classList.remove("active"));

pages.forEach(p=>p.classList.remove("active"));

tab.classList.add("active");

$("#"+tab.dataset.tab).classList.add("active");

};

});

// ==========================================
// D-Day
// ==========================================

const startDate=$("#startDate");
const dday=$("#dday");

function updateDday(){

if(!startDate.value){

dday.textContent="D+0";

return;

}

const s=new Date(startDate.value);

const t=new Date();

s.setHours(0,0,0,0);

t.setHours(0,0,0,0);

const diff=Math.floor((t-s)/(1000*60*60*24));

if(diff>=0){

dday.textContent=`D+${diff}`;

}else{

dday.textContent=`D${diff}`;

}

}

startDate.onchange=updateDday;

// ==========================================
// Cover Image
// ==========================================

imageInput.onchange=()=>{

const file=imageInput.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=e=>{

preview.src=e.target.result;

autoSave();

};

reader.readAsDataURL(file);

};

// ==========================================
// Viewer
// ==========================================

preview.onclick=()=>{

viewer.classList.add("show");

viewerImage.src=preview.src;

};

$("#closeViewer").onclick=()=>{

viewer.classList.remove("show");

};

viewer.onclick=e=>{

if(e.target===viewer){

viewer.classList.remove("show");

}

};

// ==========================================
// Home
// ==========================================

$("#backBtn").onclick=()=>{

location.href="index.html";

};

// ==========================================
// Setting
// ==========================================

$("#settingBtn").onclick=()=>{

settingModal.classList.add("show");

};

$("#closeSetting").onclick=()=>{

settingModal.classList.remove("show");

};

settingModal.onclick=e=>{

if(e.target===settingModal){

settingModal.classList.remove("show");

}

};
// ==========================================
// Storage
// ==========================================

const STORAGE_KEY = "DreamArchive_v2";

// ==========================================
// Collect Data
// ==========================================

function collectData(){

return{

archiveType:$("#archiveType").value,

dreamName:$("#dreamName").value,

startDate:$("#startDate").value,

intro:$("#intro").value,

characterName:$("#characterName").value,

height:$("#height").value,

birthday:$("#birthday").value,

age:$("#age").value,

mbti:$("#mbti").value,

job:$("#job").value,

appearanceText:$("#appearanceText").value,

worldName:$("#worldName").value,

group:$("#group").value,

ability:$("#ability").value,

settingText:$("#settingText").value,

storyText:$("#storyText").value,

cover:preview.src

};

}

// ==========================================
// Apply Data
// ==========================================

function applyData(data){

if(!data) return;

Object.keys(data).forEach(key=>{

const el=document.getElementById(key);

if(el){

el.value=data[key];

}

});

if(data.cover){

preview.src=data.cover;

}

updateDday();

}

// ==========================================
// Local Save
// ==========================================

function saveLocal(){

const data=collectData();

localStorage.setItem(

STORAGE_KEY,

JSON.stringify(data)

);

$("#lastSaveTime").textContent=

new Date().toLocaleString("ko-KR");

}

// ==========================================
// Local Load
// ==========================================

function loadLocal(){

const raw=

localStorage.getItem(STORAGE_KEY);

if(!raw) return;

applyData(JSON.parse(raw));

}

// ==========================================
// Auto Save
// ==========================================

function autoSave(){

saveLocal();

saveCloud();

toastMessage("자동 저장");

}

document

.querySelectorAll("input,textarea,select")

.forEach(el=>{

el.addEventListener("input",autoSave);

el.addEventListener("change",autoSave);

});

// ==========================================
// Save Button
// ==========================================

saveBtn.onclick=()=>{

autoSave();

};

// ==========================================
// Supabase Save
// ==========================================

async function saveCloud(){

if(!db) return;

try{

await db

.from("archives")

.upsert([{

id:1,

data:collectData(),

updated_at:new Date().toISOString()

}]);

}catch(e){

console.log(e);

}

}

// ==========================================
// Supabase Load
// ==========================================

async function loadCloud(){

if(!db) return;

loadingOn();

try{

const{

data,

error

}=await db

.from("archives")

.select("*")

.eq("id",1)

.single();

if(!error&&data){

applyData(data.data);

}

}catch(e){

console.log(e);

}

loadingOff();

}
// ==========================================
// Relation
// ==========================================

const relationList=$("#relationList");
const relationTemplate=$("#relationTemplate");

$("#addRelation").onclick=()=>{

const node=relationTemplate.content.cloneNode(true);

const card=node.querySelector(".relationCard");

const preview=card.querySelector(".relationPreview");

const photo=card.querySelector(".relationPhoto");

preview.onclick=()=>photo.click();

photo.onchange=()=>{

const file=photo.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=e=>{

preview.src=e.target.result;

autoSave();

};

reader.readAsDataURL(file);

};

preview.addEventListener("click",()=>{

viewer.classList.add("show");

viewerImage.src=preview.src;

});

card.querySelector(".deleteRelation").onclick=()=>{

card.remove();

autoSave();

};

card.querySelectorAll("input,textarea").forEach(el=>{

el.oninput=autoSave;

el.onchange=autoSave;

});

relationList.appendChild(card);

autoSave();

};

// ==========================================
// Timeline
// ==========================================

const timelineList=$("#timelineList");
const timelineTemplate=$("#timelineTemplate");

$("#addTimeline").onclick=()=>{

const node=timelineTemplate.content.cloneNode(true);

const card=node.querySelector(".timelineCard");

card.querySelector(".deleteTimeline").onclick=()=>{

card.remove();

autoSave();

};

card.querySelectorAll("input,textarea").forEach(el=>{

el.oninput=autoSave;

el.onchange=autoSave;

});

timelineList.appendChild(card);

autoSave();

};

// ==========================================
// Observe
// ==========================================

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

// ==========================================
// Gallery Viewer
// ==========================================

document.addEventListener("click",e=>{

if(

e.target.classList.contains("relationPreview")

){

viewer.classList.add("show");

viewerImage.src=e.target.src;

}

});
// ==========================================
// AU
// ==========================================

const auList=$("#auList");
const auTemplate=$("#auTemplate");

$("#addAU").onclick=()=>{

const node=auTemplate.content.cloneNode(true);

const card=node.querySelector(".auCard");

const preview=card.querySelector(".auPreview");

const imageInput=card.querySelector(".auImage");

const galleryInput=card.querySelector(".auGallery");

const gallery=card.querySelector(".galleryPreview");

// --------------------------
// Cover Image
// --------------------------

preview.onclick=()=>imageInput.click();

imageInput.onchange=()=>{

const file=imageInput.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=e=>{

preview.src=e.target.result;

autoSave();

};

reader.readAsDataURL(file);

};

// --------------------------
// Gallery
// --------------------------

galleryInput.onchange=()=>{

gallery.innerHTML="";

[...galleryInput.files].forEach(file=>{

const reader=new FileReader();

reader.onload=e=>{

const img=document.createElement("img");

img.src=e.target.result;

img.onclick=()=>{

viewer.classList.add("show");

viewerImage.src=img.src;

};

gallery.appendChild(img);

};

reader.readAsDataURL(file);

});

autoSave();

};

// --------------------------
// Delete
// --------------------------

card.querySelector(".deleteAU").onclick=()=>{

card.remove();

autoSave();

};

// --------------------------
// Auto Save
// --------------------------

card.querySelectorAll("input,textarea").forEach(el=>{

el.oninput=autoSave;

el.onchange=autoSave;

});

// --------------------------
// Preview Viewer
// --------------------------

preview.addEventListener("click",()=>{

viewer.classList.add("show");

viewerImage.src=preview.src;

});

auList.appendChild(card);

autoSave();

};

// ==========================================
// AU Observer
// ==========================================

new MutationObserver(()=>{

saveLocal();

}).observe(auList,{

childList:true

});

// ==========================================
// Gallery Viewer
// ==========================================

document.addEventListener("click",e=>{

if(e.target.closest(".galleryPreview img")){

viewer.classList.add("show");

viewerImage.src=e.target.src;

}

});

// ==========================================
// Update Counter
// ==========================================

function updateAUCount(){

const count=auList.querySelectorAll(".auCard").length;

const stat=$("#statAU");

if(stat){

stat.textContent=count;

}

}

new MutationObserver(updateAUCount).observe(auList,{

childList:true

});

updateAUCount();
// ==========================================
// Commission
// ==========================================

const commissionList = $("#commissionList");
const commissionTemplate = $("#commissionTemplate");

$("#addCommission").onclick = () => {

const node = commissionTemplate.content.cloneNode(true);

const card = node.querySelector(".commissionCard");

const preview = card.querySelector(".commissionPreview");

const imageInput = card.querySelector(".commissionImage");

const galleryInput = card.querySelector(".commissionGalleryInput");

const gallery = card.querySelector(".commissionGalleryPreview");

// --------------------------
// Cover Image
// --------------------------

preview.onclick = () => imageInput.click();

imageInput.onchange = () => {

const file = imageInput.files[0];

if(!file) return;

const reader = new FileReader();

reader.onload = e => {

preview.src = e.target.result;

autoSave();

};

reader.readAsDataURL(file);

};

// --------------------------
// Gallery
// --------------------------

galleryInput.onchange = () => {

gallery.innerHTML = "";

[...galleryInput.files].forEach(file=>{

const reader = new FileReader();

reader.onload = e => {

const img = document.createElement("img");

img.src = e.target.result;

img.onclick = ()=>{

viewer.classList.add("show");

viewerImage.src = img.src;

};

gallery.appendChild(img);

};

reader.readAsDataURL(file);

});

autoSave();

};

// --------------------------
// Delete
// --------------------------

card.querySelector(".deleteCommission").onclick = () => {

card.remove();

autoSave();

};

// --------------------------
// Auto Save
// --------------------------

card.querySelectorAll("input,textarea").forEach(el=>{

el.oninput = autoSave;

el.onchange = autoSave;

});

// --------------------------
// Viewer
// --------------------------

preview.addEventListener("click",
// ==========================================
// JSON Export
// ==========================================

$("#exportJSON").onclick=()=>{

const data=collectData();

const blob=new Blob(

[JSON.stringify(data,null,2)],

{type:"application/json"}

);

const url=URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;

a.download="dream_archive.json";

a.click();

URL.revokeObjectURL(url);

toastMessage("JSON 백업 완료");

};

// ==========================================
// JSON Import
// ==========================================

$("#importJSON").onclick=()=>{

$("#jsonFile").click();

};

$("#jsonFile").onchange=e=>{

const file=e.target.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=x=>{

try{

const data=JSON.parse(x.target.result);

applyData(data);

autoSave();

toastMessage("불러오기 완료");

}catch{

toastMessage("JSON 오류");

}

};

reader.readAsText(file);

};

// ==========================================
// Gallery
// ==========================================

const galleryGrid=$("#galleryGrid");

function rebuildGallery(){

if(!galleryGrid) return;

galleryGrid.innerHTML="";

document

.querySelectorAll(

".auPreview,.commissionPreview,.relationPreview"

)

.forEach(img=>{

if(

!img.src ||

img.src.includes("default.png")

) return;

const clone=document.createElement("img");

clone.src=img.src;

clone.className="galleryImage";

clone.onclick=()=>{

viewer.classList.add("show");

viewerImage.src=clone.src;

};

galleryGrid.appendChild(clone);

});

document

.querySelectorAll(

".galleryPreview img,.commissionGalleryPreview img"

)

.forEach(img=>{

const clone=document.createElement("img");

clone.src=img.src;

clone.className="galleryImage";

clone.onclick=()=>{

viewer.classList.add("show");

viewerImage.src=clone.src;

};

galleryGrid.appendChild(clone);

});

}

// ==========================================
// Gallery Observe
// ==========================================

new MutationObserver(()=>{

rebuildGallery();

}).observe(document.body,{

childList:true,

subtree:true

});

rebuildGallery();
// ==========================================
// Last Save Time
// ==========================================

function updateLastSave(){

const now=new Date();

$("#lastSaveTime").textContent=

now.toLocaleString("ko-KR");

}

// ==========================================
// Cloud Save
// ==========================================

async function cloudSave(){

if(!db) return;

try{

loadingOn();

const data=collectData();

await db

.from("archives")

.upsert([{

id:1,

data:data,

updated_at:new Date().toISOString()

}]);

updateLastSave();

toastMessage("☁️ 클라우드 저장");

}catch(err){

console.error(err);

toastMessage("저장 실패");

}

loadingOff();

}

// ==========================================
// Cloud Load
// ==========================================

async function cloudLoad(){

if(!db) return;

try{

loadingOn();

const {data,error}=await db

.from("archives")

.select("*")

.eq("id",1)

.single();

if(error) return;

if(data){

applyData(data.data);

updateLastSave();

rebuildGallery();

}

}catch(err){

console.error(err);

}

loadingOff();

}

// ==========================================
// Auto Sync
// ==========================================

let saveTimer;

function syncSave(){

clearTimeout(saveTimer);

saveTimer=setTimeout(async()=>{

saveLocal();

await cloudSave();

},800);

}

document

.querySelectorAll("input,textarea,select")

.forEach(el=>{

el.addEventListener("input",syncSave);

el.addEventListener("change",syncSave);

});

// ==========================================
// Save Button
// ==========================================

saveBtn.onclick=async()=>{

saveLocal();

await cloudSave();

};

// ==========================================
// Delete Archive
// ==========================================

$("#deleteDream").onclick=async()=>{

if(!confirm("정말 삭제하시겠습니까?")) return;

localStorage.removeItem(STORAGE_KEY);

if(db){

try{

await db

.from("archives")

.delete()

.eq("id",1);

}catch(err){

console.error(err);

}

}

location.reload();

};

// ==========================================
// Ctrl + S
// ==========================================

document.addEventListener("keydown",async e=>{

if(e.ctrlKey&&e.key==="s"){

e.preventDefault();

saveLocal();

await cloudSave();

}

});
// ==========================================
// Initialize
// ==========================================

window.addEventListener("load",async()=>{

loadLocal();

await cloudLoad();

updateDday();

rebuildGallery();

updateAUCount();

updateCommissionCount();

toastMessage("Dream Archive Ready");

});

// ==========================================
// Auto Save (30s)
// ==========================================

setInterval(async()=>{

saveLocal();

await cloudSave();

},30000);

// ==========================================
// Before Exit
// ==========================================

window.addEventListener("beforeunload",()=>{

saveLocal();

});

// ==========================================
// Statistics
// ==========================================

function updateStats(){

const au=$("#statAU");

const commission=$("#statCommission");

const day=$("#statDay");

if(day){

day.textContent=$("#dday").textContent;

}

if(au){

au.textContent=

document.querySelectorAll(".auCard").length;

}

if(commission){

commission.textContent=

document.querySelectorAll(".commissionCard").length;

}

}

setInterval(updateStats,1000);

// ==========================================
// Mutation Update
// ==========================================

new MutationObserver(()=>{

updateStats();

rebuildGallery();

}).observe(document.body,{

childList:true,

subtree:true

});

// ==========================================
// Change Cover
// ==========================================

$("#changeCover").onclick=()=>{

imageInput.click();

};

// ==========================================
// ESC Close Viewer
// ==========================================

document.addEventListener("keydown",e=>{

if(e.key==="Escape"){

viewer.classList.remove("show");

settingModal.classList.remove("show");

}

});

// ==========================================
// Drag & Drop Cover
// ==========================================

preview.addEventListener("dragover",e=>{

e.preventDefault();

});

preview.addEventListener("drop",e=>{

e.preventDefault();

const file=e.dataTransfer.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=x=>{

preview.src=x.target.result;

autoSave();

};

reader.readAsDataURL(file);

});

// ==========================================
// Finish
// ==========================================

console.log("Dream Archive v2 Loaded");