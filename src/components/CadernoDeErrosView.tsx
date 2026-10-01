import React, { useState, useMemo } from 'react';
import {
  Question,
  QuestionAttempt,
  UserQuestionNote,
  ForumThreadPost,
  ForumPostCategory,
  MotivoErro,
  NivelConfianca,
} from '../types/concursos';
import { QuestionCard } from './QuestionCard';
import { Bookmark, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CadernoDeErrosViewProps {
  questions: Question[];
  attempts: QuestionAttempt[];
  userNotes: Record<string, UserQuestionNote>;
  forumPosts: ForumThreadPost[];
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

const NOTEBOOK_TABS = [
  'Todos os Cadernos',
  'Erros Críticos',
  'Revisão de Véspera',
  'Jurisprudência STF/STJ',
  'Lei Seca',
];

export const CadernoDeErrosView: React.FC<CadernoDeErrosViewProps> = ({
  questions,
  attempts,
  userNotes,
  forumPosts,
  onRecordPracticeAttempt,
  onSaveNote,
  onLogErrorReason,
  onAddForumPost,
  onAddForumReply,
  onToggleForumUpvote,
}) => {
  const [selectedNotebook, setSelectedNotebook] = useState<string>(
    'Todos os Cadernos'
  );
  const [dominioFilter, setDominioFilter] = useState<
    'todos' | 'critico' | 'em_revisao' | 'dominado'
  >('todos');

  // Local practice state for re-solving missed questions
  const [localSelections, setLocalSelections] = useState<
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

  // Questions that either have a note/notebook saved OR were missed in attempts
  const missedQuestionIds = useMemo(() => {
    const missedSet = new Set<string>();
    attempts.forEach((a) => {
      if (!a.isCorreta) missedSet.add(a.questionId);
    });
    Object.keys(userNotes).forEach((qId) => {
      const n = userNotes[qId];
      if ((n.cadernos && n.cadernos.length > 0) || n.anotacaoPessoal.trim()) {
        missedSet.add(qId);
      }
    });
    return missedSet;
  }, [attempts, userNotes]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (!missedQuestionIds.has(q.id)) return false;
      const note = userNotes[q.id];

      if (selectedNotebook !== 'Todos os Cadernos') {
        if (!note?.cadernos?.includes(selectedNotebook)) return false;
      }

      if (dominioFilter !== 'todos') {
        const currentDom = note?.nivelDominio || 'critico';
        if (currentDom !== dominioFilter) return false;
      }

      return true;
    });
  }, [questions, missedQuestionIds, userNotes, selectedNotebook, dominioFilter]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-sky-800">
            Estudo Reverso · Mapeamento de Armadilhas & Resumos Pessoais
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
            Caderno de Erros & Revisão Dirigida
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Questões que você errou ou salvou em cadernos temáticos, acompanhadas
            das suas anotações pessoais, diagnóstico do motivo do erro e
            revisão ativa.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLocalSelections({})}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar Marcações para Re-resolver</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {NOTEBOOK_TABS.map((nb) => (
            <button
              key={nb}
              type="button"
              onClick={() => setSelectedNotebook(nb)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedNotebook === nb
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {nb}
            </button>
          ))}
        </div>

        <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
          {(
            [
              { id: 'todos', label: 'Todos os Status' },
              { id: 'critico', label: '■ Críticos' },
              { id: 'em_revisao', label: '▲ Em Revisão' },
              { id: 'dominado', label: '● Dominados' },
            ] as const
          ).map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setDominioFilter(st.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                dominioFilter === st.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* List of Error Notebook Questions */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center space-y-2">
          <p className="text-base font-semibold text-slate-800">
            Nenhuma questão encontrada neste filtro do Caderno de Erros.
          </p>
          <p className="text-xs text-slate-500">
            Selecione &ldquo;Todos os Cadernos&rdquo; ou salve novas questões
            durante seus treinos.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredQuestions.map((q, idx) => {
            const note = userNotes[q.id];
            const loc = localSelections[q.id] || {
              selectedOption: null,
              confidence: 'certeza' as NivelConfianca,
              isBlank: false,
              submitted: false,
            };

            return (
              <div key={q.id} className="space-y-2">
                {/* Personal Note Banner above the Question Card if user wrote a summary */}
                {note?.anotacaoPessoal && (
                  <div className="bg-amber-50/80 border border-amber-300 rounded-lg px-5 py-3.5 flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-amber-950">
                        <span className="font-semibold">
                          ★ Seu Lembrete Pessoal de Revisão ({q.codigo}):
                        </span>
                        {note.cadernos?.map((c) => (
                          <span key={c} className="text-amber-800">
                            · {c}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed">
                        {note.anotacaoPessoal}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-amber-900 font-semibold shrink-0">
                      {note.nivelDominio === 'critico'
                        ? '■ Ponto Crítico'
                        : note.nivelDominio === 'em_revisao'
                        ? '▲ Em Revisão'
                        : '● Dominado'}
                    </span>
                  </div>
                )}

                <QuestionCard
                  question={q}
                  indexNumber={idx + 1}
                  totalQuestions={filteredQuestions.length}
                  mode="treino_comentado"
                  selectedOption={loc.selectedOption}
                  confidence={loc.confidence}
                  isBlank={loc.isBlank}
                  isSubmitted={loc.submitted}
                  userNote={note}
                  forumPosts={forumPosts}
                  onSelectOption={(letra, conf, blank) => {
                    setLocalSelections((prev) => ({
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
                    setLocalSelections((prev) => ({
                      ...prev,
                      [q.id]: {
                        selectedOption: letra,
                        confidence: conf,
                        isBlank: Boolean(blank),
                        submitted: true,
                      },
                    }));
                    onRecordPracticeAttempt(
                      q.id,
                      letra,
                      conf,
                      Boolean(blank)
                    );
                  }}
                  onSaveNote={onSaveNote}
                  onLogErrorReason={onLogErrorReason}
                  onAddForumPost={onAddForumPost}
                  onAddForumReply={onAddForumReply}
                  onToggleForumUpvote={onToggleForumUpvote}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
