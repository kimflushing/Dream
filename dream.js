// ==========================================
// Dream Archive v3
// ==========================================

"use strict";

// ==========================================
// Shortcut
// ==========================================

const $ = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);

// ==========================================
// Supabase
// ==========================================

const db = window.supabaseClient || null;

// ==========================================
// LocalStorage
// ==========================================

const STORAGE_KEY = "DreamArchive_v3";

// ==========================================
// Elements
// ==========================================

const tabs = $$(".tab");
const pages = $$(".tabContent");

const preview = $("#previewImage");
const imageInput = $("#mainImage");

const saveBtn = $("#saveBtn");
const backBtn = $("#backBtn");

const toast = $("#toast");

const viewer = $("#imageViewer");
const viewerImage = $("#viewerImage");
const closeViewer = $("#closeViewer");

const loading = $("#loadingScreen");

const settingModal = $("#settingModal");
const settingBtn = $("#settingBtn");
const closeSetting = $("#closeSetting");

const startDate = $("#startDate");
const dday = $("#dday");

// ==========================================
// Toast
// ==========================================

let toastTimer = null;

function toastMessage(text){

    if(!toast) return;

    toast.textContent = text;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(()=>{

        toast.classList.remove("show");

    },1800);

}

// ==========================================
// Loading
// ==========================================

function loadingOn(){

    if(loading){

        loading.classList.add("show");

    }

}

function loadingOff(){

    if(loading){

        loading.classList.remove("show");

    }

}

// ==========================================
// Tab
// ==========================================

tabs.forEach(tab=>{

    tab.addEventListener("click",()=>{

        tabs.forEach(t=>t.classList.remove("active"));

        pages.forEach(p=>p.classList.remove("active"));

        tab.classList.add("active");

        const page=$("#"+tab.dataset.tab);

        if(page){

            page.classList.add("active");

        }

    });

});

// ==========================================
// D-Day
// ==========================================

function updateDday(){

    if(!startDate || !dday) return;

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

    dday.textContent=

        diff>=0 ? `D+${diff}` : `D${diff}`;

}

if(startDate){

    startDate.addEventListener("change",updateDday);

}

// ==========================================
// Cover Image
// ==========================================

if(imageInput){

imageInput.addEventListener("change",()=>{

    const file=imageInput.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=e=>{

        preview.src=e.target.result;

        autoSave();

    };

    reader.readAsDataURL(file);

});

}

// ==========================================
// Viewer
// ==========================================

if(preview){

preview.addEventListener("click",()=>{

    viewer.classList.add("show");

    viewerImage.src=preview.src;

});

}

if(closeViewer){

closeViewer.onclick=()=>{

    viewer.classList.remove("show");

};

}

if(viewer){

viewer.onclick=e=>{

    if(e.target===viewer){

        viewer.classList.remove("show");

    }

};

}

// ==========================================
// Header Buttons
// ==========================================

if(backBtn){

backBtn.onclick=()=>{

    location.href="index.html";

};

}

if(settingBtn){

settingBtn.onclick=()=>{

    settingModal.classList.add("show");

};

}

if(closeSetting){

closeSetting.onclick=()=>{

    settingModal.classList.remove("show");

};

}

if(settingModal){

settingModal.onclick=e=>{

    if(e.target===settingModal){

        settingModal.classList.remove("show");

    }

};

}
// ==========================================
// Collect Data
// ==========================================

function collectData(){

    return{

        archiveType:$("#archiveType")?.value||"",

        dreamName:$("#dreamName")?.value||"",

        startDate:$("#startDate")?.value||"",

        intro:$("#intro")?.value||"",

        characterName:$("#characterName")?.value||"",

        height:$("#height")?.value||"",

        birthday:$("#birthday")?.value||"",

        age:$("#age")?.value||"",

        mbti:$("#mbti")?.value||"",

        job:$("#job")?.value||"",

        appearanceText:$("#appearanceText")?.value||"",

        worldName:$("#worldName")?.value||"",

        group:$("#group")?.value||"",

        ability:$("#ability")?.value||"",

        settingText:$("#settingText")?.value||"",

        storyText:$("#storyText")?.value||"",

        cover:preview ? preview.src : ""

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

    if(data.cover && preview){

        preview.src=data.cover;

    }

    updateDday();

}

// ==========================================
// Local Save
// ==========================================

function saveLocal(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(

            collectData()

        )

    );

    const time=$("#lastSaveTime");

    if(time){

        time.textContent=

        new Date().toLocaleString("ko-KR");

    }

}

