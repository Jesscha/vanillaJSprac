const form = document.querySelector("form"),
  input = document.querySelector("input"),
  result = document.querySelector("#result"),
  apiURL = "https://api.lyrics.ovh",
  more = document.querySelector("#move");

// 0. 각 행위를 할 장소를 선언한다

// 1. get 요청을 해서 노래를 받아 온다.

// 이벤트 추가하기

form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchSongs(apiURL);
});

async function searchSongs(url) {
  const term = input.value.trim();
  if (!term) {
    alert("please fiil the search input");
  } else {
    const data = await (await fetch(`${url}/suggest/${term}`)).json();
    console.log(data);
    makeSongList(data);
  }
}

function makeSongList(data) {
  result.innerHTML = `
    <ul calss="songs--list">
    ${data.data
      .map((item) => {
        const {
          title,
          artist: { name },
        } = item;
        return `
        <li class="song">
                <span><strong>${name}</strong> - ${title}</span>
                <button class="btn" data-singger="${name}" data-title="${title}">See Lyrics</button>
            </li>
        `;
      })
      .join("")}
    </ul>
    `;
  if (data.prev || data.next) {
    more.innerHTML = `
        ${data.prev ? `<button class="btn" onClick = "givemoreSongs('${data.prev}')"> prev </button>` : ""}
        ${data.next ? `<button class="btn"  onClick = "givemoreSongs('${data.next}')" > next </button>` : ""}
        `;
  }else{
    more.innerHTML = ``
  }
}

// 2. 다음 이전 버튼을 구현한다.
async function givemoreSongs(url){
    const data = await (await fetch(`https://cors-anywhere.herokuapp.com/${url}`)).json();
    makeSongList(data);

}

// 3. 가사 보기 기능을 추가한다.

result.addEventListener("click", (e)=>{
    if (e.target.tagName === "BUTTON"){
        console.log(e)
        const singer  = e.target.getAttribute("data-singger")
        const title = e.target.getAttribute("data-title")
        fetchLyrics(singer, title)
    }
})
 
async function fetchLyrics(singer, title){
    const data = await (await fetch(`${apiURL}/v1/${singer}/${title}`)).json();
    const lyrics =data.lyrics.replace(/(\r\n|\n|\r)/g, "<br>")
    result.innerHTML = `
  <h2><strong>${singer}</strong> - ${title}</h2>
  <span>${lyrics}</span>
  `
  more.innerHTML= ""



}