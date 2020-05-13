// 목표, 카드를 만들고 카드가 뒤집어 질 수 있도록 하기 


// 작업을 할 DOM을 선언하는 것
const cardsContainer = document.getElementById('cards-container'),
  prevBtn = document.getElementById("prev"),
  nextBtn = document.getElementById("next"),
  currentEl = document.getElementById("current"),
  showBtn = document.getElementById("show"),
  hideBtn = document.getElementById("hide"),
  questionEl = document.getElementById("question"),
  answerEl = document.getElementById('answer'),
  addCardBtn = document.getElementById('add-card'),
  clearBtn = document.getElementById('clear'),
  addContainer = document.getElementById('add-container');


// 카드개수 
let currentActiveCard = 0

// 카드 내용이 담겨있는 array
const cardsEl = [] 



// 카드 데이터 

const cardsData = getCardsData();


// const cardsData = [
//   {
//     question: 'What must a variable begin with?',
//     answer: 'A letter, $ or _'
//   },
//   {
//     question: 'What is a variable?',
//     answer: 'Container for a piece of data'
//   },
//   {
//     question: 'Example of Case Sensitive Variable',
//     answer: 'thisIsAVariable'
//   }
// ];

//데이터를 바탕으로 카드 만들어서 집어넣기 

// 데이터를 각각의 카드를 만드는 함수로 집어 넣음
function createCards(){
  cardsData.forEach((data, index)=> createCard(data, index))
}

function createCard(data, index) {
  const {question, answer} = data;
  const card = document.createElement('div');
  card.classList.add('card')
  // 제일 앞에 있는 카드에 'active' 클래스를 추가 해 준다.
  if (index === 0){
    card.classList.add('active')
  }
  card.innerHTML =`
        <div class="inner-card">
          <div class="inner-card-front">
            <p>
              ${question}
            </p>
          </div>
          <div class="inner-card-back">
            <p>
              ${answer}
            </p>
          </div>
        </div>
  `;

  // 각 카드에 클릭이벤트 리스너를 추가
  card.addEventListener('click', ()=>card.classList.toggle('show-answer'));
  // Dom에 추가 하기위해 push 해 준다.
  // cardsEl에 값이 저장되는게 아니라 해당 노드의 포인터가 저장되기 때문에 이 배열에서 해당 노드의 클래스 등등을 변경할 수 있다. 
  cardsEl.push(card);
  cardsContainer.appendChild(card);

  // 전체 카드 개수 수정 
  updateCurrentText();

}
// 카드 수 나오게 하기
function updateCurrentText(){
  currentEl.innerText= `${currentActiveCard +1}/${cardsEl.length}`;

}

function getCardsData(){
  const cards = JSON.parse(localStorage.getItem('cards'));
  return cards === null ? [] : cards;
}

function setCardsData(cards){
  localStorage.setItem('cards', JSON.stringify(cards));
  window.location.reload();
}

createCards();



// 네비게이션 만들기 

nextBtn.addEventListener('click', ()=>{
  cardsEl[currentActiveCard].className = 'card left';
  currentActiveCard = currentActiveCard+1;

  if (currentActiveCard > cardsEl.length -1) {
    currentActiveCard = cardsEl.length-1;
  }

  cardsEl[currentActiveCard].className = 'card active';

  updateCurrentText();
})

prevBtn.addEventListener('click', ()=>{
  cardsEl[currentActiveCard].className = 'card right';
  currentActiveCard = currentActiveCard-1;

  if (currentActiveCard < 0) {
    currentActiveCard = 0;
  }

  cardsEl[currentActiveCard].className = 'card active';

  updateCurrentText();

})

showBtn.addEventListener("click", ()=> addContainer.classList.add('show'));
hideBtn.addEventListener("click", ()=> addContainer.classList.remove('show'));



//Add new card 

addCardBtn.addEventListener('click', ()=> {
  const question = questionEl.value;
  const answer = answerEl.value;

  if (question.trim() && answer.trim()){
    const newCard = { question, answer}

    createCard(newCard);

    questionEl.value ="";
    answerEl.value = "";
    addContainer.classList.remove('show');

    cardsData.push(newCard);
    setCardsData(cardsData);
  };
})


clearBtn.addEventListener('click', ()=>{
  localStorage.clear();
  cardsContainer.innerHTML='';
  window.location.reload();
})







