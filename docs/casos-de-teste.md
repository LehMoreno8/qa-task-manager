# Casos de Teste Manuais

Total: **18 casos**. Cada caso referencia os critérios de aceitação de `requisitos.md`.

## Como executar

1. Suba a aplicação (`npm run serve`) e abra `http://localhost:8080` no navegador.
2. Antes de **cada** caso, abra o DevTools (F12) > Application > Local Storage e apague a chave `tasks` (ou clique em "Clear all"), depois recarregue a página. Assim um caso não contamina o outro.
3. Siga os passos, compare com o **Resultado esperado** e preencha **Resultado obtido** e **Status** (`Passou` / `Falhou` / `Bloqueado`).
4. Se um caso falhar, repita para confirmar que é reproduzível e só então abra um bug em `docs/bugs/`.

## Resumo

| ID | Objetivo | Tipo | Critério | Automação | Status |
|---|---|---|---|---|---|
| TC-01 | Cadastrar tarefa com todos os campos | Positivo | CA01.1, CA01.2 | AT-01 | Executado |
| TC-02 | Cadastrar só com título (padrões) | Positivo | CA01.3 | - | Executado |
| TC-03 | Remover espaços nas pontas do título | Positivo | CA01.4 | - | Não executado |
| TC-04 | Rejeitar título vazio | Negativo | CA02.1 | AT-02 | Não executado |
| TC-05 | Rejeitar título só com espaços | Negativo | CA02.2 | AT-03 |  Executado |
| TC-06 | Rejeitar título com 101 caracteres | Negativo / limite | CA02.3 | AT-04 | Executado |
| TC-07 | Aceitar título com 100 caracteres | Positivo / limite | CA02.4 | - | Não executado |
| TC-08 | Editar tarefa existente | Positivo | CA03.1, CA03.2 | AT-05 | Não executado |
| TC-09 | Rejeitar edição com título vazio | Negativo | CA03.3 | - | Não executado |
| TC-10 | Cancelar edição | Positivo | CA03.4 | - | Não executado |
| TC-11 | Excluir tarefa confirmando | Positivo | CA04.1, CA04.2 | AT-06 | Não executado |
| TC-12 | Cancelar a exclusão | Negativo | CA04.3 | AT-07 | Não executado |
| TC-13 | Alterar status pela lista | Positivo | CA05.1, CA05.2 | AT-08 | Não executado |
| TC-14 | Filtrar por status | Positivo | CA06.1, CA06.2 | AT-09 | Não executado |
| TC-15 | Buscar por título e busca sem resultado | Positivo / negativo | CA06.3, CA06.5 | - | Não executado |
| TC-16 | Combinar filtro de status e busca | Positivo | CA06.4, CA06.6 | - | Não executado |
| TC-17 | Persistir dados após recarregar | Positivo | CA07.1, CA07.2 | AT-10 | Não executado |
| TC-18 | Exibir HTML do título como texto | Negativo / segurança | CA-N01 | - | Não executado |

---

## TC-01 - Cadastrar tarefa com todos os campos
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o cadastro de uma tarefa válida com título, descrição e status. |
| **Pré-condições** | Aplicação aberta, `localStorage` limpo, lista vazia. |
| **Passos** | 1. Digitar o título. 2. Digitar a descrição. 3. Selecionar o status. 4. Clicar em "Adicionar tarefa". |
| **Dados de entrada** | Título: `Estudar Playwright` / Descrição: `Fazer o tutorial oficial` / Status: `Concluído` |
| **Resultado esperado** | A tarefa aparece na lista com os três dados informados. O formulário volta a ficar vazio, com status "A fazer". O contador mostra "Exibindo 1 de 1 tarefa(s)". |
| **Resultado obtido** | _(preencher)_ |
| **Status** | Não Executado |

## TC-02 - Cadastrar só com título (valores padrão)
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Confirmar que descrição é opcional e que o status padrão é "A fazer". |
| **Pré-condições** | `localStorage` limpo. |
| **Passos** | 1. Digitar apenas o título. 2. Não mexer nos outros campos. 3. Clicar em "Adicionar tarefa". |
| **Dados de entrada** | Título: `Comprar pão` |
| **Resultado esperado** | Tarefa criada com status "A fazer" e sem descrição. Nenhum erro exibido. |
| **Resultado obtido** | Resultado obtido foi o mesmo que o esperado. A tarefa foi adicionada ao campo "A fazer", e com 0 erros. |
| **Status** | Executado |

## TC-03 - Remover espaços nas pontas do título
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que espaços extras no início e no fim são descartados. |
| **Pré-condições** | `localStorage` limpo. |
| **Passos** | 1. Digitar o título com espaços antes e depois. 2. Clicar em "Adicionar tarefa". 3. Clicar em "Editar" na tarefa criada e observar o campo título. |
| **Dados de entrada** | Título: `␣␣Pagar conta␣␣` (dois espaços antes e dois depois) |
| **Resultado esperado** | O título salvo é `Pagar conta`, sem espaços nas pontas (visível no campo ao editar). |
| **Resultado obtido** | _(preencher)_ |
| **Status** | Não executado |

