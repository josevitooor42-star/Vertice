import {
  Question,
  CarreiraMeta,
  SimuladoBlueprint,
  SimuladoResultRecord,
  QuestionAttempt,
  UserQuestionNote,
} from '../types/concursos';

export const CARREIRAS_META: CarreiraMeta[] = [
  {
    id: 'auditor-fiscal-rfb',
    nome: 'Auditor-Fiscal (Receita Federal & SEFAZ)',
    orgaoReferencia: 'RFB / SEFAZ-SP',
    bancaReferencia: 'FGV',
    notaCorteAlvo: 82,
    tempoMedioAlvoSegundos: 135,
    pesosDisciplinas: {
      'Direito Tributário & AFO': 2.0,
      'Direito Constitucional': 1.5,
      'Direito Administrativo': 1.5,
      'Língua Portuguesa': 1.5,
      'Raciocínio Lógico': 1.5,
      'Informática & TI': 1.5,
    },
  },
  {
    id: 'analista-judiciario-trf',
    nome: 'Analista Judiciário — Área Judiciária (TRF / TRT / STJ)',
    orgaoReferencia: 'TRF-3 / STJ / TSE',
    bancaReferencia: 'FCC',
    notaCorteAlvo: 80,
    tempoMedioAlvoSegundos: 120,
    pesosDisciplinas: {
      'Direito Constitucional': 2.0,
      'Direito Administrativo': 2.0,
      'Língua Portuguesa': 1.5,
      'Raciocínio Lógico': 1.0,
      'Direito Tributário & AFO': 1.0,
      'Informática & TI': 1.0,
    },
  },
  {
    id: 'policia-federal-agente',
    nome: 'Carreiras Policiais Federais (PF / PRF)',
    orgaoReferencia: 'Polícia Federal',
    bancaReferencia: 'CEBRASPE',
    notaCorteAlvo: 74,
    tempoMedioAlvoSegundos: 95,
    pesosDisciplinas: {
      'Informática & TI': 2.0,
      'Língua Portuguesa': 1.5,
      'Direito Administrativo': 1.5,
      'Direito Constitucional': 1.5,
      'Raciocínio Lógico': 1.5,
      'Direito Tributário & AFO': 1.0,
    },
  },
  {
    id: 'controle-externo-tcu',
    nome: 'Auditor Federal de Controle Externo (TCU / CGU / TCE)',
    orgaoReferencia: 'TCU / CGU',
    bancaReferencia: 'FGV',
    notaCorteAlvo: 78,
    tempoMedioAlvoSegundos: 130,
    pesosDisciplinas: {
      'Direito Administrativo': 2.0,
      'Direito Tributário & AFO': 2.0,
      'Direito Constitucional': 1.5,
      'Língua Portuguesa': 1.5,
      'Informática & TI': 1.5,
      'Raciocínio Lógico': 1.0,
    },
  },
];

