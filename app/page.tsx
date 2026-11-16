"use client";

import { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Intro from "@/components/Intro";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Playground from "@/components/Playground";
import TechStack from "@/components/TechStack";
import GithubSection from "@/components/GithubSection";
import Contact from "@/components/Contact";

/**
 * Home page composition. The intro overlay lifts once genuine load
 * milestones complete (or the user skips it); the hero line reveals then
 * play. All content sections are server-renderable client components so
 * animations can attach after hydration.
 */
export default function Home() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>
      <SmoothScroll />
      <Cursor />
      {!introDone ? <Intro onDone={() => setIntroDone(true)} /> : null}
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero start={introDone} />
        <About />
        <Projects />
        <Playground />
        <TechStack />
        <GithubSection />
        <Contact />
      </main>
    </>
  );
}
