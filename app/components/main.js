// // Shuffle function
// function shuffle(array) {
//   var currentIndex = array.length,
//     temporaryValue,
//     randomIndex;

//   // While there remain elements to shuffle...
//   while (0 !== currentIndex) {
//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;

//     // And swap it with the current element.
//     temporaryValue = array[currentIndex];
//     array[currentIndex] = array[randomIndex];
//     array[randomIndex] = temporaryValue;
//   }

//   return array;
// }

// let b = document.body;
// let radio = document.querySelector("#radio");
// let a = document.querySelector("#audio");

// let sfa = document.querySelectorAll(".speaker__front");
// let sta = document.querySelectorAll(".speaker__top");
// let sba = document.querySelectorAll(".speaker__back");
// let sla = document.querySelectorAll(".speaker__left");
// let sra = document.querySelectorAll(".speaker__right");

// let son = document.querySelector("#son");
// let soff = document.querySelector("#soff");

// let songs = [
//   "02-Ox Out The Cage (Ft. El-P).mp3",
//   "Hot-Chocolate-Every-1s-A-Winner.mp3",
//   "hozier - take me to church.mp3",
// ];
// let currentSong = 0;

// let playAudio = () => {
//   if (a.paused) {
//     songs = shuffle(songs); // shuffle the songs
//     a.src = songs[currentSong];
//     a.play();
//   } else {
//     a.pause();
//     a.currentTime = 0;
//   }
//   sfa.forEach((f) => f.classList.toggle("sfa"));
//   sta.forEach((f) => f.classList.toggle("sta"));
//   sba.forEach((f) => f.classList.toggle("sba"));
//   sla.forEach((f) => f.classList.toggle("sla"));
//   sra.forEach((f) => f.classList.toggle("sra"));

//   radio.classList.toggle("radio-a");

//   son.classList.toggle("s");
//   soff.classList.toggle("s");
// };

// a.addEventListener("ended", function () {
//   currentSong++;
//   if (currentSong >= songs.length) {
//     currentSong = 0;
//   }
//   playAudio();
// });

// b.addEventListener("click", playAudio);
