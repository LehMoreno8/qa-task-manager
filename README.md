# QA Task Manager

Projeto para praticar e demonstrar o ciclo básico de QA em um sistema web de tarefas: **requisitos, casos de teste manuais, automação com Playwright, execução, relatório e registro de bugs**.

O foco é a atividade de teste. A aplicação é propositalmente pequena (HTML, CSS e JavaScript puro, sem framework e sem backend; os dados ficam no `localStorage`).

## O que o sistema faz

Cadastro, edição, exclusão e mudança de status de tarefas, filtros (por status e busca por título), validação do título obrigatório (máx. 100 caracteres) e persistência após recarregar a página.

## Estrutura

```
app/                      aplicação (index.html, style.css, app.js)
tests/tasks.spec.js       10 testes automatizados (Playwright Test)
docs/requisitos.md        requisitos e critérios de aceitação
docs/casos-de-teste.md    18 casos de teste manuais
docs/relatorio-execucao.md  resultados reais, ambiente e limitações
docs/bugs/                modelo de bug report (sem bugs reproduzidos até agora)
playwright.config.js      configuração dos testes
```

## Como executar

Pré-requisito: Node.js 18 ou superior.

```bash
npm install                       # instala Playwright Test e http-server
npx playwright install chromium   # baixa o navegador usado nos testes
npm test                          # roda os 10 testes (sobe o app sozinho)
npm run report                    # abre o relatório HTML da última execução
```

Para usar o app manualmente (e executar os casos de `docs/casos-de-teste.md`):

```bash
npm run serve                     # abre em http://localhost:8080
```

Outros comandos: `npm run test:headed` roda os testes com o navegador visível.

## Decisões de teste

- **Seletores estáveis:** os testes usam `data-testid` (ex.: `task-title-input`), que não quebram quando o texto ou o CSS mudam.
- **Testes independentes:** cada teste começa com o `localStorage` vazio (contexto novo do Playwright) e cria seus próprios dados pela interface.
- **Sem retentativas** (`retries: 0`): uma falha instável deve aparecer, não ser escondida.
- **Asserções específicas:** os testes conferem textos, contagens e valores exatos, e não só "o elemento existe".
- **Testes foram validados:** inseri defeitos propositais numa cópia do app e confirmei que cada teste falha quando deveria (ver seção 4 do relatório).

## Situação atual (21/10/2026)

| Item | Estado |
|---|---|
| Testes automatizados | 10 de 10 passaram (Chromium, Playwright 1.56.0) |
| Casos manuais | 18 escritos, **execução pendente** |
| Bugs reproduzidos | Nenhum |

Leia `docs/relatorio-execucao.md` para o ambiente, as adaptações feitas na execução e as limitações. Em especial: `npm install` e `npm run serve` não puderam ser verificados no ambiente onde os testes foram rodados (acesso ao npm bloqueado), então confirme-os na sua máquina.

## Fora do escopo

Login, backend, banco de dados, múltiplos usuários, testes em outros navegadores, acessibilidade completa, desempenho e segurança.
