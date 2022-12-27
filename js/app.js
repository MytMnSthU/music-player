(() => {
   const playbtn = document.getElementById("playbtn");
   const playicon = document.querySelector("#playbtn span i");
   const nextbtn = document.getElementById("forwardbtn");
   const prevbtn = document.getElementById("backwardbtn");
   const progressbar = document.getElementById("progressbar");
   const progress = document.getElementById("progress");
   const currentelm = document.getElementById("current");
   const endelm = document.getElementById("end");
   const titleelm = document.getElementById("title");
   const singerelm = document.getElementById("singer");
   const coverimg = document.getElementById("coverimg");
   const themebtn = document.getElementById("themebtn");
   const colorboxes = document.querySelectorAll(".player__box");
   const audios = document.querySelectorAll(".player__audio");
   const audio = document.getElementById("emptyaudio");
   const playlist = document.getElementById("playlist");
   const listtogglebtn = document.getElementById("listtogglebtn");
   const toggleicon = document.getElementById("toggleicon");

   const MUSIC_DATA = [
      {
         title: "Unstoppable",
         singer: "Sia",
         songurl: "unstoppable",
         imgurl: "unstoppable",
      },
      {
         title: "The Nights",
         singer: "Avicii",
         songurl: "thenights",
         imgurl: "thenights",
      },
      {
         title: "Crown",
         singer: "Neffex",
         songurl: "crown",
         imgurl: "crown",
      },
   ];

   let currentIdx = 0;
   let isPlay = false;
   let duration = 0;
   let playlistitems;

   loadMusic(MUSIC_DATA[currentIdx]);

   function loadMusic(music) {
      audio.src = `./assets/${music.songurl}.mp3`;
      coverimg.src = `./assets/${music.imgurl}.jpg`;
      titleelm.textContent = music.title;
      singerelm.textContent = music.singer;
   }

   function playMusic() {
      !isPlay ? audio.play() : audio.pause();
      isPlay = !isPlay;
   }

   function changeIcon() {
      isPlay
         ? playicon.classList.replace("fa-play", "fa-pause")
         : playicon.classList.replace("fa-pause", "fa-play");
   }

   function nextMusic() {
      currentIdx += 1;
      if (currentIdx > MUSIC_DATA.length - 1) {
         currentIdx = 0;
      }
      loadMusic(MUSIC_DATA[currentIdx]);
      isPlay = false;
      changeIcon();
   }

   function prevMusic() {
      currentIdx -= 1;
      if (currentIdx < 0) {
         currentIdx = MUSIC_DATA.length - 1;
      }
      loadMusic(MUSIC_DATA[currentIdx]);
      isPlay = false;
      changeIcon();
   }

   function getDurationWithFormat(customDuration) {
      let endmin = Math.floor((customDuration || duration) / 60);
      let endsec = (customDuration || duration) % 60;
      return endmin + ":" + (endsec <= 9 ? "0" + endsec : endsec);
   }

   playbtn.addEventListener("click", () => {
      playMusic();
      changeIcon();
   });

   nextbtn.addEventListener("click", nextMusic);
   prevbtn.addEventListener("click", prevMusic);

   audio.addEventListener("timeupdate", () => {
      let pos = 0;
      let progressbarwidth = parseInt(progressbar.clientWidth);
      let current = Math.floor(audio.currentTime);
      let currentmin = Math.floor(current / 60);
      let currentsec = current <= 60 ? current : current % 60;

      if (!isNaN(Math.floor(audio.duration))) {
         duration = Math.floor(audio.duration);
      }
      pos += audio.currentTime * (progressbarwidth / duration);

      currentelm.textContent =
         currentmin + ":" + (currentsec <= 9 ? "0" + currentsec : currentsec);

      progress.style.width = `${pos}px`;
      // console.log(current,duration);
   });

   audio.addEventListener("loadeddata", () => {
      duration = Math.floor(audio.duration);
      const durationWithFormat = getDurationWithFormat();

      endelm.textContent = durationWithFormat;
   });

   progressbar.addEventListener("click", (e) => {
      let updatetime = Math.floor(
         e.offsetX * (duration / progressbar.clientWidth)
      );
      audio.currentTime = updatetime;
   });

   themebtn.addEventListener("click", () => {
      themebtn.classList.toggle("open");
   });

   colorboxes.forEach((colorbox) => {
      colorbox.addEventListener("click", () => {
         const getcolor = window.getComputedStyle(colorbox).backgroundColor;
         //  console.log(getcolor);
         document.documentElement.style.setProperty("--clr-acc", getcolor);
      });
   });

   audios.forEach((ado, idx) => {
      const music = MUSIC_DATA[idx];
      const li = document.createElement("li");
      li.className = "player__list-item";
      ado.addEventListener("loadeddata", () => {
         const duration = getDurationWithFormat(Math.floor(ado.duration));
         li.innerHTML = `
            <img
               src="./assets/${music.imgurl}.jpg"
               class="player__img player__img--sm"
               alt=${music.title}
            />
            <div>
               <h2 class="player__list-title">${music.title}</h2>
               <span class="player__list-txt">${music.singer}</span>
            </div>
            <span class="player__list-duration">${duration}</span>
         `;
      });
      playlist.appendChild(li);

      playlistitems = document.querySelectorAll(".player__list-item");
   });

   listtogglebtn.addEventListener("click", () => {
      toggleicon.classList.toggle("fa-times");
      playlist.classList.toggle("toggle");
   });

   playlistitems.forEach((itm, idx) => {
      itm.addEventListener("click", () => {
         currentIdx = idx;
         loadMusic(MUSIC_DATA[currentIdx]);
         playlist.classList.toggle("toggle");
         toggleicon.classList.toggle("fa-times");
         isPlay = false;
         changeIcon();
      });
   });

   audio.addEventListener('ended', () => {  
      progress.style.width = 0;
      isPlay = false;
      changeIcon();
      nextMusic();
   })
})();
