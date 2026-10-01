import React, { useState } from 'react';
import {
  StudyGoals,
  AchievementBadge,
  QuestionAttempt,
  SimuladoResultRecord,
} from '../types/concursos';
import {
  Award,
  Flame,
  Target,
  CheckCircle2,
  Sliders,
  ArrowRight,
  Trophy,
  Check,
} from 'lucide-react';

interface GoalsAndRewardsViewProps {
  goals: StudyGoals;
  badges: AchievementBadge[];
  attempts: QuestionAttempt[];
  simulados: SimuladoResultRecord[];
  questionsAnsweredToday: number;
  questionsAnsweredThisWeek: number;
  simuladosCompletedThisWeek: number;
  onUpdateGoals: (newGoals: StudyGoals) => void;
  onNavigateToAction: (destination: 'questoes' | 'simulados' | 'comunidade') => void;
}

export const GoalsAndRewardsView: React.FC<GoalsAndRewardsViewProps> = ({
  goals,
  badges,
  attempts,
  simulados,
  questionsAnsweredToday,
  questionsAnsweredThisWeek,
  simuladosCompletedThisWeek,
  onUpdateGoals,
  onNavigateToAction,
}) => {
  const [draftGoals, setDraftGoals] = useState<StudyGoals>(goals);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [badgeFilter, setBadgeFilter] = useState<
    'todas' | 'desbloqueadas' | 'em_progresso'
  >('todas');

  const unlockedBadges = badges.filter((b) => b.unlocked);
  const totalBadgeXp = unlockedBadges.reduce((sum, b) => sum + b.xpReward, 0);
  const totalXp =
    goals.bonusXp +
    totalBadgeXp +
    attempts.length * 15 +
    simulados.length * 80;

  const currentLevel = Math.floor(totalXp / 500) + 1;
  const xpInCurrentLevel = totalXp % 500;
  const xpProgressPercent = Math.round((xpInCurrentLevel / 500) * 100);

  const getRankTitle = (level: number) => {
    if (level >= 6) return 'Concurseiro de Elite — Fase de Aprovação';
    if (level >= 4) return 'Especialista em Banca Examinadora';
    if (level >= 2) return 'Candidato Competitivo';
    return 'Iniciante Estratégico';
  };

  const dailyProgressPct = Math.min(
    100,
    Math.round((questionsAnsweredToday / goals.dailyQuestionsTarget) * 100)
  );
  const weeklyQuestionsPct = Math.min(
    100,
    Math.round((questionsAnsweredThisWeek / goals.weeklyQuestionsTarget) * 100)
  );
  const weeklySimuladosPct = Math.min(
    100,
    Math.round(
      (simuladosCompletedThisWeek / goals.weeklySimuladosTarget) * 100
    )
  );

  const totalCorrect = attempts.filter((a) => a.isCorreta).length;
  const currentAccuracy =
    attempts.length > 0
      ? Math.round((totalCorrect / attempts.length) * 100)
      : 0;

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGoals(draftGoals);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2200);
  };

  const filteredBadges = badges.filter((b) => {
    if (badgeFilter === 'desbloqueadas') return b.unlocked;
    if (badgeFilter === 'em_progresso') return !b.unlocked;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-sky-800">
            Disciplina Tática · Metas Diárias, Semanais e Sistema de Recompensas
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
            Metas de Estudo & Galeria de Conquistas
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Configure suas metas diárias e semanais de resolução de questões e
            simulados. Ao atingir seus indicadores, você acumula XP e desbloqueia
            insígnias de desempenho.
          </p>
        </div>

        {/* Level & Streak Summary Strip */}
        <div className="flex items-center gap-6 bg-white border border-slate-200 rounded-lg px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="block font-mono text-lg font-semibold text-slate-900 tabular-nums leading-none">
                {goals.streakDays} dias
              </span>
              <span className="text-xs text-slate-500">Ofensiva Atual</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-sky-700 shrink-0" />
            <div>
              <span className="block font-mono text-lg font-semibold text-slate-900 tabular-nums leading-none">
                Nível {currentLevel} · {totalXp} XP
              </span>
              <span className="text-xs text-slate-500">
                {getRankTitle(currentLevel)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Grid: Live Goal Progress (Left 7 cols) + Interactive Goal Calibrator (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Live Progress Trackers */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Progresso das Metas Ativas
              </h2>
              <p className="text-xs text-slate-500">
                Atualizado em tempo real conforme você resolve questões e
                conclui simulados
              </p>
            </div>
            <span className="text-xs font-mono text-slate-600 tabular-nums">
              {unlockedBadges.length}/{badges.length} Insígnias Desbloqueadas
            </span>
          </div>

          <div className="space-y-5">
            {/* Goal 1: Daily Questions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">
                  1. Meta Diária de Questões Comentadas
                </span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {questionsAnsweredToday} / {goals.dailyQuestionsTarget}{' '}
                  questões ({dailyProgressPct}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    dailyProgressPct >= 100 ? 'bg-emerald-600' : 'bg-sky-600'
                  }`}
                  style={{ width: `${dailyProgressPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  {dailyProgressPct >= 100
                    ? '✓ Meta diária concluída! +150 XP garantidos.'
                    : `Faltam ${Math.max(
                        0,
                        goals.dailyQuestionsTarget - questionsAnsweredToday
                      )} questões para fechar a meta de hoje.`}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigateToAction('questoes')}
                  className="inline-flex items-center gap-1 font-medium text-sky-800 hover:underline cursor-pointer"
                >
                  <span>Resolver questões</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Goal 2: Weekly Questions */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">
                  2. Meta Semanal de Volume de Questões
                </span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {questionsAnsweredThisWeek} / {goals.weeklyQuestionsTarget}{' '}
                  questões ({weeklyQuestionsPct}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    weeklyQuestionsPct >= 100 ? 'bg-emerald-600' : 'bg-sky-600'
                  }`}
                  style={{ width: `${weeklyQuestionsPct}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                {weeklyQuestionsPct >= 100
                  ? '✓ Volume semanal superado! Excelente ritmo de preparação.'
                  : `Restam ${Math.max(
                      0,
                      goals.weeklyQuestionsTarget - questionsAnsweredThisWeek
                    )} questões para atingir seu volume semanal.`}
              </p>
            </div>

            {/* Goal 3: Weekly Mock Exams */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">
                  3. Meta Semanal de Simulados Concluídos
                </span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {simuladosCompletedThisWeek} / {goals.weeklySimuladosTarget}{' '}
                  simulados ({weeklySimuladosPct}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    weeklySimuladosPct >= 100 ? 'bg-emerald-600' : 'bg-sky-600'
                  }`}
                  style={{ width: `${weeklySimuladosPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Cada simulado concluído rende +80 XP e atualiza o Raio-X
                  Analítico.
                </span>
                <button
                  type="button"
                  onClick={() => onNavigateToAction('simulados')}
                  className="inline-flex items-center gap-1 font-medium text-sky-800 hover:underline cursor-pointer"
                >
                  <span>Iniciar simulado</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Goal 4: Target Accuracy Rate */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">
                  4. Meta de Taxa de Acerto Global
                </span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  Atual: {currentAccuracy}% · Alvo: {goals.targetAccuracyPercent}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    currentAccuracy >= goals.targetAccuracyPercent
                      ? 'bg-emerald-600'
                      : 'bg-amber-600'
                  }`}
                  style={{ width: `${Math.min(100, currentAccuracy)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                {currentAccuracy >= goals.targetAccuracyPercent
                  ? '● Desempenho igual ou acima da sua meta de precisão!'
                  : `▲ Você está a ${
                      goals.targetAccuracyPercent - currentAccuracy
                    } pontos percentuais da sua meta de precisão.`}
              </p>
            </div>
          </div>

          {/* Level XP Bar */}
          <div className="pt-4 border-t border-slate-200 bg-slate-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">
                Progresso para o Nível {currentLevel + 1}
              </span>
              <span className="font-mono text-slate-700 tabular-nums">
                {xpInCurrentLevel} / 500 XP ({xpProgressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 transition-all"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Interactive Goal Calibrator Form */}
        <form
          onSubmit={handleSaveGoals}
          className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 space-y-5 flex flex-col justify-between"
        >
          <div className="space-y-5">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-700" />
                <span>Configurar Metas de Estudo</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ajuste seus parâmetros diários e semanais conforme sua carga
                horária disponível
              </p>
            </div>

            {/* Slider 1: Daily Questions */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="slider-daily-q"
                  className="font-semibold text-slate-800"
                >
                  Meta Diária de Questões:
                </label>
                <span className="font-mono font-semibold text-sky-900 tabular-nums">
                  {draftGoals.dailyQuestionsTarget} questões/dia
                </span>
              </div>
              <input
                id="slider-daily-q"
                type="range"
                min={5}
                max={50}
                step={5}
                value={draftGoals.dailyQuestionsTarget}
                onChange={(e) =>
                  setDraftGoals({
                    ...draftGoals,
                    dailyQuestionsTarget: Number(e.target.value),
                  })
                }
                className="w-full accent-sky-700 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                <span>5/dia</span>
                <span>25/dia</span>
                <span>50/dia</span>
              </div>
            </div>

            {/* Slider 2: Weekly Questions */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="slider-weekly-q"
                  className="font-semibold text-slate-800"
                >
                  Meta Semanal de Questões:
                </label>
                <span className="font-mono font-semibold text-sky-900 tabular-nums">
                  {draftGoals.weeklyQuestionsTarget} questões/semana
                </span>
              </div>
              <input
                id="slider-weekly-q"
                type="range"
                min={15}
                max={200}
                step={5}
                value={draftGoals.weeklyQuestionsTarget}
                onChange={(e) =>
                  setDraftGoals({
                    ...draftGoals,
                    weeklyQuestionsTarget: Number(e.target.value),
                  })
                }
                className="w-full accent-sky-700 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                <span>15/sem</span>
                <span>100/sem</span>
                <span>200/sem</span>
              </div>
            </div>

            {/* Slider 3: Weekly Simulados */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="slider-weekly-sim"
                  className="font-semibold text-slate-800"
                >
                  Meta Semanal de Simulados:
                </label>
                <span className="font-mono font-semibold text-sky-900 tabular-nums">
                  {draftGoals.weeklySimuladosTarget} simulados/semana
                </span>
              </div>
              <input
                id="slider-weekly-sim"
                type="range"
                min={1}
                max={10}
                step={1}
                value={draftGoals.weeklySimuladosTarget}
                onChange={(e) =>
                  setDraftGoals({
                    ...draftGoals,
                    weeklySimuladosTarget: Number(e.target.value),
                  })
                }
                className="w-full accent-sky-700 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                <span>1/sem</span>
                <span>5/sem</span>
                <span>10/sem</span>
              </div>
            </div>

            {/* Slider 4: Target Accuracy */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="slider-acc"
                  className="font-semibold text-slate-800"
                >
                  Meta de Precisão (Taxa de Acerto):
                </label>
                <span className="font-mono font-semibold text-sky-900 tabular-nums">
                  {draftGoals.targetAccuracyPercent}%
                </span>
              </div>
              <input
                id="slider-acc"
                type="range"
                min={60}
                max={95}
                step={1}
                value={draftGoals.targetAccuracyPercent}
                onChange={(e) =>
                  setDraftGoals({
                    ...draftGoals,
                    targetAccuracyPercent: Number(e.target.value),
                  })
                }
                className="w-full accent-sky-700 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                <span>60%</span>
                <span>80% (Corte Fiscal)</span>
                <span>95%</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            {savedNotice ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <Check className="w-4 h-4" />
                Metas atualizadas com sucesso!
              </span>
            ) : (
              <span className="text-xs text-slate-500">
                Salve para recalibrar suas insígnias.
              </span>
            )}
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              Salvar Novas Metas
            </button>
          </div>
        </form>
      </div>

      {/* Achievements & Badges Section */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Insígnias & Recompensas Desbloqueáveis
            </h2>
            <p className="text-xs text-slate-500">
              Conquistas auditadas automaticamente com base no seu histórico de
              questões, simulados e participações na comunidade
            </p>
          </div>

          <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            {(
              [
                { id: 'todas', label: `Todas (${badges.length})` },
                {
                  id: 'desbloqueadas',
                  label: `Desbloqueadas (${unlockedBadges.length})`,
                },
                {
                  id: 'em_progresso',
                  label: `Em Progresso (${badges.length - unlockedBadges.length})`,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setBadgeFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  badgeFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBadges.map((badge) => {
            const pct = Math.min(
              100,
              Math.round((badge.progressCurrent / badge.progressTarget) * 100)
            );
            return (
              <div
                key={badge.id}
                className={`border rounded-lg p-5 flex flex-col justify-between gap-4 transition-colors ${
                  badge.unlocked
                    ? 'bg-white border-emerald-300'
                    : 'bg-white border-slate-200 opacity-90'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500">
                      {badge.code} · +{badge.xpReward} XP
                    </span>
                    {badge.unlocked ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Desbloqueada
                      </span>
                    ) : (
                      <span className="font-medium text-amber-800">
                        ▲ Em Progresso ({pct}%)
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                        badge.unlocked
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {badge.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      {badge.unlocked
                        ? badge.unlockedAt || 'Conquista ativa'
                        : 'Progresso atual'}
                    </span>
                    <span className="font-mono font-medium text-slate-800 tabular-nums">
                      {badge.progressCurrent}/{badge.progressTarget}{' '}
                      {badge.unitLabel}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        badge.unlocked ? 'bg-emerald-600' : 'bg-sky-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