## TC-04 - Rejeitar título vazio
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Validar o campo obrigatório. |
| **Pré-condições** | `localStorage` limpo. |
| **Passos** | 1. Deixar o título em branco. 2. Clicar em "Adicionar tarefa". |
| **Dados de entrada** | Título: (vazio) |
| **Resultado esperado** | Aparece "O título é obrigatório." Nenhuma tarefa é criada. A lista continua mostrando "Nenhuma tarefa cadastrada.". |
| **Resultado obtido** | Resultado obtido foi o mesmo que o esperado. |
| **Status** | Executado |

## TC-05 - Rejeitar título só com espaços
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Garantir que espaços em branco não passem como título válido. |
| **Pré-condições** | `localStorage` limpo. |
| **Passos** | 1. Digitar somente espaços no título. 2. Clicar em "Adicionar tarefa". |
| **Dados de entrada** | Título: `␣␣␣␣` (4 espaços) |
| **Resultado esperado** | Aparece "O título é obrigatório." Nenhuma tarefa é criada. |
| **Resultado obtido** | _(preencher)_ |
| **Status** | Não executado |

## TC-06 - Rejeitar título com 101 caracteres
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Testar o limite máximo (valor-limite inválido). |
| **Pré-condições** | `localStorage` limpo. |
| **Passos** | 1. Colar um título com 101 caracteres. 2. Clicar em "Adicionar tarefa". |
| **Dados de entrada** | Título: a letra `A` repetida 101 vezes |
| **Resultado esperado** | Aparece "O título deve ter no máximo 100 caracteres." Nenhuma tarefa é criada. |
| **Resultado obtido** | _(preencher)_ |
| **Status** | Não executado |

## TC-07 - Aceitar título com 100 caracteres
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Testar o limite máximo (valor-limite válido). |
| **Pré-condições** | `localStorage` limpo. |
| **Passos** | 1. Colar um título com exatamente 100 caracteres. 2. Clicar em "Adicionar tarefa". |
| **Dados de entrada** | Título: a letra `A` repetida 100 vezes |
| **Resultado esperado** | A tarefa é criada e exibida na lista. Nenhum erro. |
| **Resultado obtido** | _(preencher)_ |
| **Status** | Não executado |

## TC-08 - Editar tarefa existente
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a edição de título e descrição. |
| **Pré-condições** | Existe a tarefa `Estudar SQL` (descrição `Capítulo 1`, status "A fazer"). |
| **Passos** | 1. Clicar em "Editar". 2. Conferir que o formulário foi preenchido e que o título do formulário é "Editar tarefa". 3. Trocar título e descrição. 4. Clicar em "Salvar alterações". |
| **Dados de entrada** | Novo título: `Estudar SQL avançado` / Nova descrição: `Capítulo 2` |
| **Resultado esperado** | A lista mostra a tarefa com os novos dados, **sem duplicar**. O formulário volta ao modo "Nova tarefa". |
| **Resultado obtido** | _(preencher)_ |
| **Status** | Não executado |

## TC-09 - Rejeitar edição com título vazio
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Validar o campo obrigatório também na edição. |
| **Pré-condições** | Existe a tarefa `Ligar para o banco`. |
| **Passos** | 1. Clicar em "Editar". 2. Apagar o título. 3. Clicar em "Salvar alterações". |
| **Dados de entrada** | Título: (vazio) |
| **Resultado esperado** | Aparece "O título é obrigatório." A tarefa na lista continua como `Ligar para o banco`. |
| **Resultado obtido** | _(preencher)_ |
| **Status** | Não executado |

## TC-10 - Cancelar edição
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que cancelar descarta as alterações. |
| **Pré-condições** | Existe a tarefa `Revisar relatório`. |
| **Passos** | 1. Clicar em "Editar". 2. Trocar o título para `Outro texto`. 3. Clicar em "Cancelar edição". |
| **Dados de entrada** | Título digitado: `Outro texto` |
| **Resultado esperado** | O formulário volta ao modo "Nova tarefa", vazio. A lista continua mostrando `Revisar relatório`. |
| **Resultado obtido** | _(preencher)_ |
| **Status** | Não executado |

## TC-11 - Excluir tarefa confirmando
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a exclusão com confirmação. |
| **Pré-condições** | Existe a tarefa `Tarefa para excluir`. |
| **Passos** | 1. Clicar em "Excluir". 2. Observar o diálogo de confirmação. 3. Clicar em "OK". |
| **Dados de entrada** | - |
| **Resultado esperado** | O diálogo pergunta `Excluir a tarefa "Tarefa para excluir"?`. Após confirmar, a tarefa some e a lista mostra "Nenhuma tarefa cadastrada.". |
| **Resultado obtido** | _(preencher)_ |
| **Status** | Não executado |

