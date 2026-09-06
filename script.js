const ADMIN_PASS = "Admin2025";
let vouchers = JSON.parse(localStorage.getItem('vouchers')||'{}');
let results = JSON.parse(localStorage.getItem('results')||'{}'); // {normal:[], vip:[]}
let vipMembers = JSON.parse(localStorage.getItem('vipMembers')||'[]');

function checkPass(){
  if(document.getElementById('pass').value===ADMIN_PASS){
    document.getElementById('loginBox').style.display='none';
    document.getElementById('adminPanel').style.display='block';
    loadVIPTable();
  } else alert('Wrong Password')
}

function saveNums(){
  results.normal = document.getElementById('normalNums').value;
  results.vip = document.getElementById('vipNums').value;
  localStorage.setItem('results', JSON.stringify(results));
  alert('Numbers Saved!')
}

function addVIP(){
  let member = {
    name: document.getElementById('vipName').value,
    phone: document.getElementById('vipPhone').value,
    balance: parseInt(document.getElementById('vipBalance').value),
    status: 'LOCKED'
  };
  vipMembers.push(member);
  localStorage.setItem('vipMembers', JSON.stringify(vipMembers));
  loadVIPTable();
  alert('VIP Added!')
}

function postPayment(){
  let index = document.getElementById('vipList').value;
  let amount = parseInt(document.getElementById('payAmount').value);
  vipMembers[index].balance -= amount;
  if(vipMembers[index].balance <= 0){
    vipMembers[index].balance = 0;
    vipMembers[index].status = 'UNLOCKED';
  }
  localStorage.setItem('vipMembers', JSON.stringify(vipMembers));
  loadVIPTable();
  alert('Payment Posted!')
}

function loadVIPTable(){
  let table = '<tr><th>Name</th><th>Phone</th><th>Balance</th><th>Status</th></tr>';
  let options = '';
  vipMembers.forEach((m,i)=>{
    table += `<tr><td>${m.name}</td><td>${m.phone}</td><td>R${m.balance}</td><td>${m.status}</td></tr>`;
    options += `<option value="${i}">${m.name} - R${m.balance}</option>`;
  });
  document.getElementById('vipTable').innerHTML = table;
  document.getElementById('vipList').innerHTML = options;
}
