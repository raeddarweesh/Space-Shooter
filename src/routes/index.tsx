import { createFileRoute } from "@tanstack/react-router";
import { AphelionGame } from "@/components/game/aphelion-game";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <AphelionGame />;
}
