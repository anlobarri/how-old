import Quiz from "@/components/Quiz";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-black mb-8">
        How<span className="text-[#EFD81D]">Old</span>
      </h1>
      <Quiz />
    </main>
  );
}
