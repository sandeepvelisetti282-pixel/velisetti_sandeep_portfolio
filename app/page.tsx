import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { Record } from "@/components/record";
import { Stack } from "@/components/stack";
import { Work } from "@/components/work";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Work />
        <Stack />
        <Record />
        <About />
        <Contact />
      </main>
    </>
  );
}
