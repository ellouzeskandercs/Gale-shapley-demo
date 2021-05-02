
const couples = {};
let groupA = [];
let groupB = [];
let algoPhase = false;
let currentStep = {
  memberA: 0,
  memberB: 0,
  finished: true,
  evaluated: true
}


/* group and members functions */
function isGroupA(id){
  return id > 0;
}
function getMemberById(id){
  return (isGroupA(id)? _.find(groupA, (el) => el.id === id): _.find(groupB, (el) => el.id === id));
}
function addMember(group, member, coeff){
  member.id = coeff * (group.length + 1);
  group.push(member);
}

/* order functions */
function getOrderedChoicesForMember(a){ //a is an id
  return(isGroupA(a) ? _.sortBy(groupB, (elt) => getOrder(a,elt.id)) : _.sortBy(groupA, (elt) => getOrder(a,elt.id)))
}
function getOrder(a,b){ // a and b are both ids
  return getMemberById(a)["choices"][b];
}
function setOrder(a, b, order){ // a and b are both ids
  getMemberById(a)["choices"][b] = Number(order);
}

/* couples functions */
function createCouple(a,b){
  couples[a] = b;
  couples[b] = a;
}
function removeCouple(a,b){
  delete couples[a];
  delete couples[b];
}
function getOneSingle(group){
  return _.sample(_.filter(group, (elt) => !couples[elt.id]));
}
function evaluateCouple(a,b){ //a and b are both ids, a MUST be SINGLE.
  if (!couples[b]){
    return true;
  } else if (couples[b]){
    let member = couples[b];
    return(getOrder(b,a) < getOrder(b, member))
  }
}

/* display functions */
function displayOneMember(member){
  return(`
  <li id="member_${member.id}" class="list-group-item member-card">
    <i class="fas fa-user"> </i> 
    <span>${member.displayName}</span> 
    ${algoPhase? `<span id="order_member_${member.id}" class="float-right badge badge-light"></span>`: `<i onclick="openChoices(${member.id})" style="padding-top: 2px;" class="float-right fas fa-list"> </i>`}  
  </li>`);  
}
function displayMembers(){
  groupAMembers.innerHTML=groupA.reduce((acc, el) => acc + displayOneMember(el), '<ul class="list-group member">') + '</ul>';
  groupBMembers.innerHTML=groupB.reduce((acc, el) => acc + displayOneMember(el), '<ul class="list-group member">') + '</ul>';
}
function highLightMember(id){
  let memberElt = document.getElementById(`member_${id}`);
  memberElt.style.border = "solid red";
}
function displayOrder(member){
  if (isGroupA(member)){
    groupB.forEach((elt) => {
      let memberElt = document.getElementById(`order_member_${elt.id}`);
      memberElt.style.display = "block";
      memberElt.innerHTML = getOrder(member, elt.id);
    })
  } else {
    groupA.forEach((elt) => {
      let memberElt = document.getElementById(`order_member_${elt.id}`);
      memberElt.style.display = "block";
      memberElt.innerHTML = getOrder(member, elt.id);
    })
  }
}
function displayOneChoice(member, max, selectedMemberId){
  return(`
  <li class="list-group-item">
    <div class="form-group row">
      <span class="col-sm-8 col-form-label">${member.displayName}</span>      
      <select value=${getOrder(selectedMemberId, member.id)} onchange="setOrder(${selectedMemberId},${member.id},this.value)" id="newGroupSelect" class="form-control col-sm-4">
        <option value="undefined"></option>
        ${_.range(max).reduce((acc, idx) => acc + '<option '+ (getOrder(selectedMemberId, member.id) === (idx + 1) ? 'selected':'unselected') + '> ' + (idx + 1) + ' </option>', '')}
    </select>
    </div>
  </li>`);  
}
function openChoices(id){
  if (!algoPhase){
    choicesListBody.innerHTML = (isGroupA(id)? groupB: groupA).reduce((acc, el) => acc + displayOneChoice(el, (isGroupA(id) ? groupB: groupA).length, id), '<ul class="list-group member">') + '</ul>'
    $('#choicesModal').modal('show')
  }
}
function displayOneCouple(id){
  return `<tr> <td> ${getMemberById(parseInt(id)).displayName} </td> <td> ${getMemberById(couples[id]).displayName} </td></tr>`
};
function displayCouples(){
  couplesTableBody.innerHTML = _.filter(_.keys(couples), (elt) => elt > 0).reduce((acc, elt) => acc + displayOneCouple(elt), '')
}

/* function needed upload/download setup */
function copyOneMember(member){
  let result = {}
  result.name = member.displayName;
  result.choices = {}
  _.keys(member.choices).forEach((key) => {
    result.choices[getMemberById(Number(key)).displayName] = member.choices[key]}
  )
  return result;
}


let addMemberBtn = document.getElementById("addMemberBtn");
let newGroupSelect = document.getElementById("newGroupSelect");
let newDisplayNameInput = document.getElementById("newDisplayName");
let groupAMembers = document.getElementById("GroupAMembers");
let groupBMembers = document.getElementById("GroupBMembers");
let choicesListBody = document.getElementById("choicesListBody");
let startAlgoBtn = document.getElementById("startAlgoBtn");
let bottomBtns = document.getElementById("bottomBtns");
let quickSetupBtn = document.getElementById("quickSetupBtn");
let settingBtns = document.getElementById("settingBtns");
let couplesDiv = document.getElementById("couples");
let couplesTableBody = document.getElementById("couplesTableBody");
let nextBtn = document.getElementById("nextBtn");
let confirmUploadSetupBtn = document.getElementById("confirmUploadSetupBtn");
let setupContent = document.getElementById("setupContent");
let downloadSetupBtn = document.getElementById("downloadSetupBtn");