export const QUESTIONS_BANK: Question[] = [
  {
    id: 'Q-01',
    codigo: 'VRT-2501',
    banca: 'FGV',
    ano: 2025,
    orgao: 'TCU',
    cargo: 'Auditor Federal de Controle Externo',
    disciplina: 'Direito Administrativo',
    assunto: 'Nova Lei de Licitações (Lei 14.133/2021)',
    dificuldade: 'Difícil',
    modalidade: 'multipla_escolha',
    enunciado:
      'O Ministério da Gestão planeja contratar serviços técnicos especializados de natureza predominantemente intelectual com profissional de notória especialização para treinamento e aperfeiçoamento de pessoal. Paralelamente, necessita adquirir peças de reposição originais de equipamento de inspeção aeroportuária junto ao fornecedor exclusivo. Nos termos da Lei nº 14.133/2021, assinale a afirmativa correta acerca da contratação direta.',
    palavrasChave: [
      'natureza predominantemente intelectual',
      'notória especialização',
      'treinamento e aperfeiçoamento de pessoal',
      'fornecedor exclusivo',
      'contratação direta',
    ],
    gabarito: 'B',
    alternativas: [
      {
        letra: 'A',
        texto:
          'Ambas as hipóteses configuram dispensa de licitação, sendo admitida a subcontratação integral do treinamento caso o profissional titular aprove o plano pedagógico.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. Não se trata de dispensa (Art. 75), mas sim de inexigibilidade de licitação (Art. 74, I e III, "f"). Além disso, o Art. 74, § 4º veda expressamente a subcontratação de empresas ou a atuação de profissionais distintos daqueles que tenham justificado a inexigibilidade.',
        taxaMarcacaoComunidade: 8,
      },
      {
        letra: 'B',
        texto:
          'Ambas as hipóteses ensejam inexigibilidade de licitação, sendo vedada, no caso do serviço técnico de notória especialização, a subcontratação de profissionais distintos daqueles que justificaram a inexigibilidade.',
        isCorreta: true,
        comentarioEspecifico:
          'Correta! A aquisição com fornecedor exclusivo (Art. 74, I) e a contratação de serviços técnicos especializados de natureza predominantemente intelectual com notória especialização para treinamento (Art. 74, III, "f") são hipóteses clássicas de inexigibilidade. O § 4º do Art. 74 proíbe a subcontratação de profissionais distintos dos que embasaram a notória especialização.',
        taxaMarcacaoComunidade: 61,
      },
      {
        letra: 'C',
        texto:
          'A aquisição com fornecedor exclusivo configura inexigibilidade, podendo a exclusividade ser demonstrada por carta de exclusividade emitida pelo próprio sindicato estadual sem restrição territorial, mas o treinamento exige pregão eletrônico.',
        isCorreta: false,
        isPegadinha: true,
        comentarioEspecifico:
          'Incorreta (Pegadinha da Banca). Muitos candidatos confundem porque a Lei 14.133/21 veda o pregão para serviços técnicos de natureza predominantemente intelectual (Art. 29, parágrafo único) e cabe inexigibilidade quando há notória especialização (Art. 74, III, "f").',
        taxaMarcacaoComunidade: 19,
      },
      {
        letra: 'D',
        texto:
          'O treinamento de pessoal configura inexigibilidade de licitação, inclusive para serviços de publicidade e divulgação institucional da campanha educativa.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. O Art. 74, III da Lei 14.133/2021 veda expressamente a inexigibilidade para serviços de publicidade e divulgação.',
        taxaMarcacaoComunidade: 7,
      },
      {
        letra: 'E',
        texto:
          'A contratação de fornecedor exclusivo é hipótese de licitação dispensada, e o treinamento exige obrigatoriamente a modalidade diálogo competitivo.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. Fornecedor exclusivo gera inviabilidade de competição (inexigibilidade, Art. 74, I), e não licitação dispensada (que se refere à alienação de bens no Art. 76).',
        taxaMarcacaoComunidade: 5,
      },
    ],
    comentario: {
      resumoTeorico:
        'Na Lei nº 14.133/2021, a inexigibilidade ocorre sempre que houver inviabilidade de competição (rol exemplificativo do Art. 74), enquanto a dispensa ocorre quando a competição é viável, mas a lei autoriza a contratação direta (rol taxativo do Art. 75).',
      fundamentoLegal:
        'Art. 74, incisos I e III, alínea "f", e § 4º da Lei nº 14.133/2021.',
      jurisprudenciaOuDoutrina:
        'O TCU consolidou entendimento (e a Lei 14.133 positivou) de que a "singularidade do objeto" não exige que apenas uma pessoa no mundo saiba fazer o serviço, mas sim que o serviço tenha natureza predominantemente intelectual e o contratado detenha notória especialização.',
      pegadinhaDaBanca:
        'A FGV costuma misturar os requisitos do Art. 74, § 4º (vedação à subcontratação na inexigibilidade por notória especialização) com a vedação absoluta de inexigibilidade para serviços de publicidade e divulgação.',
      dicaDeMemorizacao:
        'Inexigibilidade = Inviabilidade (Art. 74): Fornecedor Exclusivo (I), Artista Consagrado (II), Serviço Técnico Intelectual + Notória Especialização (III - vedado publicidade e vedado subcontratar terceiros), Credenciamento (IV) e Compra/Locação de Imóvel (V).',
    },
    estatisticasComunidade: {
      totalRespostas: 4820,
      taxaAcertoGeral: 61,
      tempoMedioSegundos: 128,
    },
  },
  {
    id: 'Q-02',
    codigo: 'VRT-2502',
    banca: 'CEBRASPE',
    ano: 2025,
    orgao: 'Polícia Federal',
    cargo: 'Agente de Polícia Federal',
    disciplina: 'Direito Constitucional',
    assunto: 'Direitos e Garantias Fundamentais (Art. 5º)',
    dificuldade: 'Média',
    modalidade: 'certo_errado',
    enunciado:
      'Julgue o item a seguir à luz da jurisprudência consolidada do Supremo Tribunal Federal acerca da inviolabilidade domiciliar (art. 5º, XI, da CF/88).\n\nA entrada forçada em domicílio sem mandado judicial é lícita, mesmo em período noturno, quando amparada em fundadas razões, devidamente justificadas a posteriori, que indiquem que dentro da casa ocorre situação de flagrante delito de crime permanente, sendo suficiente para configurar tais fundadas razões o recebimento de denúncia anônima detalhada aliado ao nervosismo do suspeito ao avistar a viatura policial.',
    palavrasChave: [
      'sem mandado judicial',
      'período noturno',
      'fundadas razões',
      'sendo suficiente',
      'denúncia anônima detalhada',
      'nervosismo do suspeito',
    ],
    gabarito: 'E',
    alternativas: [
      {
        letra: 'C',
        rotulo: 'Certo',
        texto: 'Certo',
        isCorreta: false,
        isPegadinha: true,
        comentarioEspecifico:
          'Incorreto (Pegadinha Clássica do Cebraspe!). A primeira metade do enunciado reproduz fielmente o Tema 280 do STF (que admite entrada sem mandado à noite em flagrante de crime permanente com fundadas razões justificadas a posteriori). Porém, o final do item está ERRADO: denúncia anônima e nervosismo do suspeito NÃO configuram, por si sós, fundadas razões!',
        taxaMarcacaoComunidade: 38,
      },
      {
        letra: 'E',
        rotulo: 'Errado',
        texto: 'Errado',
        isCorreta: true,
        comentarioEspecifico:
          'Gabarito: ERRADO. Segundo o STF e o STJ, nem a denúncia anônima isolada nem o mero nervosismo/fuga ao avistar a polícia bastam para caracterizar as "fundadas razões" (justa causa) exigidas para mitigar a inviolabilidade domiciliar sem mandado judicial.',
        taxaMarcacaoComunidade: 62,
      },
    ],
    comentario: {
      resumoTeorico:
        'A casa é asilo inviolável do indivíduo. Em caso de flagrante delito (especialmente em crimes permanentes como tráfico de drogas ou posse ilegal de arma), pode haver ingresso sem mandado judicial a qualquer hora (dia ou noite). Contudo, exige-se controle judicial a posteriori das "fundadas razões".',
      fundamentoLegal:
        'Art. 5º, XI da Constituição Federal de 1988.',
      jurisprudenciaOuDoutrina:
        'STF (Tema 280 de Repercussão Geral - RE 603.616) e STJ (HC 598.051/SP): A mera intuição policial, o nervosismo do abordado, o fato de o local ser conhecido como ponto de tráfico ou o recebimento de denúncia anônima sem diligências prévias que evidenciem o crime não legitimam a invasão domiciliar.',
      pegadinhaDaBanca:
        'O Cebraspe constrói um enunciado 80% verdadeiro citando a tese literal do Tema 280 do STF e insere no último período uma conclusão que contraria a jurisprudência restritiva sobre denúncia anônima + nervosismo.',
      dicaDeMemorizacao:
        'Denúncia anônima + Nervosismo ≠ Fundadas Razões. Sem diligência prévia que constate elementos objetivos externos, a prova colhida no domicílio é ilícita!',
    },
    estatisticasComunidade: {
      totalRespostas: 7310,
      taxaAcertoGeral: 62,
      tempoMedioSegundos: 84,
    },
  },
  {
    id: 'Q-03',
    codigo: 'VRT-2503',
    banca: 'FGV',
    ano: 2025,
    orgao: 'Receita Federal',
    cargo: 'Auditor-Fiscal da Receita Federal',
    disciplina: 'Língua Portuguesa',
    assunto: 'Sintaxe, Crase e Reescrita Semântica',
    dificuldade: 'Difícil',
    modalidade: 'multipla_escolha',
    textoApoio:
      'Considere o período original: "Caso a administração tributária não aperfeiçoe os mecanismos de fiscalização aduaneira, haverá retração na arrecadação federal."',
    enunciado:
      'Assinale a alternativa em que a reescrita do período preserva a correção gramatical e o sentido condicional negativo (conjunção "caso... não") do trecho original.',
    palavrasChave: [
      'preserva a correção gramatical',
      'sentido condicional negativo',
      'Caso a administração tributária não aperfeiçoe',
    ],
    gabarito: 'D',
    alternativas: [
      {
        letra: 'A',
        texto:
          'Conquanto a administração tributária aperfeiçoe os mecanismos de fiscalização aduaneira, haverá retração na arrecadação federal.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. "Conquanto" é conjunção concessiva (= embora), alterando completamente o sentido condicional do período original.',
        taxaMarcacaoComunidade: 11,
      },
      {
        letra: 'B',
        texto:
          'A menos que a administração tributária não aperfeiçoe os mecanismos de fiscalização aduaneira, haverá retração na arrecadação federal.',
        isCorreta: false,
        isPegadinha: true,
        comentarioEspecifico:
          'Incorreta (Pegadinha Clássica FGV!). A locução "a menos que" já carrega valor condicional NEGATIVO (= "se não"). Ao inserir outro "não" depois de "a menos que", cria-se uma dupla negação que inverte o sentido ("se ela aperfeiçoar, haverá retração").',
        taxaMarcacaoComunidade: 28,
      },
      {
        letra: 'C',
        texto:
          'Porquanto a administração tributária deixe de aperfeiçoar os mecanismos de fiscalização aduaneira, haverá retração na arrecadação federal.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. "Porquanto" é conjunção explicativa/causal (= porque, visto que), além de não se harmonizar com o modo subjuntivo "deixe".',
        taxaMarcacaoComunidade: 9,
      },
      {
        letra: 'D',
        texto:
          'Salvo se a administração tributária aperfeiçoar os mecanismos de fiscalização aduaneira, haverá retração na arrecadação federal.',
        isCorreta: true,
        comentarioEspecifico:
          'Correta! A locução "Salvo se" (assim como "A menos que" ou "Exceto se") equivale a "Se não / Caso não". Como ela já embute a negação, o verbo subsequente ("aperfeiçoar", no futuro do subjuntivo exigido pelo "se") fica na forma afirmativa, preservando exatamente a condição negativa original!',
        taxaMarcacaoComunidade: 46,
      },
      {
        letra: 'E',
        texto:
          'Desde que a administração tributária aperfeiçoe os mecanismos de fiscalização aduaneira, haverá retração na arrecadação federal.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. "Desde que" sem a partícula "não" expressa condição afirmativa, invertendo a relação lógica da frase original.',
        taxaMarcacaoComunidade: 6,
      },
    ],
    comentario: {
      resumoTeorico:
        'As locuções conjuntivas condicionais "a menos que", "a não ser que", "salvo se" e "exceto se" possuem valor semântico intrinsecamente negativo (equivalem a "se não" ou "caso não"). Portanto, ao substituir "Caso não + presente do subjuntivo" por "Salvo se + futuro do subjuntivo", retira-se o advérbio "não" para manter a equivalência semântica.',
      fundamentoLegal:
        'Sintaxe do Período Composto por Subordinação — Orações Subordinadas Adverbiais Condicionais.',
      jurisprudenciaOuDoutrina:
        'Bechara e Celso Cunha destacam a correlação verbal obrigatória: "Caso" exige Presente ou Imperfeito do Subjuntivo ("caso aperfeiçoe"); já "Se / Salvo se" exige Futuro do Subjuntivo ("salvo se aperfeiçoar").',
      pegadinhaDaBanca:
        'A FGV adora trocar "Caso não faça" por "A menos que não faça" (alternativa B). Lembre-se: "A menos que" + "não" gera dupla negação e inverte o sentido!',
      dicaDeMemorizacao:
        'Equação FGV: [Caso + NÃO + verbo] = [A menos que + verbo afirmativo] = [Salvo se + verbo afirmativo]. E jamais confunda "Conquanto" (Embora/Concessiva) com "Porquanto" (Porque/Causal-Explicativa).',
    },
    estatisticasComunidade: {
      totalRespostas: 5910,
      taxaAcertoGeral: 46,
      tempoMedioSegundos: 115,
    },
  },
  {
    id: 'Q-04',
    codigo: 'VRT-2504',
    banca: 'FCC',
    ano: 2025,
    orgao: 'TRF-3ª Região',
    cargo: 'Analista Judiciário — Área Judiciária',
    disciplina: 'Direito Administrativo',
    assunto: 'Improbidade Administrativa (Lei 8.429/1992)',
    dificuldade: 'Média',
    modalidade: 'multipla_escolha',
    enunciado:
      'De acordo com a Lei nº 8.429/1992, com a redação dada pela Lei nº 14.230/2021 e a jurisprudência do Supremo Tribunal Federal, a respeito da configuração e do regime sancionatório dos atos de improbidade administrativa, é correto afirmar que:',
    palavrasChave: [
      'Lei nº 8.429/1992',
      'Lei nº 14.230/2021',
      'configuração',
      'regime sancionatório',
      'correto afirmar',
    ],
    gabarito: 'A',
    alternativas: [
      {
        letra: 'A',
        texto:
          'A configuração de qualquer modalidade de ato de improbidade administrativa exige a comprovação de dolo específico, não mais subsistindo no ordenamento jurídico a modalidade culposa de lesão ao erário.',
        isCorreta: true,
        comentarioEspecifico:
          'Correta! A Lei 14.230/2021 extinguiu totalmente a modalidade culposa de improbidade administrativa (que antes existia no Art. 10 - lesão ao erário). Além disso, o Art. 1º, §§ 1º e 2º exigem o dolo específico (vontade livre e consciente de alcançar o resultado ilícito tipificado nos arts. 9º, 10 e 11).',
        taxaMarcacaoComunidade: 74,
      },
      {
        letra: 'B',
        texto:
          'O rol dos atos de improbidade que atentam contra os princípios da Administração Pública (art. 11) permanece meramente exemplificativo, bastando a violação genérica ao princípio da moralidade.',
        isCorreta: false,
        isPegadinha: true,
        comentarioEspecifico:
          'Incorreta (Pegadinha!). Antes de 2021, o Art. 11 tinha um caput aberto e exemplificativo. Com a Lei 14.230/2021, o rol do Art. 11 passou a ser TAXATIVO ("caracterizam-se por uma das seguintes condutas:"), enquanto os arts. 9º e 10 continuam exemplificativos.',
        taxaMarcacaoComunidade: 14,
      },
      {
        letra: 'C',
        texto:
          'O prazo prescricional da ação de improbidade administrativa passou a ser de 5 (cinco) anos, contados da data de cessação do vínculo do agente com o Poder Público.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. O novo prazo prescricional unificado (Art. 23) é de 8 (oito) anos, contados a partir da ocorrência do fato ou, no caso de infrações permanentes, do dia em que cessou a permanência.',
        taxaMarcacaoComunidade: 6,
      },
      {
        letra: 'D',
        texto:
          'A sanção de suspensão dos direitos políticos para atos que importam enriquecimento ilícito pode atingir até 20 (vinte) anos.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. O teto máximo de suspensão dos direitos políticos na Lei 8.429/92 (Art. 12, I) passou a ser de até 14 (catorze) anos para enriquecimento ilícito (e até 12 anos para lesão ao erário; não há suspensão de direitos políticos para o Art. 11).',
        taxaMarcacaoComunidade: 4,
      },
      {
        letra: 'E',
        texto:
          'A indisponibilidade de bens do réu independe da demonstração de perigo de dano (periculum in mora), sendo presumida a urgência, e abrange valores referentes a eventual multa civil.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. Com a reforma da Lei 14.230/2021 (Art. 16, §§ 3º e 10), a indisponibilidade de bens exige a demonstração concreta de perigo de dano irreparável (não é mais presumido o periculum in mora) e NÃO pode incidir sobre valores a título de multa civil.',
        taxaMarcacaoComunidade: 2,
      },
    ],
    comentario: {
      resumoTeorico:
        'A reforma da Lei de Improbidade Administrativa (Lei 14.230/2021) promoveu profundas alterações garantistas: 1) Exigência de dolo específico em todas as modalidades; 2) Taxatividade do Art. 11 (violação a princípios); 3) Prescrição unificada em 8 anos a partir do fato (com prescrição intercorrente de 4 anos); 4) Exigência de periculum in mora concreto para indisponibilidade de bens.',
      fundamentoLegal:
        'Art. 1º, §§ 1º a 3º; Art. 11, caput; Art. 12, incisos I a III; e Art. 23 da Lei nº 8.429/1992.',
      jurisprudenciaOuDoutrina:
        'No Tema 1199 de Repercussão Geral (ARE 843.989), o STF fixou que a revogação da modalidade culposa não retroage para desconstituir a coisa julgada, mas aplica-se aos processos em curso sem trânsito em julgado.',
      pegadinhaDaBanca:
        'Cuidado com o rol: Arts. 9º e 10 usam "notadamente" (exemplificativos), mas o Art. 11 (princípios) agora é estritamente TAXATIVO e não prevê mais suspensão de direitos políticos (apenas multa de até 24x a remuneração e proibição de contratar por até 4 anos).',
      dicaDeMemorizacao:
        'Prazos máximos de Suspensão de Direitos Políticos e Proibição de Contratar (14 - 12 - 4): Art. 9º (14 anos), Art. 10 (12 anos), Art. 11 (0 anos de suspensão política / 4 anos de proibição de contratar).',
    },
    estatisticasComunidade: {
      totalRespostas: 6410,
      taxaAcertoGeral: 74,
      tempoMedioSegundos: 98,
    },
  },
  {
    id: 'Q-05',
    codigo: 'VRT-2505',
    banca: 'CEBRASPE',
    ano: 2025,
    orgao: 'Polícia Federal',
    cargo: 'Perito / Agente Federal',
    disciplina: 'Raciocínio Lógico',
    assunto: 'Lógica Proposicional: Equivalência e Negação',
    dificuldade: 'Média',
    modalidade: 'certo_errado',
    enunciado:
      'Considere a proposição condicional P: "Se o servidor cumpre a meta trimestral, então recebe a gratificação de desempenho ou obtém promoção funcional".\n\nJulgue o item:\nA proposição "Se o servidor não recebe a gratificação de desempenho e não obtém promoção funcional, então ele não cumpre a meta trimestral" é logicamente equivalente à proposição P.',
    palavrasChave: [
      'Se o servidor cumpre',
      'então recebe',
      'ou obtém',
      'não recebe',
      'e não obtém',
      'logicamente equivalente',
    ],
    gabarito: 'C',
    alternativas: [
      {
        letra: 'C',
        rotulo: 'Certo',
        texto: 'Certo',
        isCorreta: true,
        comentarioEspecifico:
          'Gabarito: CERTO! Aplicou-se a Equivalência Contrapositiva: (A → (B v C)) equivale a ~(B v C) → ~A. Pela Lei de De Morgan, a negação de (B v C) é (~B ^ ~C), isto é: "não recebe a gratificação E não obtém promoção". Logo, (~B ^ ~C) → ~A está perfeita!',
        taxaMarcacaoComunidade: 68,
      },
      {
        letra: 'E',
        rotulo: 'Errado',
        texto: 'Errado',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreto. Muitos candidatos erram ao esquecer que, ao inverter a condicional na contrapositiva, o consequente composto "B ou C" deve ser negado usando De Morgan, trocando o "OU" pelo "E".',
        taxaMarcacaoComunidade: 32,
      },
    ],
    comentario: {
      resumoTeorico:
        'Existem duas equivalências fundamentais para a condicional (p → q): 1) Contrapositiva (~q → ~p): inverte-se a ordem e negam-se ambos os termos; 2) Disjunção inclusiva ("Regra do NEyMAr"): (~p v q), onde se nega a primeira e mantém a segunda trocando o "Se... então" por "ou".',
      fundamentoLegal:
        'Equivalência Contrapositiva (Transposição) combinada com a Primeira Lei de De Morgan: ~(B v C) ⇔ (~B ^ ~C).',
      jurisprudenciaOuDoutrina:
        'Seja A = "cumpre a meta", B = "recebe gratificação", C = "obtém promoção". Temos A → (B v C). Pela contrapositiva: ~(B v C) → ~A, que resulta em (~B ^ ~C) → ~A.',
      pegadinhaDaBanca:
        'A banca tenta induzir o candidato a achar que a presença do conectivo "E" ("não recebe E não obtém") torna o item uma negação da condicional em vez de uma equivalência. Cuidado: o "E" aparece aqui apenas dentro do antecedente por causa da Lei de De Morgan aplicada ao "OU"!',
      dicaDeMemorizacao:
        'Contrapositiva: Volta Negando Tudo! Como o segundo termo tinha um "OU", ao voltar negando, o "OU" vira "E" (De Morgan).',
    },
    estatisticasComunidade: {
      totalRespostas: 5120,
      taxaAcertoGeral: 68,
      tempoMedioSegundos: 105,
    },
  },
  {
    id: 'Q-06',
    codigo: 'VRT-2506',
    banca: 'FGV',
    ano: 2025,
    orgao: 'SEFAZ-SP',
    cargo: 'Auditor Fiscal da Receita Estadual',
    disciplina: 'Direito Tributário & AFO',
    assunto: 'Limitações ao Poder de Tributar: Princípio da Anterioridade',
    dificuldade: 'Difícil',
    modalidade: 'multipla_escolha',
    enunciado:
      'Em 15 de dezembro de 2025, foram publicadas três leis ordinárias federais e estaduais majorando alíquotas tributárias: (I) majoração da alíquota do Imposto sobre Produtos Industrializados (IPI); (II) majoração da alíquota do Imposto de Renda (IR); e (III) fixação da base de cálculo do IPVA para o exercício seguinte. À luz do texto constitucional, assinale a opção que indica corretamente a regra de anterioridade aplicável a cada uma dessas alterações.',
    palavrasChave: [
      '15 de dezembro',
      'majoração',
      'IPI',
      'Imposto de Renda (IR)',
      'base de cálculo do IPVA',
      'anterioridade',
    ],
    gabarito: 'C',
    alternativas: [
      {
        letra: 'A',
        texto:
          'O IPI tem cobrança imediata; o IR respeita apenas a anterioridade anual; e a base de cálculo do IPVA respeita ambas as anterioridades (anual e nonagesimal).',
        isCorreta: false,
        isPegadinha: true,
        comentarioEspecifico:
          'Incorreta (Pegadinha!). O IPI é exceção apenas à anterioridade anual, devendo respeitar a noventena (90 dias). Já a base de cálculo do IPVA (e do IPTU) é exceção à noventena, respeitando apenas a anterioridade anual!',
        taxaMarcacaoComunidade: 24,
      },
      {
        letra: 'B',
        texto:
          'Tanto o IPI quanto o IR respeitam apenas a anterioridade nonagesimal, podendo ser cobrados a partir de março de 2026.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. O Imposto de Renda (IR) é a situação oposta ao IPI: o IR respeita a anterioridade anual (1º de janeiro de 2026) e é exceção à anterioridade nonagesimal.',
        taxaMarcacaoComunidade: 12,
      },
      {
        letra: 'C',
        texto:
          'O IPI submete-se apenas à anterioridade nonagesimal; já o IR e a fixação da base de cálculo do IPVA submetem-se apenas à anterioridade anual, podendo ambos incidir já em 1º de janeiro de 2026.',
        isCorreta: true,
        comentarioEspecifico:
          'Correta! 1) O IPI é exceção à anterioridade de exercício (anual), mas sujeita-se à noventena; 2) O IR e a fixação da base de cálculo do IPVA e do IPTU são as três célebres exceções à anterioridade nonagesimal (Art. 150, § 1º, parte final da CF/88), submetendo-se apenas à anterioridade anual (podendo valer em 01/01/2026 mesmo publicados em 15/12/2025).',
        taxaMarcacaoComunidade: 54,
      },
      {
        letra: 'D',
        texto:
          'O IR submete-se a ambas as anterioridades; o IPI tem eficácia imediata por ser extrafiscal; e a base de cálculo do IPVA submete-se apenas à noventena.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. Os impostos extrafiscais de eficácia imediata (exceção às duas anterioridades) são II, IE, IOF e IEG (Imposto Extraordinário de Guerra). O IPI espera 90 dias, e o IR espera apenas virar o ano.',
        taxaMarcacaoComunidade: 6,
      },
      {
        letra: 'E',
        texto:
          'A fixação da base de cálculo do IPVA equivale à mera atualização monetária pelo índice oficial, tendo aplicação imediata na data da publicação.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. A fixação da base de cálculo do IPVA (alteração de planta/tabela venal acima da inflação) sujeita-se à anterioridade anual; o que tem aplicação imediata (segundo o STF) é apenas a correção monetária dentro dos índices oficiais de inflação (que sequer constitui majoração de tributo, Art. 97, § 2º do CTN).',
        taxaMarcacaoComunidade: 4,
      },
    ],
    comentario: {
      resumoTeorico:
        'A Constituição Federal estabelece como regra a dupla anterioridade: de exercício (Art. 150, III, "b") e nonagesimal/noventena (Art. 150, III, "c"). Contudo, o § 1º do Art. 150 traz exceções cirúrgicas que são cobradas em quase toda prova fiscal e de controle.',
      fundamentoLegal:
        'Art. 150, III, alíneas "b" e "c", e § 1º da Constituição Federal de 1988.',
      jurisprudenciaOuDoutrina:
        'Súmula 584 do STF (superada): Hoje é pacífico no STF que a majoração do IR publicada até 31 de dezembro vale a partir de 1º de janeiro do ano seguinte, sem precisar aguardar 90 dias.',
      pegadinhaDaBanca:
        'Não confunda a ALÍQUOTA do IPVA/IPTU (que respeita anual + 90 dias!) com a BASE DE CÁLCULO do IPVA/IPTU (que respeita APENAS a anual, dispensando os 90 dias).',
      dicaDeMemorizacao:
        'Exceções à Noventena (Só esperam 1º de Janeiro): IR + Base de Cálculo do IPVA + Base de Cálculo do IPTU. Exceções à Anual (Só esperam 90 dias): IPI + ICMS-Combustíveis + CIDE-Combustíveis + Contribuições Sociais.',
    },
    estatisticasComunidade: {
      totalRespostas: 4390,
      taxaAcertoGeral: 54,
      tempoMedioSegundos: 132,
    },
  },
  {
    id: 'Q-07',
    codigo: 'VRT-2507',
    banca: 'CEBRASPE',
    ano: 2025,
    orgao: 'Polícia Federal',
    cargo: 'Agente / Escrivão de Polícia Federal',
    disciplina: 'Informática & TI',
    assunto: 'Segurança da Informação: Criptografia e Assinatura Digital',
    dificuldade: 'Média',
    modalidade: 'certo_errado',
    enunciado:
      'Julgue o item a seguir, relativo a criptografia assimétrica e assinatura digital no âmbito da ICP-Brasil.\n\nPara assinar digitalmente um documento eletrônico garantindo autenticidade, integridade e não repúdio, o remetente aplica uma função hash sobre o documento e, em seguida, cifra o resumo criptográfico (hash) utilizando a chave pública do destinatário.',
    palavrasChave: [
      'assinar digitalmente',
      'autenticidade, integridade e não repúdio',
      'função hash',
      'chave pública do destinatário',
    ],
    gabarito: 'E',
    alternativas: [
      {
        letra: 'C',
        rotulo: 'Certo',
        texto: 'Certo',
        isCorreta: false,
        isPegadinha: true,
        comentarioEspecifico:
          'Incorreto (Pegadinha Clássica!). Na ASSINATURA DIGITAL, o remetente cifra o hash com a sua PRÓPRIA CHAVE PRIVADA (e o destinatário confere usando a chave pública do remetente). Usar a chave pública do destinatário serve para CONFIDENCIALIDADE (criptografar a mensagem para que só o destinatário leia), e não para assinar!',
        taxaMarcacaoComunidade: 29,
      },
      {
        letra: 'E',
        rotulo: 'Errado',
        texto: 'Errado',
        isCorreta: true,
        comentarioEspecifico:
          'Gabarito: ERRADO. Na assinatura digital, o hash do documento é cifrado com a CHAVE PRIVADA DO REMETENTE (autor da assinatura), e não com a chave pública do destinatário.',
        taxaMarcacaoComunidade: 71,
      },
    ],
    comentario: {
      resumoTeorico:
        'A criptografia assimétrica utiliza um par de chaves matematicamente vinculadas (Pública e Privada). A forma de uso depende do objetivo de segurança:\n1) Assinatura Digital (Autenticidade + Integridade + Não Repúdio): Remetente assina o hash com sua Chave PRIVADA -> Destinatário valida com a Chave PÚBLICA do remetente.\n2) Sigilo / Confidencialidade: Remetente cifra com a Chave PÚBLICA do destinatário -> Destinatário decifra com sua Chave PRIVADA.',
      fundamentoLegal:
        'Conceitos da ICP-Brasil (MP nº 2.200-2/2001 e Lei nº 14.063/2020) e Arquitetura PKI (Public Key Infrastructure).',
      jurisprudenciaOuDoutrina:
        'Importante lembrar também que a assinatura digital em si NÃO garante confidencialidade (sigilo) do documento, pois o documento continua legível se não for cifrado separadamente.',
      pegadinhaDaBanca:
        'O Cebraspe adora inverter as chaves (trocar Chave Privada do Remetente por Chave Pública do Destinatário) ou afirmar que a assinatura digital garante "confidencialidade".',
      dicaDeMemorizacao:
        'ASSINATURA = É pessoal e intransferível = Usa a MINHA CHAVE PRIVADA. SIGILO = Quero trancar no cofre do destinatário = Uso a CHAVE PÚBLICA DO DESTINATÁRIO.',
    },
    estatisticasComunidade: {
      totalRespostas: 6890,
      taxaAcertoGeral: 71,
      tempoMedioSegundos: 68,
    },
  },
  {
    id: 'Q-08',
    codigo: 'VRT-2508',
    banca: 'FCC',
    ano: 2025,
    orgao: 'STJ',
    cargo: 'Analista Judiciário',
    disciplina: 'Direito Constitucional',
    assunto: 'Controle de Constitucionalidade (ADI, ADC e ADPF)',
    dificuldade: 'Difícil',
    modalidade: 'multipla_escolha',
    enunciado:
      'Determinado partido político com representação na Câmara dos Deputados pretende questionar, perante o Supremo Tribunal Federal, a validade de: (I) uma lei ordinária municipal de 2023 que contraria frontalmente preceito fundamental da Constituição Federal; e (II) um decreto autônomo federal editado pelo Presidente da República em 2024 para dispor sobre extinção de cargos públicos vagos, mas que extrapolou os limites constitucionais ao extinguir cargos ocupados. As ações de controle concentrado cabíveis no STF para impugnar os atos (I) e (II) são, respectivamente:',
    palavrasChave: [
      'partido político',
      'lei ordinária municipal',
      'decreto autônomo federal',
      'cargos ocupados',
      'respectivamente',
    ],
    gabarito: 'E',
    alternativas: [
      {
        letra: 'A',
        texto:
          'Ação Direta de Inconstitucionalidade (ADI) e Arguição de Descumprimento de Preceito Fundamental (ADPF).',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. Não cabe ADI no STF contra lei municipal (o Art. 102, I, "a" da CF restringe a ADI a lei ou ato normativo federal ou estadual).',
        taxaMarcacaoComunidade: 10,
      },
      {
        letra: 'B',
        texto:
          'Arguição de Descumprimento de Preceito Fundamental (ADPF) para ambos os atos, visto que decreto presidencial nunca pode ser objeto de ADI.',
        isCorreta: false,
        isPegadinha: true,
        comentarioEspecifico:
          'Incorreta (Pegadinha!). Embora decretos meramente regulamentares não caibam em ADI (por gerarem crise de legalidade reflexa), o DECRETO AUTÔNOMO (Art. 84, VI da CF) retira seu fundamento diretamente da Constituição, sendo ato normativo primário passível de ADI!',
        taxaMarcacaoComunidade: 26,
      },
      {
        letra: 'C',
        texto:
          'Ação Declaratória de Constitucionalidade (ADC) e Ação Direta de Inconstitucionalidade (ADI).',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. A ADC só cabe para confirmar a constitucionalidade de lei ou ato normativo FEDERAL, jamais municipal.',
        taxaMarcacaoComunidade: 3,
      },
      {
        letra: 'D',
        texto:
          'Recurso Extraordinário direto e Mandado de Segurança Coletivo, por ausência de pertinência temática do partido político.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. Partido político com representação no Congresso Nacional é legitimado UNIVERSAL (Art. 103, VIII da CF), não se lhe exigindo demonstração de pertinência temática.',
        taxaMarcacaoComunidade: 5,
      },
      {
        letra: 'E',
        texto:
          'Arguição de Descumprimento de Preceito Fundamental (ADPF) e Ação Direta de Inconstitucionalidade (ADI).',
        isCorreta: true,
        comentarioEspecifico:
          'Correta! Contra lei municipal que fere preceito fundamental da CF/88 cabe ADPF no STF (princípio da subsidiariedade, Art. 1º, parágrafo único, I da Lei 9.882/99). Já contra decreto autônomo federal (ato normativo primário federal previsto no Art. 84, VI da CF) que viola diretamente a Constituição, cabe ADI!',
        taxaMarcacaoComunidade: 56,
      },
    ],
    comentario: {
      resumoTeorico:
        'No controle concentrado perante o STF:\n- ADI: Lei ou ato normativo FEDERAL ou ESTADUAL pós-1988 dotado de abstração, generalidade e autonomia primária (inclui decretos autônomos do Art. 84, VI da CF).\n- ADC: Apenas lei ou ato normativo FEDERAL pós-1988.\n- ADPF: Caráter subsidiário, alcançando leis MUNICIPAIS e normas PRÉ-CONSTITUCIONAIS (anteriores a 05/10/1988).',
      fundamentoLegal:
        'Art. 102, I, "a" e § 1º; Art. 84, VI, "b" da CF/88; Lei nº 9.868/1999 e Lei nº 9.882/1999.',
      jurisprudenciaOuDoutrina:
        'O STF diferencia o decreto regulamentar (secundário, cuja extrapolação gera ilegalidade e não cabe ADI) do decreto autônomo (primário, fundado diretamente no Art. 84, VI da CF, contra o qual cabe ADI).',
      pegadinhaDaBanca:
        'Candidatos decoram "não cabe ADI contra decreto" e esquecem da exceção clássica do Decreto Autônomo (organização administrativa sem aumento de despesa e extinção de funções/cargos vagos).',
      dicaDeMemorizacao:
        'Lei Municipal ou Direito Pré-88 no STF = Só vai de ADPF! Decreto Autônomo = Tem status de lei (ato primário) = Vai de ADI!',
    },
    estatisticasComunidade: {
      totalRespostas: 5240,
      taxaAcertoGeral: 56,
      tempoMedioSegundos: 122,
    },
  },
  {
    id: 'Q-09',
    codigo: 'VRT-2509',
    banca: 'CESGRANRIO',
    ano: 2024,
    orgao: 'CNU — Concurso Nacional Unificado',
    cargo: 'Especialista em Políticas Públicas e Gestão Governamental',
    disciplina: 'Direito Tributário & AFO',
    assunto: 'Orçamento Público: Créditos Adicionais e Restos a Pagar',
    dificuldade: 'Média',
    modalidade: 'multipla_escolha',
    enunciado:
      'Durante a execução da Lei Orçamentária Anual (LOA), o Poder Executivo verificou a necessidade urgente e imprevista de custear ações de defesa civil decorrentes de calamidade pública estadual reconhecida pelo Congresso Nacional, para a qual não havia dotação orçamentária específica. Nos termos da Constituição Federal e da Lei nº 4.320/1964, o instrumento adequado para atender a essa despesa é o crédito adicional:',
    palavrasChave: [
      'urgente e imprevista',
      'calamidade pública',
      'não havia dotação orçamentária específica',
      'crédito adicional',
    ],
    gabarito: 'D',
    alternativas: [
      {
        letra: 'A',
        texto:
          'Suplementar, aberto por decreto executivo após prévia autorização legislativa e indicação obrigatória da fonte de anulação de despesa.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. O crédito suplementar destina-se ao reforço de dotação orçamentária JÁ existente na LOA, e não a despesas urgentes e imprevistas sem dotação.',
        taxaMarcacaoComunidade: 9,
      },
      {
        letra: 'B',
        texto:
          'Especial, aberto por medida provisória, cuja vigência é restrita ao exercício financeiro em que for aberto, ainda que publicado em dezembro.',
        isCorreta: false,
        isPegadinha: true,
        comentarioEspecifico:
          'Incorreta (Pegadinha!). Despesa sem dotação específica em condições normais pede crédito especial (autorizado por lei), mas quando é URGENTE E IMPREVISÍVEL (guerra, comoção interna ou calamidade pública), cabe o crédito EXTRAORDINÁRIO.',
        taxaMarcacaoComunidade: 17,
      },
      {
        letra: 'C',
        texto:
          'Extraordinário, que depende de prévia autorização legislativa e da indicação obrigatória de superávit financeiro apurado em balanço patrimonial.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. O crédito extraordinário é o único que independe de autorização legislativa prévia (é aberto diretamente por Medida Provisória na esfera federal) e independe da indicação prévia da fonte de recursos.',
        taxaMarcacaoComunidade: 11,
      },
      {
        letra: 'D',
        texto:
          'Extraordinário, que pode ser aberto por medida provisória sem necessidade de indicação prévia da fonte de recursos, podendo ser reaberto no exercício seguinte nos limites de seu saldo se promulgado nos últimos quatro meses do exercício.',
        isCorreta: true,
        comentarioEspecifico:
          'Correta! Conforme o Art. 167, §§ 2º e 3º da CF/88, despesas imprevisíveis e urgentes (guerra, comoção interna ou calamidade pública) autorizam a abertura de crédito extraordinário por medida provisória. Além disso, créditos especiais e extraordinários abertos nos últimos 4 meses do ano (setembro a dezembro) podem ser reabertos no exercício seguinte nos limites de seus saldos!',
        taxaMarcacaoComunidade: 59,
      },
      {
        letra: 'E',
        texto:
          'Suplementar extraordinário, cuja vigência plurianual prescinde de incorporação ao orçamento do exercício subsequente.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. Não existe a figura de "crédito suplementar extraordinário" na Lei 4.320/1964.',
        taxaMarcacaoComunidade: 4,
      },
    ],
    comentario: {
      resumoTeorico:
        'Os Créditos Adicionais dividem-se em:\n1) Suplementares: Reforço de dotação já existente (exige autorização em lei + indicação de recursos; vigência restrita ao ano em que aberto).\n2) Especiais: Despesas para as quais NÃO haja dotação específica (exige lei específica + recursos; se aberto nos últimos 4 meses, reabre no ano seguinte).\n3) Extraordinários: Despesas imprevisíveis e urgentes (guerra, comoção, calamidade). Aberto por MP; dispensa indicação prévia de recursos; se aberto nos últimos 4 meses, reabre no ano seguinte.',
      fundamentoLegal:
        'Art. 167, inciso V e §§ 2º e 3º da CF/88; Arts. 40 a 45 da Lei nº 4.320/1964.',
      jurisprudenciaOuDoutrina:
        'O STF exerce controle jurisdicional sobre os requisitos constitucionais de "imprevisibilidade e urgência" da Medida Provisória que abre crédito extraordinário (ADI 4.048).',
      pegadinhaDaBanca:
        'As bancas tentam fazer o candidato marcar "Crédito Especial" só porque o enunciado diz "para a qual não havia dotação orçamentária específica". Porém, havendo calamidade pública (urgência + imprevisibilidade), prevalece o Crédito Extraordinário!',
      dicaDeMemorizacao:
        'Quais reabrem no ano seguinte se abertos nos últimos 4 meses (Set-Out-Nov-Dez)? Apenas os "E": Especial e Extraordinário! O Suplementar NUNCA passa para o ano seguinte.',
    },
    estatisticasComunidade: {
      totalRespostas: 4150,
      taxaAcertoGeral: 59,
      tempoMedioSegundos: 112,
    },
  },
  {
    id: 'Q-10',
    codigo: 'VRT-2510',
    banca: 'VUNESP',
    ano: 2025,
    orgao: 'TJ-SP',
    cargo: 'Escrevente Técnico Judiciário',
    disciplina: 'Língua Portuguesa',
    assunto: 'Emprego do Sinal Indicativo de Crase e Regência',
    dificuldade: 'Média',
    modalidade: 'multipla_escolha',
    enunciado:
      'Assinale a alternativa em que o sinal indicativo de crase está empregado em estrita conformidade com a norma-padrão da língua portuguesa.',
    palavrasChave: [
      'sinal indicativo de crase',
      'estrita conformidade',
      'norma-padrão',
    ],
    gabarito: 'A',
    alternativas: [
      {
        letra: 'A',
        texto:
          'O magistrado fez menção àquela jurisprudência consolidada e determinou o retorno dos autos à 3ª Vara Cível até as 17 horas.',
        isCorreta: true,
        comentarioEspecifico:
          'Correta! 1) Quem faz menção, faz menção "a" algo + "aquela" = "àquela" (crase obrigatória); 2) Retorno "a" + "a 3ª Vara Cível" = "à 3ª Vara Cível"; 3) "até as 17 horas": após a preposição "até", a crase antes de horas ou palavra feminina é FACULTATIVA ("até as 17h" ou "até às 17h" estão ambas corretas!).',
        taxaMarcacaoComunidade: 52,
      },
      {
        letra: 'B',
        texto:
          'As intimações foram remetidas à Vossa Excelência logo após à audiência de instrução.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. Duplo erro: não ocorre crase antes de pronomes de tratamento ("a Vossa Excelência") nem após a preposição "após" ("após a audiência").',
        taxaMarcacaoComunidade: 8,
      },
      {
        letra: 'C',
        texto:
          'Os peritos ficaram cara à cara com os litigantes e responderam à todas as impugnações técnicas.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. Não ocorre crase em locuções com palavras repetidas ("cara a cara", "frente a frente", "gota a gota") nem antes do pronome indefinido "todas" ("a todas as impugnações").',
        taxaMarcacaoComunidade: 10,
      },
      {
        letra: 'D',
        texto:
          'A certidão referia-se à uma decisão interlocutória proferida daqui à duas semanas.',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. Não ocorre crase antes do artigo indefinido "uma" nem antes de numeral cardinal que não indique horas ("daqui a duas semanas").',
        taxaMarcacaoComunidade: 9,
      },
      {
        letra: 'E',
        texto:
          'O servidor dirigiu-se à Brasília para entregar o relatório técnico à diretora-geral.',
        isCorreta: false,
        isPegadinha: true,
        comentarioEspecifico:
          'Incorreta (Pegadinha!). "Quem vai a Brasília, volta DE Brasília" (não aceita artigo "a", logo não tem crase em "dirigiu-se a Brasília"). Só haveria crase se "Brasília" estivesse especificada ("à Brasília dos anos 60").',
        taxaMarcacaoComunidade: 21,
      },
    ],
    comentario: {
      resumoTeorico:
        'A crase é a fusão da preposição "a" com o artigo definido "a(s)" ou com o "a" inicial dos pronomes demonstrativos "aquele(s), aquela(s), aquilo". É importante dominar tanto os casos proibidos quanto os três casos facultativos.',
      fundamentoLegal:
        'Regência Verbal/Nominal e Emprego do Acento Grave (Norma-Padrão).',
      jurisprudenciaOuDoutrina:
        'Casos de Crase Facultativa ("ATÉ MINHA MARIA"): 1) Após a preposição "ATÉ" (até a / até à); 2) Antes de pronome possessivo feminino adjetivo (a minha / à minha); 3) Antes de nomes próprios femininos (a Maria / à Maria).',
      pegadinhaDaBanca:
        'Muitos candidatos descartam a alternativa A por acharem que antes de horas ("17 horas") a crase seria sempre obrigatória. Mas há a preposição "ATÉ" antes de "as 17 horas", tornando a crase facultativa!',
      dicaDeMemorizacao:
        'Para topônimos (nomes de lugares): "Vou a, volto DA, crase HÁ! Vou a, volto DE, crase PRA QUÊ?" (Volto de Brasília -> sem crase; Volto da Bahia -> com crase).',
    },
    estatisticasComunidade: {
      totalRespostas: 6180,
      taxaAcertoGeral: 52,
      tempoMedioSegundos: 88,
    },
  },
  {
    id: 'Q-11',
    codigo: 'VRT-2511',
    banca: 'CEBRASPE',
    ano: 2025,
    orgao: 'TCU / CGU',
    cargo: 'Auditor Federal',
    disciplina: 'Direito Administrativo',
    assunto: 'Responsabilidade Civil do Estado (Art. 37, § 6º da CF/88)',
    dificuldade: 'Difícil',
    modalidade: 'certo_errado',
    enunciado:
      'Julgue o item a seguir conforme a tese de repercussão geral fixada pelo Supremo Tribunal Federal acerca da responsabilidade civil extracontratual do Estado e de seus agentes.\n\nO particular que sofrer dano causado por servidor público no exercício de suas funções poderá, a seu critério, ajuizar ação de indenização diretamente contra o Estado, diretamente contra o servidor causador do dano ou contra ambos em litisconsórcio passivo facultativo, observado que, contra o servidor, caberá ao autor comprovar o dolo ou a culpa.',
    palavrasChave: [
      'a seu critério',
      'diretamente contra o servidor',
      'litisconsórcio passivo facultativo',
    ],
    gabarito: 'E',
    alternativas: [
      {
        letra: 'C',
        rotulo: 'Certo',
        texto: 'Certo',
        isCorreta: false,
        isPegadinha: true,
        comentarioEspecifico:
          'Incorreto (Pegadinha Clássica!). Essa era uma antiga posição do STJ, mas foi superada pelo STF no Tema 940 de Repercussão Geral (Teoria da Dupla Garantia). A vítima NÃO pode processar diretamente o servidor público!',
        taxaMarcacaoComunidade: 27,
      },
      {
        letra: 'E',
        rotulo: 'Errado',
        texto: 'Errado',
        isCorreta: true,
        comentarioEspecifico:
          'Gabarito: ERRADO. Pela Tese da Dupla Garantia (Tema 940 do STF), a ação por danos causados por agente público deve ser ajuizada EXCLUSIVAMENTE contra o Estado ou a pessoa jurídica de direito privado prestadora de serviço público, sendo parte ilegítima para a ação o autor do ato, assegurado o direito de regresso contra o responsável nos casos de dolo ou culpa.',
        taxaMarcacaoComunidade: 73,
      },
    ],
    comentario: {
      resumoTeorico:
        'O Art. 37, § 6º da CF/88 consagra a "Dupla Garantia": 1ª garantia em prol do particular lesado (que aciona o Estado sob responsabilidade objetiva, sem precisar provar dolo ou culpa); 2ª garantia em prol do agente público (que somente responde administrativamente ou em ação regressiva perante o Estado, jamais diretamente perante a vítima na esfera cível).',
      fundamentoLegal:
        'Art. 37, § 6º da Constituição Federal de 1988.',
      jurisprudenciaOuDoutrina:
        'STF, Tema 940 de Repercussão Geral (RE 1.027.633): "A teor do disposto no art. 37, § 6º, da Constituição Federal, a ação por danos causados por agente público deve ser ajuizada contra o Estado ou a pessoa jurídica de direito privado prestadora de serviço público, sendo parte ilegítima para a ação o autor do ato, assegurado o direito de regresso contra o responsável nos casos de dolo ou culpa."',
      pegadinhaDaBanca:
        'O enunciado adiciona "observado que, contra o servidor, caberá ao autor comprovar o dolo ou a culpa" para parecer ponderado e técnico, induzindo o candidato ao erro.',
      dicaDeMemorizacao:
        'Tema 940 STF = Tese da Dupla Garantia = Vítima NUNCA processa o servidor diretamente ("por salto"). Vítima → Estado (Objetiva) → Servidor em Regresso (Subjetiva).',
    },
    estatisticasComunidade: {
      totalRespostas: 6540,
      taxaAcertoGeral: 73,
      tempoMedioSegundos: 75,
    },
  },
  {
    id: 'Q-12',
    codigo: 'VRT-2512',
    banca: 'FGV',
    ano: 2025,
    orgao: 'Receita Federal',
    cargo: 'Analista-Tributário / Auditor-Fiscal',
    disciplina: 'Informática & TI',
    assunto: 'Banco de Dados Relacional, SQL e Normalização',
    dificuldade: 'Média',
    modalidade: 'multipla_escolha',
    enunciado:
      'Um auditor fiscal precisa extrair da tabela AUTUACOES (colunas: ID_AUTO, CNPJ, UF, VALOR_MULTA, ANO) a soma total de VALOR_MULTA por UF apenas para os autos lavrados a partir do ano de 2024, exibindo no resultado final somente as Unidades da Federação cuja soma das multas ultrapasse R$ 5.000.000,00, ordenadas da maior soma para a menor. A consulta SQL ANSI correta para essa operação é:',
    palavrasChave: [
      'soma total',
      'por UF',
      'a partir do ano de 2024',
      'cuja soma das multas ultrapasse',
      'da maior soma para a menor',
    ],
    gabarito: 'C',
    alternativas: [
      {
        letra: 'A',
        texto:
          'SELECT UF, SUM(VALOR_MULTA) FROM AUTUACOES WHERE ANO >= 2024 AND SUM(VALOR_MULTA) > 5000000 GROUP BY UF ORDER BY SUM(VALOR_MULTA) DESC;',
        isCorreta: false,
        isPegadinha: true,
        comentarioEspecifico:
          'Incorreta (Pegadinha Clássica SQL!). A cláusula WHERE filtra linhas individuais ANTES do agrupamento e jamais aceita funções de agregação como SUM(), AVG() ou COUNT(). O filtro pós-agrupamento deve ser feito com HAVING!',
        taxaMarcacaoComunidade: 22,
      },
      {
        letra: 'B',
        texto:
          'SELECT UF, SUM(VALOR_MULTA) FROM AUTUACOES GROUP BY UF HAVING ANO >= 2024 AND SUM(VALOR_MULTA) > 5000000 ORDER BY SUM(VALOR_MULTA) ASC;',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. A coluna ANO não faz parte do GROUP BY nem está em função de agregação (deve ficar no WHERE), e ASC ordena do menor para o maior (o enunciado pediu da maior para a menor = DESC).',
        taxaMarcacaoComunidade: 8,
      },
      {
        letra: 'C',
        texto:
          'SELECT UF, SUM(VALOR_MULTA) FROM AUTUACOES WHERE ANO >= 2024 GROUP BY UF HAVING SUM(VALOR_MULTA) > 5000000 ORDER BY SUM(VALOR_MULTA) DESC;',
        isCorreta: true,
        comentarioEspecifico:
          'Correta! 1) WHERE ANO >= 2024 filtra os registros antes de agrupar; 2) GROUP BY UF agrupa por estado; 3) HAVING SUM(VALOR_MULTA) > 5000000 filtra os grupos cuja soma supera 5 milhões; 4) ORDER BY SUM(VALOR_MULTA) DESC ordena de forma decrescente.',
        taxaMarcacaoComunidade: 63,
      },
      {
        letra: 'D',
        texto:
          'SELECT UF, COUNT(VALOR_MULTA) FROM AUTUACOES WHERE ANO >= 2024 GROUP BY UF HAVING COUNT(VALOR_MULTA) > 5000000 ORDER BY 2 DESC;',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. A função COUNT() conta a quantidade de linhas, enquanto o enunciado pediu a soma dos valores monetários (SUM).',
        taxaMarcacaoComunidade: 4,
      },
      {
        letra: 'E',
        texto:
          'SELECT UF, SUM(VALOR_MULTA) FROM AUTUACOES HAVING ANO >= 2024 GROUP BY UF WHERE SUM(VALOR_MULTA) > 5000000 ORDER BY 2 DESC;',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. Inverteu completamente o papel e a ordem sintática do WHERE e do HAVING.',
        taxaMarcacaoComunidade: 3,
      },
    ],
    comentario: {
      resumoTeorico:
        'Em SQL, a ordem lógica e sintática de escrita de uma consulta é: SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY.\n- WHERE: Filtra tuplas (linhas) individuais antes do GROUP BY. Não admite funções de agregação.\n- HAVING: Filtra os grupos formados pelo GROUP BY com base no resultado de funções de agregação (SUM, COUNT, AVG, MIN, MAX).',
      fundamentoLegal:
        'Padrão ISO/IEC 9075 (SQL ANSI) — DQL (Data Query Language).',
      jurisprudenciaOuDoutrina:
        'Ordem de execução interna pelo SGBD: 1º FROM/JOIN -> 2º WHERE -> 3º GROUP BY -> 4º HAVING -> 5º SELECT -> 6º ORDER BY.',
      pegadinhaDaBanca:
        'Colocar `SUM(coluna) > valor` dentro do `WHERE` é a armadilha número 1 da FGV e do Cebraspe em provas de TI e Auditoria Fiscal.',
      dicaDeMemorizacao:
        'WHERE = Filtra Linhas (Antes do Grupo). HAVING = Filtra Funções Agregadas (Depois do GROUP BY).',
    },
    estatisticasComunidade: {
      totalRespostas: 4720,
      taxaAcertoGeral: 63,
      tempoMedioSegundos: 92,
    },
  },
  {
    id: 'Q-13',
    codigo: 'VRT-2513',
    banca: 'FGV',
    ano: 2025,
    orgao: 'TRF-1ª Região',
    cargo: 'Analista Judiciário',
    disciplina: 'Raciocínio Lógico',
    assunto: 'Probabilidade Condicional e Análise Combinatória',
    dificuldade: 'Difícil',
    modalidade: 'multipla_escolha',
    enunciado:
      'Em uma vara federal tramitam 10 processos prioritários, sendo 6 de matéria previdenciária e 4 de matéria tributária. Um analista seleciona, ao acaso e sem reposição, 3 desses processos para análise imediata. Sabendo-se que pelo menos 1 dos processos selecionados é de matéria tributária, qual é a probabilidade de que exatamente 2 dos processos selecionados sejam de matéria tributária?',
    palavrasChave: [
      '10 processos',
      '6 de matéria previdenciária',
      '4 de matéria tributária',
      'sem reposição, 3 desses processos',
      'Sabendo-se que pelo menos 1',
      'exatamente 2',
    ],
    gabarito: 'B',
    alternativas: [
      {
        letra: 'A',
        texto: '3/10',
        isCorreta: false,
        isPegadinha: true,
        comentarioEspecifico:
          'Incorreta (Pegadinha!). 36/120 = 3/10 é a probabilidade incondicional de escolher exatamente 2 tributários dentre todos os 120 trios possíveis. Mas o enunciado deu uma condição ("Sabendo-se que pelo menos 1 é tributário"), o que reduz o espaço amostral de 120 para 100!',
        taxaMarcacaoComunidade: 31,
      },
      {
        letra: 'B',
        texto: '9/25',
        isCorreta: true,
        comentarioEspecifico:
          'Correta! Total de combinações C(10,3) = 120. Casos sem nenhum tributário (todos previdenciários): C(6,3) = 20. Logo, o espaço amostral reduzido ("pelo menos 1 tributário") é 120 - 20 = 100. Casos favoráveis ("exatamente 2 tributários e 1 previdenciário"): C(4,2) × C(6,1) = 6 × 6 = 36. Probabilidade condicional = 36 / 100 = 9/25!',
        taxaMarcacaoComunidade: 44,
      },
      {
        letra: 'C',
        texto: '2/5',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. 40/100 = 2/5 seria a probabilidade de "pelo menos 2 tributários" (somando os 36 casos de exatamente 2 com os 4 casos de exatamente 3 tributários).',
        taxaMarcacaoComunidade: 14,
      },
      {
        letra: 'D',
        texto: '1/3',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. Resultado obtido por aproximação incorreta sem considerar a distribuição hipergeométrica.',
        taxaMarcacaoComunidade: 7,
      },
      {
        letra: 'E',
        texto: '5/6',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreta. 100/120 = 5/6 é apenas a probabilidade do evento condicionante ("pelo menos 1 tributário").',
        taxaMarcacaoComunidade: 4,
      },
    ],
    comentario: {
      resumoTeorico:
        'A probabilidade condicional P(A | B) = n(A ∩ B) / n(B) reduz o espaço amostral ao evento B que já sabemos ter ocorrido.\n1) Total de trios: C(10, 3) = (10 × 9 × 8) / 6 = 120.\n2) Evento B (pelo menos 1 tributário) = Total - (Nenhum tributário) = 120 - C(6, 3) = 120 - 20 = 100.\n3) Evento A ∩ B (exatamente 2 tributários e 1 previdenciário) = C(4, 2) × C(6, 1) = 6 × 6 = 36.\n4) P(A | B) = 36 / 100 = 9/25 (ou 36%).',
      fundamentoLegal:
        'Teorema da Probabilidade Condicional e Combinação Simples C(n, p) = n! / [p!(n-p)!].',
      jurisprudenciaOuDoutrina:
        'Sempre que a questão usar expressões como "Sabendo-se que...", "Dado que...", "Se a soma foi...", o denominador da probabilidade NÃO é mais o total geral, mas sim o total restrito à condição informada.',
      pegadinhaDaBanca:
        'A alternativa A (3/10 = 36/120) está pronta esperando quem calcula perfeitamente o numerador (36), mas divide pelo total geral (120) esquecendo a condição "Sabendo-se que pelo menos 1...".',
      dicaDeMemorizacao:
        '"Pelo menos 1" = Total menos Nenhum! E "Sabendo-se que" = Novo Denominador Restrito!',
    },
    estatisticasComunidade: {
      totalRespostas: 3980,
      taxaAcertoGeral: 44,
      tempoMedioSegundos: 154,
    },
  },
  {
    id: 'Q-14',
    codigo: 'VRT-2514',
    banca: 'CEBRASPE',
    ano: 2025,
    orgao: 'STJ / TRF',
    cargo: 'Analista Judiciário',
    disciplina: 'Direito Constitucional',
    assunto: 'Organização do Estado e Repartição de Competências',
    dificuldade: 'Média',
    modalidade: 'certo_errado',
    enunciado:
      'Julgue o item a seguir acerca da repartição constitucional de competências legislativas.\n\nCompete privativamente à União legislar sobre direito civil, comercial, penal, processual, eleitoral, agrário, marítimo, aeronáutico, espacial e do trabalho; contudo, lei complementar federal poderá autorizar os Estados a legislar sobre questões específicas dessas matérias.',
    palavrasChave: [
      'privativamente à União',
      'direito civil, comercial, penal, processual, eleitoral, agrário, marítimo, aeronáutico, espacial e do trabalho',
      'lei complementar federal poderá autorizar os Estados',
      'questões específicas',
    ],
    gabarito: 'C',
    alternativas: [
      {
        letra: 'C',
        rotulo: 'Certo',
        texto: 'Certo',
        isCorreta: true,
        comentarioEspecifico:
          'Gabarito: CERTO! O item reproduz com exatidão o Art. 22, inciso I ("CAPACETE de PM") combinado com o parágrafo único do mesmo artigo, que permite a delegação de questões específicas aos Estados mediante Lei Complementar federal.',
        taxaMarcacaoComunidade: 81,
      },
      {
        letra: 'E',
        rotulo: 'Errado',
        texto: 'Errado',
        isCorreta: false,
        comentarioEspecifico:
          'Incorreto. A competência privativa da União (Art. 22) é delegável por Lei Complementar em questões específicas; a competência que é indelegável é a exclusiva da União (Art. 21, de natureza material/administrativa).',
        taxaMarcacaoComunidade: 19,
      },
    ],
    comentario: {
      resumoTeorico:
        'A competência legislativa privativa da União (Art. 22 da CF/88) admite delegação aos Estados (e ao DF) desde que preenchidos três requisitos cumulativos previstos no parágrafo único do Art. 22: 1) Instrumento formal: Lei Complementar federal; 2) Objeto: apenas "questões específicas" das matérias do Art. 22; 3) Isonomia: extensível a todos os Estados.',
      fundamentoLegal:
        'Art. 22, inciso I e parágrafo único da Constituição Federal de 1988.',
      jurisprudenciaOuDoutrina:
        'Não confunda com os ramos do Direito da Competência Concorrente (Art. 24, I - "PUTO FE"): Direito Penitenciário, Urbanístico, Tributário, Orçamentário, Financeiro e Econômico.',
      pegadinhaDaBanca:
        'Muitas vezes a banca troca "Direito Agrário" (Privativa da União - Art. 22) por "Direito Urbanístico" ou "Penitenciário" (Concorrente - Art. 24), ou diz que a delegação pode ser feita por lei ordinária.',
      dicaDeMemorizacao:
        'Mnemônico Art. 22, I (Privativa da União): CAPACETE de PM = Civil, Agrário, Penal, Aeronáutico, Comercial, Eleitoral, Trabalho, Espacial, Processual e Marítimo.',
    },
    estatisticasComunidade: {
      totalRespostas: 7120,
      taxaAcertoGeral: 81,
      tempoMedioSegundos: 64,
    },
  },
];