// ==========================================
// Local Load
// ==========================================

function loadLocal(){

    const raw=

    localStorage.getItem(STORAGE_KEY);

    if(!raw) return;

    try{

        applyData(

            JSON.parse(raw)

        );

    }catch(e){

        console.error(e);

    }

}

// ==========================================
// Cloud Save
// ==========================================

async function saveCloud(){

    if(!db) return;

    try{

        await db

        .from("archives")

        .upsert([{

            id:1,

            data:collectData(),

            updated_at:

            new Date()

            .toISOString()

        }]);

    }

    catch(err){

        console.error(err);

    }

}

// ==========================================
// Cloud Load
// ==========================================

async function loadCloud(){

    if(!db) return;

    loadingOn();

    try{

        const{

            data,

            error

        }=

        await db

        .from("archives")

        .select("*")

        .eq("id",1)

        .single();

        if(!error && data){

            applyData(data.data);

        }

    }

    catch(err){

        console.error(err);

    }

    loadingOff();

}

// ==========================================
// Auto Save
// ==========================================

function autoSave(){

    saveLocal();

    saveCloud();

    toastMessage("자동 저장");

}

// ==========================================
// Inputs
// ==========================================

document

.querySelectorAll(

"input,textarea,select"

)

.forEach(el=>{

    el.addEventListener(

        "input",

        autoSave

    );

    el.addEventListener(

        "change",

        autoSave

    );

});

// ==========================================
// Save Button
// ==========================================

if(saveBtn){

saveBtn.onclick=()=>{

    autoSave();

};

}
// ==========================================
// Relation
// ==========================================

const relationList=$("#relationList");
const relationTemplate=$("#relationTemplate");

if($("#addRelation")){

$("#addRelation").onclick=()=>{

    const node=

    relationTemplate.content.cloneNode(true);

    const card=

    node.querySelector(".relationCard");

    const preview=

    card.querySelector(".relationPreview");

    const photo=

    card.querySelector(".relationPhoto");

    // ----------------------
    // Image
    // ----------------------

    preview.onclick=()=>{

        photo.click();

    };

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

    // ----------------------
    // Viewer
    // ----------------------

    preview.addEventListener("click",()=>{

        viewer.classList.add("show");

        viewerImage.src=preview.src;

    });

    // ----------------------
    // Delete
    // ----------------------

    card.querySelector(".deleteRelation")

    .onclick=()=>{

        card.remove();

        autoSave();

    };

    // ----------------------
    // Auto Save
    // ----------------------

    card.querySelectorAll(

    "input,textarea"

    ).forEach(el=>{

        el.oninput=autoSave;

        el.onchange=autoSave;

    });

    relationList.appendChild(card);

    autoSave();

};

}

// ==========================================
// Timeline
// ==========================================

const timelineList=$("#timelineList");

const timelineTemplate=$("#timelineTemplate");

if($("#addTimeline")){

$("#addTimeline").onclick=()=>{

    const node=

    timelineTemplate.content.cloneNode(true);

    const card=

    node.querySelector(".timelineCard");

    card.querySelector(

    ".deleteTimeline"

    ).onclick=()=>{

        card.remove();

        autoSave();

    };

    card.querySelectorAll(

    "input,textarea"

    ).forEach(el=>{

        el.oninput=autoSave;

        el.onchange=autoSave;

    });

    timelineList.appendChild(card);

    autoSave();

};

}

// ==========================================
// Observe
// ==========================================

