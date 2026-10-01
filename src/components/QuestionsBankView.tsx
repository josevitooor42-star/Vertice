import React, { useState, useMemo, useEffect } from 'react';
import {
  Question,
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
import { Search, RotateCcw } from 'lucide-react';

interface QuestionsBankViewProps {
  questions: Question[];
  userNotes: Record<string, UserQuestionNote>;
  forumPosts: ForumThreadPost[];
  initialDisciplinaFilter?: Disciplina | 'Todas';
  focusedQuestionId?: string | null;
  onClearFocusedQuestion?: () => void;
  onRecordPracticeAttempt: (
    questionId: string,
    letra: string | null,
    confidence: NivelConfianca,
    isBlank: boolean
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

const DISCIPLINAS_OPTIONS: ('Todas' | Disciplina)[] = [
  'Todas',
  'Direito Constitucional',
  'Direito Administrativo',
  'Língua Portuguesa',
  'Raciocínio Lógico',
  'Direito Tributário & AFO',
  'Informática & TI',
];

const BANCAS_OPTIONS: ('Todas' | Banca)[] = [
  'Todas',
  'FGV',
  'CEBRASPE',
  'FCC',
  'VUNESP',
  'CESGRANRIO',
];

const DIFICULDADE_OPTIONS: ('Todas' | Dificuldade)[] = [
  'Todas',
  'Fácil',
  'Média',
  'Difícil',
];

export const QuestionsBankView: React.FC<QuestionsBankViewProps> = ({
  questions,
  userNotes,
  forumPosts,
  initialDisciplinaFilter = 'Todas',
  focusedQuestionId,
  onClearFocusedQuestion,
  onRecordPracticeAttempt,
  onSaveNote,
  onLogErrorReason,
  onAddForumPost,
  onAddForumReply,
  onToggleForumUpvote,
}) => {
  const [selectedDisciplina, setSelectedDisciplina] = useState<
    'Todas' | Disciplina
  >(initialDisciplinaFilter);
  const [selectedBanca, setSelectedBanca] = useState<'Todas' | Banca>('Todas');
  const [selectedDificuldade, setSelectedDificuldade] = useState<
    'Todas' | Dificuldade
  >('Todas');
  const [selectedModalidade, setSelectedModalidade] = useState<
    'todas' | 'multipla_escolha' | 'certo_errado'
  >('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [practiceState, setPracticeState] = useState<
    Record<
      string,
      {
        selectedOption: string | null;
        confidence: NivelConfianca;
        isBlank: boolean;
        submitted: boolean;
      }
    >
  >({});

  useEffect(() => {
    if (initialDisciplinaFilter) {
      setSelectedDisciplina(initialDisciplinaFilter);
    }
  }, [initialDisciplinaFilter]);

  useEffect(() => {
    if (focusedQuestionId) {
      const targetQ = questions.find((q) => q.id === focusedQuestionId);
      if (targetQ) {
        setSelectedDisciplina('Todas');
        setSelectedBanca('Todas');
        setSelectedDificuldade('Todas');
        setSelectedModalidade('todas');
        setSearchQuery(targetQ.codigo);
      }
    }
  }, [focusedQuestionId, questions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (
        selectedDisciplina !== 'Todas' &&
        q.disciplina !== selectedDisciplina
      ) {
        return false;
      }
      if (selectedBanca !== 'Todas' && q.banca !== selectedBanca) {
        return false;
      }
      if (
        selectedDificuldade !== 'Todas' &&
        q.dificuldade !== selectedDificuldade
      ) {
        return false;
      }
      if (
        selectedModalidade !== 'todas' &&
        q.modalidade !== selectedModalidade
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const term = searchQuery.toLowerCase();
        return (
          q.codigo.toLowerCase().includes(term) ||
          q.enunciado.toLowerCase().includes(term) ||
          q.assunto.toLowerCase().includes(term) ||
          q.orgao.toLowerCase().includes(term) ||
          q.comentario.fundamentoLegal.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [
    questions,
    selectedDisciplina,
    selectedBanca,
    selectedDificuldade,
    selectedModalidade,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setSelectedDisciplina('Todas');
    setSelectedBanca('Todas');
    setSelectedDificuldade('Todas');
    setSelectedModalidade('todas');
    setSearchQuery('');
    if (onClearFocusedQuestion) onClearFocusedQuestion();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-sky-800">
            Resolução Ativa · Comentários Alternativa por Alternativa & Fórum
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
            Banco de Questões Comentadas
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Filtre por disciplina, banca, dificuldade ou artigo de lei. Cada
            questão traz análise individual de todas as alternativas,
            mapeamento de pegadinhas e tópico de discussão da comunidade.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold text-slate-700 tabular-nums">
            Exibindo {filteredQuestions.length} de {questions.length} questões
          </span>
          <button
            type="button"
            onClick={() => setPracticeState({})}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Respostas</span>
          </button>
        </div>
      </div>

      {/* Multi-Dimensional Filter Console */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código (VRT-2501), artigo, súmula, órgão ou termo..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-600 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <select
              aria-label="Filtrar por banca examinadora"
              value={selectedBanca}
              onChange={(e) =>
                setSelectedBanca(e.target.value as 'Todas' | Banca)
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-sky-600 focus:outline-none"
            >
              {BANCAS_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b === 'Todas' ? 'Banca: Todas' : `Banca: ${b}`}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              aria-label="Filtrar por dificuldade"
              value={selectedDificuldade}
              onChange={(e) =>
                setSelectedDificuldade(e.target.value as 'Todas' | Dificuldade)
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-sky-600 focus:outline-none"
            >
              {DIFICULDADE_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d === 'Todas' ? 'Dificuldade: Todas' : `Nível: ${d}`}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              aria-label="Filtrar por modalidade"
              value={selectedModalidade}
              onChange={(e) =>
                setSelectedModalidade(
                  e.target.value as 'todas' | 'multipla_escolha' | 'certo_errado'
                )
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-sky-600 focus:outline-none"
            >
              <option value="todas">Modalidade: Todas</option>
              <option value="multipla_escolha">Múltipla Escolha (A–E)</option>
              <option value="certo_errado">Certo / Errado (CEBRASPE)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {DISCIPLINAS_OPTIONS.map((disc) => (
              <button
                key={disc}
                type="button"
                onClick={() => setSelectedDisciplina(disc)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedDisciplina === disc
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                {disc}
              </button>
            ))}
          </div>

          {(selectedDisciplina !== 'Todas' ||
            selectedBanca !== 'Todas' ||
            selectedDificuldade !== 'Todas' ||
            selectedModalidade !== 'todas' ||
            searchQuery.trim() !== '') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-medium text-sky-800 hover:underline cursor-pointer whitespace-nowrap"
            >
              Limpar filtros ativos
            </button>
          )}
        </div>
      </div>

      {/* Questions Feed */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center space-y-3">
          <p className="text-base font-semibold text-slate-800">
            Nenhuma questão encontrada para esses critérios.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            Exibir Todas as Questões
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredQuestions.map((q, idx) => {
            const st = practiceState[q.id] || {
              selectedOption: null,
              confidence: 'certeza' as NivelConfianca,
              isBlank: false,
              submitted: false,
            };

            return (
              <QuestionCard
                key={q.id}
                question={q}
                indexNumber={idx + 1}
                totalQuestions={filteredQuestions.length}
                mode="treino_comentado"
                selectedOption={st.selectedOption}
                confidence={st.confidence}
                isBlank={st.isBlank}
                isSubmitted={st.submitted}
                userNote={userNotes[q.id]}
                forumPosts={forumPosts}
                defaultOpenTab={
                  focusedQuestionId === q.id ? 'forum' : undefined
                }
                onSelectOption={(letra, conf, blank) => {
                  setPracticeState((prev) => ({
                    ...prev,
                    [q.id]: {
                      selectedOption: letra,
                      confidence: conf,
                      isBlank: Boolean(blank),
                      submitted: false,
                    },
                  }));
                }}
                onConfirmAnswer={(letra, conf, blank) => {
                  setPracticeState((prev) => ({
                    ...prev,
                    [q.id]: {
                      selectedOption: letra,
                      confidence: conf,
                      isBlank: Boolean(blank),
                      submitted: true,
                    },
                  }));
                  onRecordPracticeAttempt(q.id, letra, conf, Boolean(blank));
                }}
                onSaveNote={onSaveNote}
                onLogErrorReason={onLogErrorReason}
                onAddForumPost={onAddForumPost}
                onAddForumReply={onAddForumReply}
                onToggleForumUpvote={onToggleForumUpvote}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
