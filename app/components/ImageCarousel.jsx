import React, { useEffect, useState, useRef } from "react";
import { Pane } from "https://cdn.skypack.dev/tweakpane";
import gsap from "https://cdn.skypack.dev/gsap@3.12.0";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CONFIG = {
  debug: false,
  backface: false,
  buff: 2,
  animate: true,
  scrollDrive: true,
  dark: true,
  masklower: 0.9,
  maskupper: 1.8,
  perspective: 320,
  vertical: false,
  infinite: false,
  items: 16,
  gap: 0.1,
  rotatex: 0,
  rotatez: 0,
};

const RotatingCarousel = () => {
  const [config, setConfig] = useState(CONFIG);
  const mainRef = useRef(null);
  const scrollerRef = useRef(null);
  const tweenRef = useRef(null);

  const generateItems = () => {
    const items = [];
    const controllers = [];

    for (let i = 0; i < config.items + 1; i++) {
      if (i !== config.items) {
        items.push(
          <li key={i} style={{ "--index": i }}>
            <img src={`https://picsum.photos/300/300?random=${i}`} alt="" />
          </li>
        );
      }
      controllers.push(<li key={`controller-${i}`}></li>);
    }

    return { items, controllers };
  };

  const handleScroll = () => {
    if (!config.infinite) return;
    const scroller = scrollerRef.current;
    if (config.vertical) {
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

  const update = () => {
    const docStyle = document.documentElement.style;
    docStyle.setProperty("--gap-efficient", config.gap);
    docStyle.setProperty("--rotate-x", config.rotatex);
    docStyle.setProperty("--rotate-z", config.rotatez);
    docStyle.setProperty("--mask-lower", config.masklower);
    docStyle.setProperty("--mask-upper", config.maskupper);
    docStyle.setProperty("--scroll-ratio", config.buff);
    docStyle.setProperty("--perspective", config.perspective);

    if (
      !CSS.supports("animation-timeline: scroll()") &&
      config.scrollDrive &&
      config.animate
    ) {
      if (scrollerRef.current) {
        scrollerRef.current[config.vertical ? "scrollTop" : "scrollLeft"] = 0;
      }
      document.documentElement.dataset.gsap = true;
      gsap.set([".carousel"], { animation: "none", "--rotate": 0 });
      tweenRef.current = gsap.to(".carousel", {
        rotateY: -360,
        "--rotate": 360,
        ease: "none",
        scrollTrigger: {
          horizontal: !config.vertical,
          scroller: ".controller",
          scrub: true,
        },
      });
    } else {
      document.documentElement.dataset.gsap = false;
      gsap.set(".carousel", { clearProps: true });
      if (tweenRef.current) tweenRef.current.kill();
      ScrollTrigger.killAll();
      document.querySelector(".carousel").removeAttribute("style");
    }
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.addEventListener("scroll", handleScroll);
    }
    update();

    const controlPanel = new Pane({ title: "Config", expanded: false });

    controlPanel.addBinding(config, "animate", { label: "Animate" });
    const scrolling = controlPanel.addFolder({
      title: "Scrolling",
      expanded: false,
    });
    scrolling.addBinding(config, "scrollDrive", { label: "Scroll Drive" });
    scrolling.addBinding(config, "vertical", { label: "Vertical" });
    scrolling.addBinding(config, "infinite", { label: "Infinite" });
    scrolling.addBinding(config, "buff", {
      label: "Ratio",
      min: 1,
      max: 10,
      step: 0.1,
    });
    scrolling.addBinding(config, "debug", { label: "Debug" });
    const rotation = controlPanel.addFolder({
      title: "Rotation",
      expanded: false,
    });
    rotation.addBinding(config, "rotatex", {
      min: 0,
      max: 360,
      step: 1,
      label: "X",
    });
    rotation.addBinding(config, "rotatez", {
      min: 0,
      max: 360,
      step: 1,
      label: "Z",
    });
    const masker = controlPanel.addFolder({ title: "Mask", expanded: false });
    masker.addBinding(config, "masklower", {
      label: "Lower (Item W)",
      min: 0,
      max: 5,
      step: 0.1,
    });
    masker.addBinding(config, "maskupper", {
      label: "Upper (Item W)",
      min: 0,
      max: 5,
      step: 0.1,
    });
    controlPanel.addBinding(config, "backface", { label: "Backface" });
    controlPanel.addBinding(config, "perspective", {
      label: "Perspective (px)",
      min: 50,
      max: 1500,
      step: 1,
    });
    controlPanel.addBinding(config, "gap", {
      label: "Gap (%)",
      min: 0,
      max: 5,
      step: 0.1,
    });
    controlPanel.addBinding(config, "dark", { label: "Dark Theme" });

    controlPanel.on("change", (ev) => {
      setConfig((prev) => ({ ...prev, ...ev }));
      update();
    });

    return () => {
      if (scroller) {
        scroller.removeEventListener("scroll", handleScroll);
      }
      if (tweenRef.current) tweenRef.current.kill();
      ScrollTrigger.killAll();
    };
  }, [config]);

  const { items, controllers } = generateItems();

  return (
    <main ref={mainRef}>
      <div className="container1" style={{ "--total": config.items }}>
        <div className="carousel-container1">
          <ul className="carousel1">{items}</ul>
        </div>
        <ul className="controller" ref={scrollerRef}>
          {controllers}
        </ul>
      </div>
    </main>
  );
};

export default RotatingCarousel;