export const SIMULADO_BLUEPRINTS: SimuladoBlueprint[] = [
  {
    id: 'sim-01-geral',
    titulo: 'Simulado Nacional de Alta Performance — Carreiras Federais',
    subtitulo:
      'Bateria multidisciplinar calibrada com questões comentadas de Direito Constitucional, Administrativo, Português, RLM, Tributário/AFO e TI.',
    bancaPrincipal: 'FGV',
    carreiraAlvo: 'Auditor-Fiscal / Analista Federal',
    modalidade: 'mista',
    regraPontuacao: 'bruta',
    tempoLimiteMinutos: 25,
    notaCorteReferencia: 80,
    questionIds: ['Q-01', 'Q-03', 'Q-06', 'Q-08', 'Q-12', 'Q-13'],
  },
  {
    id: 'sim-02-cebraspe',
    titulo: 'Simulado Oficial Padrão CEBRASPE (Certo / Errado com Penalidade)',
    subtitulo:
      'Treinamento tático de gestão de banca: 1 questão errada anula 1 questão certa. Treine quando marcar com certeza e quando deixar em branco.',
    bancaPrincipal: 'CEBRASPE',
    carreiraAlvo: 'Polícia Federal / TCU / STJ',
    modalidade: 'certo_errado',
    regraPontuacao: 'cebraspe_liquida',
    tempoLimiteMinutos: 15,
    notaCorteReferencia: 72,
    questionIds: ['Q-02', 'Q-05', 'Q-07', 'Q-11', 'Q-14'],
  },
  {
    id: 'sim-03-juridico',
    titulo: 'Sprint Jurídico de Elite — Constitucional & Administrativo',
    subtitulo:
      'Foco em jurisprudência do STF (Temas de Repercussão Geral), Nova Lei de Licitações (14.133/21) e Reforma da Lei de Improbidade (14.230/21).',
    bancaPrincipal: 'FCC',
    carreiraAlvo: 'Analista Judiciário (TRF / TRT / STJ)',
    modalidade: 'mista',
    regraPontuacao: 'bruta',
    tempoLimiteMinutos: 20,
    notaCorteReferencia: 78,
    questionIds: ['Q-01', 'Q-02', 'Q-04', 'Q-08', 'Q-11', 'Q-14'],
  },
  {
    id: 'sim-04-completo',
    titulo: 'Maratona Vértice Completa — Diagnóstico Integral (12 Questões)',
    subtitulo:
      'Avaliação global cobrindo todas as 6 disciplinas nucleares para mapeamento completo do Edital Verticalizado e detecção de pontos cegos.',
    bancaPrincipal: 'MISTA',
    carreiraAlvo: 'Todas as Carreiras de Alto Nível',
    modalidade: 'mista',
    regraPontuacao: 'bruta',
    tempoLimiteMinutos: 40,
    notaCorteReferencia: 80,
    questionIds: [
      'Q-01',
      'Q-02',
      'Q-03',
      'Q-04',
      'Q-05',
      'Q-06',
      'Q-07',
      'Q-08',
      'Q-09',
      'Q-10',
      'Q-11',
      'Q-12',
    ],
  },
];

