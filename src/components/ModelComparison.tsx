import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CheckCircle2 } from "lucide-react";

const modelData = [
  { model: "Logistic Regression", accuracy: 0.79 },
  { model: "Naive Bayes", accuracy: 0.76 },
];

export const ModelComparison = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Model Performance Comparison
        </CardTitle>
        <CardDescription>
          Accuracy comparison between trained ML models
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modelData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                domain={[0, 1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                type="category" 
                dataKey="model" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                width={150}
              />
              <Tooltip 
                formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar dataKey="accuracy" radius={[0, 8, 8, 0]}>
                {modelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {modelData.map((model, index) => (
            <div key={index} className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="font-semibold text-sm">{model.model}</div>
              <div className="text-2xl font-bold text-primary">
                {(model.accuracy * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Test set accuracy
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