## TC-12 - Cancelar a exclusão
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Garantir que recusar a confirmação não apaga a tarefa. |
| **Pré-condições** | Existe a tarefa `Tarefa para manter`. |
| **Passos** | 1. Clicar em "Excluir". 2. No diálogo, clicar em "Cancelar". |
| **Dados de entrada** | - |
| **Resultado esperado** | A tarefa continua na lista. |
| **Resultado obtido** | _(preencher)_ |
| **Status** | Não executado |

## TC-13 - Alterar status pela lista
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a mudança de status sem entrar no modo de edição. |
| **Pré-condições** | Existe a tarefa `Escrever testes` (descrição `Parte 1`, status "A fazer"). |
| **Passos** | 1. No seletor de status da tarefa, escolher "Concluída". |
| **Dados de entrada** | Novo status: `Concluída` |
| **Resultado esperado** | O status exibido muda para "Concluída" imediatamente. Título e descrição não mudam. |
| **Resultado obtido** | _(preencher)_ |
| **Status** | Não executado |

## TC-14 - Filtrar por status
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar o filtro por status e o retorno para "Todas". |
| **Pré-condições** | Três tarefas: `Tarefa A` (A fazer), `Tarefa B` (Em andamento), `Tarefa C` (Concluída). |
| **Passos** | 1. Filtrar por "Em andamento". 2. Filtrar por "Concluída". 3. Voltar para "Todas". |
| **Dados de entrada** | Filtros: `Em andamento`, `Concluída`, `Todas` |
| **Resultado esperado** | 1: só `Tarefa B`. 2: só `Tarefa C`. 3: as três tarefas. |
| **Resultado obtido** | _(preencher)_ |
| **Status** | Não executado |

## TC-15 - Buscar por título e busca sem resultado
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar a busca sem diferenciar maiúsculas/minúsculas e a mensagem de lista vazia. |
| **Pré-condições** | Tarefas: `Comprar Leite`, `Pagar conta`. |
| **Passos** | 1. Digitar `leite` na busca. 2. Limpar e digitar `xyz`. |
| **Dados de entrada** | Buscas: `leite`, `xyz` |
| **Resultado esperado** | 1: só `Comprar Leite`. 2: nenhuma tarefa e a mensagem "Nenhuma tarefa encontrada com os filtros atuais.". |
| **Resultado obtido** | _(preencher)_ |
| **Status** | Não executado |

## TC-16 - Combinar filtro de status e busca
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que os dois filtros funcionam juntos e que o contador está correto. |
| **Pré-condições** | `Estudar JS` (A fazer), `Estudar QA` (Concluída), `Lavar carro` (Concluída). |
| **Passos** | 1. Filtrar por "Concluída". 2. Digitar `estudar` na busca. |
| **Dados de entrada** | Status: `Concluída` / Busca: `estudar` |
| **Resultado esperado** | Só `Estudar QA` é exibida. O contador mostra "Exibindo 1 de 3 tarefa(s)". |
| **Resultado obtido** | _(preencher)_ |
| **Status** | Não executado |

## TC-17 - Persistir dados após recarregar
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que cadastro, edição, mudança de status e exclusão sobrevivem ao recarregamento. |
| **Pré-condições** | `localStorage` limpo. |
| **Passos** | 1. Cadastrar `Tarefa persistente`. 2. Recarregar (F5) e conferir. 3. Mudar o status para "Concluída" e recarregar. 4. Editar o título para `Tarefa persistente editada` e recarregar. 5. Excluir a tarefa e recarregar. |
| **Dados de entrada** | Títulos: `Tarefa persistente`, `Tarefa persistente editada` |
| **Resultado esperado** | Após o passo 2 a tarefa continua. Após o 3, continua "Concluída". Após o 4, o título novo continua. Após o 5, a lista está vazia com "Nenhuma tarefa cadastrada.". |
| **Resultado obtido** | _(preencher)_ |
| **Status** | Não executado |

## TC-18 - Exibir HTML do título como texto
| Campo | Conteúdo |
|---|---|
| **Objetivo** | Verificar que o conteúdo digitado não é interpretado como HTML. |
| **Pré-condições** | `localStorage` limpo. |
| **Passos** | 1. Cadastrar uma tarefa com HTML no título. 2. Observar a lista. |
| **Dados de entrada** | Título: `<b>negrito</b>` |
| **Resultado esperado** | A lista mostra o texto literal `<b>negrito</b>`, sem formatação em negrito. |
| **Resultado obtido** | _(preencher)_ |
| **Status** | Não executado |
