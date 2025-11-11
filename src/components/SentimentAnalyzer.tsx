import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare } from "lucide-react";

interface SentimentResult {
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
}

export const SentimentAnalyzer = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeSentiment = (inputText: string): SentimentResult => {
    // Simple rule-based sentiment analysis for demo
    const positiveWords = ["good", "great", "excellent", "amazing", "wonderful", "fantastic", "love", "best", "happy", "perfect"];
    const negativeWords = ["bad", "terrible", "awful", "worst", "hate", "horrible", "poor", "disappointing", "delayed", "rude"];
    
    const lowerText = inputText.toLowerCase();
    const words = lowerText.split(/\s+/);
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
      if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    });
    
    let sentiment: "positive" | "negative" | "neutral";
    let confidence: number;
    
    if (positiveCount > negativeCount) {
      sentiment = "positive";
      confidence = Math.min(0.65 + (positiveCount * 0.1), 0.95);
    } else if (negativeCount > positiveCount) {
      sentiment = "negative";
      confidence = Math.min(0.65 + (negativeCount * 0.1), 0.95);
    } else {
      sentiment = "neutral";
      confidence = 0.5 + Math.random() * 0.2;
    }
    
    return { text: inputText, sentiment, confidence };
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const result = analyzeSentiment(text);
    setResult(result);
    setIsAnalyzing(false);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "positive";
      case "negative": return "negative";
      default: return "neutral";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Sentiment Analyzer
        </CardTitle>
        <CardDescription>
          Enter text to analyze its sentiment (positive, negative, or neutral)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Type or paste your text here... (e.g., 'I had a wonderful experience, the crew was fantastic!')"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] resize-none"
          />
        </div>
        
        <Button 
          onClick={handleAnalyze} 
          disabled={!text.trim() || isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Sentiment"
          )}
        </Button>

        {result && (
          <div className="mt-6 p-4 rounded-lg bg-muted/50 space-y-3 animate-in fade-in-50 duration-300">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Sentiment:</span>
              <Badge 
                variant="outline" 
                className={`
                  ${result.sentiment === 'positive' ? 'bg-positive/10 text-positive border-positive/20' : ''}
                  ${result.sentiment === 'negative' ? 'bg-negative/10 text-negative border-negative/20' : ''}
                  ${result.sentiment === 'neutral' ? 'bg-muted text-muted-foreground border-border' : ''}
                `}
              >
                {result.sentiment.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Confidence:</span>
              <span className="text-sm font-semibold">{(result.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-background rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  result.sentiment === 'positive' ? 'bg-positive' : 
                  result.sentiment === 'negative' ? 'bg-negative' : 
                  'bg-muted-foreground'
                }`}
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
