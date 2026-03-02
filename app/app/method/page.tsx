"use client";

import Link from "next/link";
import {
  ArrowRight,
  ScanLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    question: "How much time per day is needed?",
    answer: "Most days are designed for 20 to 30 minutes. Consistency matters more than long sessions."
  },
  {
    question: "Is this suitable for beginners?",
    answer: "Yes. The sequence starts from high-utility basics and builds progressively into real speaking."
  },
  {
    question: "How is progress tracked?",
    answer: "Each day can be marked complete or incomplete. The app updates percentage, streak, and sidebar status automatically."
  }
];

export default function MethodPage() {
  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="space-y-4 p-8">
          <Badge className="w-fit" variant="default">
            Method
          </Badge>
          <CardTitle className="max-w-3xl text-3xl tracking-tight sm:text-4xl">
            Estonian is hard to learn. Your path can still be simple.
          </CardTitle>
          <CardDescription className="max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Most people fail because they use random lessons without a system. EstonianFast is built on one core rule:
            80/20 language deconstruction. Each day you learn the most useful high-frequency words first, build short sentence frames, then speak immediately.
          </CardDescription>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            30-day execution guarantee: complete every daily commitment and you finish with practical basic Estonian speaking ability for greetings,
            self-introduction, and short everyday question-answer exchanges.
          </p>
          <p className="max-w-3xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Attribution: this framework is inspired by 80/20 language deconstruction principles popularized by Tim Ferriss,
            and broader frequency-based language-learning approaches. EstonianFast is independent and not endorsed by any individual.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/app/day/1">
              <Button className="rounded-xl">
                Ready to Start Day 1
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>What You Can Build in 30 Days</CardTitle>
            <CardDescription>Clear outcomes, not unrealistic promises.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <li>Stable daily learning habit with measurable completion.</li>
              <li>A practical 80/20 vocabulary base (12 high-frequency words per day).</li>
              <li>Improved pronunciation through repeated listening and speaking drills.</li>
              <li>Higher confidence in everyday Estonian interactions.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>The System</CardTitle>
            <CardDescription>Simple loop repeated every day.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm font-medium text-slate-700 dark:text-slate-200 sm:grid-cols-5">
              {[
                "Learn",
                "Practice",
                "Recall",
                "Speak",
                "Review"
              ].map((step, index) => (
                <div key={step} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center dark:border-slate-800 dark:bg-slate-800/60">
                  <div className="text-xs text-slate-500 dark:text-slate-400">{index + 1}</div>
                  <div>{step}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">FAQ</h2>
        <div className="space-y-3">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-soft dark:border-slate-800 dark:bg-slate-900"
            >
              <summary className="cursor-pointer list-none text-sm font-medium text-slate-800 dark:text-slate-100">
                <span className="inline-flex items-center gap-2">
                  <ScanLine className="h-4 w-4 text-indigo-500" />
                  {item.question}
                </span>
              </summary>
              <p className="pt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
