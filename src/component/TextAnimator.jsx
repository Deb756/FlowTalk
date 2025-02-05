import React, { useState, useEffect } from "react";

const TextAnimator = () => {
  const words = [
    "Instant Messaging",
  "Real-Time Chat",
  "Group Conversations",
  "File Sharing",
  "Personalized Chats",
  "Secure Messaging",
  "Custom Emojis",
  "Multi-Device Sync",
  "Chat History",
  "Private Chats",
  "Online Presence",
  "Push Notifications",
  "Team Collaboration",
  ];

  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const animateText = () => {
      if (wordIndex < words.length) {
        let word = words[wordIndex];

        if (charIndex < word.length) {
          setDisplayText((prev) => prev + word[charIndex]); // Add one character
          setTimeout(() => setCharIndex((prev) => prev + 1), 150);
        } else {
          // Pause before clearing and moving to next word
          setTimeout(() => {
            setDisplayText(""); // Clear text
            setCharIndex(0);
            setWordIndex((prev) => (prev + 1) % words.length); // Loop words
          }, 130);
        }
      }
    };

    const timeout = setTimeout(animateText, 1);
    return () => clearTimeout(timeout);
  }, [charIndex, wordIndex]);

  return (
    <div
      style={{
        color: "white",
        display: "flex",
        fontFamily:"monospace",
        justifyContent:"center",
        placeItems:"center",
        gap: "10px",
        fontSize: "x-large",
        width: "100vw",
      }}
    >
      <div id="textmate">{displayText}<div id="blinker">|</div></div>
      
    </div>
  );
};

export default TextAnimator;

