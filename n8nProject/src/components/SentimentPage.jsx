import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Smile,
  Frown,
  Meh,
  FileText,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const SentimentPage = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [inputError, setInputError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    // Clear previous input error
    setInputError("");

    if (!text.trim()) {
      setInputError("Please enter some text to analyze");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "https://narendra-sai-9092.app.n8n.cloud/webhook-test/d7d09f23-1436-4792-9b8b-a6ea389ffb7e",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get analysis from server");
      }

      const data = await response.json();
      console.log("Response data:", data);
      setResult(data);

      // Show success toast
      toast({
        title: "Analysis Complete!",
        description: "Your sentiment analysis has been successfully completed.",
        className: "bg-green-50 border-green-200 text-green-900",
      });
    } catch (error) {
      console.error("Error:", error);

      // Show error toast
      toast({
        variant: "destructive",
        title: "❌ Analysis Failed",
        description:
          error.message ||
          "Failed to analyze text. Please check your connection and try again.",
        className: "bg-red-600 text-white border-red-700",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSentimentConfig = (sentiment) => {
    const normalizedSentiment = sentiment?.toLowerCase();

    switch (normalizedSentiment) {
      case "positive":
        return {
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: Smile,
          iconColor: "text-green-500",
          gradient: "from-green-50 to-emerald-50",
        };
      case "negative":
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: Frown,
          iconColor: "text-red-500",
          gradient: "from-red-50 to-rose-50",
        };
      case "neutral":
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          icon: Meh,
          iconColor: "text-blue-500",
          gradient: "from-blue-50 to-sky-50",
        };
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          icon: Meh,
          iconColor: "text-gray-500",
          gradient: "from-gray-50 to-slate-50",
        };
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter a sentence or paragraph..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setInputError(""); // Clear error when user types
            }}
            className={`min-h-[150px] text-base ${
              inputError ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
          />
          {inputError && (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm font-medium bg-red-50 p-3 rounded-md border border-red-200">
              <AlertCircle className="w-4 h-4" />
              <span>{inputError}</span>
            </div>
          )}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-4"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </CardContent>
      </Card>

      {loading && (
        <Card className="w-full max-w-2xl mt-4">
          <CardHeader>
            <CardTitle>Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card
          className={`w-full max-w-2xl mt-6 border-2 shadow-lg bg-gradient-to-br ${
            getSentimentConfig(result.sentimentResult).gradient
          }`}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 text-purple-500" />
              Analysis Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sentiment Section */}
            <div
              className={`p-6 rounded-xl border-2 ${
                getSentimentConfig(result.sentimentResult).borderColor
              } ${
                getSentimentConfig(result.sentimentResult).bgColor
              } shadow-md transition-all hover:shadow-lg`}
            >
              <div className="flex items-center gap-3 mb-3">
                {React.createElement(
                  getSentimentConfig(result.sentimentResult).icon,
                  {
                    className: `w-8 h-8 ${
                      getSentimentConfig(result.sentimentResult).iconColor
                    }`,
                  }
                )}
                <h3 className="text-lg font-bold text-gray-700">
                  Sentiment Analysis
                </h3>
              </div>
              <div
                className={`inline-block px-6 py-3 rounded-full font-bold text-xl ${
                  getSentimentConfig(result.sentimentResult).bgColor
                } ${
                  getSentimentConfig(result.sentimentResult).color
                } border-2 ${
                  getSentimentConfig(result.sentimentResult).borderColor
                } shadow-sm`}
              >
                {result.sentimentResult}
              </div>
            </div>

            {/* Summary Section */}
            <div className="p-6 rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-7 h-7 text-purple-500" />
                <h3 className="text-lg font-bold text-gray-700">Summary</h3>
              </div>
              <p className="text-gray-800 leading-relaxed text-base bg-white/60 p-4 rounded-lg border border-purple-100">
                {result.summaryResult}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SentimentPage;
