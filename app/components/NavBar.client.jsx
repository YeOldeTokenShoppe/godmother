"use client";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useSwipeable } from "react-swipeable";

export const NavBarContainer = styled.div`
  width: 100%;
  display: flex; // Using flex to better manage child elements
  justify-content: center; // This centers the NavBarStyled
  position: relative;
  padding: 0; // Adjust padding as necessary
  overflow: visible;
`;
const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative; // Ensure relative positioning for absolute children
  width: 820px; // Adjust width based on NavBarStyled width plus some extra for arrows
`;

const NavBarStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  gap: 10px;
  margin: 0;
  background: rgba(0, 0, 0, 0.2);
  width: 720px; // Specific width for NavBar
  height: 90px;
  position: relative;
  bottom: 10px;
  left: 50%;
  zindex: 1;
  ${"" /* background-image: url("/images/banner3.png"); */}
  transform: translateX(-50%); // Centering NavBar horizontally
  ${"" /* zindex: 1; */}
  backdrop-filter: blur(20px);
  background-image: radial-gradient(
    circle at 50% 57%,
    rgb(67, 54, 74) 22.3%,
    rgb(47, 48, 67) 51.15%,
    rgb(27, 23, 36) 74.33%
  );
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  font-family: "Roboto", sans-serif;

  @media (max-width: 778px) {
    display: none; // Hide NavBar under 778px
  }
`;

const Arrow = styled.button`
  position: absolute;
  top: 35%;
  transform: translateY(-50%);
  display: block;
  width: 50px; // Set a specific width
  height: 50px; // Set a specific height
  cursor: pointer;
  background: none;
  border: none;
  font-size: 4rem; // Adjust size as necessary
  color: #ffc4ec; // Set the color
  line-height: 30px; // Align vertically
  text-align: center; // Align horizontally
  z-index: 2;
`;

const LeftArrow = styled(Arrow)`
  position: absolute;
  left: -3rem;
  &:before {
    content: "👈"; // Using < character for left arrow
  }
`;

const RightArrow = styled(Arrow)`
  position: absolute;
  right: 1.3rem;
  &:before {
    content: "👉"; // Using > character for right arrow
  }
`;

const Emoji = styled.span`
  font-size: 70px;
  marginright: 10px;
  aligncontent: center;
  transition: transform 0.3s;
`;
const Tab = styled.div`
  display: flex;
  flex-direction: row;
  flex: 0 0 235px;
  touch-action: pan-y;
  top: 0px;
  transition: background-color 0.3s, transform 0.3s;
  width: 240px;
  height: 70px;
  position: relative;
  background-color: ${(props) =>
    props.$isHovered
      ? "#ffc4ec"
      : props.$isCurrent && !props.$isHovered
      ? "#ffc4ec"
      : "#8f662c"};
  transform: translate(0px, 0px);
  z-index: 90;
  &:hover ${Emoji} {
    transform: scale(1.15);
  }
`;

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 120px;
  color: #1b1724;
  height: 70px;
  clip-path: polygon(90% 0%, 100% 20%, 100% 100%, 0 100%, 0 0);
  align-items: center;
  padding: 10px;
`;

const TabDate = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
`;

const TabTitle = styled.span`
  font-size: 0.8rem;
`;

const TabImage = styled.img.attrs((props) => ({
  src: props.$image,
}))`
  width: 70px;
  height: 69px;
`;

const TabsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  transition: transform 0.5s ease; // Smooth transition for sliding effect
  width: auto; // Take up all available width
  flex-shrink: 0; // Prevent flex items from shrinking
