import React, { useMemo } from 'react';
import {
  Question,
  QuestionAttempt,
  SimuladoResultRecord,
  CarreiraMeta,
  Disciplina,
  Banca,
} from '../types/concursos';
import {
  TrendingUp,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

interface PerformanceAnalyticsViewProps {
  questions: Question[];
  attempts: QuestionAttempt[];
  simulados: SimuladoResultRecord[];
  carreiras: CarreiraMeta[];
  selectedCarreiraId: string;
  onSelectCarreira: (id: string) => void;
  onPracticeSubject: (disciplina: Disciplina, assunto?: string) => void;
}

const ALL_DISCIPLINAS: Disciplina[] = [
  'Direito Constitucional',
  'Direito Administrativo',
  'Língua Portuguesa',
  'Raciocínio Lógico',
  'Direito Tributário & AFO',
  'Informática & TI',
];

const ALL_BANCAS: Banca[] = [
  'FGV',
  'CEBRASPE',
  'FCC',
  'VUNESP',
  'CESGRANRIO',
];

export const PerformanceAnalyticsView: React.FC<
  PerformanceAnalyticsViewProps
> = ({
  questions,
  attempts,
  simulados,
  carreiras,
  selectedCarreiraId,
  onSelectCarreira,
  onPracticeSubject,
}) => {
  const activeCarreira =
    carreiras.find((c) => c.id === selectedCarreiraId) || carreiras[0];

  const questionMap = useMemo(() => {
    const map: Record<string, Question> = {};
    questions.forEach((q) => {
      map[q.id] = q;
    });
    return map;
  }, [questions]);

  // Global metrics
  const globalStats = useMemo(() => {
    const total = attempts.length;
    const correct = attempts.filter((a) => a.isCorreta).length;
    const wrong = attempts.filter((a) => !a.isCorreta && !a.emBranco).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const avgTime =
      total > 0
        ? Math.round(
            attempts.reduce((acc, a) => acc + a.tempoGastoSegundos, 0) / total
          )
        : 0;
    const gapToCut = accuracy - activeCarreira.notaCorteAlvo;
    return { total, correct, wrong, accuracy, avgTime, gapToCut };
  }, [attempts, activeCarreira]);

  // Discipline & Topic (Edital Verticalizado) Matrix
  const disciplineStats = useMemo(() => {
    return ALL_DISCIPLINAS.map((disc) => {
      const discQuestions = questions.filter((q) => q.disciplina === disc);
      const discAttempts = attempts.filter(
        (a) => questionMap[a.questionId]?.disciplina === disc
      );
      const total = discAttempts.length;
      const correct = discAttempts.filter((a) => a.isCorreta).length;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
      const avgTime =
        total > 0
          ? Math.round(
              discAttempts.reduce((s, a) => s + a.tempoGastoSegundos, 0) / total
            )
          : 0;
      const peso = activeCarreira.pesosDisciplinas[disc] || 1.0;
      const gap = accuracy - activeCarreira.notaCorteAlvo;

      // Subtopics (Assuntos)
      const uniqueAssuntos = Array.from(
        new Set(discQuestions.map((q) => q.assunto))
      );
      const assuntosBreakdown = uniqueAssuntos.map((assunto) => {
        const topicAttempts = discAttempts.filter(
          (a) => questionMap[a.questionId]?.assunto === assunto
        );
        const tTotal = topicAttempts.length;
        const tCorrect = topicAttempts.filter((a) => a.isCorreta).length;
        const tAcc = tTotal > 0 ? Math.round((tCorrect / tTotal) * 100) : 0;
        return {
          assunto,
          total: tTotal,
          correct: tCorrect,
          accuracy: tAcc,
        };
      });

      return {
        disciplina: disc,
        total,
        correct,
        wrong: total - correct,
        accuracy,
        avgTime,
        peso,
        gap,
        assuntosBreakdown,
      };
    });
  }, [questions, attempts, questionMap, activeCarreira]);

  // Confidence Matrix (Certeza vs Dúvida vs Chute)
  const confidenceStats = useMemo(() => {
    const levels = [
      {
        id: 'certeza' as const,
        label: 'Tenho Certeza',
        desc: 'Domínio consciente (erros aqui indicam pegadinha ou falsa certeza)',
      },
      {
        id: 'duvida' as const,
        label: 'Dúvida entre 2',
        desc: 'Eliminação parcial de distratores',
      },
      {
        id: 'chute' as const,
        label: 'Chute',
        desc: 'Alto risco em provas com penalidade líquida (CEBRASPE)',
      },
    ];

    return levels.map((lvl) => {
      const sub = attempts.filter((a) => a.confianca === lvl.id);
      const total = sub.length;
      const correct = sub.filter((a) => a.isCorreta).length;
      const wrong = total - correct;
      const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
      return { ...lvl, total, correct, wrong, accuracy: acc };
    });
  }, [attempts]);

  // Banca Performance Breakdown
  const bancaStats = useMemo(() => {
    return ALL_BANCAS.map((banca) => {
      const sub = attempts.filter(
        (a) => questionMap[a.questionId]?.banca === banca
      );
      const total = sub.length;
      const correct = sub.filter((a) => a.isCorreta).length;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
      return { banca, total, correct, accuracy };
    });
  }, [attempts, questionMap]);

  return (
    <div className="space-y-8">
      {/* Header & Career Benchmark Selector */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-sky-800">
            Diagnóstico de Precisão · Edital Verticalizado & Evolução Histórica
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
            Raio-X Analítico de Desempenho
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Compare sua taxa de acerto e tempo médio de resolução contra a nota
            de corte da sua carreira-alvo e identifique pontos cegos por
            assunto.
          </p>
        </div>

        <div className="space-y-1 min-w-[280px]">
          <label
            htmlFor="analytics-career-select"
            className="block text-xs font-semibold text-slate-700"
          >
            Carreira-Alvo (Nota de Corte & Pesos):
          </label>
          <select
            id="analytics-career-select"
            value={selectedCarreiraId}
            onChange={(e) => onSelectCarreira(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-sky-600 focus:outline-none"
          >
            {carreiras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} — Corte: {c.notaCorteAlvo}% ({c.bancaReferencia})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1.5">
          <span className="text-xs font-medium text-slate-500">
            Taxa de Acerto Global
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl font-semibold text-slate-900 tabular-nums">
              {globalStats.accuracy}%
            </span>
            <span className="text-xs font-mono text-slate-600 tabular-nums">
              {globalStats.correct}/{globalStats.total} questões
            </span>
          </div>
          <p className="text-xs text-slate-600 pt-1">
            {globalStats.gapToCut >= 0 ? (
              <span className="font-semibold text-emerald-700">
                ● +{globalStats.gapToCut}% acima do corte (
                {activeCarreira.notaCorteAlvo}%)
              </span>
            ) : (
              <span className="font-semibold text-amber-800">
                ▲ {Math.abs(globalStats.gapToCut)}% abaixo do corte (
                {activeCarreira.notaCorteAlvo}%)
              </span>
            )}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1.5">
          <span className="text-xs font-medium text-slate-500">
            Simulados Auditados
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl font-semibold text-slate-900 tabular-nums">
              {simulados.length}
            </span>
            <span className="text-xs font-mono text-emerald-700 font-semibold tabular-nums">
              Último: {simulados[simulados.length - 1]?.percentualBruto ?? 0}%
            </span>
          </div>
          <p className="text-xs text-slate-600 pt-1">
            Evolução desde o 1º diagnóstico:{' '}
            <strong className="font-mono text-slate-900 tabular-nums">
              +
              {Math.max(
                0,
                (simulados[simulados.length - 1]?.percentualBruto ?? 0) -
                  (simulados[0]?.percentualBruto ?? 0)
              )}{' '}
              p.p.
            </strong>
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1.5">
          <span className="text-xs font-medium text-slate-500">
            Tempo Médio por Questão
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl font-semibold text-slate-900 tabular-nums">
              {globalStats.avgTime}s
            </span>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              Alvo: {activeCarreira.tempoMedioAlvoSegundos}s
            </span>
          </div>
          <p className="text-xs text-slate-600 pt-1">
            {globalStats.avgTime <= activeCarreira.tempoMedioAlvoSegundos ? (
              <span className="font-semibold text-emerald-700">
                ● Ritmo seguro dentro da janela de prova
              </span>
            ) : (
              <span className="font-semibold text-amber-800">
                ▲ Acima do tempo-alvo da carreira
              </span>
            )}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-1.5">
          <span className="text-xs font-medium text-slate-500">
            Acertos Conscientes (Certeza)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl font-semibold text-slate-900 tabular-nums">
              {confidenceStats[0]?.accuracy ?? 0}%
            </span>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              {confidenceStats[0]?.correct ?? 0}/
              {confidenceStats[0]?.total ?? 0} certas
            </span>
          </div>
          <p className="text-xs text-slate-600 pt-1">
            Falsas certezas (erros com certeza):{' '}
            <strong className="font-mono text-red-700 tabular-nums">
              {confidenceStats[0]?.wrong ?? 0}
            </strong>
          </p>
        </div>
      </div>

      {/* Evolution Chart & Banca Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Simulado Trajectory vs Cutoff Line */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Curva de Evolução nos Simulados vs. Nota de Corte
              </h2>
              <p className="text-xs text-slate-500">
                Histórico cronológico de aproveitamento bruto (%) comparado à
                meta de {activeCarreira.notaCorteAlvo}%
              </p>
            </div>
            <span className="text-xs font-mono text-sky-900 font-semibold tabular-nums">
              Linha tracejada = Corte ({activeCarreira.notaCorteAlvo}%)
            </span>
          </div>

          {/* Visual Bar/Trajectory Chart */}
          <div className="relative pt-6 pb-2">
            {/* Horizontal Cutoff Reference Line */}
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-amber-500/80 z-10 pointer-events-none flex justify-end"
              style={{
                bottom: `${Math.min(92, Math.max(15, activeCarreira.notaCorteAlvo))}%`,
              }}
            >
              <span className="text-[11px] font-mono font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 -mt-3 rounded-xs tabular-nums">
                Corte {activeCarreira.notaCorteAlvo}%
              </span>
            </div>

            <div className="grid grid-cols-5 gap-4 items-end h-52 pt-4 border-b border-slate-200 px-2">
              {simulados.slice(-5).map((sim, idx) => {
                const heightPct = Math.max(12, Math.min(100, sim.percentualBruto));
                const beatCutoff =
                  sim.percentualBruto >= activeCarreira.notaCorteAlvo;
                return (
                  <div
                    key={sim.id}
                    className="flex flex-col items-center justify-end h-full gap-2"
                  >
                    <span className="font-mono text-xs font-semibold text-slate-900 tabular-nums">
                      {sim.percentualBruto}%
                    </span>
                    <div
                      className={`w-full max-w-[54px] rounded-t-md transition-all ${
                        beatCutoff ? 'bg-emerald-600' : 'bg-sky-700'
                      }`}
                      style={{ height: `${heightPct}%` }}
                      title={`${sim.titulo} — Bruto: ${sim.percentualBruto}% | Líquido: ${sim.percentualLiquido}%`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-5 gap-4 pt-2 px-2 text-center">
              {simulados.slice(-5).map((sim, idx) => (
                <div key={sim.id} className="space-y-0.5">
                  <span className="block text-xs font-medium text-slate-800 truncate">
                    #{idx + 1} · {sim.banca}
                  </span>
                  <span className="block text-[11px] font-mono text-slate-500 tabular-nums">
                    {sim.dataRealizacao.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Accuracy by Exam Board (Banca) & Confidence Matrix */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-semibold text-slate-900">
              Rendimento por Banca Examinadora
            </h2>
            <p className="text-xs text-slate-500">
              Adaptação ao estilo de cobrança de cada organizadora
            </p>
          </div>

          <div className="space-y-3.5">
            {bancaStats.map((b) => (
              <div key={b.banca} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">
                    {b.banca}
                    {b.banca === activeCarreira.bancaReferencia && (
                      <span className="ml-2 font-normal text-sky-800">
                        (Banca Principal da Carreira)
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-slate-800 tabular-nums">
                    {b.total > 0
                      ? `${b.accuracy}% (${b.correct}/${b.total})`
                      : 'Sem registros'}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      b.accuracy >= activeCarreira.notaCorteAlvo
                        ? 'bg-emerald-600'
                        : b.accuracy >= 60
                        ? 'bg-sky-600'
                        : 'bg-amber-600'
                    }`}
                    style={{ width: `${b.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h3 className="text-xs font-semibold text-slate-900">
              Matriz de Confiança na Resposta
            </h3>
            <div className="space-y-2">
              {confidenceStats.map((c) => (
                <div
                  key={c.id}
                  className="p-3 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">
                      {c.label}
                    </span>
                    <span className="text-[11px] text-slate-500">{c.desc}</span>
                  </div>
                  <div className="text-right font-mono tabular-nums shrink-0">
                    <span className="text-sm font-semibold text-slate-900 block">
                      {c.accuracy}% acerto
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {c.correct}C · {c.wrong}E
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edital Verticalizado Table (Granular Subject & Topic Diagnosis) */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Edital Verticalizado — Diagnóstico por Disciplina e Assunto
            </h2>
            <p className="text-xs text-slate-500">
              Mapeamento de precisão, peso ponderado na carreira (
              {activeCarreira.nome}) e identificação de pontos cegos
            </p>
          </div>
          <span className="text-xs text-slate-500">
            Clique em &ldquo;Treinar Disciplina&rdquo; para abrir questões
            comentadas do tema
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="py-3 px-4 font-semibold">
                  Disciplina & Assuntos Mapeados
                </th>
                <th className="py-3 px-4 font-semibold text-right">
                  Peso no Edital
                </th>
                <th className="py-3 px-4 font-semibold text-right">
                  Resolvidas
                </th>
                <th className="py-3 px-4 font-semibold text-right">
                  Taxa de Acerto
                </th>
                <th className="py-3 px-4 font-semibold text-right">
                  Gap p/ Corte ({activeCarreira.notaCorteAlvo}%)
                </th>
                <th className="py-3 px-4 font-semibold text-right">
                  Tempo Médio
                </th>
                <th className="py-3 px-4 font-semibold">Diagnóstico</th>
                <th className="py-3 px-4 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {disciplineStats.map((row) => {
                const statusLabel =
                  row.accuracy >= activeCarreira.notaCorteAlvo
                    ? '● Domínio Forte'
                    : row.accuracy >= 60
                    ? '▲ Em Evolução'
                    : '■ Ponto Cego Crítico';

                const statusColor =
                  row.accuracy >= activeCarreira.notaCorteAlvo
                    ? 'text-emerald-800 font-semibold'
                    : row.accuracy >= 60
                    ? 'text-amber-800 font-semibold'
                    : 'text-red-800 font-semibold';

                return (
                  <tr
                    key={row.disciplina}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block text-sm">
                        {row.disciplina}
                      </span>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[11px] text-slate-500">
                        {row.assuntosBreakdown.map((sub, idx) => (
                          <React.Fragment key={sub.assunto}>
                            {idx > 0 && <span aria-hidden="true">·</span>}
                            <span>
                              {sub.assunto}:{' '}
                              <strong className="font-mono text-slate-700 tabular-nums">
                                {sub.accuracy}%
                              </strong>
                            </span>
                          </React.Fragment>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-700 tabular-nums">
                      {row.peso.toFixed(1)}x
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-900 tabular-nums">
                      {row.correct}/{row.total}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      {row.accuracy}%
                    </td>
                    <td
                      className={`py-3.5 px-4 text-right font-mono font-semibold tabular-nums ${
                        row.gap >= 0 ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {row.gap >= 0 ? `+${row.gap}%` : `${row.gap}%`}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-700 tabular-nums">
                      {row.avgTime}s
                    </td>
                    <td className={`py-3.5 px-4 ${statusColor}`}>
                      {statusLabel}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onPracticeSubject(row.disciplina)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-sky-900 bg-sky-50 border border-sky-200 rounded-md hover:bg-sky-100 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <span>Treinar Disciplina</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
