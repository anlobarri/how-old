import Quiz from "@/components/Quiz";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">HowOld</h1>
      <Quiz />
    </main>
  );
}
