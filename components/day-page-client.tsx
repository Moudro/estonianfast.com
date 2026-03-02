"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3 } from "lucide-react";
import { getDayLesson, type DayLesson } from "@/lib/day-plan";
import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type DayPageClientProps = {
  dayNumber: number;
};

function sectionList(title: string, items: string[]) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

type WritingChallenge = {
  prompt: string;
  answer: string;
};

function normalizeForWrite(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[!?.,]/g, "")
    .replace(/\s+/g, " ");
}

function randomChoice<T>(items: T[]): T | null {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)] ?? null;
}

function buildWritingChallenge(lesson: DayLesson): WritingChallenge {
  const words = lesson.coreWords.filter((item) => item?.et && item?.en);
  const phrases = (lesson.speakGlossary ?? []).filter((item) => item?.et && item?.en);
  const usePhrase = phrases.length > 0 && (Math.random() < 0.55 || words.length === 0);

  if (usePhrase) {
    const phrase = randomChoice(phrases);
    if (phrase) {
      const toEstonian = Math.random() < 0.7;
      return {
        prompt: toEstonian ? `Write in Estonian: "${phrase.en}"` : `Write in English: "${phrase.et}"`,
        answer: toEstonian ? phrase.et : phrase.en
      };
    }
  }

  const word = randomChoice(words);
  if (word) {
    return {
      prompt: `Write in Estonian: "${word.en}"`,
      answer: word.et
    };
  }

  return {
    prompt: `Rewrite this phrase exactly: "${lesson.speakPrompt}"`,
    answer: lesson.speakPrompt
  };
}

export function DayPageClient({ dayNumber }: DayPageClientProps) {
  const lesson = getDayLesson(dayNumber);
  const { hydrated, isCompleted, setCompleted } = useProgress();
  const [toast, setToast] = React.useState<string | null>(null);
  const [writeChallenge, setWriteChallenge] = React.useState<WritingChallenge | null>(null);
  const [writeValue, setWriteValue] = React.useState("");
  const [writeFeedback, setWriteFeedback] = React.useState("Write it from memory, then press Check.");

  React.useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  React.useEffect(() => {
    if (!lesson) return;
    setWriteChallenge(buildWritingChallenge(lesson));
    setWriteValue("");
    setWriteFeedback("Write it from memory, then press Check.");
  }, [lesson]);

  if (!lesson) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Day not found</CardTitle>
          <CardDescription>Please choose a day from the sidebar.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!hydrated) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
    );
  }

  const completed = isCompleted(dayNumber);
  const hasPrev = dayNumber > 1;
  const hasNext = dayNumber < 30;

  const onToggle = () => {
    const next = !completed;
    setCompleted(dayNumber, next);
    setToast(next ? `Day ${dayNumber} marked complete` : `Day ${dayNumber} marked incomplete`);
  };

  const onNewPrompt = () => {
    setWriteChallenge(buildWritingChallenge(lesson));
    setWriteValue("");
    setWriteFeedback("Write it from memory, then press Check.");
  };

  const onClearWrite = () => {
    setWriteValue("");
    setWriteFeedback("Cleared. Write it again from memory.");
  };

  const onCheckWrite = () => {
    if (!writeChallenge) return;
    if (!writeValue.trim()) {
      setWriteFeedback("Write your answer first, then press Check.");
      return;
    }

    const ok = normalizeForWrite(writeValue) === normalizeForWrite(writeChallenge.answer);
    if (ok) {
      setWriteFeedback("Correct. Clear and do another prompt.");
    } else {
      setWriteFeedback(`Not yet. Correct answer: ${writeChallenge.answer}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{lesson.weekLabel}</Badge>
              <Badge variant="default">{lesson.estimatedTime}</Badge>
            </div>
            <CardTitle className="text-3xl tracking-tight">{lesson.title}</CardTitle>
            <CardDescription className="text-base">{lesson.subtitle}</CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant={completed ? "secondary" : "default"} onClick={onToggle} aria-pressed={completed}>
              <CheckCircle2 className="h-4 w-4" />
              {completed ? "Mark as Incomplete" : "Mark as Complete"}
            </Button>
            {hasNext ? (
              completed ? (
                <Link href={`/app/day/${dayNumber + 1}`}>
                  <Button variant="outline">
                    Next day
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" disabled aria-disabled="true">
                  Next day
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )
            ) : (
              <Link href="/app">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            )}
          </div>
        </CardHeader>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Goal</CardTitle>
            <CardDescription className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              Estimated time: {lesson.estimatedTime}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{lesson.goal}</p>
          </CardContent>
        </Card>

        {sectionList("Practice", lesson.practice)}

        <Card>
          <CardHeader>
            <CardTitle>80/20 Core Words Today</CardTitle>
            <CardDescription>High-frequency words first. Use at least 8 in short spoken lines.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {lesson.coreWords
                .filter((item) => item?.et && item?.en)
                .map((item) => (
                  <li key={`${item.et}-${item.en}`} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2 last:border-b-0 dark:border-slate-800">
                    <span className="font-medium text-slate-900 dark:text-slate-100">{item.et}</span>
                    <span className="text-right text-slate-500 dark:text-slate-400">{item.en}</span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Speak Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{lesson.speakPrompt}</p>
            {lesson.speakGlossary?.length ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {lesson.speakGlossary.map((item) => (
                  <li key={`${item.et}-${item.en}`}>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{item.et}</span>
                    {" - "}
                    {item.en}
                  </li>
                ))}
              </ul>
            ) : null}
          </CardContent>
        </Card>

        {sectionList("Review (SRS)", lesson.review)}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Write Loop</CardTitle>
          <CardDescription>Write from memory. Check, clear, and generate a new prompt as many times as you want.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{writeChallenge?.prompt ?? ""}</p>
          <textarea
            className="min-h-[96px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            placeholder="Write your answer here"
            value={writeValue}
            onChange={(event) => setWriteValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                onCheckWrite();
              }
            }}
            aria-label="Write practice input"
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={onCheckWrite}>Check</Button>
            <Button variant="outline" onClick={onClearWrite}>Clear</Button>
            <Button variant="outline" onClick={onNewPrompt}>New Prompt</Button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">{writeFeedback}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between p-6">
          {hasPrev ? (
            <Link href={`/app/day/${dayNumber - 1}`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
            </Link>
          ) : (
            <div />
          )}

          {hasNext ? (
            completed ? (
              <Link href={`/app/day/${dayNumber + 1}`}>
                <Button variant="outline">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button variant="outline" disabled aria-disabled="true">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )
          ) : (
            <Link href="/app">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          )}
        </CardContent>
      </Card>

      {toast ? (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-soft dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
