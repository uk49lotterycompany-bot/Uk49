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
    renderExisting();
  } else alert("Password is Admin2025");
}

document.getElementById('continueToggle')?.addEventListener('change', function(){
  let txt = document.getElementById('toggleText');
  txt.innerText = this.checked? "SHOW" : "HIDE";
  txt.style.color = this.checked? "#0d6efd" : "#ef4444";
  let btn = document.getElementById('draggableBtn');
  if(btn) btn.style.opacity = this.checked? "1" : "0.25";
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
    x = Math.max(5, Math.min(95, x)); y = Math.max(5, Math.min(95, y));
    return {x,y};
  }
  btn.onmousedown = btn.ontouchstart = function(e){ isDragging=true; e.preventDefault(); };
  window.onmousemove = window.ontouchmove = function(e){
    if(!isDragging) return;
    let pos = getPos(e); btnPos = pos;
    btn.style.left = pos.x + "%"; btn.style.top = pos.y + "%";
  };
  window.onmouseup = window.ontouchend = function(){ isDragging=false; };
}

function uploadImage(){
  if(!selectedFileData) return alert("Choose image first");
  let order = parseInt(document.getElementById('imgOrder').value) || payments.length+1;
  let showBtn = document.getElementById('continueToggle').checked;
  payments.push({id:Date.now(), data:selectedFileData, order:order, showButton:showBtn, btnX:btnPos.x, btnY:btnPos.y});
  payments.sort((a,b)=>a.order-b.order);
  localStorage.setItem('uk49_payments_final', JSON.stringify(payments));
  document.getElementById('uploadCard').style.display="none";
  document.getElementById('successCard').style.display="block";
  document.getElementById('posText').innerText = `X:${Math.round(btnPos.x)}% Y:${Math.round(btnPos.y)}% - ${showBtn?'SHOW':'HIDE but still clickable'}`;
  selectedFileData=null; document.getElementById('dragArea').style.display="none"; document.getElementById('dragHint').style.display="none"; document.getElementById('fileInput').value="";
}

function showUpload(){
  document.getElementById('successCard').style.display="none";
  document.getElementById('uploadCard').style.display="block";
  document.getElementById('imgOrder').value = payments.length + 1;
  renderExisting();
}

function renderExisting(){
  let list=document.getElementById('existingList');
  if(!list) return;
  if(payments.length===0){list.innerHTML="<small>No images yet</small>"; return;}
  let html=`<hr><small><b>Uploaded (${payments.length})</b></small>`;
  payments.forEach((p,i)=>{
    html+=`<div style="border:1px solid #ddd; border-radius:10px; padding:8px; margin:8px 0; display:flex; gap:10px;"><img src="${p.data}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;"><div><b>Order ${p.order}</b><br><small>${Math.round(p.btnX)}%,${Math.round(p.btnY)}% | ${p.showButton?'SHOW':'HIDE'}</small><br><button onclick="deleteImg(${i})" style="background:red;color:white;border:none;padding:3px 8px;border-radius:5px;font-size:11px;">Delete</button></div></div>`;
  });
  list.innerHTML=html;
}

function deleteImg(i){ if(!confirm("Delete?")) return; payments.splice(i,1); localStorage.setItem('uk49_payments_final', JSON.stringify(payments)); renderExisting(); }

function memberLogin(){
  let u=document.getElementById('username').value.trim();
  let p=document.getElementById('password').value.trim();
  if(!members[u] || members[u].password!==p) return alert("Try test / 1234");
  if(payments.length===0) return alert("No images yet");
  payments.sort((a,b)=>a.order-b.order); currentIdx=0;
  document.getElementById('loginCard').style.display="none";
  document.getElementById('imageCard').style.display="block";
  showMemberImage();
}

function showMemberImage(){
  let data=payments[currentIdx];
  document.getElementById('memberImg').src=data.data;
  document.getElementById('imgTag').innerText=`Image ${currentIdx+1}`;
  let btn=document.getElementById('continueBtn');
  btn.style.left=data.btnX+"%"; btn.style.top=data.btnY+"%";
  if(data.showButton){ btn.style.display="block"; btn.style.opacity="1"; btn.style.pointerEvents="auto"; }
  else { btn.style.display="block"; btn.style.opacity="0"; btn.style.pointerEvents="auto"; }
}

function nextImage(){
  currentIdx++;
  if(currentIdx>=payments.length){ alert("End of images."); currentIdx=payments.length-1; return;}
  showMemberImage();
}
