const ADMIN_PASS = "Admin2025";
let vouchers = JSON.parse(localStorage.getItem('vouchers')||'{}');
let results = JSON.parse(localStorage.getItem('results')||'{}');
let vipMembers = JSON.parse(localStorage.getItem('vipMembers')||'[]');
let winners = JSON.parse(localStorage.getItem('winners')||'[["Thabo","3500"],["Lindiwe","2200"]]');

// ADMIN LOGIN
function checkPass(){
  if(document.getElementById('pass').value===ADMIN_PASS){
    document.getElementById('loginBox').style.display='none';
    document.getElementById('adminPanel').style.display='block';
    loadVIPTable();
    document.getElementById('winner1Name').value = winners[0][0];
    document.getElementById('winner1Amount').value = winners[0][1];
    document.getElementById('winner2Name').value = winners[1][0];
    document.getElementById('winner2Amount').value = winners[1][1];
  } else alert('Wrong Password')
}

// SAVE NUMBERS
function saveNums(){
  results.normal = document.getElementById('normalNums').value;
  results.vip = document.getElementById('vipNums').value;
  localStorage.setItem('results', JSON.stringify(results));
  alert('Numbers Saved!')
}

// SAVE WINNERS
function saveWinners(){
  winners = [
    [document.getElementById('winner1Name').value, document.getElementById('winner1Amount').value],
    [document.getElementById('winner2Name').value, document.getElementById('winner2Amount').value]
  ];
  localStorage.setItem('winners', JSON.stringify(winners));
  alert('Ticker Updated! Refresh homepage to see it')
}

// GENERATE VOUCHERS
function genVoucher(){
  let code = Math.random().toString(36).substr(2,8).toUpperCase();
  let type = document.getElementById('type').value;
  vouchers[code] = {type:type, used:false};
  localStorage.setItem('vouchers', JSON.stringify(vouchers));
  document.getElementById('vouchers').innerHTML += `<p>${type.toUpperCase()} CODE: <b>${code}</b></p>`;
}

// VIP MANAGER
function addVIP(){
  vipMembers.push({name:document.getElementById('vipName').value, phone:document.getElementById('vipPhone').value, balance:parseInt(document.getElementById('vipBalance').value), status:'LOCKED'});
  localStorage.setItem('vipMembers', JSON.stringify(vipMembers));
  loadVIPTable();
}
function postPayment(){
  let i = document.getElementById('vipList').value;
  vipMembers[i].balance -= parseInt(document.getElementById('payAmount').value);
  if(vipMembers[i].balance <= 0){vipMembers[i].balance = 0; vipMembers[i].status = 'UNLOCKED';}
  localStorage.setItem('vipMembers', JSON.stringify(vipMembers));
  loadVIPTable();
}
function loadVIPTable(){
  let table = '<tr><th>Name</th><th>Phone</th><th>Balance</th><th>Status</th></tr>';
  let options = '';
  vipMembers.forEach((m,i)=>{table += `<td>${m.name}</td><td>${m.phone}</td><td>R${m.balance}</td><td>${m.status}</td></tr>`; options += `<option value="${i}">${m.name} - R${m.balance}</option>`;});
  document.getElementById('vipTable').innerHTML = table;
  document.getElementById('vipList').innerHTML = options;
}

// LOAD TICKER ON HOMEPAGE
function loadTicker(){
  let ticker = document.getElementById('ticker');
  if(ticker && winners.length > 1){
    ticker.innerHTML = `WINNER: ${winners[0][0]} won R${winners[0][1]}! | WINNER: ${winners[1][0]} won R${winners[1][1]}!`;
  }
}
loadTicker();

// MEMBER LOGIN - SECURE NOW
function login(){
  let code = document.getElementById('voucher').value.trim().toUpperCase(); 
  
  if(!vouchers[code]){
    alert('INVALID CODE. Code does not exist');
    document.getElementById('voucher').value = '';
    return;
  }
  if(vouchers[code].used){
    alert('THIS CODE WAS ALREADY USED');
    document.getElementById('voucher').value = '';
    return;
  }
  if(vouchers[code].type == 'vip'){
    alert('THIS IS A VIP CODE. Please use VIP Login');
    document.getElementById('voucher').value = '';
    return;
  }
  
  vouchers[code].used = true; 
  localStorage.setItem('vouchers',JSON.stringify(vouchers)); 
  document.getElementById('normalArea').style.display = 'block'; 
  document.getElementById('normalNums').innerText = results.normal || 'No numbers yet';
}

// VIP LOGIN - SECURE
function vipLogin(){
  let code = document.getElementById('voucher').value.trim().toUpperCase(); 
  
  if(!vouchers[code]){
    alert('INVALID VIP CODE. Code does not exist');
    document.getElementById('voucher').value = '';
    return;
  }
  if(vouchers[code].used){
    alert('THIS VIP CODE WAS ALREADY USED');
    document.getElementById('voucher').value = '';
    return;
  }
  if(vouchers[code].type!= 'vip'){
    alert('THIS IS NOT A VIP CODE');
    document.getElementById('voucher').value = '';
    return;
  }
  
  vouchers[code].used = true; 
  localStorage.setItem('vouchers',JSON.stringify(vouchers)); 
  document.getElementById('vipArea').style.display = 'block'; 
  document.getElementById('vipNums').innerText = results.vip || 'No VIP numbers yet';
}
