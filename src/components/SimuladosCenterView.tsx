import React, { useState, useEffect, useMemo } from 'react';
import {
  Question,
  SimuladoBlueprint,
  SimuladoResultRecord,
  Disciplina,
  Banca,
  Dificuldade,
  NivelConfianca,
  UserQuestionNote,
  ForumThreadPost,
  ForumPostCategory,
  MotivoErro,
} from '../types/concursos';
import { QuestionCard } from './QuestionCard';
import {
  Clock,
  Play,
  BookOpen,
  CheckCircle2,
  XCircle,
  Flag,
  Sliders,
  Plus,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Award,
  AlertTriangle,
} from 'lucide-react';

interface SimuladosCenterViewProps {
  questions: Question[];
  blueprints: SimuladoBlueprint[];
  simuladoHistory: SimuladoResultRecord[];
  userNotes: Record<string, UserQuestionNote>;
  forumPosts: ForumThreadPost[];
  externalStartBlueprintId?: string | null;
  onClearExternalStart?: () => void;
  onCreateCustomBlueprint: (bp: SimuladoBlueprint) => void;
  onCompleteSimulado: (
    result: SimuladoResultRecord,
    sessionAttempts: {
      questionId: string;
      respostaUsuario: string | null;
      isCorreta: boolean;
      emBranco: boolean;
      confianca: NivelConfianca;
      tempoGastoSegundos: number;
    }[]
  ) => void;
  onSaveNote: (
    questionId: string,
    noteData: Partial<UserQuestionNote>
  ) => void;
  onLogErrorReason: (questionId: string, reason: MotivoErro) => void;
  onAddForumPost: (
    questionId: string,
    category: ForumPostCategory,
    content: string
  ) => void;
  onAddForumReply: (postId: string, content: string) => void;
  onToggleForumUpvote: (postId: string, replyId?: string) => void;
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

const ALL_DIFICULDADES: Dificuldade[] = ['Fácil', 'Média', 'Difícil'];

interface ActiveAnswerState {
  selectedOption: string | null;
  confidence: NivelConfianca;
  isBlank: boolean;
  flaggedForReview: boolean;
  confirmedInTreino: boolean;
  timeSpentSeconds: number;
}

export const SimuladosCenterView: React.FC<SimuladosCenterViewProps> = ({
  questions,
  blueprints,
  simuladoHistory,
  userNotes,
  forumPosts,
  externalStartBlueprintId,
  onClearExternalStart,
  onCreateCustomBlueprint,
  onCompleteSimulado,
  onSaveNote,
  onLogErrorReason,
  onAddForumPost,
  onAddForumReply,
  onToggleForumUpvote,
}) => {
  // Modes: 'catalog' | 'builder' | 'running' | 'report'
  const [viewState, setViewState] = useState<
    'catalog' | 'builder' | 'running' | 'report'
  >('catalog');

  // Custom Mock Exam Builder State
  const [customTitle, setCustomTitle] = useState<string>(
    'Simulado Personalizado — Foco Direcionado'
  );
  const [selectedDisciplinas, setSelectedDisciplinas] =
    useState<Disciplina[]>(ALL_DISCIPLINAS);
  const [selectedBancas, setSelectedBancas] = useState<Banca[]>(ALL_BANCAS);
  const [selectedDificuldades, setSelectedDificuldades] =
    useState<Dificuldade[]>(ALL_DIFICULDADES);
  const [scoringRule, setScoringRule] = useState<'bruta' | 'cebraspe_liquida'>(
    'bruta'
  );
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(25);
  const [maxQuestionCount, setMaxQuestionCount] = useState<number>(10);

  // Active Simulado Runner State
  const [activeBlueprint, setActiveBlueprint] =
    useState<SimuladoBlueprint | null>(null);
  const [executionMode, setExecutionMode] = useState<
    'prova_real' | 'treino_comentado'
  >('prova_real');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [answersMap, setAnswersMap] = useState<
    Record<string, ActiveAnswerState>
  >({});
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [completedReport, setCompletedReport] =
    useState<SimuladoResultRecord | null>(null);

  // Question lookup map
  const questionMap = useMemo(() => {
    const map: Record<string, Question> = {};
    questions.forEach((q) => {
      map[q.id] = q;
    });
    return map;
  }, [questions]);

  // Matching questions for Custom Builder
  const builderMatchingQuestions = useMemo(() => {
    return questions.filter(
      (q) =>
        selectedDisciplinas.includes(q.disciplina) &&
        selectedBancas.includes(q.banca) &&
        selectedDificuldades.includes(q.dificuldade)
    );
  }, [questions, selectedDisciplinas, selectedBancas, selectedDificuldades]);

  // Launch blueprint helper
  const startSimulado = (
    bp: SimuladoBlueprint,
    mode: 'prova_real' | 'treino_comentado'
  ) => {
    const initialMap: Record<string, ActiveAnswerState> = {};
    bp.questionIds.forEach((qId) => {
      initialMap[qId] = {
        selectedOption: null,
        confidence: 'certeza',
        isBlank: false,
        flaggedForReview: false,
        confirmedInTreino: false,
        timeSpentSeconds: 0,
      };
    });
    setActiveBlueprint(bp);
    setExecutionMode(mode);
    setAnswersMap(initialMap);
    setCurrentQuestionIdx(0);
    setElapsedSeconds(0);
    setIsPaused(false);
    setViewState('running');
  };

  // Handle external start trigger
  useEffect(() => {
    if (externalStartBlueprintId) {
      if (externalStartBlueprintId === 'OPEN_BUILDER') {
        setViewState('builder');
      } else {
        const found = blueprints.find((b) => b.id === externalStartBlueprintId);
        if (found) {
          startSimulado(found, 'prova_real');
        }
      }
      if (onClearExternalStart) onClearExternalStart();
    }
  }, [externalStartBlueprintId, blueprints]);

  // Live timer during running state
  useEffect(() => {
    if (viewState !== 'running' || isPaused || !activeBlueprint) return;
    const currentQId = activeBlueprint.questionIds[currentQuestionIdx];

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      if (currentQId) {
        setAnswersMap((prev) => {
          const curr = prev[currentQId];
          if (!curr) return prev;
          return {
            ...prev,
            [currentQId]: {
              ...curr,
              timeSpentSeconds: curr.timeSpentSeconds + 1,
            },
          };
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [viewState, isPaused, activeBlueprint, currentQuestionIdx]);

  const toggleItemInArray = <T,>(
    arr: T[],
    item: T,
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    if (arr.includes(item)) {
      if (arr.length > 1) {
        setter(arr.filter((x) => x !== item));
      }
    } else {
      setter([...arr, item]);
    }
  };

  const handleGenerateCustomSimulado = (
    launchMode: 'prova_real' | 'treino_comentado'
  ) => {
    const chosenIds = builderMatchingQuestions
      .slice(0, maxQuestionCount)
      .map((q) => q.id);
    if (chosenIds.length === 0) return;

    const newBp: SimuladoBlueprint = {
      id: `sim-custom-${Date.now()}`,
      titulo:
        customTitle.trim() || 'Simulado Personalizado — Bateria Sob Medida',
      subtitulo: `Disciplinas: ${selectedDisciplinas.join(', ')} · Bancas: ${selectedBancas.join(', ')} · Dificuldades: ${selectedDificuldades.join(', ')}`,
      bancaPrincipal:
        selectedBancas.length === 1 ? selectedBancas[0] : 'MISTA',
      carreiraAlvo: 'Personalizado pelo Candidato',
      modalidade: 'mista',
      regraPontuacao: scoringRule,
      tempoLimiteMinutos: timeLimitMinutes,
      notaCorteReferencia: 78,
      questionIds: chosenIds,
      isCustom: true,
      filtrosUsados: {
        disciplinas: selectedDisciplinas,
        bancas: selectedBancas,
        dificuldades: selectedDificuldades,
      },
    };

    onCreateCustomBlueprint(newBp);
    startSimulado(newBp, launchMode);
  };

  const handleFinishSimulado = () => {
    if (!activeBlueprint) return;

    const totalQuestoes = activeBlueprint.questionIds.length;
    let acertos = 0;
    let erros = 0;
    let emBranco = 0;

    const discTracker: Record<
      string,
      {
        disciplina: Disciplina;
        total: number;
        acertos: number;
        erros: number;
        emBranco: number;
      }
    > = {};

    const sessionAttempts: {
      questionId: string;
      respostaUsuario: string | null;
      isCorreta: boolean;
      emBranco: boolean;
      confianca: NivelConfianca;
      tempoGastoSegundos: number;
    }[] = [];

    activeBlueprint.questionIds.forEach((qId) => {
      const q = questionMap[qId];
      const st = answersMap[qId];
      if (!q || !st) return;

      if (!discTracker[q.disciplina]) {
        discTracker[q.disciplina] = {
          disciplina: q.disciplina,
          total: 0,
          acertos: 0,
          erros: 0,
          emBranco: 0,
        };
      }
      discTracker[q.disciplina].total += 1;

      const isBlankAnswer = st.isBlank || st.selectedOption === null;
      const isCorrectAnswer =
        !isBlankAnswer && st.selectedOption === q.gabarito;

      if (isBlankAnswer) {
        emBranco += 1;
        discTracker[q.disciplina].emBranco += 1;
      } else if (isCorrectAnswer) {
        acertos += 1;
        discTracker[q.disciplina].acertos += 1;
      } else {
        erros += 1;
        discTracker[q.disciplina].erros += 1;
      }

      sessionAttempts.push({
        questionId: qId,
        respostaUsuario: isBlankAnswer ? null : st.selectedOption,
        isCorreta: isCorrectAnswer,
        emBranco: isBlankAnswer,
        confianca: st.confidence,
        tempoGastoSegundos: Math.max(12, st.timeSpentSeconds),
      });
    });

    const percentualBruto =
      totalQuestoes > 0 ? Math.round((acertos / totalQuestoes) * 100) : 0;

    const netPoints =
      activeBlueprint.regraPontuacao === 'cebraspe_liquida'
        ? Math.max(0, acertos - erros)
        : acertos;
    const percentualLiquido =
      totalQuestoes > 0 ? Math.round((netPoints / totalQuestoes) * 100) : 0;

    const resultRecord: SimuladoResultRecord = {
      id: `sim-res-${Date.now()}`,
      blueprintId: activeBlueprint.id,
      titulo: activeBlueprint.titulo,
      banca: activeBlueprint.bancaPrincipal,
      dataRealizacao: new Date().toISOString().slice(0, 10),
      modo: executionMode,
      regraPontuacao: activeBlueprint.regraPontuacao,
      totalQuestoes,
      acertos,
      erros,
      emBranco,
      percentualBruto,
      percentualLiquido,
      tempoTotalSegundos: Math.max(30, elapsedSeconds),
      notaCorteReferencia: activeBlueprint.notaCorteReferencia,
      desempenhoPorDisciplina: Object.values(discTracker),
      questionIds: activeBlueprint.questionIds,
    };

    setCompletedReport(resultRecord);
    onCompleteSimulado(resultRecord, sessionAttempts);
    setViewState('report');
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  // RENDER 1: ACTIVE SIMULADO RUNNER
  if (viewState === 'running' && activeBlueprint) {
    const currentQId = activeBlueprint.questionIds[currentQuestionIdx];
    const currentQuestion = questionMap[currentQId];
    const currentAnswerState = answersMap[currentQId] || {
      selectedOption: null,
      confidence: 'certeza',
      isBlank: false,
      flaggedForReview: false,
      confirmedInTreino: false,
      timeSpentSeconds: 0,
    };

    const answeredCount = Object.values(answersMap).filter(
      (a) => a.selectedOption !== null || a.isBlank
    ).length;

    const limitSecs = activeBlueprint.tempoLimiteMinutos * 60;
    const remainingSecs = Math.max(0, limitSecs - elapsedSeconds);

    return (
      <div className="space-y-6">
        {/* Top Exam Control Bar */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => setViewState('catalog')}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sair do Simulado</span>
              </button>
              <span aria-hidden="true">·</span>
              <span>
                {executionMode === 'prova_real'
                  ? 'Modo Prova Real (Gabarito ao finalizar)'
                  : 'Modo Treino Comentado (Gabarito imediato)'}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Regra:{' '}
                {activeBlueprint.regraPontuacao === 'cebraspe_liquida'
                  ? 'CEBRASPE Líquida (1 errada anula 1 certa)'
                  : 'Pontuação Bruta'}
              </span>
            </div>
            <h1 className="text-base font-semibold text-slate-900">
              {activeBlueprint.titulo}
            </h1>
          </div>

          {/* Live Telemetry & Submit Action */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 text-white rounded-lg font-mono text-sm tabular-nums">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>{formatTimer(remainingSecs)}</span>
              <span className="text-xs text-slate-400">restantes</span>
            </div>

            <button
              type="button"
              onClick={handleFinishSimulado}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              Finalizar e Corrigir ({answeredCount}/
              {activeBlueprint.questionIds.length})
            </button>
          </div>
        </div>

        {/* Split Layout: Question Stage (Left 9 cols) + Answer Sheet Navigation (Right 3 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-9 space-y-4">
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                indexNumber={currentQuestionIdx + 1}
                totalQuestions={activeBlueprint.questionIds.length}
                mode={executionMode}
                selectedOption={currentAnswerState.selectedOption}
                confidence={currentAnswerState.confidence}
                isBlank={currentAnswerState.isBlank}
                isSubmitted={
                  executionMode === 'treino_comentado' &&
                  currentAnswerState.confirmedInTreino
                }
                timeSpentSeconds={currentAnswerState.timeSpentSeconds}
                userNote={userNotes[currentQuestion.id]}
                forumPosts={forumPosts}
                onSelectOption={(letra, conf, blank) => {
                  setAnswersMap((prev) => ({
                    ...prev,
                    [currentQuestion.id]: {
                      ...prev[currentQuestion.id],
                      selectedOption: letra,
                      confidence: conf,
                      isBlank: Boolean(blank),
                    },
                  }));
                }}
                onConfirmAnswer={(letra, conf, blank) => {
                  setAnswersMap((prev) => ({
                    ...prev,
                    [currentQuestion.id]: {
                      ...prev[currentQuestion.id],
                      selectedOption: letra,
                      confidence: conf,
                      isBlank: Boolean(blank),
                      confirmedInTreino: true,
                    },
                  }));
                }}
                onSaveNote={onSaveNote}
                onLogErrorReason={onLogErrorReason}
                onAddForumPost={onAddForumPost}
                onAddForumReply={onAddForumReply}
                onToggleForumUpvote={onToggleForumUpvote}
              />
            )}

            {/* Question Prev / Review Flag / Next Bar */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={currentQuestionIdx === 0}
                onClick={() =>
                  setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-40 cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Questão Anterior</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAnswersMap((prev) => ({
                    ...prev,
                    [currentQId]: {
                      ...prev[currentQId],
                      flaggedForReview: !prev[currentQId]?.flaggedForReview,
                    },
                  }));
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                  currentAnswerState.flaggedForReview
                    ? 'bg-amber-50 border-amber-400 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>
                  {currentAnswerState.flaggedForReview
                    ? 'Marcada para Revisão'
                    : 'Marcar para Revisar Antes de Entregar'}
                </span>
              </button>

              {currentQuestionIdx < activeBlueprint.questionIds.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentQuestionIdx((prev) =>
                      Math.min(
                        activeBlueprint.questionIds.length - 1,
                        prev + 1
                      )
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer whitespace-nowrap"
                >
                  <span>Próxima Questão</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishSimulado}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 cursor-pointer whitespace-nowrap"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Concluir e Gerar Diagnóstico</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Folha de Respostas Interativa */}
          <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-lg p-5 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Folha de Respostas
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
                {answeredCount} de {activeBlueprint.questionIds.length}{' '}
                preenchidas
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {activeBlueprint.questionIds.map((qId, idx) => {
                const st = answersMap[qId];
                const isCurrent = idx === currentQuestionIdx;
                const hasSelection = st?.selectedOption !== null;
                const isBlankSel = st?.isBlank;

                let btnClass =
                  'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100';
                if (isCurrent) {
                  btnClass =
                    'border-sky-600 bg-sky-50 text-sky-950 ring-1 ring-sky-600 font-semibold';
                } else if (st?.flaggedForReview) {
                  btnClass = 'border-amber-400 bg-amber-50 text-amber-900';
                } else if (hasSelection) {
                  btnClass = 'border-slate-800 bg-slate-900 text-white';
                } else if (isBlankSel) {
                  btnClass = 'border-slate-300 bg-slate-200 text-slate-700';
                }

                return (
                  <button
                    key={qId}
                    type="button"
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`h-10 rounded-md border text-xs font-mono tabular-nums flex flex-col items-center justify-center transition-colors cursor-pointer ${btnClass}`}
                  >
                    <span>{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-[10px] leading-none opacity-80">
                      {st?.selectedOption || (st?.isBlank ? '—' : '·')}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Respondidas:</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {
                    Object.values(answersMap).filter(
                      (a) => a.selectedOption !== null
                    ).length
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Em branco:</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {
                    Object.values(answersMap).filter(
                      (a) => a.selectedOption === null
                    ).length
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Marcadas para revisão:</span>
                <span className="font-mono font-semibold text-amber-800 tabular-nums">
                  {
                    Object.values(answersMap).filter((a) => a.flaggedForReview)
                      .length
                  }
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // RENDER 2: POST-EXAM ANALYTICAL REPORT
  if (viewState === 'report' && completedReport && activeBlueprint) {
    const avgTimePerQ = Math.round(
      completedReport.tempoTotalSegundos / completedReport.totalQuestoes
    );
    const passedCut =
      completedReport.percentualLiquido >=
      completedReport.notaCorteReferencia;

    return (
      <div className="space-y-8">
        <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-sky-800">
                Relatório Oficial Pós-Simulado · Diagnóstico Concluído
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">
                {completedReport.titulo}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span>Banca: {completedReport.banca}</span>
                <span aria-hidden="true">·</span>
                <span>
                  Regra:{' '}
                  {completedReport.regraPontuacao === 'cebraspe_liquida'
                    ? 'CEBRASPE Líquida (1 errada anula 1 certa)'
                    : 'Pontuação Bruta'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  Data: {completedReport.dataRealizacao}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => startSimulado(activeBlueprint, 'treino_comentado')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refazer Simulado</span>
              </button>
              <button
                type="button"
                onClick={() => setViewState('catalog')}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer whitespace-nowrap"
              >
                Voltar aos Simulados
              </button>
            </div>
          </div>

          {/* Score Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block">
                Aproveitamento Bruto
              </span>
              <span className="font-mono text-2xl font-semibold text-slate-900 tabular-nums mt-1 block">
                {completedReport.percentualBruto}%
              </span>
              <span className="text-xs text-slate-600 tabular-nums">
                {completedReport.acertos}/{completedReport.totalQuestoes} acertos
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block">
                Nota Líquida Final
              </span>
              <span
                className={`font-mono text-2xl font-semibold tabular-nums mt-1 block ${
                  passedCut ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {completedReport.percentualLiquido}%
              </span>
              <span className="text-xs text-slate-600 tabular-nums">
                Corte de referência: {completedReport.notaCorteReferencia}%
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block">
                Acertos / Erros / Branco
              </span>
              <span className="font-mono text-xl font-semibold text-slate-900 tabular-nums mt-1 block">
                {completedReport.acertos}C · {completedReport.erros}E ·{' '}
                {completedReport.emBranco}B
              </span>
              <span className="text-xs text-slate-600">
                Balanço de marcações
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block">
                Ritmo por Questão
              </span>
              <span className="font-mono text-2xl font-semibold text-slate-900 tabular-nums mt-1 block">
                {avgTimePerQ}s
              </span>
              <span className="text-xs text-slate-600 tabular-nums">
                Tempo total: {formatTimer(completedReport.tempoTotalSegundos)}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 block">
                Status vs. Nota de Corte
              </span>
              <span
                className={`text-sm font-semibold mt-1.5 block ${
                  passedCut ? 'text-emerald-800' : 'text-amber-800'
                }`}
              >
                {passedCut
                  ? '● Acima da Nota de Corte'
                  : '▲ Abaixo do Corte — Revisar Erros'}
              </span>
              <span className="text-xs text-slate-600 block mt-1">
                +80 XP creditados nas Metas
              </span>
            </div>
          </div>

          {/* Breakdown by Discipline in this Simulado */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Desempenho por Disciplina neste Simulado
            </h2>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="py-2.5 px-4 font-semibold">Disciplina</th>
                    <th className="py-2.5 px-4 font-semibold text-right">
                      Questões
                    </th>
                    <th className="py-2.5 px-4 font-semibold text-right">
                      Acertos
                    </th>
                    <th className="py-2.5 px-4 font-semibold text-right">
                      Erros
                    </th>
                    <th className="py-2.5 px-4 font-semibold text-right">
                      Aproveitamento
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {completedReport.desempenhoPorDisciplina.map((d) => {
                    const pct =
                      d.total > 0 ? Math.round((d.acertos / d.total) * 100) : 0;
                    return (
                      <tr key={d.disciplina} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-medium text-slate-900">
                          {d.disciplina}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                          {d.total}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-emerald-700 font-semibold tabular-nums">
                          {d.acertos}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-red-700 tabular-nums">
                          {d.erros}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-semibold tabular-nums">
                          {pct >= 75
                            ? `● ${pct}% (Forte)`
                            : pct >= 50
                            ? `▲ ${pct}% (Atenção)`
                            : `■ ${pct}% (Crítico)`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Full Commented Review of All Questions in the Simulado */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Correção Comentada Alternativa por Alternativa ({completedReport.totalQuestoes}{' '}
            Questões)
          </h2>
          {activeBlueprint.questionIds.map((qId, idx) => {
            const q = questionMap[qId];
            const st = answersMap[qId];
            if (!q || !st) return null;
            return (
              <QuestionCard
                key={qId}
                question={q}
                indexNumber={idx + 1}
                totalQuestions={activeBlueprint.questionIds.length}
                mode="revisao_pos_prova"
                selectedOption={st.selectedOption}
                confidence={st.confidence}
                isBlank={st.isBlank || st.selectedOption === null}
                isSubmitted={true}
                timeSpentSeconds={st.timeSpentSeconds}
                userNote={userNotes[q.id]}
                forumPosts={forumPosts}
                onSelectOption={() => {}}
                onSaveNote={onSaveNote}
                onLogErrorReason={onLogErrorReason}
                onAddForumPost={onAddForumPost}
                onAddForumReply={onAddForumReply}
                onToggleForumUpvote={onToggleForumUpvote}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // RENDER 3: CATALOG & CUSTOM SIMULADO BUILDER
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-sky-800">
            Treinamento Cronometrado · Baterias Oficiais & Gerador Sob Medida
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
            Central de Simulados & Gerador Personalizado
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Execute simulados oficiais calibrados por carreira ou monte sua
            própria bateria selecionando disciplinas, bancas examinadoras e
            níveis de dificuldade.
          </p>
        </div>

        <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setViewState('catalog')}
            className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              viewState === 'catalog'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cadernos de Simulados ({blueprints.length})
          </button>
          <button
            type="button"
            onClick={() => setViewState('builder')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              viewState === 'builder'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Criar Simulado Personalizado</span>
          </button>
        </div>
      </div>

      {/* Custom Mock Exam Builder */}
      {viewState === 'builder' && (
        <section className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Gerador de Simulado Personalizado (Sob Medida)
              </h2>
              <p className="text-xs text-slate-500">
                Selecione as disciplinas, bancas examinadoras, níveis de
                dificuldade e regra de correção para montar sua prova
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-sky-900 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-md tabular-nums">
              {builderMatchingQuestions.length} questões compatíveis encontradas
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {/* Custom Title */}
              <div className="space-y-1.5">
                <label
                  htmlFor="custom-sim-title"
                  className="block text-xs font-semibold text-slate-800"
                >
                  Título do seu Simulado Personalizado:
                </label>
                <input
                  id="custom-sim-title"
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none"
                />
              </div>

              {/* 1. Select Subjects (Disciplinas) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">
                    1. Selecionar Disciplinas ({selectedDisciplinas.length}/
                    {ALL_DISCIPLINAS.length}):
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedDisciplinas(ALL_DISCIPLINAS)}
                    className="text-xs font-medium text-sky-800 hover:underline cursor-pointer"
                  >
                    Marcar todas
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ALL_DISCIPLINAS.map((disc) => {
                    const active = selectedDisciplinas.includes(disc);
                    return (
                      <button
                        key={disc}
                        type="button"
                        onClick={() =>
                          toggleItemInArray(
                            selectedDisciplinas,
                            disc,
                            setSelectedDisciplinas
                          )
                        }
                        className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {active ? `✓ ${disc}` : disc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Select Exam Boards (Bancas) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">
                    2. Selecionar Bancas Examinadoras ({selectedBancas.length}/
                    {ALL_BANCAS.length}):
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedBancas(ALL_BANCAS)}
                    className="text-xs font-medium text-sky-800 hover:underline cursor-pointer"
                  >
                    Marcar todas
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ALL_BANCAS.map((banca) => {
                    const active = selectedBancas.includes(banca);
                    return (
                      <button
                        key={banca}
                        type="button"
                        onClick={() =>
                          toggleItemInArray(
                            selectedBancas,
                            banca,
                            setSelectedBancas
                          )
                        }
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-sky-700 text-white border-sky-700'
                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {active ? `✓ ${banca}` : banca}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Select Difficulty Levels (Dificuldades) */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-800 block">
                  3. Níveis de Dificuldade:
                </span>
                <div className="flex flex-wrap gap-2">
                  {ALL_DIFICULDADES.map((dif) => {
                    const active = selectedDificuldades.includes(dif);
                    return (
                      <button
                        key={dif}
                        type="button"
                        onClick={() =>
                          toggleItemInArray(
                            selectedDificuldades,
                            dif,
                            setSelectedDificuldades
                          )
                        }
                        className={`px-4 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {active ? `✓ ${dif}` : dif}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Calibration & Launch */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  Parâmetros da Prova
                </h3>

                {/* Question Count Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label
                      htmlFor="sim-q-count"
                      className="font-medium text-slate-700"
                    >
                      Limite de Questões:
                    </label>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {Math.min(
                        maxQuestionCount,
                        builderMatchingQuestions.length
                      )}{' '}
                      questões
                    </span>
                  </div>
                  <input
                    id="sim-q-count"
                    type="range"
                    min={2}
                    max={14}
                    step={1}
                    value={maxQuestionCount}
                    onChange={(e) =>
                      setMaxQuestionCount(Number(e.target.value))
                    }
                    className="w-full accent-sky-700 cursor-pointer"
                  />
                </div>

                {/* Time Limit Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <label
                      htmlFor="sim-time-limit"
                      className="font-medium text-slate-700"
                    >
                      Tempo de Prova:
                    </label>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {timeLimitMinutes} minutos
                    </span>
                  </div>
                  <input
                    id="sim-time-limit"
                    type="range"
                    min={10}
                    max={60}
                    step={5}
                    value={timeLimitMinutes}
                    onChange={(e) =>
                      setTimeLimitMinutes(Number(e.target.value))
                    }
                    className="w-full accent-sky-700 cursor-pointer"
                  />
                </div>

                {/* Scoring System */}
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-slate-700 block">
                    Critério de Correção:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => setScoringRule('bruta')}
                      className={`p-2.5 text-left text-xs rounded-md border transition-colors cursor-pointer ${
                        scoringRule === 'bruta'
                          ? 'bg-white border-sky-600 text-slate-900 font-semibold ring-1 ring-sky-600'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      Pontuação Bruta (Sem penalidade por erro)
                    </button>
                    <button
                      type="button"
                      onClick={() => setScoringRule('cebraspe_liquida')}
                      className={`p-2.5 text-left text-xs rounded-md border transition-colors cursor-pointer ${
                        scoringRule === 'cebraspe_liquida'
                          ? 'bg-white border-sky-600 text-slate-900 font-semibold ring-1 ring-sky-600'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      Padrão CEBRASPE Líquido (1 errada anula 1 certa)
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  disabled={builderMatchingQuestions.length === 0}
                  onClick={() => handleGenerateCustomSimulado('prova_real')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Gerar e Iniciar em Modo Prova Real</span>
                </button>
                <button
                  type="button"
                  disabled={builderMatchingQuestions.length === 0}
                  onClick={() =>
                    handleGenerateCustomSimulado('treino_comentado')
                  }
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-sky-900 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 disabled:opacity-40 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Iniciar em Modo Treino Comentado</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blueprints Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blueprints.map((bp) => (
          <article
            key={bp.id}
            className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between gap-5"
          >
            <div className="space-y-2.5">
              {/* Unboxed metadata line */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-900">
                  Banca: {bp.bancaPrincipal}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {bp.questionIds.length} questões
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {bp.tempoLimiteMinutos} min
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Corte Alvo:{' '}
                  <strong className="font-mono text-slate-800 tabular-nums">
                    {bp.notaCorteReferencia}%
                  </strong>
                </span>
                {bp.isCustom && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-sky-800">
                      ★ Criado por Você
                    </span>
                  </>
                )}
              </div>

              <h2 className="text-lg font-semibold text-slate-900">
                {bp.titulo}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {bp.subtitulo}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                {bp.regraPontuacao === 'cebraspe_liquida'
                  ? '● Penalidade Ativa (1E anula 1C)'
                  : '○ Pontuação Bruta Padrão'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startSimulado(bp, 'treino_comentado')}
                  className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Treino Comentado
                </button>
                <button
                  type="button"
                  onClick={() => startSimulado(bp, 'prova_real')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Prova Real</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
