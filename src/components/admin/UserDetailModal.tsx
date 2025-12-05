import { UserData } from "@/hooks/useFirebaseData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Heart, Activity, Phone, Mail, Calendar, AlertTriangle, HelpCircle, CheckCircle, XCircle } from "lucide-react";

// Question mapping with full text
const QUESTION_MAP: Record<string, { question: string; type: string }> = {
  q1: { question: "Do you experience stuttering or speech blocks?", type: "boolean" },
  q2: { question: "When did your stuttering first begin?", type: "choice" },
  q3: { question: "In which situations do you experience the most difficulty?", type: "multi-select" },
  q4: { question: "How would you rate the severity of your stuttering? (1-10)", type: "scale" },
  q5: { question: "Do you avoid certain words or situations because of stuttering?", type: "boolean" },
  q6: { question: "How much does stuttering affect your daily life? (1-10)", type: "scale" },
  q7: { question: "Have you received speech therapy before?", type: "boolean" },
  q8: { question: "How confident do you feel when speaking? (1-10)", type: "scale" },
  q9: { question: "Do you experience physical tension when stuttering?", type: "boolean" },
  q10: { question: "How often do you think about your stuttering? (1-10)", type: "scale" },
  q11: { question: "Has stuttering affected your career or education choices?", type: "boolean" },
  q12: { question: "What is your age range?", type: "choice" },
};

interface UserDetailModalProps {
  user: UserData | null;
  open: boolean;
  onClose: () => void;
}

export function UserDetailModal({ user, open, onClose }: UserDetailModalProps) {
  if (!user) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatAnswerValue = (value: unknown, type: string) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (type === "scale" && typeof value === "number") {
      return `${value}/10`;
    }
    return String(value);
  };

  const getScoreColor = (score: number) => {
    if (score <= 30) return "text-accent";
    if (score <= 60) return "text-yellow-500";
    return "text-destructive";
  };

  const getScoreBarWidth = (score: number) => {
    return `${Math.min(score, 100)}%`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-accent/10 to-transparent border-b border-border">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-brand flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-foreground">
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold">{user.name || "Unknown Patient"}</DialogTitle>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {user.whatsapp || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Assessment: {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
            <Badge 
              variant={user.result?.profileType === "low-risk" ? "secondary" : "destructive"}
              className="text-sm px-3 py-1"
            >
              {user.result?.profileLabel || "Pending"}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh]">
          <div className="p-6 space-y-6">
            {/* Score Cards */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Brain className="h-4 w-4 text-accent" />
                Clinical Assessment Scores
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-card border border-border p-4 shadow-card">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-medium text-muted-foreground">Risk Score</span>
                  </div>
                  <p className={`text-3xl font-bold ${getScoreColor(user.result?.riskScore || 0)}`}>
                    {user.result?.riskScore || 0}
                  </p>
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-orange-500 transition-all duration-500"
                      style={{ width: getScoreBarWidth(user.result?.riskScore || 0) }}
                    />
                  </div>
                </div>
                
                <div className="rounded-xl bg-card border border-border p-4 shadow-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium text-muted-foreground">Emotion Score</span>
                  </div>
                  <p className={`text-3xl font-bold ${getScoreColor(user.result?.emotionScore || 0)}`}>
                    {user.result?.emotionScore || 0}
                  </p>
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-red-500 transition-all duration-500"
                      style={{ width: getScoreBarWidth(user.result?.emotionScore || 0) }}
                    />
                  </div>
                </div>
                
                <div className="rounded-xl bg-card border border-border p-4 shadow-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-5 w-5 text-accent" />
                    <span className="text-sm font-medium text-muted-foreground">Function Score</span>
                  </div>
                  <p className={`text-3xl font-bold ${getScoreColor(user.result?.functionScore || 0)}`}>
                    {user.result?.functionScore || 0}
                  </p>
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-blue-500 transition-all duration-500"
                      style={{ width: getScoreBarWidth(user.result?.functionScore || 0) }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Detailed Questions & Answers */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-accent" />
                Assessment Questions & Responses
              </h3>
              <div className="space-y-3">
                {user.answers?.map((answer, i) => {
                  const questionInfo = QUESTION_MAP[answer.questionId] || { 
                    question: `Question ${answer.questionId}`, 
                    type: "unknown" 
                  };
                  const isBooleanYes = typeof answer.value === "boolean" && answer.value;
                  const isBooleanNo = typeof answer.value === "boolean" && !answer.value;
                  
                  return (
                    <div 
                      key={i} 
                      className="rounded-lg border border-border bg-muted/30 p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground mb-2">
                            {questionInfo.question}
                          </p>
                          <div className="flex items-center gap-2">
                            {isBooleanYes && <CheckCircle className="h-4 w-4 text-accent" />}
                            {isBooleanNo && <XCircle className="h-4 w-4 text-muted-foreground" />}
                            <span className={`text-sm ${isBooleanYes ? 'text-accent font-medium' : 'text-muted-foreground'}`}>
                              {formatAnswerValue(answer.value, questionInfo.type)}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {questionInfo.type}
                        </Badge>
                      </div>
                    </div>
                  );
                }) || (
                  <span className="text-sm text-muted-foreground">No answers recorded</span>
                )}
              </div>
            </div>

            <Separator />

            {/* Triggers */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Identified Triggers</h3>
              <div className="flex flex-wrap gap-2">
                {user.result?.triggers?.length > 0 ? (
                  user.result.triggers.map((trigger, i) => (
                    <Badge key={i} className="bg-accent/10 text-accent border-accent/30 hover:bg-accent/20">
                      {trigger}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No triggers identified</span>
                )}
              </div>
            </div>

            <Separator />

            {/* Exercises */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Recommended Exercises</h3>
              <div className="space-y-3">
                {user.result?.exercises?.map((exercise, index) => (
                  <div key={exercise.id} className="rounded-xl border border-border p-4 bg-card shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-accent text-foreground flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <h4 className="font-medium text-foreground">{exercise.name}</h4>
                      </div>
                      <Badge variant="secondary" className="text-xs">{exercise.duration}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 ml-8">{exercise.description}</p>
                    <div className="ml-8 p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-accent font-medium mb-2">Steps:</p>
                      <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                        {exercise.steps?.slice(0, 4).map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                    <p className="text-xs text-accent font-medium mt-3 ml-8">✓ {exercise.benefit}</p>
                  </div>
                )) || (
                  <span className="text-sm text-muted-foreground">No exercises assigned</span>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
