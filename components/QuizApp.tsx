"use client";

import { useState } from "react";

import { QUIZ_SUBJECT, quizData } from "@/lib/quiz-data";

type FeedbackState = "hidden" | "correct" | "incorrect";

interface FeedbackItem {
  state: FeedbackState;
  html: string;
}

export default function QuizApp() {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(
    quizData.map(() => ({ state: "hidden", html: "" }))
  );
  const [summary, setSummary] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function selectAnswer(qIndex: number, optIndex: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  }

  async function submitQuiz() {
    if (!studentId.trim() || !studentName.trim()) {
      alert("학번과 이름을 입력해야 제출할 수 있습니다.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    let scoreCount = 0;
    const nextFeedbacks: FeedbackItem[] = quizData.map((item, index) => {
      const selected = answers[index];
      if (selected === undefined) {
        return {
          state: "incorrect" as const,
          html: `미답변. 정답: ${item.options[item.answer]}<span class="block font-normal mt-2 text-sm text-slate-600">${item.rationale}</span>`
        };
      }
      if (selected === item.answer) {
        scoreCount++;
        return {
          state: "correct" as const,
          html: `정답입니다!<span class="block font-normal mt-2 text-sm text-slate-600">${item.rationale}</span>`
        };
      }
      return {
        state: "incorrect" as const,
        html: `오답입니다. 정답: ${item.options[item.answer]}<span class="block font-normal mt-2 text-sm text-slate-600">${item.rationale}</span>`
      };
    });

    setFeedbacks(nextFeedbacks);
    const finalScore = scoreCount * 5;
    setSummary(
      `학습자: ${studentName.trim()} (${studentId.trim()})<br/>최종 점수: <b>${finalScore}점</b> / 100점`
    );

    try {
      const res = await fetch("/api/submit-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentId.trim(),
          studentName: studentName.trim(),
          score: finalScore,
          subject: QUIZ_SUBJECT
        })
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setSummary(
          (prev) =>
            `${prev}<br/><span class="text-green-700 text-sm">(성적이 선생님께 전송되었습니다.)</span>`
        );
        setSubmitted(true);
      } else {
        setSummary(
          (prev) =>
            `${prev}<br/><span class="text-amber-700 text-sm">(채점 완료 · 성적 전송 실패: ${data.error ?? "서버 설정 확인"})</span>`
        );
      }
    } catch {
      setSummary(
        (prev) =>
          `${prev}<br/><span class="text-amber-700 text-sm">(채점 완료 · 네트워크 오류로 성적 전송 실패)</span>`
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-[850px] mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <h1 className="text-center text-slate-800 text-2xl font-bold border-b-4 border-blue-500 pb-4 mb-2">
        형상모델링 검토 작업장 평가
      </h1>
      <p className="text-center text-slate-500 text-sm mb-6">NCS 학습모듈 LM1501020213 · 형상모델링 검토</p>

      <div className="no-print flex gap-2 mb-5">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 py-3 font-bold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600"
        >
          종이 시험지 인쇄하기
        </button>
      </div>

      <div className="print-only-border bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8 flex flex-wrap gap-5 justify-center items-center">
        <div>
          <label htmlFor="student-id" className="font-bold text-slate-800 mr-2">
            학번:
          </label>
          <input
            id="student-id"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="예: 3101"
            className="px-3 py-2 border-2 border-slate-300 rounded-md w-44 focus:border-blue-500 outline-none"
            disabled={submitted}
          />
        </div>
        <div>
          <label htmlFor="student-name" className="font-bold text-slate-800 mr-2">
            이름:
          </label>
          <input
            id="student-name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="성명을 입력하세요"
            className="px-3 py-2 border-2 border-slate-300 rounded-md w-44 focus:border-blue-500 outline-none"
            disabled={submitted}
          />
        </div>
      </div>

      <div>
        {quizData.map((item, index) => (
          <div
            key={index}
            className="question-card mb-6 p-5 border border-slate-200 rounded-lg hover:border-blue-400 transition-colors"
          >
            <div className="font-bold text-lg mb-4 text-slate-700">{item.q}</div>
            <div className="space-y-2">
              {item.options.map((opt, optIndex) => (
                <label
                  key={optIndex}
                  className={`option-label flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    answers[index] === optIndex
                      ? "bg-blue-50 border-blue-200"
                      : "bg-slate-50 border-slate-100 hover:bg-blue-50/50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${index}`}
                    checked={answers[index] === optIndex}
                    onChange={() => selectAnswer(index, optIndex)}
                    className="mt-1 scale-125"
                    disabled={submitted}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {feedbacks[index].state !== "hidden" && (
              <div
                className={`feedback-box mt-4 p-4 rounded-lg font-bold ${
                  feedbacks[index].state === "correct"
                    ? "bg-green-100 text-green-900 border border-green-300"
                    : "bg-red-100 text-red-900 border border-red-300"
                }`}
                dangerouslySetInnerHTML={{ __html: feedbacks[index].html }}
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={submitQuiz}
        disabled={submitting || submitted}
        className="no-print w-full py-4 text-lg font-bold text-white bg-blue-500 rounded-xl hover:bg-blue-600 disabled:bg-slate-400 disabled:cursor-not-allowed shadow"
      >
        {submitting ? "제출 중..." : submitted ? "제출 완료" : "평가 완료 및 결과 확인"}
      </button>

      {summary && (
        <div
          className="result-summary mt-8 text-center text-lg font-bold p-6 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300"
          dangerouslySetInnerHTML={{ __html: summary }}
        />
      )}
    </div>
  );
}
