let members = JSON.parse(localStorage.getItem('uk49_members') || '{"test":{"password":"1234"}}');
let payments = JSON.parse(localStorage.getItem('uk49_payments_final') || '[]');
let currentIdx = 0;
let selectedFileData = null;
let btnPos = {x:50, y:85};

function adminLogin(){
  let pass = document.getElementById('adminPass').value;
  if(pass!=="Admin2025"){alert("Password is Admin2025");return}
  document.getElementById('loginCard').style.display="none";
  document.getElementById('uploadCard').style.display="block";
  document.getElementById('imgOrder').value = payments.length + 1;
  renderExisting(); renderMembers();
}

function createMember(){
  let u = document.getElementById('newMemberUser').value.trim();
  let p = document.getElementById('newMemberPass').value.trim();
  if(!u||!p){alert("Enter username and password");return}
  members[u]={password:p};
  localStorage.setItem('uk49_members',JSON.stringify(members));
  document.getElementById('newMemberUser').value="";document.getElementById('newMemberPass').value="";
  renderMembers();alert("✅ Created: "+u+" / "+p);
}
function renderMembers(){
  let div=document.getElementById('memberList');if(!div)return;
  let html="<small><b>Members:</b></small><br>";
  Object.keys(members).forEach(k=>{
    html+=`<div style="display:flex;justify-content:space-between;background:white;padding:5px 8px;border-radius:6px;margin:3px 0;font-size:12px"><span>${k} / ${members[k].password}</span><span style="color:red;cursor:pointer" onclick="delMember('${k}')">X</span></div>`;
  });
  div.innerHTML=html;
}
function delMember(k){if(confirm("Delete "+k+"?")){delete members[k];localStorage.setItem('uk49_members',JSON.stringify(members));renderMembers()}}

let tog=document.getElementById('continueToggle');
if(tog){
 tog.addEventListener('change',function(){
  let txt=document.getElementById('toggleText');
  txt.innerText=this.checked?"SHOW":"HIDE";
  txt.style.color=this.checked?"#0d6efd":"#ef4444";
  let btn=document.getElementById('draggableBtn');
  if(btn)btn.style.opacity=this.checked?"1":"0.25";
 });
}

function previewFile(){
  let file=document.getElementById('fileInput').files[0];if(!file)return;
  let reader=new FileReader();
  reader.onload=e=>{
    // compress like before to make upload work
    let img=new Image();
    img.onload=()=>{
      let canvas=document.createElement('canvas');
      let maxW=800;let scale=maxW/img.width;
      if(img.width>maxW){canvas.width=maxW;canvas.height=img.height*scale}else{canvas.width=img.width;canvas.height=img.height}
      canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
      selectedFileData=canvas.toDataURL('image/jpeg',0.75);
      document.getElementById('dragPreviewImg').src=selectedFileData;
      document.getElementById('dragArea').style.display="block";
      btnPos={x:50,y:85};
      let btn=document.getElementById('draggableBtn');
      btn.style.left="50%";btn.style.top="85%";btn.style.opacity="1";btn.style.display="block";
      makeDraggable();
    };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
}

function makeDraggable(){
  let btn=document.getElementById('draggableBtn');
  let area=document.getElementById('dragArea');
  let dragging=false;
  function getPos(e){
    let rect=area.getBoundingClientRect();
    let cx=e.touches?e.touches[0].clientX:e.clientX;
    let cy=e.touches?e.touches[0].clientY:e.clientY;
    let x=((cx-rect.left)/rect.width)*100;
    let y=((cy-rect.top)/rect.height)*100;
    return {x:Math.max(5,Math.min(95,x)),y:Math.max(5,Math.min(95,y))};
  }
  btn.onmousedown=btn.ontouchstart=e=>{dragging=true;e.preventDefault()};
  window.onmousemove=window.ontouchmove=e=>{if(!dragging)return;let p=getPos(e);btnPos=p;btn.style.left=p.x+"%";btn.style.top=p.y+"%";};
  window.onmouseup=window.ontouchend=()=>dragging=false;
}

function uploadImage(){
  if(!selectedFileData){alert("Choose image first");return}
  let order=parseInt(document.getElementById('imgOrder').value)||payments.length+1;
  let show=document.getElementById('continueToggle').checked;
  payments.push({id:Date.now(),data:selectedFileData,order:order,showButton:show,btnX:btnPos.x,btnY:btnPos.y});
  payments.sort((a,b)=>a.order-b.order);
  try{localStorage.setItem('uk49_payments_final',JSON.stringify(payments))}catch(e){alert("Storage full, delete old images");return}
  document.getElementById('uploadCard').style.display="none";
  document.getElementById('successCard').style.display="block";
  document.getElementById('posText').innerText=`X:${Math.round(btnPos.x)}% Y:${Math.round(btnPos.y)}% - ${show?'SHOW':'HIDE'}`;
  selectedFileData=null;document.getElementById('dragArea').style.display="none";document.getElementById('fileInput').value="";
}

function showUpload(){
  document.getElementById('successCard').style.display="none";
  document.getElementById('uploadCard').style.display="block";
  document.getElementById('imgOrder').value=payments.length+1;
  renderExisting();renderMembers();
}

function renderExisting(){
  let list=document.getElementById('existingList');if(!list)return;
  if(payments.length===0){list.innerHTML="<small>No images yet</small>";return}
  let html=`<hr><small><b>Uploaded (${payments.length})</b></small>`;
  payments.forEach((p,i)=>{
    html+=`<div style="border:1px solid #ddd;border-radius:10px;padding:8px;margin:8px 0;display:flex;gap:10px"><img src="${p.data}" style="width:60px;height:80px;object-fit:contain;background:white;border-radius:8px"><div><b>Order ${p.order}</b><br><small>${Math.round(p.btnX)}%,${Math.round(p.btnY)}% | ${p.showButton?'SHOW':'HIDE'}</small><br><button onclick="deleteImg(${i})" style="background:red;color:white;border:none;padding:3px 8px;border-radius:5px;font-size:11px">Delete</button></div></div>`;
  });
  list.innerHTML=html;
}
function deleteImg(i){if(!confirm("Delete?"))return;payments.splice(i,1);localStorage.setItem('uk49_payments_final',JSON.stringify(payments));renderExisting()}

function memberLogin(){
  let u=document.getElementById('username').value.trim();
  let p=document.getElementById('password').value.trim();
  if(!members[u]||members[u].password!==p){alert("Wrong login");return}
  if(payments.length===0){alert("No images uploaded by admin");return}
  payments.sort((a,b)=>a.order-b.order);currentIdx=0;
  document.getElementById('loginCard').style.display="none";
  document.getElementById('imageCard').style.display="block";
  showMemberImage();
}
function showMemberImage(){
  let d=payments[currentIdx];
  document.getElementById('memberImg').src=d.data;
  document.getElementById('imgTag').innerText=`Image ${currentIdx+1}/${payments.length}`;
  let btn=document.getElementById('continueBtn');
  btn.style.left=d.btnX+"%";btn.style.top=d.btnY+"%";btn.style.display="block";
  if(d.showButton){btn.style.opacity="1";btn.style.pointerEvents="auto"}
  else{btn.style.opacity="0.15";btn.style.pointerEvents="auto"}
}
function nextImage(){
  currentIdx++;
  if(currentIdx>=payments.length){alert("End of images");currentIdx=payments.length-1;return}
  showMemberImage();
}
