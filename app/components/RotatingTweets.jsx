import React, { useState, useEffect } from "react";
import { useMediaQuery } from "@chakra-ui/react";
import { TwitterTweetEmbed } from "react-twitter-embed";

const tweets = [
  { id: "933354946111705097", image: "checking.png" },
  { id: "1083592734038929408", image: "checking2.png" },
  { id: "1806767512614248459", image: "checking.png" },
  // Add more tweets and images as needed
];
// const [isSmallScreen] = useMediaQuery("(max-width: 600px)");

function RotatingTweet() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % tweets.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <div>
      <TwitterTweetEmbed key={tweets[index].id} tweetId={tweets[index].id} />
      <img
        src={tweets[index].image}
        alt=""
        width={324} // Adjust the width based on the screen size
        height={405}
      />
    </div>
  );
}

export default RotatingTweet;
