import {
  ForumThreadPost,
  StudyGoals,
  QuestionAttempt,
  SimuladoResultRecord,
  AchievementBadge,
} from '../types/concursos';

export const INITIAL_STUDY_GOALS: StudyGoals = {
  dailyQuestionsTarget: 10,
  weeklyQuestionsTarget: 45,
  weeklySimuladosTarget: 3,
  targetAccuracyPercent: 78,
  streakDays: 6,
  bonusXp: 350,
};

export const INITIAL_FORUM_POSTS: ForumThreadPost[] = [
  {
    id: 'fp-101',
    questionId: 'Q-01',
    authorName: 'Lucas Mendonça',
    authorTargetCareer: 'Auditor Federal — TCU',
    createdAt: 'há 2 dias',
    category: 'explicacao',
    isPinnedExplanation: true,
    content:
      'Pessoal, para nunca mais confundir na FGV os casos da Lei 14.133/2021: o Art. 74, III, alínea "f" coloca expressamente o "treinamento e aperfeiçoamento de pessoal" dentro de INEXIGIBILIDADE (quando houver natureza predominantemente intelectual + notória especialização). E o § 4º do mesmo Art. 74 proíbe a subcontratação do profissional que justificou a notória especialização.',
    upvotes: 34,
    isUpvotedByUser: true,
    replies: [
      {
        id: 'fpr-101-1',
        authorName: 'Camila Vasconcelos',
        authorTargetCareer: 'Analista Judiciário — TRF',
        createdAt: 'há 1 dia',
        content:
          'Excelente resumo, Lucas! Eu quase marquei a letra C porque confundi com a regra do pregão. Vale lembrar que o Art. 29, parágrafo único da Lei 14.133 veda o pregão para serviços técnicos de natureza predominantemente intelectual.',
        upvotes: 12,
      },
    ],
  },
  {
    id: 'fp-102',
    questionId: 'Q-01',
    authorName: 'Rafael Nogueira',
    authorTargetCareer: 'SEFAZ-SP',
    createdAt: 'há 5 horas',
    category: 'duvida',
    content:
      'Alguém sabe dizer se o credenciamento na Nova Lei de Licitações entra como dispensa ou inexigibilidade? Vi uma questão parecida da FGV cobrando isso junto com fornecedor exclusivo.',
    upvotes: 8,
    replies: [
      {
        id: 'fpr-102-1',
        authorName: 'Marina Alencar',
        authorTargetCareer: 'Procuradoria Estadual',
        createdAt: 'há 3 horas',
        content:
          'Entra como INEXIGIBILIDADE (Art. 74, inciso IV da Lei 14.133/2021), Rafael! O credenciamento é um procedimento auxiliar (Art. 79) que fundamenta contratação direta por inexigibilidade porque todos os interessados que preenchem os requisitos são contratados (inviabilidade de competição por contratação de todos).',
        upvotes: 19,
      },
    ],
  },
  {
    id: 'fp-201',
    questionId: 'Q-02',
    authorName: 'Rodrigo Tavares',
    authorTargetCareer: 'Polícia Federal — Agente',
    createdAt: 'há 3 dias',
    category: 'jurisprudencia',
    isPinnedExplanation: true,
    content:
      'Questão cirúrgica sobre o Tema 280 do STF e o HC 598.051 do STJ! A banca copiou o texto exato do Tema 280 até a metade ("entrada forçada sem mandado é lícita, mesmo à noite, amparada em fundadas razões..."), mas no final emendou que "denúncia anônima + nervosismo" bastam. Para o STF e STJ, denúncia anônima sem campana/diligência prévia e nervosismo do abordado NÃO configuram fundadas razões!',
    upvotes: 49,
    isUpvotedByUser: false,
    replies: [
      {
        id: 'fpr-201-1',
        authorName: 'Bianca Ferreira',
        authorTargetCareer: 'PRF / PF',
        createdAt: 'há 2 dias',
        content:
          'Caí exatamente nessa na primeira leitura rápida! Tem que ler os itens do Cebraspe até a última palavra com desconfiança máxima.',
        upvotes: 15,
      },
    ],
  },
  {
    id: 'fp-301',
    questionId: 'Q-03',
    authorName: 'Beatriz Siqueira',
    authorTargetCareer: 'Receita Federal — Auditor',
    createdAt: 'há 4 dias',
    category: 'mnemonico',
    isPinnedExplanation: true,
    content:
      'Bizu infalível para a FGV em reescrita de condicionais negativas:\n• "Caso NÃO faça" = Condição + Negação.\n• "Salvo se fizer" / "A menos que faça" = A própria locução já carrega o "NÃO" embutido!\nSe você escrever "A menos que NÃO faça" (como na letra B), você coloca dois "nãos" e inverte o sentido para afirmativo.',
    upvotes: 62,
    isUpvotedByUser: true,
    replies: [],
  },
  {
    id: 'fp-401',
    questionId: 'Q-04',
    authorName: 'Henrique Paiva',
    authorTargetCareer: 'Analista Judiciário — STJ',
    createdAt: 'há 2 dias',
    category: 'explicacao',
    content:
      'Quadro comparativo rápido da Lei 8.429/92 pós-Lei 14.230/2021 para quem está revisando:\n• Art. 9º (Enriquecimento Ilícito): Rol exemplificativo | Suspensão política até 14 anos | Proibição de contratar até 14 anos.\n• Art. 10 (Lesão ao Erário): Rol exemplificativo (SÓ DOLO, extinta a culpa!) | Suspensão política até 12 anos | Proibição de contratar até 12 anos.\n• Art. 11 (Princípios): Rol TAXATIVO | SEM suspensão de direitos políticos | Proibição de contratar até 4 anos.',
    upvotes: 41,
    replies: [],
  },
  {
    id: 'fp-501',
    questionId: 'Q-05',
    authorName: 'Daniela Costa',
    authorTargetCareer: 'Polícia Federal',
    createdAt: 'há 1 dia',
    category: 'mnemonico',
    content:
      'Passo a passo no rascunho:\nProposição P: Meta → (Gratificação OU Promoção).\nAplicando a Contrapositiva (inverte e nega os dois lados):\n~(Gratificação OU Promoção) → ~Meta.\nNegação do "OU" (De Morgan) vira "E" negando tudo:\n(~Gratificação E ~Promoção) → ~Meta. Bate 100% com o item!',
    upvotes: 28,
    replies: [],
  },
  {
    id: 'fp-601',
    questionId: 'Q-06',
    authorName: 'Gustavo Oliveira',
    authorTargetCareer: 'Auditor Fiscal — SEFAZ',
    createdAt: 'há 3 dias',
    category: 'mnemonico',
    isPinnedExplanation: true,
    content:
      'A pergunta mais cobrada em Direito Tributário sobre Anterioridade:\nQuem NÃO espera os 90 dias (Noventena), mas espera 1º de janeiro (Anual)?\nLembrem da tríade: **IR + Base de Cálculo do IPVA + Base de Cálculo do IPTU**.\nCuidado: Se a questão falar em ALÍQUOTA do IPVA ou ALÍQUOTA do IPTU, aí respeita as DUAS anterioridades (anual + 90 dias)!',
    upvotes: 53,
    replies: [],
  },
  {
    id: 'fp-701',
    questionId: 'Q-07',
    authorName: 'Thiago Albuquerque',
    authorTargetCareer: 'Perito Criminal Federal',
    createdAt: 'há 2 dias',
    category: 'explicacao',
    content:
      'Sempre que a questão falar em ASSINATURA DIGITAL:\n1) Gera o resumo (Hash) do documento.\n2) Cifra o hash com a CHAVE PRIVADA DO REMETENTE (quem assina usa a sua chave privada, que só ele tem).\n3) Quem recebe usa a chave pública do remetente para decifrar o hash e comparar.\nSe usar a chave pública do destinatário, isso é criptografia para SIGILO, não assinatura!',
    upvotes: 37,
    replies: [],
  },
  {
    id: 'fp-801',
    questionId: 'Q-08',
    authorName: 'Fernanda Lima',
    authorTargetCareer: 'Analista Judiciário — TRF-3',
    createdAt: 'há 1 dia',
    category: 'jurisprudencia',
    content:
      'Detalhe importantíssimo na alternativa E: Decreto Autônomo (Art. 84, VI da CF: organização da administração sem aumento de despesa e extinção de funções/cargos públicos VAGOS) é ato normativo PRIMÁRIO. Se o Presidente usa decreto autônomo para extinguir cargo OCUPADO, ele viola diretamente a Constituição, cabendo ADI no STF!',
    upvotes: 25,
    replies: [],
  },
  {
    id: 'fp-1301',
    questionId: 'Q-13',
    authorName: 'Pedro Henrique',
    authorTargetCareer: 'Receita Federal',
    createdAt: 'há 6 horas',
    category: 'explicacao',
    isPinnedExplanation: true,
    content:
      'Para quem marcou 3/10 (Letra A): 36/120 seria a resposta se o enunciado NÃO tivesse dito "Sabendo-se que pelo menos 1 dos processos selecionados é de matéria tributária". Essa frase restringe o universo! Dos 120 trios totais, retiramos os C(6,3)=20 trios que só têm previdenciários. Sobram 100 trios possíveis no denominador. Logo: 36 / 100 = 9/25.',
    upvotes: 44,
    replies: [],
  },
];

