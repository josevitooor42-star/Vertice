import React, { useState, useEffect, useMemo } from 'react';
import {
  QuestionAttempt,
  UserQuestionNote,
  SimuladoBlueprint,
  SimuladoResultRecord,
  ForumThreadPost,
  ForumPostCategory,
  StudyGoals,
  Disciplina,
  NivelConfianca,
  MotivoErro,
} from './types/concursos';
import {
  QUESTIONS_BANK,
  CARREIRAS_META,
  SIMULADO_BLUEPRINTS,
  INITIAL_ATTEMPTS,
  INITIAL_NOTES,
  INITIAL_SIMULADO_HISTORY,
} from './data/questionsData';
import {
  INITIAL_STUDY_GOALS,
  INITIAL_FORUM_POSTS,
  computeAchievements,
} from './data/forumAndGoalsData';
import { SimuladosCenterView } from './components/SimuladosCenterView';
import { QuestionsBankView } from './components/QuestionsBankView';
import { CommunityForumView } from './components/CommunityForumView';
import { CadernoDeErrosView } from './components/CadernoDeErrosView';
import { GoalsAndRewardsView } from './components/GoalsAndRewardsView';
import { PerformanceAnalyticsView } from './components/PerformanceAnalyticsView';
import {
  Play,
  ArrowUpRight,
  Flame,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Sliders,
  BookOpen,
  Award,
} from 'lucide-react';

type ActiveSection =
  | 'painel'
  | 'simulados'
  | 'questoes'
  | 'comunidade'
  | 'caderno'
  | 'metas'
  | 'desempenho';

