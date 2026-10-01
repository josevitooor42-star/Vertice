export type Banca = 'CEBRASPE' | 'FGV' | 'FCC' | 'VUNESP' | 'CESGRANRIO';

export type Disciplina =
  | 'Direito Constitucional'
  | 'Direito Administrativo'
  | 'Língua Portuguesa'
  | 'Raciocínio Lógico'
  | 'Direito Tributário & AFO'
  | 'Informática & TI';

export type Dificuldade = 'Fácil' | 'Média' | 'Difícil';

export type ModalidadeQuestao = 'multipla_escolha' | 'certo_errado';

export type NivelConfianca = 'certeza' | 'duvida' | 'chute';

export type MotivoErro =
  | 'lacuna_teorica'
  | 'pegadinha_banca'
  | 'falta_atencao'
  | 'jurisprudencia'
  | 'tempo_insuficiente';

export interface AlternativaQuestao {
  letra: string;
  rotulo?: string;
  texto: string;
  isCorreta: boolean;
  isPegadinha?: boolean;
  comentarioEspecifico: string;
  taxaMarcacaoComunidade: number;
}

export interface ComentarioEstruturado {
  resumoTeorico: string;
  fundamentoLegal: string;
  jurisprudenciaOuDoutrina: string;
  pegadinhaDaBanca: string;
  dicaDeMemorizacao: string;
}

export interface Question {
  id: string;
  codigo: string;
  banca: Banca;
  ano: number;
  orgao: string;
  cargo: string;
  disciplina: Disciplina;
  assunto: string;
  dificuldade: Dificuldade;
  modalidade: ModalidadeQuestao;
  textoApoio?: string;
  enunciado: string;
  palavrasChave: string[];
  alternativas: AlternativaQuestao[];
  gabarito: string;
  comentario: ComentarioEstruturado;
  estatisticasComunidade: {
    totalRespostas: number;
    taxaAcertoGeral: number;
    tempoMedioSegundos: number;
  };
}

export interface QuestionAttempt {
  id: string;
  questionId: string;
  simuladoId?: string;
  respostaUsuario: string | null;
  isCorreta: boolean;
  emBranco: boolean;
  confianca: NivelConfianca;
  tempoGastoSegundos: number;
  timestamp: string;
  motivoErro?: MotivoErro;
}

export interface UserQuestionNote {
  questionId: string;
  cadernos: string[];
  anotacaoPessoal: string;
  motivoErroRegistrado?: MotivoErro;
  nivelDominio: 'critico' | 'em_revisao' | 'dominado';
  ultimaAtualizacao: string;
}

export interface SimuladoBlueprint {
  id: string;
  titulo: string;
  subtitulo: string;
  bancaPrincipal: Banca | 'MISTA';
  carreiraAlvo: string;
  modalidade: ModalidadeQuestao | 'mista';
  regraPontuacao: 'bruta' | 'cebraspe_liquida';
  tempoLimiteMinutos: number;
  notaCorteReferencia: number;
  questionIds: string[];
  isCustom?: boolean;
  filtrosUsados?: {
    disciplinas: Disciplina[];
    bancas: Banca[];
    dificuldades: Dificuldade[];
  };
}

export interface SimuladoResultRecord {
  id: string;
  blueprintId: string;
  titulo: string;
  banca: string;
  dataRealizacao: string;
  modo: 'prova_real' | 'treino_comentado';
  regraPontuacao: 'bruta' | 'cebraspe_liquida';
  totalQuestoes: number;
  acertos: number;
  erros: number;
  emBranco: number;
  percentualBruto: number;
  percentualLiquido: number;
  tempoTotalSegundos: number;
  notaCorteReferencia: number;
  desempenhoPorDisciplina: {
    disciplina: Disciplina;
    total: number;
    acertos: number;
    erros: number;
    emBranco: number;
  }[];
  questionIds: string[];
}

export interface CarreiraMeta {
  id: string;
  nome: string;
  orgaoReferencia: string;
  bancaReferencia: Banca;
  notaCorteAlvo: number;
  tempoMedioAlvoSegundos: number;
  pesosDisciplinas: Record<Disciplina, number>;
}

// Community Forum Types (Dedicated Thread per Question)
export type ForumPostCategory =
  | 'duvida'
  | 'explicacao'
  | 'mnemonico'
  | 'jurisprudencia';

export interface ForumReply {
  id: string;
  authorName: string;
  authorTargetCareer: string;
  createdAt: string;
  content: string;
  upvotes: number;
  isUpvotedByUser?: boolean;
}

export interface ForumThreadPost {
  id: string;
  questionId: string;
  authorName: string;
  authorTargetCareer: string;
  createdAt: string;
  category: ForumPostCategory;
  content: string;
  upvotes: number;
  isUpvotedByUser?: boolean;
  isPinnedExplanation?: boolean;
  replies: ForumReply[];
}

// Goal-Setting & Reward System Types
export interface StudyGoals {
  dailyQuestionsTarget: number;
  weeklyQuestionsTarget: number;
  weeklySimuladosTarget: number;
  targetAccuracyPercent: number;
  streakDays: number;
  bonusXp: number;
}

export interface AchievementBadge {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'metas' | 'simulados' | 'precisao' | 'comunidade';
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progressCurrent: number;
  progressTarget: number;
  unitLabel: string;
}
