import { SentimentAnalyzer } from "@/components/SentimentAnalyzer";
import { DatasetOverview } from "@/components/DatasetOverview";
import { SentimentChart } from "@/components/SentimentChart";
import { ModelComparison } from "@/components/ModelComparison";
import { SamplePredictions } from "@/components/SamplePredictions";
import { BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sentiment Analysis Dashboard</h1>
              <p className="text-sm text-muted-foreground">AI-powered tweet sentiment analyzer</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Advanced Sentiment Analysis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powered by Machine Learning models trained on 14,873 airline tweets. 
            Analyze text sentiment with Logistic Regression and Naive Bayes classifiers.
          </p>
        </section>

        {/* Dataset Overview */}
        <section>
          <DatasetOverview />
        </section>

        {/* Sentiment Analyzer */}
        <section className="grid gap-6 lg:grid-cols-2">
          <SentimentAnalyzer />
          <SamplePredictions />
        </section>

        {/* Charts */}
        <section>
          <SentimentChart />
        </section>

        {/* Model Comparison */}
        <section>
          <ModelComparison />
        </section>

        {/* Footer Info */}
        <section className="text-center py-8 text-sm text-muted-foreground">
          <p>
            Dataset: Twitter US Airline Sentiment | Models: Logistic Regression (79% accuracy) & Naive Bayes (76% accuracy)
          </p>
        </section>
      </main>
    </div>
  );
};

export default Index;