const STORAGE_KEYS = {
  ATTEMPTS: 'vertice_attempts_v1',
  NOTES: 'vertice_notes_v1',
  BLUEPRINTS: 'vertice_blueprints_v1',
  SIMULADOS: 'vertice_simulados_v1',
  FORUM: 'vertice_forum_v1',
  GOALS: 'vertice_goals_v1',
  CARREIRA: 'vertice_carreira_v1',
};

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('painel');

  // Persistent States with Initial Seed Fallback
  const [attempts, setAttempts] = useState<QuestionAttempt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return saved ? JSON.parse(saved) : INITIAL_ATTEMPTS;
    } catch {
      return INITIAL_ATTEMPTS;
    }
  });

  const [userNotes, setUserNotes] = useState<Record<string, UserQuestionNote>>(
    () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
        return saved ? JSON.parse(saved) : INITIAL_NOTES;
      } catch {
        return INITIAL_NOTES;
      }
    }
  );

  const [blueprints, setBlueprints] = useState<SimuladoBlueprint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLUEPRINTS);
      return saved ? JSON.parse(saved) : SIMULADO_BLUEPRINTS;
    } catch {
      return SIMULADO_BLUEPRINTS;
    }
  });

  const [simuladoHistory, setSimuladoHistory] = useState<
    SimuladoResultRecord[]
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIMULADOS);
      return saved ? JSON.parse(saved) : INITIAL_SIMULADO_HISTORY;
    } catch {
      return INITIAL_SIMULADO_HISTORY;
    }
  });

  const [forumPosts, setForumPosts] = useState<ForumThreadPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FORUM);
      return saved ? JSON.parse(saved) : INITIAL_FORUM_POSTS;
    } catch {
      return INITIAL_FORUM_POSTS;
    }
  });

  const [studyGoals, setStudyGoals] = useState<StudyGoals>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      return saved ? JSON.parse(saved) : INITIAL_STUDY_GOALS;
    } catch {
      return INITIAL_STUDY_GOALS;
    }
  });

  const [selectedCarreiraId, setSelectedCarreiraId] = useState<string>(() => {
    try {
      return (
        localStorage.getItem(STORAGE_KEYS.CARREIRA) || 'auditor-fiscal-rfb'
      );
    } catch {
      return 'auditor-fiscal-rfb';
    }
  });

  // Cross-view contextual navigation states
  const [externalBlueprintId, setExternalBlueprintId] = useState<string | null>(
    null
  );
  const [initialDisciplinaFilter, setInitialDisciplinaFilter] = useState<
    Disciplina | 'Todas'
  >('Todas');
  const [focusedQuestionId, setFocusedQuestionId] = useState<string | null>(
    null
  );

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
    } catch {}
  }, [attempts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(userNotes));
    } catch {}
  }, [userNotes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLUEPRINTS, JSON.stringify(blueprints));
    } catch {}
  }, [blueprints]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.SIMULADOS,
        JSON.stringify(simuladoHistory)
      );
    } catch {}
  }, [simuladoHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FORUM, JSON.stringify(forumPosts));
    } catch {}
  }, [forumPosts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(studyGoals));
    } catch {}
  }, [studyGoals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CARREIRA, selectedCarreiraId);
    } catch {}
  }, [selectedCarreiraId]);

  const activeCarreira = useMemo(
    () =>
      CARREIRAS_META.find((c) => c.id === selectedCarreiraId) ||
      CARREIRAS_META[0],
    [selectedCarreiraId]
  );

  // Compute daily & weekly progress metrics
  const sessionAddedQuestions = Math.max(
    0,
    attempts.length - INITIAL_ATTEMPTS.length
  );
  const questionsAnsweredToday = 7 + sessionAddedQuestions;
  const questionsAnsweredThisWeek = 34 + sessionAddedQuestions;
  const simuladosCompletedThisWeek =
    2 + Math.max(0, simuladoHistory.length - INITIAL_SIMULADO_HISTORY.length);

  const achievements = useMemo(
    () =>
      computeAchievements(
        attempts,
        simuladoHistory,
        forumPosts,
        studyGoals,
        questionsAnsweredToday,
        questionsAnsweredThisWeek
      ),
    [
      attempts,
      simuladoHistory,
      forumPosts,
      studyGoals,
      questionsAnsweredToday,
      questionsAnsweredThisWeek,
    ]
  );

  const unlockedBadgesCount = achievements.filter((b) => b.unlocked).length;

  // Handlers
  const handleRecordPracticeAttempt = (
    questionId: string,
    letra: string | null,
    confidence: NivelConfianca,
    isBlank: boolean
  ) => {
    const q = QUESTIONS_BANK.find((item) => item.id === questionId);
    if (!q) return;
    const isCorreta = !isBlank && letra !== null && letra === q.gabarito;

    const newAtt: QuestionAttempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      questionId,
      respostaUsuario: isBlank ? null : letra,
      isCorreta,
      emBranco: isBlank,
      confianca: confidence,
      tempoGastoSegundos: 85,
      timestamp: new Date().toISOString(),
    };

    setAttempts((prev) => [...prev, newAtt]);
  };

  const handleSaveNote = (
    questionId: string,
    noteData: Partial<UserQuestionNote>
  ) => {
    setUserNotes((prev) => {
      const existing = prev[questionId] || {
        questionId,
        cadernos: [],
        anotacaoPessoal: '',
        nivelDominio: 'em_revisao',
        ultimaAtualizacao: new Date().toISOString().slice(0, 10),
      };
      return {
        ...prev,
        [questionId]: {
          ...existing,
          ...noteData,
          ultimaAtualizacao: new Date().toISOString().slice(0, 10),
        },
      };
    });
  };

  const handleLogErrorReason = (questionId: string, reason: MotivoErro) => {
    setAttempts((prev) =>
      prev.map((att) =>
        att.questionId === questionId ? { ...att, motivoErro: reason } : att
      )
    );
  };

  const handleCreateCustomBlueprint = (bp: SimuladoBlueprint) => {
    setBlueprints((prev) => [bp, ...prev]);
  };

  const handleCompleteSimulado = (
    result: SimuladoResultRecord,
    sessionAttempts: {
      questionId: string;
      respostaUsuario: string | null;
      isCorreta: boolean;
      emBranco: boolean;
      confianca: NivelConfianca;
      tempoGastoSegundos: number;
    }[]
  ) => {
    setSimuladoHistory((prev) => [...prev, result]);
    const nowIso = new Date().toISOString();
    const mappedAttempts: QuestionAttempt[] = sessionAttempts.map(
      (sa, idx) => ({
        id: `att-sim-${Date.now()}-${idx}`,
        questionId: sa.questionId,
        simuladoId: result.id,
        respostaUsuario: sa.respostaUsuario,
        isCorreta: sa.isCorreta,
        emBranco: sa.emBranco,
        confianca: sa.confianca,
        tempoGastoSegundos: sa.tempoGastoSegundos,
        timestamp: nowIso,
      })
    );
    setAttempts((prev) => [...prev, ...mappedAttempts]);
  };

  const handleAddForumPost = (
    questionId: string,
    category: ForumPostCategory,
    content: string
  ) => {
    const newPost: ForumThreadPost = {
      id: `fp-user-${Date.now()}`,
      questionId,
      authorName: 'Você (Candidato Vértice)',
      authorTargetCareer: activeCarreira.nome.split('(')[0].trim(),
      createdAt: 'agora mesmo',
      category,
      content,
      upvotes: 1,
      isUpvotedByUser: true,
      replies: [],
    };
    setForumPosts((prev) => [newPost, ...prev]);
    setStudyGoals((prev) => ({ ...prev, bonusXp: prev.bonusXp + 25 }));
  };

  const handleAddForumReply = (postId: string, content: string) => {
    setForumPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          replies: [
            ...post.replies,
            {
              id: `fpr-user-${Date.now()}`,
              authorName: 'Você (Candidato Vértice)',
              authorTargetCareer: activeCarreira.nome.split('(')[0].trim(),
              createdAt: 'agora mesmo',
              content,
              upvotes: 1,
              isUpvotedByUser: true,
            },
          ],
        };
      })
    );
    setStudyGoals((prev) => ({ ...prev, bonusXp: prev.bonusXp + 15 }));
  };

  const handleToggleForumUpvote = (postId: string, replyId?: string) => {
    setForumPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        if (!replyId) {
          const already = Boolean(post.isUpvotedByUser);
          return {
            ...post,
            upvotes: already ? post.upvotes - 1 : post.upvotes + 1,
            isUpvotedByUser: !already,
          };
        }
        return {
          ...post,
          replies: post.replies.map((rep) => {
            if (rep.id !== replyId) return rep;
            const alreadyRep = Boolean(rep.isUpvotedByUser);
            return {
              ...rep,
              upvotes: alreadyRep ? rep.upvotes - 1 : rep.upvotes + 1,
              isUpvotedByUser: !alreadyRep,
            };
          }),
        };
      })
    );
  };

  // Dashboard Summary Metrics
  const globalAccuracy = useMemo(() => {
    if (attempts.length === 0) return 0;
    const correct = attempts.filter((a) => a.isCorreta).length;
    return Math.round((correct / attempts.length) * 100);
  }, [attempts]);

  const dailyPct = Math.min(
    100,
    Math.round((questionsAnsweredToday / studyGoals.dailyQuestionsTarget) * 100)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-6 py-3.5">
        <div className="max-w-[1380px] mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Single text element Brand Wordmark */}
          <a
            href="#painel"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('painel');
            }}
            className="font-editorial text-xl font-semibold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Vértice Concursos
          </a>

          {/* Zone 2: Clean text navigation links with subtle active/hover underlines */}
          <nav
            aria-label="Navegação principal"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            {(
              [
                { id: 'painel', label: 'Painel' },
                { id: 'simulados', label: 'Simulados' },
                { id: 'questoes', label: 'Questões' },
                { id: 'comunidade', label: 'Fórum' },
                { id: 'caderno', label: 'Caderno de Erros' },
                { id: 'metas', label: 'Metas & Conquistas' },
                { id: 'desempenho', label: 'Desempenho' },
              ] as { id: ActiveSection; label: string }[]
            ).map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                    isActive
                      ? 'text-slate-900 font-semibold border-sky-700'
                      : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 Primary Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setExternalBlueprintId('OPEN_BUILDER');
                setActiveSection('simulados');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              + Simulado Personalizado
            </button>
          </div>
        </div>

        {/* Mobile Compact Nav Strip */}
        <div className="flex md:hidden items-center gap-4 overflow-x-auto pt-3 mt-3 border-t border-slate-100 text-xs font-medium">
          {(
            [
              { id: 'painel', label: 'Painel' },
              { id: 'simulados', label: 'Simulados' },
              { id: 'questoes', label: 'Questões' },
              { id: 'comunidade', label: 'Fórum' },
              { id: 'caderno', label: 'Erros' },
              { id: 'metas', label: 'Metas' },
              { id: 'desempenho', label: 'Desempenho' },
            ] as { id: ActiveSection; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeSection === item.id
                  ? 'text-slate-900 font-semibold border-sky-700'
                  : 'text-slate-500 border-transparent'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Container (1440px desktop baseline -> max-w-[1380px]) */}
      <main className="flex-1 w-full max-w-[1380px] mx-auto px-6 py-8">
        {activeSection === 'painel' && (
          <div className="space-y-10">
            {/* Hero / Executive Study Command Bar */}
            <section className="bg-white border border-slate-200 rounded-lg p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="font-semibold text-sky-800">
                      Foco Ativo: {activeCarreira.nome}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      Nota de Corte Alvo: {activeCarreira.notaCorteAlvo}%
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      Ofensiva: {studyGoals.streakDays} dias seguidos
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-4xl font-semibold text-slate-900 tracking-tight leading-[1.18]">
                    Preparação cirúrgica com questões comentadas alternativa por
                    alternativa.
                  </h1>

                  <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                    Analise o fundamento legal de cada item, monte simulados sob
                    medida por banca e dificuldade, debata no fórum de cada
                    questão e acompanhe sua distância real para a nota de corte.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveSection('questoes')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Resolver Questões Comentadas</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExternalBlueprintId('OPEN_BUILDER');
                        setActiveSection('simulados');
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Sliders className="w-4 h-4" />
                      <span>Montar Simulado Personalizado</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection('comunidade')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Fórum de Dúvidas ({forumPosts.length})</span>
                    </button>
                  </div>
                </div>

                {/* Right 5 Cols: Daily Goal & Performance Snapshot */}
                <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">
                        Meta Diária & Constância de Estudo
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {unlockedBadgesCount}/{achievements.length} insígnias
                        conquistadas
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveSection('metas')}
                      className="text-xs font-medium text-sky-800 hover:underline cursor-pointer"
                    >
                      Ajustar metas
                    </button>
                  </div>

                  {/* Daily Questions Progress */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium">
                        Questões resolvidas hoje
                      </span>
                      <span className="font-mono font-semibold text-slate-900 tabular-nums">
                        {questionsAnsweredToday}/
                        {studyGoals.dailyQuestionsTarget} ({dailyPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          dailyPct >= 100 ? 'bg-emerald-600' : 'bg-sky-700'
                        }`}
                        style={{ width: `${dailyPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Key Numbers Grid */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="bg-white border border-slate-200 rounded-md p-3">
                      <span className="text-[11px] text-slate-500 block">
                        Acerto Global
                      </span>
                      <span className="font-mono text-lg font-semibold text-slate-900 tabular-nums">
                        {globalAccuracy}%
                      </span>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-md p-3">
                      <span className="text-[11px] text-slate-500 block">
                        Simulados
                      </span>
                      <span className="font-mono text-lg font-semibold text-slate-900 tabular-nums">
                        {simuladoHistory.length}
                      </span>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-md p-3">
                      <span className="text-[11px] text-slate-500 block">
                        Caderno Erros
                      </span>
                      <span className="font-mono text-lg font-semibold text-amber-800 tabular-nums">
                        {Object.keys(userNotes).length} itens
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3-Column Feature Hub: Recommended Simulados, Priority Error Revisions, Active Forum Discussions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Col 1 (5 cols): Featured Mock Exams */}
              <section className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900">
                    Simulados Prontos & Sob Medida
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveSection('simulados')}
                    className="text-xs font-medium text-sky-800 hover:underline cursor-pointer"
                  >
                    Ver todos ({blueprints.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {blueprints.slice(0, 3).map((bp) => (
                    <div
                      key={bp.id}
                      className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-slate-800">
                          {bp.bancaPrincipal} · {bp.questionIds.length} questões
                        </span>
                        <span className="font-mono tabular-nums">
                          {bp.tempoLimiteMinutos} min · Corte{' '}
                          {bp.notaCorteReferencia}%
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {bp.titulo}
                      </h3>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-slate-500">
                          {bp.regraPontuacao === 'cebraspe_liquida'
                            ? '● Líquido (1E anula 1C)'
                            : '○ Pontuação Bruta'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setExternalBlueprintId(bp.id);
                            setActiveSection('simulados');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 cursor-pointer whitespace-nowrap"
                        >
                          <Play className="w-3 h-3" />
                          <span>Iniciar Prova</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Col 2 (7 cols): Community Discussions + Recent Error Notebook */}
              <section className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900">
                    Destaques do Fórum de Questões & Pegadinhas Mapeadas
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveSection('comunidade')}
                    className="text-xs font-medium text-sky-800 hover:underline cursor-pointer"
                  >
                    Abrir Fórum Completo
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-200">
                  {forumPosts.slice(0, 3).map((post) => {
                    const q = QUESTIONS_BANK.find(
                      (item) => item.id === post.questionId
                    );
                    return (
                      <div key={post.id} className="p-4 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-mono font-semibold text-slate-900">
                              {q?.codigo}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-medium text-sky-800">
                              {q?.disciplina}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>por {post.authorName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (q) {
                                setFocusedQuestionId(q.id);
                                setActiveSection('questoes');
                              }
                            }}
                            className="inline-flex items-center gap-1 font-medium text-sky-800 hover:underline cursor-pointer whitespace-nowrap"
                          >
                            <span>Ver questão e debate</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Banner to Caderno de Erros & Raio-X */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveSection('caderno')}
                    className="text-left p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
                      <span>Revisar Caderno de Erros</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-slate-600">
                      Revise suas {Object.keys(userNotes).length} questões com
                      anotações pessoais e armadilhas de banca registradas.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('desempenho')}
                    className="text-left p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-sky-900">
                      <span>Abrir Edital Verticalizado</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-slate-600">
                      Inspecione sua precisão por disciplina, matriz de
                      confiança e distância para a nota de corte.
                    </p>
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeSection === 'simulados' && (
          <SimuladosCenterView
            questions={QUESTIONS_BANK}
            blueprints={blueprints}
            simuladoHistory={simuladoHistory}
            userNotes={userNotes}
            forumPosts={forumPosts}
            externalStartBlueprintId={externalBlueprintId}
            onClearExternalStart={() => setExternalBlueprintId(null)}
            onCreateCustomBlueprint={handleCreateCustomBlueprint}
            onCompleteSimulado={handleCompleteSimulado}
            onSaveNote={handleSaveNote}
            onLogErrorReason={handleLogErrorReason}
            onAddForumPost={handleAddForumPost}
            onAddForumReply={handleAddForumReply}
            onToggleForumUpvote={handleToggleForumUpvote}
          />
        )}

        {activeSection === 'questoes' && (
          <QuestionsBankView
            questions={QUESTIONS_BANK}
            userNotes={userNotes}
            forumPosts={forumPosts}
            initialDisciplinaFilter={initialDisciplinaFilter}
            focusedQuestionId={focusedQuestionId}
            onClearFocusedQuestion={() => setFocusedQuestionId(null)}
            onRecordPracticeAttempt={handleRecordPracticeAttempt}
            onSaveNote={handleSaveNote}
            onLogErrorReason={handleLogErrorReason}
            onAddForumPost={handleAddForumPost}
            onAddForumReply={handleAddForumReply}
            onToggleForumUpvote={handleToggleForumUpvote}
          />
        )}

        {activeSection === 'comunidade' && (
          <CommunityForumView
            questions={QUESTIONS_BANK}
            forumPosts={forumPosts}
            onAddForumPost={handleAddForumPost}
            onAddForumReply={handleAddForumReply}
            onToggleForumUpvote={handleToggleForumUpvote}
            onOpenQuestionFromForum={(questionId) => {
              setFocusedQuestionId(questionId);
              setActiveSection('questoes');
            }}
          />
        )}

        {activeSection === 'caderno' && (
          <CadernoDeErrosView
            questions={QUESTIONS_BANK}
            attempts={attempts}
            userNotes={userNotes}
            forumPosts={forumPosts}
            onRecordPracticeAttempt={handleRecordPracticeAttempt}
            onSaveNote={handleSaveNote}
            onLogErrorReason={handleLogErrorReason}
            onAddForumPost={handleAddForumPost}
            onAddForumReply={handleAddForumReply}
            onToggleForumUpvote={handleToggleForumUpvote}
          />
        )}

        {activeSection === 'metas' && (
          <GoalsAndRewardsView
            goals={studyGoals}
            badges={achievements}
            attempts={attempts}
            simulados={simuladoHistory}
            questionsAnsweredToday={questionsAnsweredToday}
            questionsAnsweredThisWeek={questionsAnsweredThisWeek}
            simuladosCompletedThisWeek={simuladosCompletedThisWeek}
            onUpdateGoals={setStudyGoals}
            onNavigateToAction={(dest) => setActiveSection(dest)}
          />
        )}

        {activeSection === 'desempenho' && (
          <PerformanceAnalyticsView
            questions={QUESTIONS_BANK}
            attempts={attempts}
            simulados={simuladoHistory}
            carreiras={CARREIRAS_META}
            selectedCarreiraId={selectedCarreiraId}
            onSelectCarreira={setSelectedCarreiraId}
            onPracticeSubject={(disc) => {
              setInitialDisciplinaFilter(disc);
              setFocusedQuestionId(null);
              setActiveSection('questoes');
            }}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6 mt-12">
        <div className="max-w-[1380px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <span>
            Vértice Concursos — Simulados de Alta Precisão, Questões Comentadas
            & Diagnóstico Analítico
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveSection('questoes')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Banco de Questões
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveSection('comunidade')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Fórum da Comunidade
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveSection('metas')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Metas & Conquistas
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
