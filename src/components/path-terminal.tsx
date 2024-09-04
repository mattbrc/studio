"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function PathTerminal() {
  const [text, setText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const fullText = "Welcome to the path. Are you ready to start?";

  useEffect(() => {
    const typeText = async () => {
      for (let i = 0; i <= fullText.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        setText(fullText.slice(0, i));
      }
      setIsTypingDone(true);
    };

    void typeText();
  }, []);

  return (
    <div className="flex w-full flex-col items-start space-y-4">
      <div className="w-full rounded-lg border border-gray-600 bg-black p-4 font-mono text-sm">
        <p className="text-emerald-400">
          {text}
          <span className="animate-pulse">▋</span>
        </p>
      </div>
      {isTypingDone && (
        <Button variant="acidOutline" size="sm">
          Yes
        </Button>
      )}
    </div>
  );
}
