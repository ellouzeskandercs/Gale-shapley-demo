// let population = [];
// let bestScore = 0;
// let step = 0;
// let initialPop = 3;
// let selectionOutput = 3;
// let spaceSize = 12; 
// let mutationProbability = 0.05;

// function initialize_population() {
//   return _.range(initialPop).map(() => _.range(spaceSize).map(() => Math.round(Math.random())))
// }
// function fitness(individual) {
//   return _.reverse(_.clone(individual)).reduce((acc, el, idx) => acc +(el * (2**idx)))
// }
// function selection(population) {
//   return _.slice(_.sortBy(population, (ind) => - fitness(ind)), 0, selectionOutput);
// }
// function crossOver(a, b) {
//   return _.concat(_.slice(a, 0, spaceSize/2), _.slice(b, spaceSize/2, spaceSize))
// }
// function crossPhase(population) {
//   return population.reduce((acc, el, idx) => _.concat(acc, population.map(element => crossOver(el, element))), [])
// }
// function mutation(individual) {
//   return individual.map(genom => Math.random() < mutationProbability ? 1 - genom : genom)
// }
// function mutationPhase(population) {
//   return population.map(individu => mutation(individu))
// }
// function transforIndToStr(individual){
//   return individual.reduce((acc, el) => acc+el, "")
// }
// function displayPopulation(population, id){
//   let element = document.getElementById(id);
//   element.innerHTML = population.reduce((acc, el) => acc + transforIndToStr(el) + "<br/>", "")
// }
// function getBestScore(population){
//   return fitness(_.maxBy(population, (ind) => fitness(ind)))
// }
// function displayBestScore(score, id){
//   let element = document.getElementById(id);
//   if(score !== undefined){
//     element.innerHTML = "<b> Step: " + step + "</b><b> Best Score: " + score + "</b>";
//   } else {
//     element.innerHTML = "";
//   }
// }
// function switchBtn(btn){
//   inibtn.disabled = !(btn === selbtn && step === 0);
//   selbtn.disabled = !(btn === selbtn);
//   cobtn.disabled = !(btn === cobtn);
//   mutbtn.disabled = !(btn === mutbtn);
// }

// let inibtn = document.getElementById("ini");
// let selbtn = document.getElementById("sel");
// let cobtn = document.getElementById("c-o");
// let mutbtn = document.getElementById("mut");
// let nxtbtn = document.getElementById("next");
// let refbtn = document.getElementById("refresh");
// let iniInp = document.getElementById("iniPopSize");
// let selInp = document.getElementById("selPopSize");
// let genInp = document.getElementById("nbGenoms");
// let probInp = document.getElementById("probMut");

// function init(){
//   inibtn.disabled = false;
//   selbtn.disabled = true;
//   cobtn.disabled = true;
//   mutbtn.disabled = true;
//   iniInp.value = initialPop;
//   selInp.value = selectionOutput;
//   genInp.value = spaceSize;
//   probInp.value = mutationProbability;
// }

// init();

// inibtn.onclick = function(){
//   population = initialize_population()
//   bestScore = getBestScore(population);
//   displayPopulation(population, "generation")
//   displayBestScore(bestScore, "best")
//   switchBtn(selbtn)
// }
// selbtn.onclick = function(){
//   population = selection(population);
//   displayPopulation(population, "selection")
//   switchBtn(cobtn)
// }
// cobtn.onclick = function(){
//   population = crossPhase(population);
//   displayPopulation(population, "cross")
//   switchBtn(mutbtn)
// }
// mutbtn.onclick = function(){
//   population = mutationPhase(population);
//   displayPopulation(population, "generation")
//   bestScore = getBestScore(population);
//   step = step + 1;
//   displayPopulation(population, "generation")
//   displayPopulation([], "selection")
//   displayPopulation([], "cross")
//   displayBestScore(bestScore, "best")
//   switchBtn(selbtn)
// }
// nxtbtn.onclick = function(){
//   if(!mutbtn.disabled){
//     return mutbtn.click()
//   }
//   if(!cobtn.disabled){
//     return cobtn.click()
//   }
//   if(!selbtn.disabled){
//     return selbtn.click()
//   }
//   if(!inibtn.disabled){
//     return inibtn.click()
//   }
// }
// refbtn.onclick = function(){
//   initialPop = iniInp.value;
//   selectionOutput = selInp.value;
//   spaceSize = genInp.value; 
//   mutationProbability = probInp.value;
//   population = [];
//   bestScore = 0;
//   step = 0;
//   init();
//   displayPopulation([], "generation")
//   displayPopulation([], "selection")
//   displayPopulation([], "cross")
//   displayBestScore(undefined, "best")
// }
const couples = {};
const groupA = [];
const groupB = [];
let algoPhase = false;
let currentStep = {
  memberA: 0,
  memberB: 0,
  finished: true
}

function isGroupA(id){
  return id > 0;
}
function createCouple(a,b){
  couples[a] = b;
  couples[b] = a;
}
function removeCouple(a,b){
  delete couples[a];
  delete couples[b];
}
function getMemberById(id){
  return (isGroupA(id)? _.find(groupA, (el) => el.id === id): _.find(groupB, (el) => el.id === id));
}
function getAllOrder(a){ //a is an id
  Object.keysgetMemberById(a)
}
function getOrder(a,b){ // a and b are both ids
  return getMemberById(a)["choices"][b];
}
function setOrder(a, b, order){ // a and b are both ids
  console.log('order')
  console.log(order)
  getMemberById(a)["choices"][b] = Number(order);
}
function evaluateCouple(a,b){
  if (!couples[b]){
    return true;
  }
  return (getOrder(b, couples[b]) > getOrder(b, a));
}
function checkAllOrdered(){
  return (groupA.reduce((acc, el) => acc & (el["order"].length === groupB.length),true) &&
  groupB.reduce((acc, el) => acc & (el["order"].length === groupA.length),true))
}
function addMember(group, member, coeff){
  member.id = coeff * (group.length + 1);
  group.push(member);
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
function displayOneMember(member){
  return(`<li class="list-group-item member-card"><i class="fas fa-user"> </i> <span>${member.displayName}</span> <i onclick="openChoices(${member.id})" style="padding-top: 2px;" class="float-right fas fa-list"> </i> </li>`);  
}
function displayMembers(){
  groupAMembers.innerHTML=groupA.reduce((acc, el) => acc + displayOneMember(el), '<ul class="list-group member">') + '</ul>';
  groupBMembers.innerHTML=groupB.reduce((acc, el) => acc + displayOneMember(el), '<ul class="list-group member">') + '</ul>';
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
let nextBtn = document.getElementById("nextBtn");

addMemberBtn.onclick = function(){
  const newMember = {
    displayName: newDisplayNameInput.value,
    choices: {}
  };
  const group = newGroupSelect.value;
  addMember(group === "Group A"? groupA: groupB, newMember, group === "Group A"? 1 : -1)
  console.log(groupA, groupB);
  displayMembers()
}

startAlgoBtn.onclick = function(){
  algoPhase= true;
  bottomBtns.style.display = "block";
  couplesDiv.style.display = "block";
  settingBtns.style.display = "none";
}

nextBtn.onclick = function(){
  if (currentStep.finished){

  }
}