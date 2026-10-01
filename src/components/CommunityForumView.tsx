import React, { useState, useMemo } from 'react';
import {
  Question,
  ForumThreadPost,
  ForumPostCategory,
  Disciplina,
} from '../types/concursos';
import {
  MessageSquare,
  ThumbsUp,
  Reply,
  Search,
  ArrowUpRight,
  Send,
  Plus,
} from 'lucide-react';

interface CommunityForumViewProps {
  questions: Question[];
  forumPosts: ForumThreadPost[];
  onAddForumPost: (
    questionId: string,
    category: ForumPostCategory,
    content: string
  ) => void;
  onAddForumReply: (postId: string, content: string) => void;
  onToggleForumUpvote: (postId: string, replyId?: string) => void;
  onOpenQuestionFromForum: (questionId: string) => void;
}

const DISCIPLINAS_LIST: ('Todas' | Disciplina)[] = [
  'Todas',
  'Direito Constitucional',
  'Direito Administrativo',
  'Língua Portuguesa',
  'Raciocínio Lógico',
  'Direito Tributário & AFO',
  'Informática & TI',
];

export const CommunityForumView: React.FC<CommunityForumViewProps> = ({
  questions,
  forumPosts,
  onAddForumPost,
  onAddForumReply,
  onToggleForumUpvote,
  onOpenQuestionFromForum,
}) => {
  const [selectedDisciplina, setSelectedDisciplina] = useState<
    'Todas' | Disciplina
  >('Todas');
  const [selectedCategory, setSelectedCategory] = useState<
    'todas' | ForumPostCategory
  >('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedQuestionFilter, setSelectedQuestionFilter] =
    useState<string>('todas');

  // New Topic composer state
  const [showNewTopicForm, setShowNewTopicForm] = useState<boolean>(false);
  const [composerQuestionId, setComposerQuestionId] = useState<string>(
    questions[0]?.id || 'Q-01'
  );
  const [composerCategory, setComposerCategory] =
    useState<ForumPostCategory>('duvida');
  const [composerContent, setComposerContent] = useState<string>('');

  // Reply state
  const [replyingToPostId, setReplyingToPostId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');

  const questionMap = useMemo(() => {
    const map: Record<string, Question> = {};
    questions.forEach((q) => {
      map[q.id] = q;
    });
    return map;
  }, [questions]);

  const filteredPosts = useMemo(() => {
    return forumPosts.filter((post) => {
      const q = questionMap[post.questionId];
      if (!q) return false;

      if (
        selectedDisciplina !== 'Todas' &&
        q.disciplina !== selectedDisciplina
      ) {
        return false;
      }

      if (selectedCategory !== 'todas' && post.category !== selectedCategory) {
        return false;
      }

      if (
        selectedQuestionFilter !== 'todas' &&
        post.questionId !== selectedQuestionFilter
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const term = searchQuery.toLowerCase();
        const matchesPost =
          post.content.toLowerCase().includes(term) ||
          post.authorName.toLowerCase().includes(term);
        const matchesQuestion =
          q.codigo.toLowerCase().includes(term) ||
          q.assunto.toLowerCase().includes(term) ||
          q.enunciado.toLowerCase().includes(term);
        return matchesPost || matchesQuestion;
      }

      return true;
    });
  }, [
    forumPosts,
    questionMap,
    selectedDisciplina,
    selectedCategory,
    selectedQuestionFilter,
    searchQuery,
  ]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerContent.trim()) return;
    onAddForumPost(
      composerQuestionId,
      composerCategory,
      composerContent.trim()
    );
    setComposerContent('');
    setShowNewTopicForm(false);
  };

  const handleCreateReply = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    onAddForumReply(postId, replyContent.trim());
    setReplyContent('');
    setReplyingToPostId(null);
  };

  const getCategoryLabel = (cat: ForumPostCategory) => {
    switch (cat) {
      case 'duvida':
        return '● Dúvida sobre a Questão';
      case 'explicacao':
        return '✓ Resolução Colaborativa';
      case 'mnemonico':
        return '★ Bizu / Mnemônico';
      case 'jurisprudencia':
        return '§ Jurisprudência & Lei Seca';
    }
  };

  const totalReplies = useMemo(
    () => forumPosts.reduce((acc, p) => acc + p.replies.length, 0),
    [forumPosts]
  );

  return (
    <div className="space-y-8">
      {/* Header & Summary */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-sky-800">
            Inteligência Coletiva · Threads Vinculadas por Questão
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
            Fórum da Comunidade & Discussão de Questões
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Cada questão do banco possui um tópico exclusivo de debate. Tire
            dúvidas de alternativas específicas, compartilhe mnemônicos e
            aprofunde a jurisprudência com outros candidatos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-4 pr-3 border-r border-slate-200 text-xs text-slate-600">
            <div>
              <span className="block font-mono text-base font-semibold text-slate-900 tabular-nums">
                {forumPosts.length}
              </span>
              <span>Tópicos Ativos</span>
            </div>
            <div>
              <span className="block font-mono text-base font-semibold text-slate-900 tabular-nums">
                {totalReplies}
              </span>
              <span>Respostas</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowNewTopicForm((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Dúvida ou Explicação</span>
          </button>
        </div>
      </div>

      {/* Collapsible New Discussion Post Composer */}
      {showNewTopicForm && (
        <form
          onSubmit={handleCreatePost}
          className="bg-white border border-slate-200 rounded-lg p-6 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-base font-semibold text-slate-900">
              Nova Contribuição vinculada a uma Questão
            </h2>
            <button
              type="button"
              onClick={() => setShowNewTopicForm(false)}
              className="text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              Fechar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="forum-select-question"
                className="block text-xs font-semibold text-slate-800"
              >
                Selecione a Questão do Debate:
              </label>
              <select
                id="forum-select-question"
                value={composerQuestionId}
                onChange={(e) => setComposerQuestionId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-sky-600 focus:outline-none"
              >
                {questions.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.codigo} · {q.banca} ({q.ano}) — {q.disciplina}:{' '}
                    {q.assunto}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-slate-800">
                Tipo de Contribuição:
              </span>
              <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 w-full">
                {(
                  [
                    { id: 'duvida', label: 'Dúvida' },
                    { id: 'explicacao', label: 'Explicação' },
                    { id: 'mnemonico', label: 'Bizu' },
                    { id: 'jurisprudencia', label: 'STF/STJ' },
                  ] as { id: ForumPostCategory; label: string }[]
                ).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setComposerCategory(cat.id)}
                    className={`flex-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      composerCategory === cat.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="forum-post-body"
              className="block text-xs font-semibold text-slate-800"
            >
              Seu Comentário, Dúvida ou Fundamentação:
            </label>
            <textarea
              id="forum-post-body"
              rows={3}
              value={composerContent}
              onChange={(e) => setComposerContent(e.target.value)}
              placeholder="Ex: Por que a alternativa C foi considerada incorreta pela banca? Segue meu resumo do artigo aplicável..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Sua publicação aparecerá automaticamente dentro do card da questão{' '}
              {questionMap[composerQuestionId]?.codigo} e no mural da
              comunidade.
            </span>
            <button
              type="submit"
              disabled={!composerContent.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 disabled:opacity-40 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publicar no Fórum</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por código (ex: VRT-2501), assunto, lei ou palavra-chave..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-600 focus:outline-none"
            />
          </div>

          <div className="md:col-span-4">
            <select
              aria-label="Filtrar por questão específica"
              value={selectedQuestionFilter}
              onChange={(e) => setSelectedQuestionFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-sky-600 focus:outline-none"
            >
              <option value="todas">
                Todas as Questões ({questions.length} questões com tópico)
              </option>
              {questions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.codigo} ({q.banca}) — {q.assunto}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              aria-label="Filtrar por categoria do post"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value as 'todas' | ForumPostCategory)
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:border-sky-600 focus:outline-none"
            >
              <option value="todas">Todos os Tipos de Postagem</option>
              <option value="duvida">Dúvidas de Candidatos</option>
              <option value="explicacao">Resoluções Comentadas</option>
              <option value="mnemonico">Bizus & Mnemônicos</option>
              <option value="jurisprudencia">Jurisprudência STF / STJ</option>
            </select>
          </div>
        </div>

        {/* Discipline Interactive Filter Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {DISCIPLINAS_LIST.map((disc) => (
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
      </div>

      {/* Discussion Threads List */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center space-y-3">
          <p className="text-base font-semibold text-slate-800">
            Nenhuma discussão encontrada para os filtros selecionados.
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Experimente limpar a busca ou inicie uma nova discussão sobre
            qualquer questão do banco clicando no botão acima.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedDisciplina('Todas');
              setSelectedCategory('todas');
              setSelectedQuestionFilter('todas');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const q = questionMap[post.questionId];
            if (!q) return null;

            return (
              <article
                key={post.id}
                className="bg-white border border-slate-200 rounded-lg p-6 space-y-4"
              >
                {/* Question Context Header — Unboxed clean metadata */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="font-mono font-semibold text-slate-900">
                        {q.codigo}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-slate-800">
                        {q.banca} ({q.ano})
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-sky-800">
                        {q.disciplina}
                      </span>
                      <span aria-hidden="true">/</span>
                      <span className="text-slate-700">{q.assunto}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-3xl">
                      Enunciado: &ldquo;{q.enunciado}&rdquo;
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenQuestionFromForum(q.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-sky-800 bg-sky-50 border border-sky-200 rounded-md hover:bg-sky-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Abrir Questão {q.codigo}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Author & Post Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      {post.authorName}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Carreira: {post.authorTargetCareer}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-800">
                      {getCategoryLabel(post.category)}
                    </span>
                    {post.isPinnedExplanation && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-emerald-800">
                          ★ Explicação Verificada pela Comunidade
                        </span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400">{post.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleForumUpvote(post.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer tabular-nums whitespace-nowrap ${
                        post.isUpvotedByUser
                          ? 'bg-sky-50 border-sky-300 text-sky-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Útil ({post.upvotes})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setReplyingToPostId(
                          replyingToPostId === post.id ? null : post.id
                        )
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer whitespace-nowrap"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Responder ({post.replies.length})</span>
                    </button>
                  </div>
                </div>

                {/* Post Body */}
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Nested Replies */}
                {post.replies.length > 0 && (
                  <div className="pl-4 border-l-2 border-slate-200 space-y-3 pt-1">
                    {post.replies.map((rep) => (
                      <div
                        key={rep.id}
                        className="bg-slate-50/70 p-3.5 rounded-md space-y-1"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-900">
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
                              onToggleForumUpvote(post.id, rep.id)
                            }
                            className={`inline-flex items-center gap-1 text-xs font-mono tabular-nums cursor-pointer ${
                              rep.isUpvotedByUser
                                ? 'text-sky-800 font-semibold'
                                : 'text-slate-500 hover:text-slate-900'
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

                {/* Reply Form */}
                {replyingToPostId === post.id && (
                  <form
                    onSubmit={(e) => handleCreateReply(post.id, e)}
                    className="pt-2 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`Responder a ${post.authorName} na questão ${q.codigo}...`}
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!replyContent.trim()}
                      className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-40 cursor-pointer whitespace-nowrap"
                    >
                      Publicar Resposta
                    </button>
                  </form>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
