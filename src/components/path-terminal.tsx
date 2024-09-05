"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function PathTerminal() {
  const [text, setText] = useState("");
  const [stage, setStage] = useState("initial");
  const initialText = "Welcome to the path. Are you ready to start?";
  // const choosePathText = "\n\nChoose your path:";
  const choosePathText = "\nChoose your path:";
  const paths = ["Warrior", "Gazelle", "Brute"];

  const typeText = async (textToType: string, existingText: string) => {
    for (let i = 0; i <= textToType.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setText(existingText + textToType.slice(0, i));
    }
  };

  useEffect(() => {
    const initializeText = async () => {
      await typeText(initialText, "");
      setStage("ready");
    };
    void initializeText();
  }, []);

  const handleYesClick = async () => {
    setStage("typing");
    await typeText(choosePathText, text);
    setStage("choosePath");
  };

  return (
    <div className="flex w-full flex-col items-start space-y-4">
      <div className="w-full rounded-lg border border-gray-600 bg-black p-4 font-mono text-sm">
        <p className="whitespace-pre-line text-emerald-400">
          {text}
          {stage !== "choosePath" && <span className="animate-pulse">▋</span>}
        </p>
      </div>
      {stage === "ready" && (
        <Button variant="acidOutline" size="sm" onClick={handleYesClick}>
          Yes
        </Button>
      )}
      {stage === "choosePath" && (
        <div className="flex flex-col space-y-2">
          {paths.map((path) => (
            <Button key={path} variant="acidOutline" size="sm">
              {path}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
