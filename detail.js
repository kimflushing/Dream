// ===========================
// detail.js (3/6)
// Character
// ===========================

const params = new URLSearchParams(location.search);

const archiveId = params.get("id");
const type = params.get("type") || "dream";

const characterList = document.getElementById("characterList");

// --------------------------
// 시작
// --------------------------

window.addEventListener("DOMContentLoaded",()=>{

    createDefaultCharacters();

    bindEvents();

});

// --------------------------
// 버튼
// --------------------------
function bindEvents(){

    document
    .getElementById("addCharacter")
    .onclick=async()=>{

        const name=prompt("캐릭터 이름");

        if(!name) return;

        await saveCharacter(name);

        await createDefaultCharacters();

    };

}

// --------------------------
// 기본 생성
// --------------------------

async function createDefaultCharacters(){

    characterList.innerHTML="";

    const { data,error }=await db

    .from("characters")

    .select("*")

    .eq("archive_id",archiveId);

    if(error){

        alert(error.message);

        return;

    }
    async function saveCharacter(name){

    const { error }=await db

    .from("characters")

    .insert({

        archive_id:archiveId,

        name:name,

        role:name

    });

    if(error){

        alert(error.message);

    }

    }

    if(data.length===0){

        if(type==="dream"){

            await saveCharacter("드림주");
            await saveCharacter("드림캐");

        }

        else if(type==="pair"){

            await saveCharacter("캐릭터 A");
            await saveCharacter("캐릭터 B");

        }

        else{

            await saveCharacter("자캐");

        }

        return createDefaultCharacters();

    }

    data.forEach(c=>{

        createCharacter(c.name);

    });

}

// --------------------------
// 캐릭터 생성
// --------------------------

async function createCharacter(title="새 캐릭터"){

    const template=document
    .getElementById("characterTemplate");

    const card=template.content
    .cloneNode(true);

    const root=card.querySelector(".characterCard");

    root.querySelector(".characterName").value=title;

    bindCharacter(root);

    characterList.appendChild(card);

}
const { error } = await db
.from("characters")
.insert({

    archive_id: archiveId,

    name: title,

    role: title

});

if(error){

    alert(error.message);

}
// --------------------------
// 카드 기능
// --------------------------

function bindCharacter(card){

    const image=card.querySelector(".characterImage");

    const input=card.querySelector(".characterImageInput");

    const button=card.querySelector(".changeCharacterImage");

    button.onclick=()=>{

        input.click();

    };

    input.onchange=(e)=>{

        const file=e.target.files[0];

        if(!file) return;

        const reader=new FileReader();

        reader.onload=()=>{

            image.src=reader.result;

        };

        reader.readAsDataURL(file);

    };

    card

    .querySelector(".addInfo")

    .onclick=()=>{

        addExtraInfo(card);

    };

}
// --------------------------
// 추가 정보
// --------------------------

function addExtraInfo(card){

    const wrap=card.querySelector(".extraInfo");

    const div=document.createElement("div");

    div.className="extraRow";

    div.innerHTML=`

<input
class="extraTitle"
placeholder="항목">

<input
class="extraValue"
placeholder="내용">

<button class="deleteExtra">

삭제

</button>

`;

    div

    .querySelector(".deleteExtra")

    .onclick=()=>{

        div.remove();

    };

    wrap.appendChild(div);

}
// --------------------------
// 대표 이미지
// --------------------------

const coverImage=document.getElementById("coverImage");

const coverInput=document.getElementById("coverInput");

document

.getElementById("changeCover")

.onclick=()=>{

    coverInput.click();

};

coverInput.onchange=(e)=>{

    const file=e.target.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=()=>{

        coverImage.src=reader.result;

    };

    reader.readAsDataURL(file);

};
