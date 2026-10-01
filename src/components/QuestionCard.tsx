import React, { useState, useEffect } from 'react';
import {
  Question,
  NivelConfianca,
  MotivoErro,
  UserQuestionNote,
  ForumThreadPost,
  ForumPostCategory,
} from '../types/concursos';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scissors,
  Highlighter,
  BookOpen,
  Scale,
  Lightbulb,
  Bookmark,
  Clock,
  Check,
  MessageSquare,
  ThumbsUp,
  Reply,
  Send,
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  indexNumber?: number;
  totalQuestions?: number;
  mode: 'treino_comentado' | 'prova_real' | 'revisao_pos_prova';
  selectedOption: string | null;
  confidence: NivelConfianca;
  isBlank?: boolean;
  isSubmitted: boolean;
  timeSpentSeconds?: number;
  userNote?: UserQuestionNote;
  forumPosts?: ForumThreadPost[];
  defaultOpenTab?: 'alternativas' | 'fundamento' | 'caderno' | 'forum';
  onSelectOption: (
    letra: string | null,
    confidence: NivelConfianca,
    isBlank?: boolean
  ) => void;
  onConfirmAnswer?: (
    letra: string | null,
    confidence: NivelConfianca,
    isBlank?: boolean
  ) => void;
  onSaveNote: (
    questionId: string,
    noteData: Partial<UserQuestionNote>
  ) => void;
  onLogErrorReason?: (questionId: string, reason: MotivoErro) => void;
  onAddForumPost?: (
    questionId: string,
    category: ForumPostCategory,
    content: string
  ) => void;
  onAddForumReply?: (postId: string, content: string) => void;
  onToggleForumUpvote?: (postId: string, replyId?: string) => void;
}

const AVAILABLE_NOTEBOOKS = [
  'Erros Críticos',
  'Revisão de Véspera',
  'Jurisprudência STF/STJ',
  'Lei Seca',
];

const ERROR_REASON_LABELS: { id: MotivoErro; label: string }[] = [
  { id: 'pegadinha_banca', label: 'Caiu em Pegadinha da Banca' },
  { id: 'lacuna_teorica', label: 'Lacuna Teórica / Não Conhecia a Regra' },
  { id: 'jurisprudencia', label: 'Desconhecimento de Jurisprudência' },
  { id: 'falta_atencao', label: 'Falta de Atenção na Leitura' },
  { id: 'tempo_insuficiente', label: 'Pressa / Tempo Insuficiente' },
];

