let members = JSON.parse(localStorage.getItem('uk49_members') || '{"test":{"password":"1234"}}');
let payments = JSON.parse(localStorage.getItem('uk49_payments_final') || '[]');
let currentIdx = 0;
let selectedFileData = null;
let btnPos = {x:50, y:85};

function adminLogin(){
  let pass = document.getElementById('adminPass').value;
  if(pass==="Admin2025"){
    document.getElementById('loginCard').style.display="none";
    document.getElementById('uploadCard').style.display="block";
    document.getElementById('imgOrder').value = payments.length + 1;
    renderExisting(); renderMembers();
  } else alert("Admin password is Admin2025");
}

function createMember(){
  let u = document.getElementById('newMemberUser').value.trim();
  let p = document.getElementById('newMemberPass').value.trim();
  if(!u ||!p) return alert("Enter username and password");
  members[u] = {password:p};
  localStorage.setItem('uk49_members', JSON.stringify(members));
  document.getElementById('newMemberUser').value="";
  document.getElementById('newMemberPass').value="";
  renderMembers();
  alert("✅ Member created: " + u + " / " + p);
}

function renderMembers(){
  let div=document.getElementById('memberList');
  if(!div) return;
  let html="<small><b>Members:</b></small><br>";
  Object.keys(members).forEach(k=>{
    html+=`<div style="display:flex; justify-content:space-between; background:white; padding:5px 8px; border-radius:6px; margin:3px 0; font-size:12px;"><span>${k} / ${members[k].password}</span><span style="color:red; cursor:pointer; font-weight:bold;" onclick="delMember('${k}')">DELETE</span></div>`;
  });
  div.innerHTML=html;
}

function delMember(k){
  if(confirm("Delete "+k+"?")){
    delete members[k];
    localStorage.setItem('uk49_members', JSON.stringify(members));
    renderMembers();
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  let tog = document.getElementById('continueToggle');
  if(tog){
    tog.addEventListener('change', function(){
      let txt = document.getElementById('toggleText');
      if(txt){
        txt.innerText = this.checked? "SHOW" : "HIDE";
        txt.style.color = this.checked? "#0d6efd" : "#ef4444";
      }
      let btn = document.getElementById('draggableBtn');
      if(btn) btn.style.opacity = this.checked? "1" : "0.3";
    });
  }
});

function previewFile(){
  let file = document.getElementById('fileInput').files[0];
  if(!file) return;
  let reader = new FileReader();
  reader.onload = e => {
    selectedFileData = e.target.result;
    document.getElementById('dragPreviewImg').src = selectedFileData;
    document.getElementById('dragArea').style.display="block";
    document.getElementById('dragHint').style.display="block";
    btnPos = {x:50, y:85};
    let btn = document.getElementById('draggableBtn');
    btn.style.left="50%"; btn.style.top="85%"; btn.style.opacity="1"; btn.style.display="block";
    makeDraggable();
  };
  reader.readAsDataURL(file);
}

function makeDraggable(){
  let btn = document.getElementById('draggableBtn');
  let area = document.getElementById('dragArea');
  let isDragging = false;

  function getPos(e){
    let rect = area.getBoundingClientRect();
    let clientX = e.touches? e.touches[0].clientX : e.clientX;
    let clientY = e.touches? e.touches[0].clientY : e.clientY;
    let x = ((clientX - rect.left) / rect.width) * 100;
    let y = ((clientY - rect.top) / rect.height) * 100;
    x = Math.max(5, Math.min(95, x));
    y = Math.max(5, Math.min(95, y));
    return {x,y};
  }

  btn.onmousedown = btn.ontouchstart = function(e){
    isDragging=true;
    e.preventDefault();
  };

  window.onmousemove = window.ontouchmove = function(e){
    if(!isDragging) return;
    let pos = getPos(e);
    btnPos = pos;
    btn.style.left = pos.x + "%";
    btn.style.top = pos.y + "%";
  };

  window.onmouseup = window.ontouchend = function(){
    isDragging=false;
  };
}