`;

const NavBar = () => {
  const [startTab, setStartTab] = useState(0);
  const [showNavBar, setShowNavBar] = useState(true);
  const tabs = [
    {
      date: "01",
      title: "Home",
      emoji: "🚪",
      link: "./",
    },
    {
      date: "02",
      title: "Thesis",
      emoji: "📜",
      link: "/thesis",
    },
    {
      date: "03",
      title: "Numerology",
      emoji: "📊",
      link: "./numerology",
    },
    {
      date: "04",
      title: "Bless Us, RL80",
      emoji: "🕯️",
      link: "./gallery",
    },

    {
      date: "05",
      title: "Communion",
      emoji: "👋",
      link: "./communion",
    },
  ];

  const [highlightedTab, setHighlightedTab] = useState(0);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const checkWindowSize = () => {
      setShowNavBar(window.innerWidth >= 778);
    };

    checkWindowSize();

    window.addEventListener("resize", checkWindowSize);

    return () => {
      window.removeEventListener("resize", checkWindowSize);
    };
  }, []);

  const intervalId = useRef(null);

  useEffect(() => {
    const startInterval = () => {
      intervalId.current = setInterval(() => {
        setHighlightedTab((prev) => {
          const nextHighlight = (prev + 1) % tabs.length;
          // Adjust startTab based on highlightedTab position
          if (nextHighlight >= 2 && nextHighlight < tabs.length - 1) {
            setStartTab(nextHighlight - 1);
          } else if (nextHighlight === tabs.length - 1) {
            setStartTab(nextHighlight - 2);
          } else if (nextHighlight === 0) {
            setStartTab(0); // Cycle restarts
          }
          return nextHighlight;
        });
      }, 3000);
    };
    startInterval();
    return () => clearInterval(intervalId.current);
  }, [tabs.length]);

  const handleMouseEnter = () => {
    clearInterval(intervalId.current); // Clear interval on mouse enter
  };
  const handleMouseLeave = () => {
    intervalId.current = setInterval(() => {
      setHighlightedTab((prev) => {
        const nextHighlight = (prev + 1) % tabs.length;
        // Adjust startTab based on highlightedTab position
        if (nextHighlight >= 2 && nextHighlight < tabs.length - 1) {
          setStartTab(nextHighlight - 1);
        } else if (nextHighlight === tabs.length - 1) {
          setStartTab(nextHighlight - 2);
        } else if (nextHighlight === 0) {
          setStartTab(0); // Cycle restarts
        }
        return nextHighlight;
      });
    }, 3000); // Restart interval on mouse leave
  };

  const [selectedItem, setSelectedItem] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setStartTab((prevStartTab) =>
        prevStartTab < tabs.length - 1 ? prevStartTab + 1 : 0
      ),
    onSwipedRight: () =>
      setStartTab((prevStartTab) =>
        prevStartTab > 0 ? prevStartTab - 1 : tabs.length - 1
      ),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <>
      {showNavBar && (
        <NavBarContainer
          {...handlers}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <FlexWrapper>
            <LeftArrow
              onClick={() =>
                setStartTab((prevStartTab) =>
                  prevStartTab > 0 ? prevStartTab - 1 : tabs.length - 1
                )
              }
            />
            <NavBarStyled>
              <TabsWrapper
                style={{ transform: `translateX(-${startTab * 240}px)` }}
              >
                {tabs.map((tab, index) => (
                  <Link
                    key={tab.date}
                    href={tab.link}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Tab
                        $isCurrent={index === highlightedTab && !isHovering}
                        $isHovered={index === hoveredTab}
                        onMouseEnter={() => {
                          setHoveredTab(index);
                          setIsHovering(true);
                        }}
                        onMouseLeave={() => {
                          setHoveredTab(null);
                          setIsHovering(false);
                        }}
                      >
                        <Emoji>{tab.emoji}</Emoji>
                        <TabContent>
                          <TabDate>{tab.date}</TabDate>
                          <TabTitle>{tab.title}</TabTitle>
                        </TabContent>
                      </Tab>
                    </div>
                  </Link>
                ))}
              </TabsWrapper>
            </NavBarStyled>
            <RightArrow
              onClick={() =>
                setStartTab((prevStartTab) =>
                  prevStartTab < tabs.length - 1 ? prevStartTab + 1 : 0
                )
              }
            />
          </FlexWrapper>
        </NavBarContainer>
      )}
    </>
  );
};

export default NavBar;