export const INITIAL_ATTEMPTS: QuestionAttempt[] = [
  {
    id: 'att-1',
    questionId: 'Q-01',
    simuladoId: 'hist-sim-3',
    respostaUsuario: 'B',
    isCorreta: true,
    emBranco: false,
    confianca: 'certeza',
    tempoGastoSegundos: 118,
    timestamp: '2026-09-20T14:10:00Z',
  },
  {
    id: 'att-2',
    questionId: 'Q-02',
    simuladoId: 'hist-sim-3',
    respostaUsuario: 'C',
    isCorreta: false,
    emBranco: false,
    confianca: 'duvida',
    tempoGastoSegundos: 95,
    timestamp: '2026-09-20T14:12:00Z',
    motivoErro: 'pegadinha_banca',
  },
  {
    id: 'att-3',
    questionId: 'Q-03',
    simuladoId: 'hist-sim-3',
    respostaUsuario: 'B',
    isCorreta: false,
    emBranco: false,
    confianca: 'duvida',
    tempoGastoSegundos: 142,
    timestamp: '2026-09-20T14:15:00Z',
    motivoErro: 'pegadinha_banca',
  },
  {
    id: 'att-4',
    questionId: 'Q-04',
    simuladoId: 'hist-sim-4',
    respostaUsuario: 'A',
    isCorreta: true,
    emBranco: false,
    confianca: 'certeza',
    tempoGastoSegundos: 84,
    timestamp: '2026-09-24T19:05:00Z',
  },
  {
    id: 'att-5',
    questionId: 'Q-05',
    simuladoId: 'hist-sim-4',
    respostaUsuario: 'C',
    isCorreta: true,
    emBranco: false,
    confianca: 'certeza',
    tempoGastoSegundos: 102,
    timestamp: '2026-09-24T19:08:00Z',
  },
  {
    id: 'att-6',
    questionId: 'Q-06',
    simuladoId: 'hist-sim-4',
    respostaUsuario: 'C',
    isCorreta: true,
    emBranco: false,
    confianca: 'duvida',
    tempoGastoSegundos: 138,
    timestamp: '2026-09-24T19:11:00Z',
  },
  {
    id: 'att-7',
    questionId: 'Q-07',
    simuladoId: 'hist-sim-5',
    respostaUsuario: 'E',
    isCorreta: true,
    emBranco: false,
    confianca: 'certeza',
    tempoGastoSegundos: 62,
    timestamp: '2026-09-28T10:20:00Z',
  },
  {
    id: 'att-8',
    questionId: 'Q-08',
    simuladoId: 'hist-sim-5',
    respostaUsuario: 'E',
    isCorreta: true,
    emBranco: false,
    confianca: 'certeza',
    tempoGastoSegundos: 110,
    timestamp: '2026-09-28T10:23:00Z',
  },
  {
    id: 'att-9',
    questionId: 'Q-09',
    simuladoId: 'hist-sim-5',
    respostaUsuario: 'D',
    isCorreta: true,
    emBranco: false,
    confianca: 'certeza',
    tempoGastoSegundos: 98,
    timestamp: '2026-09-28T10:25:00Z',
  },
  {
    id: 'att-10',
    questionId: 'Q-10',
    simuladoId: 'hist-sim-5',
    respostaUsuario: 'E',
    isCorreta: false,
    emBranco: false,
    confianca: 'certeza',
    tempoGastoSegundos: 76,
    timestamp: '2026-09-28T10:27:00Z',
    motivoErro: 'falta_atencao',
  },
  {
    id: 'att-11',
    questionId: 'Q-11',
    simuladoId: 'hist-sim-5',
    respostaUsuario: 'E',
    isCorreta: true,
    emBranco: false,
    confianca: 'certeza',
    tempoGastoSegundos: 70,
    timestamp: '2026-09-28T10:29:00Z',
  },
  {
    id: 'att-12',
    questionId: 'Q-12',
    simuladoId: 'hist-sim-5',
    respostaUsuario: 'C',
    isCorreta: true,
    emBranco: false,
    confianca: 'certeza',
    tempoGastoSegundos: 88,
    timestamp: '2026-09-28T10:31:00Z',
  },
  {
    id: 'att-13',
    questionId: 'Q-13',
    simuladoId: 'hist-sim-5',
    respostaUsuario: 'A',
    isCorreta: false,
    emBranco: false,
    confianca: 'duvida',
    tempoGastoSegundos: 165,
    timestamp: '2026-09-28T10:35:00Z',
    motivoErro: 'lacuna_teorica',
  },
  {
    id: 'att-14',
    questionId: 'Q-14',
    simuladoId: 'hist-sim-5',
    respostaUsuario: 'C',
    isCorreta: true,
    emBranco: false,
    confianca: 'certeza',
    tempoGastoSegundos: 58,
    timestamp: '2026-09-28T10:37:00Z',
  },
];