if(relationList){

new MutationObserver(()=>{

    saveLocal();

}).observe(

relationList,

{

childList:true

}

);

}

if(timelineList){

new MutationObserver(()=>{

    saveLocal();

}).observe(

timelineList,

{

childList:true

}

);

}

// ==========================================
// Relation Viewer
// ==========================================

document.addEventListener(

"click",

e=>{

if(

e.target.classList.contains(

"relationPreview"

)

){

viewer.classList.add("show");

viewerImage.src=e.target.src;

}

}

);
// ==========================================
// AU
// ==========================================

const auList=$("#auList");
const auTemplate=$("#auTemplate");

if($("#addAU")){

$("#addAU").onclick=()=>{

    const node=
    auTemplate.content.cloneNode(true);

    const card=
    node.querySelector(".auCard");

    const preview=
    card.querySelector(".auPreview");

    const image=
    card.querySelector(".auImage");

    const galleryInput=
    card.querySelector(".auGallery");

    const gallery=
    card.querySelector(".galleryPreview");

    // ----------------------
    // Cover
    // ----------------------

    preview.onclick=()=>{

        image.click();

    };

    image.onchange=()=>{

        const file=image.files[0];

        if(!file) return;

        const reader=new FileReader();

        reader.onload=e=>{

            preview.src=e.target.result;

            autoSave();

            rebuildGallery();

        };

        reader.readAsDataURL(file);

    };

    // ----------------------
    // Gallery
    // ----------------------

    galleryInput.onchange=()=>{

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

                rebuildGallery();

            };

            reader.readAsDataURL(file);

        });

        autoSave();

    };

    // ----------------------
    // Auto Save
    // ----------------------

    card.querySelectorAll(

    "input,textarea"

    ).forEach(el=>{

        el.oninput=autoSave;

        el.onchange=autoSave;

    });

    // ----------------------
    // Delete
    // ----------------------

    card.querySelector(

    ".deleteAU"

    ).onclick=()=>{

        card.remove();

        rebuildGallery();

        updateAUCount();

        autoSave();

    };

    // ----------------------
    // Viewer
    // ----------------------

    preview.addEventListener("click",()=>{

        viewer.classList.add("show");

        viewerImage.src=preview.src;

    });

    auList.appendChild(card);

    updateAUCount();

    autoSave();

};

}

// ==========================================
// AU Counter
// ==========================================

function updateAUCount(){

    const stat=$("#statAU");

    if(!stat) return;

    stat.textContent=

    auList

    .querySelectorAll(".auCard")

    .length;

}

if(auList){

new MutationObserver(()=>{

    updateAUCount();

}).observe(

auList,

{

childList:true

}

);

}

updateAUCount();
// ==========================================
// Commission
// ==========================================

const commissionList=$("#commissionList");
const commissionTemplate=$("#commissionTemplate");

if($("#addCommission")){

$("#addCommission").onclick=()=>{

    const node=
    commissionTemplate.content.cloneNode(true);

    const card=
    node.querySelector(".commissionCard");

    const preview=
    card.querySelector(".commissionPreview");

    const image=
    card.querySelector(".commissionImage");

    const galleryInput=
    card.querySelector(".commissionGalleryInput");

    const gallery=
    card.querySelector(".commissionGalleryPreview");

    // ----------------------
    // Cover
    // ----------------------

    preview.onclick=()=>{

        image.click();

    };

    image.onchange=()=>{

        const file=image.files[0];

        if(!file) return;

        const reader=new FileReader();

        reader.onload=e=>{

            preview.src=e.target.result;

            rebuildGallery();

            autoSave();

        };

        reader.readAsDataURL(file);

    };

    // ----------------------
    // Gallery
    // ----------------------

    galleryInput.onchange=()=>{

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

                rebuildGallery();

            };

            reader.readAsDataURL(file);

        });

        autoSave();

    };

    // ----------------------
    // Auto Save
    // ----------------------

    card.querySelectorAll(
        "input,textarea"
    ).forEach(el=>{

        el.oninput=autoSave;

        el.onchange=autoSave;

    });

    // ----------------------
    // Delete
    // ----------------------

    card.querySelector(
        ".deleteCommission"
    ).onclick=()=>{

        card.remove();

        rebuildGallery();

        updateCommissionCount();

        autoSave();

    };

    // ----------------------
    // Viewer
    // ----------------------

    preview.addEventListener("click",()=>{

        viewer.classList.add("show");

        viewerImage.src=preview.src;

    });

    commissionList.appendChild(card);

    updateCommissionCount();

    autoSave();

};

}

