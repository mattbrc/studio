"use client";

import { useState } from "react";

export default function Page() {
  return (
    <div className="container flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full md:w-2/3 lg:w-1/2">
        <header className="mx-1 mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            Training Program Generator
          </h1>
        </header>
        {/* 
        {!program ? (
          <TrainingForm onProgramGenerated={setProgram} />
        ) : (
          <div className="space-y-4">
            <TrainingProgramDisplay program={program} />
            <button
              onClick={() => setProgram(null)}
              className="w-full rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
            >
              Generate Another Program
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
}