export const INITIAL_NOTES: Record<string, UserQuestionNote> = {
  'Q-02': {
    questionId: 'Q-02',
    cadernos: ['Erros Críticos', 'Jurisprudência STF/STJ'],
    anotacaoPessoal:
      'Atenção redobrada ao final dos itens longos do Cebraspe! O Tema 280 do STF permite entrada noturna sem mandado em crime permanente, MAS denúncia anônima + nervosismo do suspeito NÃO bastam como fundadas razões (HC 598.051 STJ).',
    motivoErroRegistrado: 'pegadinha_banca',
    nivelDominio: 'critico',
    ultimaAtualizacao: '2026-09-21',
  },
  'Q-03': {
    questionId: 'Q-03',
    cadernos: ['Erros Críticos', 'Revisão de Véspera'],
    anotacaoPessoal:
      'Regra de ouro para reescrita na FGV: "A menos que" e "Salvo se" já significam "Se não". Nunca colocar a palavra "não" logo depois de "a menos que", senão gera dupla negação!',
    motivoErroRegistrado: 'pegadinha_banca',
    nivelDominio: 'critico',
    ultimaAtualizacao: '2026-09-22',
  },
  'Q-10': {
    questionId: 'Q-10',
    cadernos: ['Revisão de Véspera'],
    anotacaoPessoal:
      'Lembrar dos 3 casos de crase facultativa ("Até minha Maria"): depois da preposição "até" (até as 17h / até às 17h), antes de pronome possessivo feminino e antes de nome próprio feminino. E "Brasília" não aceita artigo ("Volto de Brasília").',
    motivoErroRegistrado: 'falta_atencao',
    nivelDominio: 'em_revisao',
    ultimaAtualizacao: '2026-09-28',
  },
  'Q-13': {
    questionId: 'Q-13',
    cadernos: ['Erros Críticos'],
    anotacaoPessoal:
      'Probabilidade condicional: quando o enunciado diz "Sabendo-se que pelo menos 1 é tributário", o denominador deixa de ser C(10,3)=120 e passa a ser 120 - C(6,3) = 100. Numerador = C(4,2) * C(6,1) = 36. Resultado = 36/100 = 9/25.',
    motivoErroRegistrado: 'lacuna_teorica',
    nivelDominio: 'critico',
    ultimaAtualizacao: '2026-09-29',
  },
  'Q-06': {
    questionId: 'Q-06',
    cadernos: ['Lei Seca', 'Revisão de Véspera'],
    anotacaoPessoal:
      'Exceções à Noventena (só respeitam 1º de janeiro): IR, Base de Cálculo do IPVA e Base de Cálculo do IPTU. Já a alíquota do IPVA/IPTU respeita ambas!',
    nivelDominio: 'dominado',
    ultimaAtualizacao: '2026-09-25',
  },
};