// ==========================================
// Commission Counter
// ==========================================

function updateCommissionCount(){

    const stat=$("#statCommission");

    if(!stat) return;

    stat.textContent=

    commissionList
    .querySelectorAll(".commissionCard")
    .length;

}

if(commissionList){

new MutationObserver(()=>{

    updateCommissionCount();

}).observe(

commissionList,

{

childList:true

}

);

}

updateCommissionCount();
// ==========================================
// JSON Export
// ==========================================

const exportBtn=$("#exportJSON");
const importBtn=$("#importJSON");
const jsonFile=$("#jsonFile");

if(exportBtn){

exportBtn.onclick=()=>{

    const data=collectData();

    const blob=new Blob(

        [JSON.stringify(data,null,2)],

        {

            type:"application/json"

        }

    );

    const url=

    URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download="dream_archive.json";

    a.click();

    URL.revokeObjectURL(url);

    toastMessage("JSON 백업 완료");

};

}

// ==========================================
// JSON Import
// ==========================================

if(importBtn){

importBtn.onclick=()=>{

    jsonFile.click();

};

}

if(jsonFile){

jsonFile.onchange=e=>{

    const file=e.target.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=x=>{

        try{

            const data=

            JSON.parse(x.target.result);

            applyData(data);

            autoSave();

            rebuildGallery();

            toastMessage("불러오기 완료");

        }

        catch(err){

            console.error(err);

            toastMessage("JSON 오류");

        }

    };

    reader.readAsText(file);

};

}

// ==========================================
// Gallery
// ==========================================

const galleryGrid=$("#galleryGrid");

function rebuildGallery(){

    if(!galleryGrid) return;

    galleryGrid.innerHTML="";

    // 대표 이미지

    document.querySelectorAll(

    ".relationPreview,.auPreview,.commissionPreview"

    ).forEach(img=>{

        if(

            !img.src ||

            img.src.includes("default.png")

        ){

            return;

        }

        const clone=document.createElement("img");

        clone.src=img.src;

        clone.className="galleryImage";

        clone.onclick=()=>{

            viewer.classList.add("show");

            viewerImage.src=clone.src;

        };

        galleryGrid.appendChild(clone);

    });

    // 갤러리 이미지

    document.querySelectorAll(

    ".galleryPreview img,.commissionGalleryPreview img"

    ).forEach(img=>{

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
// Gallery Observer
// ==========================================

new MutationObserver(()=>{

    rebuildGallery();

}).observe(

document.body,

{

childList:true,

subtree:true

}

);

rebuildGallery();
// ==========================================
// Delete Archive
// ==========================================

const deleteArchive = $("#deleteArchive");

if(deleteArchive){

    deleteArchive.onclick = async () => {

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

}

// ==========================================
// Change Cover
// ==========================================

const changeCover = $("#changeCover");

if(changeCover){

    changeCover.onclick = () => {

        imageInput.click();

    };

}

// ==========================================
// ESC Close Viewer
// ==========================================

document.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        viewer.classList.remove("show");
        settingModal.classList.remove("show");

    }

});

// ==========================================
// Drag & Drop Cover
// ==========================================

preview.addEventListener("dragover", e => {

    e.preventDefault();

});

preview.addEventListener("drop", e => {

    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = x => {

        preview.src = x.target.result;

        autoSave();

    };

    reader.readAsDataURL(file);

});

// ==========================================
// Finish
// ==========================================

console.log("Dream Archive v3 Loaded");
