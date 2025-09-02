
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Puzzle, Pilcrow, Search, Shuffle, Zap } from "lucide-react";

const games = [
  {
    icon: Pilcrow,
    title: "Pharma Crossword",
    description: "Solve puzzles with clues based on drug names, MOAs, and pharmacognosy.",
    status: "Coming Soon",
  },
  {
    icon: Search,
    title: "Word Search",
    description: "Find themed words for drug classes, herbal constituents, and medical abbreviations.",
    status: "Coming Soon",
  },
  {
    icon: Puzzle,
    title: "Flash Puzzle",
    description: "Drag and drop to match drugs to their mechanisms of action or plants to their constituents.",
    status: "Coming Soon",
  },
  {
    icon: Zap,
    title: "Rapid Fire Quiz",
    description: "Answer as many questions as you can in a 30-second streak challenge.",
    status: "Coming Soon",
  },
  {
    icon: Shuffle,
    title: "Anagram Solver",
    description: "Unscramble jumbled letters to reveal the names of common and complex drugs.",
    status: "Coming Soon",
  },
];


export function PharmaGamesClient() {

  const handleGameClick = (status: string) => {
    if (status === "Coming Soon") {
      toast({
        title: "Feature in Development",
        description: "This game is currently being built and will be available soon!",
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <Card key={game.title} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
                <game.icon className="h-10 w-10 text-primary" />
                <CardTitle>{game.title}</CardTitle>
            </div>
            <CardDescription>{game.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Button
              className="w-full"
              variant={game.status === "Coming Soon" ? "secondary" : "default"}
              onClick={() => handleGameClick(game.status)}
            >
              {game.status === "Coming Soon" ? "Coming Soon" : "Play Now"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