export const INITIAL_SIMULADO_HISTORY: SimuladoResultRecord[] = [
  {
    id: 'hist-sim-1',
    blueprintId: 'sim-01-geral',
    titulo: '1º Diagnóstico Base — Carreiras Federais',
    banca: 'FGV',
    dataRealizacao: '2026-08-24',
    modo: 'prova_real',
    regraPontuacao: 'bruta',
    totalQuestoes: 20,
    acertos: 12,
    erros: 8,
    emBranco: 0,
    percentualBruto: 60,
    percentualLiquido: 60,
    tempoTotalSegundos: 2760,
    notaCorteReferencia: 80,
    desempenhoPorDisciplina: [
      { disciplina: 'Direito Constitucional', total: 4, acertos: 3, erros: 1, emBranco: 0 },
      { disciplina: 'Direito Administrativo', total: 4, acertos: 3, erros: 1, emBranco: 0 },
      { disciplina: 'Língua Portuguesa', total: 4, acertos: 2, erros: 2, emBranco: 0 },
      { disciplina: 'Raciocínio Lógico', total: 3, acertos: 1, erros: 2, emBranco: 0 },
      { disciplina: 'Direito Tributário & AFO', total: 3, acertos: 2, erros: 1, emBranco: 0 },
      { disciplina: 'Informática & TI', total: 2, acertos: 1, erros: 1, emBranco: 0 },
    ],
    questionIds: ['Q-01', 'Q-03', 'Q-06', 'Q-08', 'Q-12', 'Q-13'],
  },
  {
    id: 'hist-sim-2',
    blueprintId: 'sim-02-cebraspe',
    titulo: 'Bateria Tática CEBRASPE — Certo/Errado Líquido',
    banca: 'CEBRASPE',
    dataRealizacao: '2026-09-04',
    modo: 'prova_real',
    regraPontuacao: 'cebraspe_liquida',
    totalQuestoes: 20,
    acertos: 15,
    erros: 3,
    emBranco: 2,
    percentualBruto: 75,
    percentualLiquido: 60,
    tempoTotalSegundos: 1920,
    notaCorteReferencia: 72,
    desempenhoPorDisciplina: [
      { disciplina: 'Direito Constitucional', total: 5, acertos: 4, erros: 1, emBranco: 0 },
      { disciplina: 'Direito Administrativo', total: 5, acertos: 4, erros: 0, emBranco: 1 },
      { disciplina: 'Raciocínio Lógico', total: 5, acertos: 3, erros: 1, emBranco: 1 },
      { disciplina: 'Informática & TI', total: 5, acertos: 4, erros: 1, emBranco: 0 },
    ],
    questionIds: ['Q-02', 'Q-05', 'Q-07', 'Q-11', 'Q-14'],
  },
  {
    id: 'hist-sim-3',
    blueprintId: 'sim-03-juridico',
    titulo: 'Sprint Jurídico de Elite — STF & Licitações',
    banca: 'FCC',
    dataRealizacao: '2026-09-14',
    modo: 'prova_real',
    regraPontuacao: 'bruta',
    totalQuestoes: 18,
    acertos: 13,
    erros: 5,
    emBranco: 0,
    percentualBruto: 72,
    percentualLiquido: 72,
    tempoTotalSegundos: 2100,
    notaCorteReferencia: 78,
    desempenhoPorDisciplina: [
      { disciplina: 'Direito Constitucional', total: 6, acertos: 4, erros: 2, emBranco: 0 },
      { disciplina: 'Direito Administrativo', total: 6, acertos: 5, erros: 1, emBranco: 0 },
      { disciplina: 'Língua Portuguesa', total: 6, acertos: 4, erros: 2, emBranco: 0 },
    ],
    questionIds: ['Q-01', 'Q-02', 'Q-04', 'Q-08', 'Q-11', 'Q-14'],
  },
  {
    id: 'hist-sim-4',
    blueprintId: 'sim-01-geral',
    titulo: '2º Simulado Geral — Ciclo de Consolidação',
    banca: 'FGV',
    dataRealizacao: '2026-09-22',
    modo: 'prova_real',
    regraPontuacao: 'bruta',
    totalQuestoes: 20,
    acertos: 15,
    erros: 5,
    emBranco: 0,
    percentualBruto: 75,
    percentualLiquido: 75,
    tempoTotalSegundos: 2340,
    notaCorteReferencia: 80,
    desempenhoPorDisciplina: [
      { disciplina: 'Direito Constitucional', total: 4, acertos: 3, erros: 1, emBranco: 0 },
      { disciplina: 'Direito Administrativo', total: 4, acertos: 4, erros: 0, emBranco: 0 },
      { disciplina: 'Língua Portuguesa', total: 4, acertos: 2, erros: 2, emBranco: 0 },
      { disciplina: 'Raciocínio Lógico', total: 3, acertos: 2, erros: 1, emBranco: 0 },
      { disciplina: 'Direito Tributário & AFO', total: 3, acertos: 2, erros: 1, emBranco: 0 },
      { disciplina: 'Informática & TI', total: 2, acertos: 2, erros: 0, emBranco: 0 },
    ],
    questionIds: ['Q-01', 'Q-03', 'Q-06', 'Q-08', 'Q-12', 'Q-13'],
  },
  {
    id: 'hist-sim-5',
    blueprintId: 'sim-04-completo',
    titulo: 'Simulado Nacional Vértice — Rodada Oficial Outubro',
    banca: 'MISTA',
    dataRealizacao: '2026-09-28',
    modo: 'prova_real',
    regraPontuacao: 'bruta',
    totalQuestoes: 14,
    acertos: 10,
    erros: 4,
    emBranco: 0,
    percentualBruto: 71,
    percentualLiquido: 71,
    tempoTotalSegundos: 1406,
    notaCorteReferencia: 80,
    desempenhoPorDisciplina: [
      { disciplina: 'Direito Constitucional', total: 3, acertos: 2, erros: 1, emBranco: 0 },
      { disciplina: 'Direito Administrativo', total: 3, acertos: 3, erros: 0, emBranco: 0 },
      { disciplina: 'Língua Portuguesa', total: 2, acertos: 0, erros: 2, emBranco: 0 },
      { disciplina: 'Raciocínio Lógico', total: 2, acertos: 1, erros: 1, emBranco: 0 },
      { disciplina: 'Direito Tributário & AFO', total: 2, acertos: 2, erros: 0, emBranco: 0 },
      { disciplina: 'Informática & TI', total: 2, acertos: 2, erros: 0, emBranco: 0 },
    ],
    questionIds: [
      'Q-01',
      'Q-02',
      'Q-03',
      'Q-04',
      'Q-05',
      'Q-06',
      'Q-07',
      'Q-08',
      'Q-09',
      'Q-10',
      'Q-11',
      'Q-12',
      'Q-13',
      'Q-14',
    ],
  },
];
