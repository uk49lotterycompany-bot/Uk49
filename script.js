const ADMIN_PASS = "Admin2025";
let members = JSON.parse(localStorage.getItem('members')||'{}');
let results = JSON.parse(localStorage.getItem('results')||'{}');

// ADMIN LOGIN
function checkPass(){
  if(document.getElementById('pass').value===ADMIN_PASS){
    document.getElementById('loginBox').style.display='none';
    document.getElementById('adminPanel').style.display='block';
    loadMemberList();
  } else alert('Wrong Admin Password')
}

// ADMIN: ADD MEMBER + SET PASSWORD
function addMember(){
  let user = document.getElementById('newUser').value.trim();
  let pass = document.getElementById('newPass').value.trim();
  if(user=='' || pass==''){ alert('Enter username and password'); return; }

  members[user] = {password: pass};
  localStorage.setItem('members', JSON.stringify(members));
  alert('Member Added: '+user);
  document.getElementById('newUser').value = '';
  document.getElementById('newPass').value = '';
  loadMemberList();
}

function loadMemberList(){
  let list = '<h4>Current Members:</h4>';
  for(let u in members){
    list += `<p><b>${u}</b> - Password: ${members[u].password}</p>`;
  }
  document.getElementById('memberList').innerHTML = list;
}

// SAVE NUMBERS
function saveNums(){
  results.normal = document.getElementById('normalNums').value;
  localStorage.setItem('results', JSON.stringify(results));
  alert('Numbers Saved!')
}

// MEMBER LOGIN - WITH PASSWORD
function login(){
  let user = document.getElementById('username').value.trim();
  let pass = document.getElementById('password').value.trim();

  if(user=='' || pass==''){
    alert('Please enter username and password');
    return;
  }

  // 1. CHECK IF USER EXISTS
  if(!members[user]){
    alert('INVALID USERNAME');
    document.getElementById('password').value = '';
    return;
  }
  // 2. CHECK IF PASSWORD IS CORRECT
  if(members[user].password!== pass){
    alert('WRONG PASSWORD');
    document.getElementById('password').value = '';
    return;
  }

  // IF CORRECT - OPEN
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('normalArea').style.display = 'block';
  document.getElementById('normalNums').innerText = results.normal || 'Admin has not posted numbers yet';
}