function uploadImage(){
  if(!selectedFileData) return alert("Choose image first");
  let order = parseInt(document.getElementById('imgOrder').value) || payments.length+1;
  let showBtn = document.getElementById('continueToggle').checked;
  payments.push({
    id:Date.now(),
    data:selectedFileData,
    order:order,
    showButton:showBtn,
    btnX:btnPos.x,
    btnY:btnPos.y
  });
  payments.sort((a,b)=>a.order-b.order);
  localStorage.setItem('uk49_payments_final', JSON.stringify(payments));
  document.getElementById('uploadCard').style.display="none";
  document.getElementById('successCard').style.display="block";
  document.getElementById('posText').innerText = `X:${Math.round(btnPos.x)}% Y:${Math.round(btnPos.y)}% - ${showBtn?'SHOW':'HIDE'}`;
  selectedFileData=null;
  document.getElementById('dragArea').style.display="none";
  document.getElementById('dragHint').style.display="none";
  document.getElementById('fileInput').value="";
}

function showUpload(){
  document.getElementById('successCard').style.display="none";
  document.getElementById('uploadCard').style.display="block";
  document.getElementById('imgOrder').value = payments.length + 1;
  renderExisting();
  renderMembers();
}

function renderExisting(){
  let list=document.getElementById('existingList');
  if(!list) return;
  if(payments.length===0){
    list.innerHTML="<small>No images yet</small>";
    return;
  }
  let html=`<hr><small><b>Uploaded (${payments.length})</b></small>`;
  payments.forEach((p,i)=>{
    html+=`<div style="border:1px solid #ddd; border-radius:10px; padding:8px; margin:8px 0; display:flex; gap:10px;"><img src="${p.data}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;"><div><b>Order ${p.order}</b><br><small>${Math.round(p.btnX)}%,${Math.round(p.btnY)}% | ${p.showButton?'SHOW':'HIDE'}</small><br><button onclick="deleteImg(${i})" style="background:red;color:white;border:none;padding:3px 8px;border-radius:5px;font-size:11px; cursor:pointer;">Delete</button></div></div>`;
  });
  list.innerHTML=html;
}

function deleteImg(i){
  if(!confirm("Delete this image?")) return;
  payments.splice(i,1);
  localStorage.setItem('uk49_payments_final', JSON.stringify(payments));
  renderExisting();
}

// --- MEMBER PART --- FIXED BUTTON ---
function memberLogin(){
  let u=document.getElementById('username').value.trim();
  let p=document.getElementById('password').value.trim();
  if(!members[u] || members[u].password!==p) return alert("Wrong password. Ask Admin to create your account.");
  if(payments.length===0) return alert("No images yet - Admin must upload first");
  payments.sort((a,b)=>a.order-b.order);
  currentIdx=0;
  document.getElementById('loginCard').style.display="none";
  document.getElementById('imageCard').style.display="block";
  showMemberImage();
}

function showMemberImage(){
  let data=payments[currentIdx];
  let img = document.getElementById('memberImg');
  let tag = document.getElementById('imgTag');
  let btn = document.getElementById('continueBtn');

  img.src=data.data;
  tag.innerText=`Image ${currentIdx+1} / ${payments.length}`;

  btn.style.left=data.btnX+"%";
  btn.style.top=data.btnY+"%";
  btn.style.display="block";
  btn.style.zIndex="10";

  // FIX: If admin set HIDE, still show faint but clickable
  if(data.showButton){
    btn.style.opacity="1";
  } else {
    btn.style.opacity="0.15"; // faint so member can still find it
  }

  btn.style.pointerEvents="auto";
}

// FIXED: This is now working 100%
function nextImage(){
  console.log("Continue clicked, idx:", currentIdx);
  currentIdx++;
  if(currentIdx>=payments.length){
    alert("🎉 You have viewed all images.");
    currentIdx=payments.length-1;
    return;
  }
  showMemberImage();
}

// Make function global
window.nextImage = nextImage;
window.memberLogin = memberLogin;
window.adminLogin = adminLogin;
window.createMember = createMember;
window.delMember = delMember;
window.deleteImg = deleteImg;
window.uploadImage = uploadImage;
window.showUpload = showUpload;
window.previewFile = previewFile;
