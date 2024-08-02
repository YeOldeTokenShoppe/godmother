import { Pane } from "https://cdn.skypack.dev/tweakpane";
import gsap from "https://cdn.skypack.dev/gsap@3.12.0";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger";

const CONFIG = {
  debug: false,
  backface: false,
  buff: 1,
  animate: true,
  scroll: true,
  dark: true,
  masklower: 0.9,
  maskupper: 1.8,
  perspective: 320,
  vertical: false,
  infinite: true,
  items: 16,
  gap: 0.1,
  rotatex: 0,
  rotatez: 0,
};
const urlParams = new URLSearchParams(window.location.search);
const avatarUrl = urlParams.get("avatarUrl");

// Array of your image URLs
const imageUrls = [
  avatarUrl,
  "https://ourlady.io/Dracarys.gif",
  "https://ourlady.io/homer.gif",
  "https://ourlady.io/sup.gif",
  "https://ourlady.io/thing1.gif",
  "https://ourlady.io/thing2.gif",
  "https://ourlady.io/thing3.gif",
  "https://ourlady.io/corndog.gif",
  "https://ourlady.io/fever.gif",
  "https://ourlady.io/frank.gif",
  "https://ourlady.io/pokemon.gif",
  "https://ourlady.io/smoke.gif",
  "https://ourlady.io/sponge.gif",
  "https://ourlady.io/Heart.gif",
  "https://ourlady.io/ThisIsFine.gif",
  "https://ourlady.io/Devito.gif",
  "https://ourlady.io/ElmoFrame.gif",
];

// Update CONFIG.items to match the number of images
CONFIG.items = imageUrls.length;

const selectImage = (event) => {
  console.log("selectImage function called"); // Debug log
  const imageUrl = event.target.src;
  console.log("Image selected in iframe:", imageUrl); // Debug log
  console.log("Posting message to parent window:", { imageUrl });
  window.parent.postMessage({ imageUrl }, "*");

  // Add visual feedback for the selected image
  document.querySelectorAll(".carousel img").forEach((img) => {
    img.classList.remove("selected");
  });
  event.target.classList.add("selected");
};

const setupEventListeners = () => {
  const images = document.querySelectorAll(".carousel img");
  console.log("Setting up event listeners for images:", images); // Debug log
  images.forEach((img) => {
    img.addEventListener("click", selectImage);
  });
};

const MAIN = document.querySelector("main");

const generateItems = () => {
  const items = [];
  const controllers = [];

  for (let i = 0; i < CONFIG.items + 1; i++) {
    if (i !== CONFIG.items) {
      items.push(`
        <li style="--index: ${i};">
          <img src="${imageUrls[i]}" alt="Image ${i + 1}" data-index="${i}" />
        </li>
      `);
    }
    controllers.push("<li></li>");
  }

  return {
    items: items.join(""),
    controllers: controllers.join(""),
  };
};

let scroller;

const handleScroll = () => {
  if (!CONFIG.infinite) return false;
  if (CONFIG.vertical) {
    if (scroller.scrollTop + window.innerHeight > scroller.scrollHeight - 2) {
      scroller.scrollTop = 2;
    }
    if (scroller.scrollTop < 2) {
      scroller.scrollTop = scroller.scrollHeight - 2;
    }
  } else {
    if (scroller.scrollLeft + window.innerWidth > scroller.scrollWidth - 2) {
      scroller.scrollLeft = 2;
    }
    if (scroller.scrollLeft < 2) {
      scroller.scrollLeft = scroller.scrollWidth - 2;
    }
  }
};

const setupController = () => {
  scroller = document.querySelector(".controller");
  scroller.addEventListener("scroll", handleScroll);
};

const render = () => {
  const { controllers, items } = generateItems();
  MAIN.innerHTML = `
    <div class="container" style="--total: ${CONFIG.items};">
      <div class="carousel-container">
        <ul class="carousel">
          ${items}
        </ul>
      </div>
      <ul class="controller">
        ${controllers}
      </ul>
    </div>
  `;
  setupController();
  setupEventListeners();
};

let tween;

const update = () => {
  document.documentElement.dataset.debug = CONFIG.debug;
  document.documentElement.dataset.animate = CONFIG.animate;
  document.documentElement.dataset.backface = CONFIG.backface;
  document.documentElement.dataset.scroll = CONFIG.scroll;
  document.documentElement.dataset.dark = CONFIG.dark;
  document.documentElement.dataset.vertical = CONFIG.vertical;
  document.documentElement.dataset.infinite = CONFIG.infinite;
  document.documentElement.style.setProperty("--gap-efficient", CONFIG.gap);
  document.documentElement.style.setProperty("--rotate-x", CONFIG.rotatex);
  document.documentElement.style.setProperty("--rotate-z", CONFIG.rotatez);
  document.documentElement.style.setProperty("--mask-lower", CONFIG.masklower);
  document.documentElement.style.setProperty("--mask-upper", CONFIG.maskupper);
  document.documentElement.style.setProperty("--scroll-ratio", CONFIG.buff);
  document.documentElement.style.setProperty(
    "--perspective",
    CONFIG.perspective
  );

  if (
    !CSS.supports("animation-timeline: scroll()") &&
    CONFIG.scroll &&
    CONFIG.animate
  ) {
    if (scroller) scroller[CONFIG.vertical ? "scrollTop" : "scrollLeft"] = 0;
    document.documentElement.dataset.gsap = true;
    gsap.registerPlugin(ScrollTrigger);
    gsap.set([".carousel"], { animation: "none", "--rotate": 0 });
    tween = gsap.to(".carousel", {
      rotateY: -360,
      "--rotate": 360,
      ease: "none",
      scrollTrigger: {
        horizontal: !CONFIG.vertical,
        scroller: ".controller",
        scrub: true,
      },
    });
  } else {
    document.documentElement.dataset.gsap = false;
    gsap.set(".carousel", { clearProps: true });
    if (tween) tween.kill();
    ScrollTrigger.killAll();
    document.querySelector(".carousel").removeAttribute("style");
  }
};

const sync = (event) => {
  if (
    !document.startViewTransition ||
    !event ||
    (event &&
      event.target.controller.view.labelElement.innerText !== "Dark Theme" &&
      event.target.controller.view.labelElement.innerText !== "Backface")
  )
    return update();
  document.startViewTransition(update);
};

render();
sync();

if (!CSS.supports("animation-timeline: scroll()")) {
  gsap.registerPlugin(ScrollTrigger);
}
window.addEventListener("load", (event) => {
  setupEventListeners();
});
