"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  CheckCircle2Icon,
  AlertCircleIcon,
  InfoIcon,
} from "lucide-react";

interface FeedbackAlertProps {
  type?: "success" | "error" | "info";
  title: string;
  description?: string;
}

export function FeedbackAlert({
  type = "info",
  title,
  description,
}: FeedbackAlertProps) {
  const iconMap = {
    success: <CheckCircle2Icon className="h-5 w-5 text-green-600" />,
    error: <AlertCircleIcon className="h-5 w-5 text-red-600" />,
    info: <InfoIcon className="h-5 w-5 text-blue-600" />,
  };

  const variant = type === "error" ? "destructive" : "default";

  return (
    <Alert variant={variant} className="flex items-start gap-3">
      {iconMap[type]}
      <div>
        <AlertTitle>{title}</AlertTitle>
        {description && <AlertDescription>{description}</AlertDescription>}
      </div>
    </Alert>
  );
}
