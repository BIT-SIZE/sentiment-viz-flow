import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

const samples = [
  {
    text: "I had a wonderful experience, crew was fantastic!",
    sentiment: "positive",
    lr_pred: "positive",
    nb_pred: "positive"
  },
  {
    text: "This was the worst flight ever. Delayed, rude staff.",
    sentiment: "negative",
    lr_pred: "negative",
    nb_pred: "negative"
  },
  {
    text: "Everything was okay. Nothing special.",
    sentiment: "neutral",
    lr_pred: "neutral",
    nb_pred: "neutral"
  },
  {
    text: "Great service and on-time departure!",
    sentiment: "positive",
    lr_pred: "positive",
    nb_pred: "positive"
  }
];

const getSentimentBadgeClass = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return "bg-positive/10 text-positive border-positive/20";
    case "negative":
      return "bg-negative/10 text-negative border-negative/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export const SamplePredictions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Sample Predictions
        </CardTitle>
        <CardDescription>
          Example predictions from both trained models
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {samples.map((sample, index) => (
            <div 
              key={index} 
              className="p-4 rounded-lg border bg-card hover:shadow-md transition-all"
            >
              <div className="text-sm mb-3 text-foreground">
                "{sample.text}"
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-muted-foreground font-medium">Predictions:</span>
                <Badge variant="outline" className={getSentimentBadgeClass(sample.lr_pred)}>
                  LR: {sample.lr_pred}
                </Badge>
                <Badge variant="outline" className={getSentimentBadgeClass(sample.nb_pred)}>
                  NB: {sample.nb_pred}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