addMemberBtn.onclick = function(){
  const newMember = {
    displayName: newDisplayNameInput.value,
    choices: {}
  };
  const group = newGroupSelect.value;
  addMember(group === "Group A"? groupA: groupB, newMember, group === "Group A"? 1 : -1)
  displayMembers()
}

startAlgoBtn.onclick = function(){
  algoPhase= true;
  bottomBtns.style.display = "block";
  couplesDiv.style.display = "block";
  settingBtns.style.display = "none";
  displayMembers();
}

nextBtn.onclick = function(){
  if (currentStep.finished){
    let member = getOneSingle(groupA);
    currentStep.memberA = member.id;
    currentStep.finished = false;
    highLightMember(currentStep.memberA);
    displayOrder(currentStep.memberA);
  } else if(currentStep.evaluated) {
    let orderedChoices = getOrderedChoicesForMember(currentStep.memberA);
    currentStep.memberB = orderedChoices[currentStep.memberB ? _.findIndex(orderedChoices, (elt) => elt.id === currentStep.memberB) + 1 : 0].id;
    currentStep.evaluated = false;
    highLightMember(currentStep.memberB);
    if (couples[currentStep.memberB]){
      displayOrder(currentStep.memberB);
    }
  } else {
    const shouldMarry = evaluateCouple(currentStep.memberA, currentStep.memberB);
    if (shouldMarry) {
      if (couples[currentStep.memberB]) {
        removeCouple(currentStep.memberB, couples[currentStep.memberB]);
      }
      createCouple(currentStep.memberB, currentStep.memberA);
      currentStep = {
        memberA: 0,
        memberB: 0,
        finished: true,
        evaluated: true
      }
      displayCouples();
        displayMembers();
    } else {
      displayMembers();
      highLightMember(currentStep.memberA);
      displayOrder(currentStep.memberA);
      currentStep.evaluated = true;
    }
  }
  if(!getOneSingle(groupA)){
    nextBtn.disabled = true;
  }
}

quickSetupBtn.onclick = function(){
  groupA = [
    {id: 1, displayName: 'A1', choices: {'-1' : 2, '-2' : 1, '-3' : 3, '-4': 5, '-5': 4}},
    {id: 2, displayName: 'A2', choices: {'-1' : 1, '-2' : 3, '-3' : 2, '-4': 5, '-5': 4}},
    {id: 3, displayName: 'A3', choices: {'-1' : 2, '-2' : 4, '-3' : 1, '-4': 5, '-5': 3}},
    {id: 4, displayName: 'A4', choices: {'-1' : 5, '-2' : 2, '-3' : 1, '-4': 4, '-5': 3}},
    {id: 5, displayName: 'A5', choices: {'-1' : 1, '-2' : 2, '-3' : 3, '-4': 4, '-5': 5}},    
  ];
  groupB = [
    {id: -1, displayName: 'B1', choices: {'1' : 2, '2' : 5, '3' : 1, '4': 4, '5': 3}},
    {id: -2, displayName: 'B2', choices: {'1' : 2, '2' : 1, '3' : 5, '4': 4, '5': 3}},
    {id: -3, displayName: 'B3', choices: {'1' : 5, '2' : 2, '3' : 3, '4': 4, '5': 1}},
    {id: -4, displayName: 'B4', choices: {'1' : 2, '2' : 1, '3' : 5, '4': 4, '5': 3}},
    {id: -5, displayName: 'B5', choices: {'1' : 5, '2' : 2, '3' : 1, '4': 4, '5': 3}},    
  ];
  displayMembers()
}

downloadSetupBtn.onclick = function(){
  setup = {};
  setup.groupA = groupA.map((el) => copyOneMember(el));
  setup.groupB = groupB.map((el) => copyOneMember(el));
  navigator.clipboard.writeText(JSON.stringify(setup));
}

confirmUploadSetupBtn.onclick = function(){
  let setup = JSON.parse(setupContent.value);
  groupA = setup.groupA.map((el, idx) => {
    let member = {}
    member.displayName = el.name;
    member.id = idx + 1;
    member.choices = {}
    _.keys(el.choices).forEach((key) => {
      member.choices[ -(_.findIndex(setup.groupB, (elt) => elt.name === key)+1)] = el.choices[key]}
    )
    return member})
  groupB = setup.groupB.map((el, idx) => {
    let member = {}
    member.displayName = el.name;
    member.id = -(idx + 1);
    member.choices = {}
    _.keys(el.choices).forEach((key) => {
      member.choices[_.findIndex(setup.groupA, (elt) => elt.name === key) + 1] = el.choices[key]}
    )
    return member})
  console.log(groupA, groupB)
  displayMembers()
}

const secret1 = {"groupA":[{"name":"A1","choices":{"B2":1,"B3":3,"B1":2}},{"name":"A2","choices":{"B3":1,"B1":3,"B2":2}},{"name":"A3","choices":{"B1":1,"B2":3,"B3":2}}],"groupB":[{"name":"B1","choices":{"A1":2,"A2":1,"A3":3}},{"name":"B2","choices":{"A1":3,"A2":2,"A3":1}},{"name":"B3","choices":{"A1":1,"A2":3,"A3":2}}]}
const secret2 = {"groupB":[{"name":"A1","choices":{"B2":1,"B3":3,"B1":2}},{"name":"A2","choices":{"B3":1,"B1":3,"B2":2}},{"name":"A3","choices":{"B1":1,"B2":3,"B3":2}}],"groupA":[{"name":"B1","choices":{"A1":2,"A2":1,"A3":3}},{"name":"B2","choices":{"A1":3,"A2":2,"A3":1}},{"name":"B3","choices":{"A1":1,"A2":3,"A3":2}}]}
