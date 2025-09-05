
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, BookOpen, FlaskConical } from 'lucide-react';

export function SmartSearchClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (!searchTerm) return;
    setIsLoading(true);
    // Simulate a search across the portal
    setTimeout(() => {
      // In a real app, this would be an API call that aggregates results
      const mockResults = [
        { type: 'Drug', title: `${searchTerm} (from Drug Tree)`, snippet: 'A potent beta-blocker used for hypertension...', icon: FlaskConical, href: '/drug-classification-tree' },
        { type: 'Lecture Note', title: `Lecture on ${searchTerm}`, snippet: 'Introduction to cardiovascular drugs, focusing on...', icon: BookOpen, href: '/lecture-notes' },
        { type: 'Case Study', title: `Case: A patient with ${searchTerm}-induced rash`, snippet: 'A 55-year-old male presents with...', icon: FileText, href: '/clinical-case-simulator' },
      ];
      setResults(mockResults);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portal-wide Search</CardTitle>
          <CardDescription>Enter a term to search across all modules.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for anything..."
                className="pl-10 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} size="lg" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center p-12">
          <p className="text-muted-foreground">Searching across the portal for "{searchTerm}"...</p>
        </div>
      )}

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>Found {results.length} results for "{searchTerm}".</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <Card key={index} className="hover:bg-muted/50 cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <result.icon className="h-5 w-5 text-primary" />
                      {result.title}
                      <span className="text-xs font-normal text-muted-foreground">({result.type})</span>
                    </CardTitle>
                    <CardDescription>{result.snippet}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!results && !isLoading && (
        <div className="text-center text-muted-foreground p-12">
          <p>Search results will appear here.</p>
        </div>
      )}
    </div>
  );
}
