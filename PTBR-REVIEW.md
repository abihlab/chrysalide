# Revisão da localização brasileira dos catálogos

Base: `abihlab/chrysalide`, branch `feat/i18n-pt-br`, commit `4687c462`.
Branch de trabalho: `feat/pt-br-catalogs`. Alterações para revisão local;
sem merge, publicação ou PR para o projeto original.

## Correções

- Rótulos para os 22 medicamentos predefinidos, sem substituir marcas comerciais.
  Os nomes canônicos continuam nos valores das opções e nos registros salvos.
- Unidades de dose e estoque localizadas no formulário, lista, detalhes,
  calendário e painel; por exemplo, `pressions` aparece como “acionamentos”.
- Frequências especiais predefinidas (à noite e a cada 12 semanas) continuam
  selecionáveis ao editar; frequências personalizadas usam o texto original.
  O histórico de mudanças também traduz as frequências conhecidas.
- Os 15 tipos de atendimento/profissionais têm cobertura de tradução;
  corrigido “Tatuadora(or)” para “Tatuador(a)”, mantendo o ID `tattoo`.
- Etiquetas dos recursos traduzidas; a busca consulta nomes, descrições e
  etiquetas no idioma atual. Os badges mostram o idioma real do destino.
  URLs, IDs, categorias e abrangência geográfica dos recursos foram preservados.
- Nomes personalizados e valores desconhecidos são exibidos sem modificação.
- Adicionadas 70 entradas a cada catálogo FR/EN/DE/PT-BR: 22 nomes de
  medicamentos, 5 unidades de dose e 43 etiquetas de recursos. Nenhuma mensagem
  anterior de FR/EN/DE foi alterada; placeholders e chaves continuam compatíveis.

## Medidas brasileiras dos exames

Conforme solicitado durante a implementação, a localização inclui a apresentação
nas seguintes unidades em pt-BR:

| Marcador                  | Unidade canônica preservada | Unidade apresentada | Conversão de exibição |
| ------------------------- | --------------------------- | ------------------- | --------------------- |
| Testosterona              | ng/mL                       | ng/dL               | valor × 100           |
| Prolactina e progesterona | µg/L                        | ng/mL               | valor idêntico        |
| LH e FSH                  | UI/L                        | mUI/mL              | valor idêntico        |

As demais unidades permanecem iguais. Os números dos exames usam vírgula decimal
em pt-BR. Resultados e limites exibidos são convertidos juntos em detalhes,
painel e dados da exportação PDF; legendas e tooltips mostram a mesma unidade.
A geometria dos gráficos e as decisões de alerta usam os dados canônicos.

Novos exames em pt-BR oferecem testosterona em ng/dL inicialmente. A edição
carrega o valor nessa unidade e utiliza o conversor já existente para salvar em
ng/mL. FR/EN/DE mantêm a apresentação anterior. O teste de navegador verifica
que cadastrar 29 ng/dL salva 0.29 ng/mL e que editar/salvar e trocar para inglês
não altera o registro.

## Integridade

`constants.ts`, `types.ts`, `resources-data.ts`, arquivos do banco de dados,
conversores médicos existentes, agendamento, validação automática e lockfile
não foram modificados. Doses do catálogo, intervalos, referências, limites de
alerta, IDs e schema permanecem iguais à base. Não há migração de dados.

A revisão independente não apontou problemas críticos ou importantes. Os três
ajustes menores encontrados (nomes nos diálogos, frequências no histórico e
artefatos decimais na edição) foram corrigidos.

## Verificações

- `pnpm install --frozen-lockfile`: concluído, lockfile intacto.
- `pnpm check:locale-keys`: FR/EN/DE/PT-BR sincronizados.
- Auditoria das mensagens anteriores: nenhum placeholder alterado.
- `pnpm test:run --maxWorkers=2`: 333 testes, 32 arquivos, todos passaram.
- `pnpm lint`: passou.
- `pnpm check`: zero erros e zero avisos.
- `pnpm build`: passou; site estático gerado em `build/`.
- Prettier nos arquivos novos e `git diff --check`: passaram.
- Playwright: 4/4 novos cenários passaram nas duas rodadas; conjunto de
  medicamentos, exames e localização: 23/24 em cada rodada, com falhas
  intermitentes diferentes nos testes existentes AC-12 e AC-14 (detalhes abaixo).

Os testes de navegador usam o Chromium instalado em `/usr/bin/chromium`, com
configuração temporária de execução, sem alterar a configuração padrão do projeto.
A rodada inicial dos três conjuntos teve 23/24 passando: o teste antigo AC-12
falhou ao aguardar a submissão/navegação do formulário. Ele passou isoladamente;
o conjunto foi repetido com um worker, sem concorrência com build/tipos.
Nessa segunda rodada, AC-12 passou e AC-14 excedeu o timeout ao clicar no link
“Détails” (antes de editar ou testar o calendário). AC-14 também passou
isoladamente em seguida. Não há uma execução integral sem falhas dos 24 cenários;
a causa dos timeouts não foi estabelecida. Os testes e o código de validação
automática existentes não foram alterados para ocultar essas falhas.

## Revisão humana

Revisar a terminologia médica e as unidades preferidas pelos laboratórios usados
pelas pessoas usuárias. Não foram adicionados medicamentos brasileiros, marcas,
URLs ou serviços locais novos. Os recursos continuam sendo os destinos existentes,
com seus idiomas e contexto geográfico explicitados.

A validação abrange navegador Chromium desktop e os cenários de toque já cobertos
pela suíte de exames; não inclui teste de instalação em um aparelho Android físico
nem revisão visual do PDF em um leitor externo.