const FORUM_CATEGORIES: { id: ForumPostCategory; label: string }[] = [
  { id: 'duvida', label: 'Dúvida na Questão' },
  { id: 'explicacao', label: 'Explicação / Resolução' },
  { id: 'mnemonico', label: 'Bizu / Mnemônico' },
  { id: 'jurisprudencia', label: 'Complemento STF / STJ / Lei' },
];

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  indexNumber,
  totalQuestions,
  mode,
  selectedOption,
  confidence,
  isBlank = false,
  isSubmitted,
  timeSpentSeconds = 0,
  userNote,
  forumPosts = [],
  defaultOpenTab,
  onSelectOption,
  onConfirmAnswer,
  onSaveNote,
  onLogErrorReason,
  onAddForumPost,
  onAddForumReply,
  onToggleForumUpvote,
}) => {
  const [crossedOut, setCrossedOut] = useState<string[]>([]);
  const [highlightKeywords, setHighlightKeywords] = useState<boolean>(false);
  const [activeCommentTab, setActiveCommentTab] = useState<
    'alternativas' | 'fundamento' | 'caderno' | 'forum'
  >(defaultOpenTab || 'alternativas');
  const [showForumPreSubmit, setShowForumPreSubmit] = useState<boolean>(
    defaultOpenTab === 'forum'
  );
  const [localNoteText, setLocalNoteText] = useState<string>(
    userNote?.anotacaoPessoal || ''
  );
  const [noteSavedFeedback, setNoteSavedFeedback] = useState<boolean>(false);

  // Forum state
  const [newPostCategory, setNewPostCategory] =
    useState<ForumPostCategory>('duvida');
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [replyingToPostId, setReplyingToPostId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');

  const questionThread = forumPosts.filter((p) => p.questionId === question.id);

  useEffect(() => {
    setLocalNoteText(userNote?.anotacaoPessoal || '');
  }, [question.id, userNote?.anotacaoPessoal]);

  useEffect(() => {
    setCrossedOut([]);
    setHighlightKeywords(false);
    setActiveCommentTab(defaultOpenTab || 'alternativas');
    setShowForumPreSubmit(defaultOpenTab === 'forum');
    setReplyingToPostId(null);
    setReplyContent('');
  }, [question.id, defaultOpenTab]);

  const toggleCrossOut = (letra: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSubmitted) return;
    setCrossedOut((prev) =>
      prev.includes(letra) ? prev.filter((l) => l !== letra) : [...prev, letra]
    );
  };

  const renderHighlightedText = (text: string) => {
    if (!highlightKeywords || !question.palavrasChave.length) {
      return text;
    }

    let parts: (string | React.ReactNode)[] = [text];
    question.palavrasChave.forEach((keyword, kwIdx) => {
      const nextParts: (string | React.ReactNode)[] = [];
      parts.forEach((part, partIdx) => {
        if (typeof part !== 'string') {
          nextParts.push(part);
          return;
        }
        const regex = new RegExp(
          `(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
          'gi'
        );
        const split = part.split(regex);
        split.forEach((s, sIdx) => {
          if (s.toLowerCase() === keyword.toLowerCase()) {
            nextParts.push(
              <mark
                key={`${kwIdx}-${partIdx}-${sIdx}`}
                className="bg-amber-200/80 text-slate-950 px-1 rounded-xs font-medium underline decoration-amber-600 decoration-2"
              >
                {s}
              </mark>
            );
          } else if (s) {
            nextParts.push(s);
          }
        });
      });
      parts = nextParts;
    });

    return parts;
  };

  const showGabarito =
    isSubmitted && (mode === 'treino_comentado' || mode === 'revisao_pos_prova');

  const isAnswerCorrect =
    !isBlank && selectedOption !== null && selectedOption === question.gabarito;

  const formatSeconds = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return mins > 0 ? `${mins}m ${rem}s` : `${rem}s`;
  };

  const handleToggleNotebook = (notebookName: string) => {
    const current = userNote?.cadernos || [];
    const updated = current.includes(notebookName)
      ? current.filter((c) => c !== notebookName)
      : [...current, notebookName];
    onSaveNote(question.id, {
      cadernos: updated,
      anotacaoPessoal: localNoteText,
      nivelDominio: userNote?.nivelDominio || 'em_revisao',
    });
  };

  const handleSavePersonalNote = () => {
    onSaveNote(question.id, {
      anotacaoPessoal: localNoteText,
      cadernos: userNote?.cadernos || ['Revisão de Véspera'],
      nivelDominio: userNote?.nivelDominio || 'em_revisao',
    });
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 1800);
  };

  const handleDominioChange = (nivel: 'critico' | 'em_revisao' | 'dominado') => {
    onSaveNote(question.id, {
      nivelDominio: nivel,
      anotacaoPessoal: localNoteText,
      cadernos: userNote?.cadernos || [],
    });
  };

  const handleReasonSelect = (reason: MotivoErro) => {
    onSaveNote(question.id, {
      motivoErroRegistrado: reason,
      anotacaoPessoal: localNoteText,
      cadernos:
        userNote?.cadernos && userNote.cadernos.length > 0
          ? userNote.cadernos
          : ['Erros Críticos'],
      nivelDominio: 'critico',
    });
    if (onLogErrorReason) {
      onLogErrorReason(question.id, reason);
    }
  };

  const handlePublishForumPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !onAddForumPost) return;
    onAddForumPost(question.id, newPostCategory, newPostContent.trim());
    setNewPostContent('');
  };

  const handlePublishReply = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !onAddForumReply) return;
    onAddForumReply(postId, replyContent.trim());
    setReplyContent('');
    setReplyingToPostId(null);
  };

  const getCategoryLabel = (cat: ForumPostCategory) => {
    switch (cat) {
      case 'duvida':
        return 'Dúvida da Comunidade';
      case 'explicacao':
        return 'Resolução Comentada';
      case 'mnemonico':
        return 'Bizu / Mnemônico';
      case 'jurisprudencia':
        return 'Jurisprudência / Lei Seca';
    }
  };

  return (
    <article className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 transition-colors">
      {/* Header Metadata - Strict Zero-Pill Discipline */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
            {indexNumber !== undefined && (
              <>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  Questão {String(indexNumber).padStart(2, '0')}
                  {totalQuestions
                    ? `/${String(totalQuestions).padStart(2, '0')}`
                    : ''}
                </span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span className="font-mono text-slate-800 font-medium">
              {question.codigo}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-900">
              {question.banca}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{question.ano}</span>
            <span aria-hidden="true">·</span>
            <span>{question.orgao}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">{question.cargo}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
            <span className="font-medium text-sky-800">
              {question.disciplina}
            </span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700">{question.assunto}</span>
            <span aria-hidden="true">·</span>
            <span>
              Dificuldade:{' '}
              <strong className="font-medium text-slate-800">
                {question.dificuldade}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              Acerto Geral: {question.estatisticasComunidade.taxaAcertoGeral}%
            </span>
          </div>
        </div>

        {/* Interactive Study Affordances */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHighlightKeywords((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              highlightKeywords
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Destacar comandos e termos-chave no enunciado"
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span>
              {highlightKeywords ? 'Termos Destacados' : 'Grifar Comando'}
            </span>
          </button>

          {mode !== 'prova_real' && (
            <button
              type="button"
              onClick={() => {
                if (showGabarito) {
                  setActiveCommentTab('forum');
                } else {
                  setShowForumPreSubmit((prev) => !prev);
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                (showGabarito && activeCommentTab === 'forum') ||
                (!showGabarito && showForumPreSubmit)
                  ? 'bg-sky-50 border-sky-300 text-sky-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="tabular-nums">
                Fórum ({questionThread.length})
              </span>
            </button>
          )}

          {userNote?.cadernos && userNote.cadernos.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (showGabarito) setActiveCommentTab('caderno');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-sky-200 bg-sky-50 text-sky-900 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 fill-sky-700 text-sky-700" />
              <span>Salva ({userNote.cadernos.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Supporting Text (Texto de Apoio) if present */}
      {question.textoApoio && (
        <div className="mt-5 p-4 bg-slate-50 border-l-2 border-slate-400 text-sm text-slate-700 leading-relaxed">
          <p className="text-xs font-semibold text-slate-500 mb-1">
            Texto de apoio:
          </p>
          <p className="italic">
            {renderHighlightedText(question.textoApoio)}
          </p>
        </div>
      )}

      {/* Question Stem (Enunciado) */}
      <div className="mt-5 text-[15.5px] leading-[1.68] text-slate-900 whitespace-pre-line max-w-[78ch]">
        {renderHighlightedText(question.enunciado)}
      </div>

      {/* Alternatives List */}
      <div
        className="mt-6 space-y-2.5"
        role="radiogroup"
        aria-label="Alternativas da questão"
      >
        {question.alternativas.map((alt) => {
          const isSelected = !isBlank && selectedOption === alt.letra;
          const isEliminated = crossedOut.includes(alt.letra);

          let containerStyle =
            'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70';
          let badgeStyle = 'border-slate-300 text-slate-700 bg-slate-50';
          let stateLabel: React.ReactNode = null;

          if (showGabarito) {
            if (alt.isCorreta) {
              containerStyle = 'border-emerald-600 bg-emerald-50/50';
              badgeStyle = 'border-emerald-600 bg-emerald-600 text-white';
              stateLabel = (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 whitespace-nowrap">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Gabarito Oficial ({alt.taxaMarcacaoComunidade}% marcaram)
                </span>
              );
            } else if (isSelected && !alt.isCorreta) {
              containerStyle = 'border-red-600 bg-red-50/50';
              badgeStyle = 'border-red-600 bg-red-600 text-white';
              stateLabel = (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-800 whitespace-nowrap">
                  <XCircle className="w-3.5 h-3.5" />
                  Sua Marcação — Incorreta ({alt.taxaMarcacaoComunidade}%
                  marcaram)
                </span>
              );
            } else if (alt.isPegadinha) {
              containerStyle = 'border-amber-300 bg-amber-50/20';
              stateLabel = (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 whitespace-nowrap">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Pegadinha Frequente ({alt.taxaMarcacaoComunidade}% caíram)
                </span>
              );
            } else {
              containerStyle = 'border-slate-200 bg-slate-50/40 opacity-85';
              stateLabel = (
                <span className="text-xs font-mono text-slate-500 tabular-nums whitespace-nowrap">
                  {alt.taxaMarcacaoComunidade}% marcaram
                </span>
              );
            }
          } else if (isSelected) {
            containerStyle = 'border-sky-600 bg-sky-50/60 ring-1 ring-sky-600';
            badgeStyle = 'border-sky-600 bg-sky-600 text-white';
          }

          return (
            <div
              key={alt.letra}
              onClick={() => {
                if (!isSubmitted && !isEliminated) {
                  onSelectOption(alt.letra, confidence, false);
                }
              }}
              className={`group relative flex items-start justify-between gap-4 p-4 rounded-lg border transition-all ${containerStyle} ${
                !isSubmitted ? 'cursor-pointer' : ''
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <span
                  className={`w-7 h-7 rounded-md border flex items-center justify-center text-xs font-mono font-semibold shrink-0 mt-0.5 transition-colors ${badgeStyle}`}
                >
                  {alt.letra}
                </span>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <p
                    className={`text-[15px] leading-relaxed ${
                      isEliminated && !showGabarito
                        ? 'line-through text-slate-400'
                        : 'text-slate-900'
                    }`}
                  >
                    {alt.rotulo ? (
                      <strong className="font-semibold">{alt.rotulo}</strong>
                    ) : (
                      alt.texto
                    )}
                  </p>

                  {showGabarito && stateLabel && (
                    <div className="pt-1 flex flex-wrap items-center gap-3">
                      {stateLabel}
                    </div>
                  )}

                  {showGabarito && (
                    <div
                      className={`mt-2 pt-2 border-t text-xs leading-relaxed ${
                        alt.isCorreta
                          ? 'border-emerald-200 text-emerald-950'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="font-semibold">
                        Análise da alternativa {alt.letra}:{' '}
                      </span>
                      {alt.comentarioEspecifico}
                    </div>
                  )}
                </div>
              </div>

              {!isSubmitted && (
                <button
                  type="button"
                  onClick={(e) => toggleCrossOut(alt.letra, e)}
                  title={
                    isEliminated
                      ? 'Restaurar alternativa'
                      : 'Riscar/eliminar alternativa'
                  }
                  className={`p-1.5 rounded-md border text-xs transition-colors shrink-0 cursor-pointer ${
                    isEliminated
                      ? 'border-slate-300 bg-slate-200 text-slate-700'
                      : 'border-transparent text-slate-400 opacity-70 group-hover:opacity-100 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Bar: Confidence Level Selector + Answer Confirmation / Blank Option */}
      <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-slate-600">
            Grau de confiança na resposta:
          </span>
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            {(
              [
                { id: 'certeza', label: 'Tenho Certeza' },
                { id: 'duvida', label: 'Dúvida entre 2' },
                { id: 'chute', label: 'Chute' },
              ] as { id: NivelConfianca; label: string }[]
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={isSubmitted}
                onClick={() => onSelectOption(selectedOption, item.id, isBlank)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  confidence === item.id
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                } ${isSubmitted ? 'opacity-75 cursor-default' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {question.banca === 'CEBRASPE' && !isSubmitted && (
            <button
              type="button"
              onClick={() => {
                onSelectOption(null, confidence, true);
                if (mode === 'treino_comentado' && onConfirmAnswer) {
                  onConfirmAnswer(null, confidence, true);
                }
              }}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                isBlank
                  ? 'border-amber-500 bg-amber-50 text-amber-900'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Deixar em Branco (Sem Penalidade)
            </button>
          )}

          {!isSubmitted && mode === 'treino_comentado' && onConfirmAnswer && (
            <button
              type="button"
              disabled={!selectedOption && !isBlank}
              onClick={() => onConfirmAnswer(selectedOption, confidence, isBlank)}
              className="px-5 py-2 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap cursor-pointer"
            >
              Responder e Ver Comentário Detalhado
            </button>
          )}

          {showGabarito && (
            <div className="flex items-center gap-3 text-xs">
              {timeSpentSeconds > 0 && (
                <span className="inline-flex items-center gap-1 font-mono text-slate-600 tabular-nums">
                  <Clock className="w-3.5 h-3.5" />
                  Seu tempo: {formatSeconds(timeSpentSeconds)} (Média:{' '}
                  {formatSeconds(
                    question.estatisticasComunidade.tempoMedioSegundos
                  )}
                  )
                </span>
              )}
              {isBlank ? (
                <span className="font-semibold text-amber-800">
                  ○ Deixada em Branco (0 pt)
                </span>
              ) : isAnswerCorrect ? (
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  Você acertou! (Gabarito: {question.gabarito})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-semibold text-red-700">
                  <XCircle className="w-4 h-4" />
                  Você marcou {selectedOption} · Gabarito Oficial:{' '}
                  {question.gabarito}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Forum Thread Section if opened before submitting, or full Raio-X + Forum after submitting */}
      {(showGabarito || (showForumPreSubmit && mode !== 'prova_real')) && (
        <section
          aria-label="Comentário detalhado e fórum da questão"
          className="mt-6 pt-6 border-t border-slate-200 space-y-5"
        >
          {showGabarito ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h3 className="text-base font-semibold text-slate-900">
                  Raio-X da Questão, Fundamentação & Fórum da Comunidade
                </h3>
                <p className="text-xs text-slate-500">
                  Análise exauriente do dispositivo legal, jurisprudência
                  aplicável e discussão colaborativa
                </p>
              </div>

              {/* Segmented Tab Controller */}
              <div className="inline-flex flex-wrap items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveCommentTab('alternativas')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeCommentTab === 'alternativas'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Resumo & Pegadinha</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCommentTab('fundamento')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeCommentTab === 'fundamento'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Lei Seca & STF/STJ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCommentTab('forum')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeCommentTab === 'forum'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="tabular-nums">
                    Fórum da Questão ({questionThread.length})
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCommentTab('caderno')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeCommentTab === 'caderno'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Caderno de Erros</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Fórum de Discussão desta Questão ({question.codigo})
                </h3>
                <p className="text-xs text-slate-500">
                  Compartilhe dúvidas, bizus e interpretações com outros
                  candidatos
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForumPreSubmit(false)}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Ocultar Fórum
              </button>
            </div>
          )}

          {showGabarito && activeCommentTab === 'alternativas' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-slate-800">
                    Síntese Teórica Direcionada
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {question.comentario.resumoTeorico}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-1.5">
                  <h4 className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-emerald-700" />
                    Bizu / Chave de Memorização Rápida
                  </h4>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {question.comentario.dicaDeMemorizacao}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-5 rounded-lg border border-slate-200">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    Radiografia da Pegadinha ({question.banca})
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {question.comentario.pegadinhaDaBanca}
                  </p>
                </div>

                {!isAnswerCorrect && !isBlank && (
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <p className="text-xs font-semibold text-slate-800">
                      Diagnóstico de Erro: Por que você errou esta questão?
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {ERROR_REASON_LABELS.map((reason) => {
                        const isChosen =
                          userNote?.motivoErroRegistrado === reason.id;
                        return (
                          <button
                            key={reason.id}
                            type="button"
                            onClick={() => handleReasonSelect(reason.id)}
                            className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                              isChosen
                                ? 'bg-red-700 text-white border-red-700 font-medium'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {reason.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {showGabarito && activeCommentTab === 'fundamento' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <h4 className="text-xs font-semibold text-slate-900">
                  Dispositivo Legal / Normativo Exato
                </h4>
                <p className="text-sm font-mono text-sky-900 leading-relaxed">
                  {question.comentario.fundamentoLegal}
                </p>
              </div>
              <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <h4 className="text-xs font-semibold text-slate-900">
                  Jurisprudência Vinculante (STF / STJ / TCU) & Doutrina
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {question.comentario.jurisprudenciaOuDoutrina}
                </p>
              </div>
            </div>
          )}

          {showGabarito && activeCommentTab === 'caderno' && (
            <div className="pt-2 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-800 block">
                    Salvar em Cadernos de Revisão:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {AVAILABLE_NOTEBOOKS.map((nb) => {
                      const active = userNote?.cadernos?.includes(nb);
                      return (
                        <button
                          key={nb}
                          type="button"
                          onClick={() => handleToggleNotebook(nb)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                            active
                              ? 'bg-sky-700 text-white border-sky-700'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {active ? `✓ ${nb}` : `+ ${nb}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-800 block">
                    Status de Domínio do Tema:
                  </span>
                  <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                    {(
                      [
                        { id: 'critico', label: '■ Crítico' },
                        { id: 'em_revisao', label: '▲ Em Revisão' },
                        { id: 'dominado', label: '● Dominado' },
                      ] as const
                    ).map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleDominioChange(st.id)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          (userNote?.nivelDominio || 'em_revisao') === st.id
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor={`note-${question.id}`}
                  className="block text-xs font-semibold text-slate-800"
                >
                  Minha Anotação / Resumo Pessoal desta Questão:
                </label>
                <textarea
                  id={`note-${question.id}`}
                  rows={3}
                  value={localNoteText}
                  onChange={(e) => setLocalNoteText(e.target.value)}
                  placeholder="Registre aqui o artigo da lei, o motivo do erro ou seu gatilho de revisão para não errar na prova..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-600 focus:outline-none"
                />
                <div className="flex items-center justify-end gap-3">
                  {noteSavedFeedback && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                      <Check className="w-3.5 h-3.5" />
                      Anotação salva no seu Caderno de Erros!
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleSavePersonalNote}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Salvar Anotação no Caderno
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dedicated Community Discussion Thread for this Question */}
          {((showGabarito && activeCommentTab === 'forum') ||
            (!showGabarito && showForumPreSubmit)) && (
            <div className="pt-2 space-y-6">
              {/* Post Composer */}
              {onAddForumPost && (
                <form
                  onSubmit={handlePublishForumPost}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-800">
                      Contribuir na discussão da questão {question.codigo}:
                    </span>
                    <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-white rounded-md border border-slate-200">
                      {FORUM_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setNewPostCategory(cat.id)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer whitespace-nowrap ${
                            newPostCategory === cat.id
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Compartilhe sua dúvida sobre uma alternativa específica, um mnemônico ou jurisprudência complementar..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-600 focus:outline-none"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Publicar ajuda a comunidade e soma +25 XP nas suas Metas &
                      Conquistas.
                    </span>
                    <button
                      type="submit"
                      disabled={!newPostContent.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 disabled:opacity-40 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publicar no Tópico</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Thread List */}
              {questionThread.length === 0 ? (
                <div className="py-6 text-center border border-dashed border-slate-200 rounded-lg">
                  <p className="text-sm font-medium text-slate-700">
                    Nenhum comentário da comunidade nesta questão ainda.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Seja o primeiro a compartilhar um comentário ou dúvida
                    acima!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 border-t border-slate-200">
                  {questionThread.map((post) => (
                    <div key={post.id} className="py-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span className="font-semibold text-slate-900">
                            {post.authorName}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>Foco: {post.authorTargetCareer}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-sky-800">
                            {getCategoryLabel(post.category)}
                          </span>
                          {post.isPinnedExplanation && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-semibold text-emerald-800">
                                ★ Explicação Destacada pela Comunidade
                              </span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-400">{post.createdAt}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              onToggleForumUpvote &&
                              onToggleForumUpvote(post.id)
                            }
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer tabular-nums ${
                              post.isUpvotedByUser
                                ? 'bg-sky-50 border-sky-300 text-sky-800'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>Útil ({post.upvotes})</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setReplyingToPostId(
                                replyingToPostId === post.id ? null : post.id
                              )
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                          >
                            <Reply className="w-3 h-3" />
                            <span>Responder</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>

                      {/* Replies */}
                      {post.replies.length > 0 && (
                        <div className="pl-4 border-l-2 border-slate-200 space-y-3 mt-2">
                          {post.replies.map((rep) => (
                            <div key={rep.id} className="space-y-1">
                              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-semibold text-slate-800">
                                    {rep.authorName}
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span>{rep.authorTargetCareer}</span>
                                  <span aria-hidden="true">·</span>
                                  <span>{rep.createdAt}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onToggleForumUpvote &&
                                    onToggleForumUpvote(post.id, rep.id)
                                  }
                                  className={`inline-flex items-center gap-1 text-xs font-mono tabular-nums cursor-pointer ${
                                    rep.isUpvotedByUser
                                      ? 'text-sky-700 font-semibold'
                                      : 'text-slate-500 hover:text-slate-800'
                                  }`}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>{rep.upvotes}</span>
                                </button>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed">
                                {rep.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Input Box */}
                      {replyingToPostId === post.id && (
                        <form
                          onSubmit={(e) => handlePublishReply(post.id, e)}
                          className="pl-4 border-l-2 border-sky-500 flex items-center gap-2 pt-1"
                        >
                          <input
                            type="text"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder={`Responder a ${post.authorName}...`}
                            className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                          />
                          <button
                            type="submit"
                            disabled={!replyContent.trim()}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 disabled:opacity-40 cursor-pointer whitespace-nowrap"
                          >
                            Enviar Resposta
                          </button>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </article>
  );
};