export function computeAchievements(
  attempts: QuestionAttempt[],
  simulados: SimuladoResultRecord[],
  forumPosts: ForumThreadPost[],
  goals: StudyGoals,
  questionsAnsweredToday: number,
  questionsAnsweredThisWeek: number
): AchievementBadge[] {
  const totalQuestions = attempts.length;
  const correctQuestions = attempts.filter((a) => a.isCorreta).length;
  const globalAccuracy =
    totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;
  const totalSimulados = simulados.length;

  // Count user forum contributions (posts or replies authored by 'Você' or upvoted/participated)
  const userForumCount = forumPosts.reduce((acc, post) => {
    const isUserPost = post.authorName.includes('Você') ? 1 : 0;
    const userReplies = post.replies.filter((r) =>
      r.authorName.includes('Você')
    ).length;
    return acc + isUserPost + userReplies;
  }, 0);

  const highScoreSimulados = simulados.filter(
    (s) => s.percentualBruto >= 80
  ).length;

  const dailyGoalMet = questionsAnsweredToday >= goals.dailyQuestionsTarget;
  const weeklyGoalMet = questionsAnsweredThisWeek >= goals.weeklyQuestionsTarget;

  return [
    {
      id: 'badge-daily-goal',
      code: 'INS-01',
      title: 'Constância Diária Cumprida',
      description:
        'Atingiu 100% da meta diária de questões comentadas resolvidas.',
      category: 'metas',
      xpReward: 150,
      unlocked: dailyGoalMet || goals.streakDays >= 5,
      unlockedAt: 'Ativa no ciclo atual',
      progressCurrent: Math.min(
        questionsAnsweredToday,
        goals.dailyQuestionsTarget
      ),
      progressTarget: goals.dailyQuestionsTarget,
      unitLabel: 'questões hoje',
    },
    {
      id: 'badge-streak-7',
      code: 'INS-02',
      title: 'Ritmo de Edital Aberto',
      description:
        'Cumpre a meta semanal de volume de questões ou mantém 7 dias de ofensiva de estudo.',
      category: 'metas',
      xpReward: 300,
      unlocked: weeklyGoalMet || goals.streakDays >= 7,
      unlockedAt: weeklyGoalMet ? 'Conquistada nesta semana' : undefined,
      progressCurrent: Math.min(
        questionsAnsweredThisWeek,
        goals.weeklyQuestionsTarget
      ),
      progressTarget: goals.weeklyQuestionsTarget,
      unitLabel: 'questões/semana',
    },
    {
      id: 'badge-simulado-5',
      code: 'INS-03',
      title: 'Veterano de Prova Objetiva',
      description:
        'Concluiu pelo menos 5 simulados cronometrados com diagnóstico completo de desempenho.',
      category: 'simulados',
      xpReward: 400,
      unlocked: totalSimulados >= 5,
      unlockedAt: totalSimulados >= 5 ? '28 Set 2026' : undefined,
      progressCurrent: Math.min(totalSimulados, 5),
      progressTarget: 5,
      unitLabel: 'simulados concluídos',
    },
    {
      id: 'badge-corte-80',
      code: 'INS-04',
      title: 'Acima da Nota de Corte (80%+)',
      description:
        'Alcançou aproveitamento bruto igual ou superior a 80% em um simulado completo.',
      category: 'precisao',
      xpReward: 500,
      unlocked: highScoreSimulados >= 1 || globalAccuracy >= 80,
      unlockedAt: highScoreSimulados >= 1 ? 'Desbloqueada' : undefined,
      progressCurrent: Math.min(
        Math.max(
          globalAccuracy,
          ...simulados.map((s) => s.percentualBruto),
          0
        ),
        80
      ),
      progressTarget: 80,
      unitLabel: '% de precisão máxima',
    },
    {
      id: 'badge-forum-contributor',
      code: 'INS-05',
      title: 'Doutrinador da Comunidade',
      description:
        'Publicou uma dúvida, mnemônico ou explicação fundamentada no Fórum de Questões.',
      category: 'comunidade',
      xpReward: 250,
      unlocked: userForumCount >= 1,
      unlockedAt: userForumCount >= 1 ? 'Desbloqueada hoje' : undefined,
      progressCurrent: Math.min(userForumCount, 1),
      progressTarget: 1,
      unitLabel: 'contribuição publicada',
    },
    {
      id: 'badge-cebraspe-tactician',
      code: 'INS-06',
      title: 'Estrategista Líquido CEBRASPE',
      description:
        'Realizou simulado no padrão CEBRASPE (1 errada anula 1 certa) mantendo saldo líquido positivo acima de 60%.',
      category: 'simulados',
      xpReward: 350,
      unlocked: simulados.some(
        (s) => s.regraPontuacao === 'cebraspe_liquida' && s.percentualLiquido >= 60
      ),
      unlockedAt: '04 Set 2026',
      progressCurrent: 1,
      progressTarget: 1,
      unitLabel: 'bateria líquida aprovada',
    },
  ];
}
