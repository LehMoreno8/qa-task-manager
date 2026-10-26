# Requisitos e Critérios de Aceitação

Sistema: Gerenciador de Tarefas (aplicação web simples, dados salvos no `localStorage` do navegador).

## Escopo

**Dentro do escopo:** cadastro, edição, exclusão, mudança de status, filtros (status e busca por título), validação do título obrigatório e persistência dos dados ao recarregar a página.

**Fora do escopo:** login, backend, banco de dados, múltiplos usuários, prioridade, datas, responsividade avançada e acessibilidade completa.

## Modelo de dados

| Campo | Obrigatório | Regra |
|---|---|---|
| Título | Sim | Não pode ser vazio nem conter só espaços; máximo de 100 caracteres |
| Descrição | Não | Texto livre |
| Status | Sim | `A fazer` (padrão), `Em andamento` ou `Concluída` |

## Requisitos funcionais

### RF01 - Cadastrar tarefa
O usuário informa título (obrigatório), descrição (opcional) e status, e clica em **Adicionar tarefa**.

- **CA01.1** Dado um título válido, quando clico em "Adicionar tarefa", então a tarefa aparece na lista com o título, a descrição e o status informados.
- **CA01.2** Dado que cadastrei uma tarefa, então o formulário volta ao estado inicial (campos vazios e status "A fazer").
- **CA01.3** Dado que não escolhi status, então a tarefa é criada como "A fazer".
- **CA01.4** Dado um título com espaços nas pontas (ex.: `  Pagar conta  `), então a tarefa é salva sem os espaços extras.

### RF02 - Validar campos obrigatórios
- **CA02.1** Dado o título vazio, quando clico em "Adicionar tarefa", então vejo a mensagem "O título é obrigatório." e nenhuma tarefa é criada.
- **CA02.2** Dado um título contendo apenas espaços, então o comportamento é o mesmo do CA02.1.
- **CA02.3** Dado um título com mais de 100 caracteres, então vejo a mensagem "O título deve ter no máximo 100 caracteres." e nenhuma tarefa é criada.
- **CA02.4** Dado um título com exatamente 100 caracteres, então a tarefa é criada normalmente.
- **CA02.5** Dado que vi uma mensagem de erro, quando corrijo o título e envio novamente, então a tarefa é criada e a mensagem de erro desaparece.

### RF03 - Editar tarefa
- **CA03.1** Quando clico em "Editar", então o formulário é preenchido com os dados da tarefa, o título do formulário vira "Editar tarefa" e o botão vira "Salvar alterações".
- **CA03.2** Quando altero os dados e clico em "Salvar alterações", então a tarefa é atualizada na lista (sem criar uma tarefa nova).
- **CA03.3** Dado que estou editando, quando apago o título e salvo, então vejo "O título é obrigatório." e a tarefa mantém os dados anteriores.
- **CA03.4** Dado que estou editando, quando clico em "Cancelar edição", então o formulário volta ao modo de cadastro e a tarefa não é alterada.

### RF04 - Excluir tarefa
- **CA04.1** Quando clico em "Excluir", então o navegador pede confirmação.
- **CA04.2** Dado que confirmo, então a tarefa some da lista.
- **CA04.3** Dado que cancelo a confirmação, então a tarefa continua na lista.
- **CA04.4** Dado que excluo a tarefa que está em edição, então o formulário volta ao modo de cadastro.

### RF05 - Alterar status
- **CA05.1** Quando escolho outro status no seletor da tarefa, então o status exibido é atualizado imediatamente.
- **CA05.2** A mudança de status não altera o título nem a descrição.

### RF06 - Filtrar tarefas
- **CA06.1** Ao escolher um status no filtro, a lista mostra somente as tarefas desse status.
- **CA06.2** Ao escolher "Todas", a lista mostra todas as tarefas.
- **CA06.3** Ao digitar no campo de busca, a lista mostra somente tarefas cujo título contém o texto (sem diferenciar maiúsculas de minúsculas).
- **CA06.4** Os dois filtros funcionam juntos (status E busca).
- **CA06.5** Se nenhuma tarefa corresponder aos filtros, vejo "Nenhuma tarefa encontrada com os filtros atuais.".
- **CA06.6** O contador mostra "Exibindo X de Y tarefa(s)" com os valores corretos.

### RF07 - Persistência
- **CA07.1** Ao recarregar a página, as tarefas cadastradas continuam na lista com os mesmos dados e status.
- **CA07.2** Edições, exclusões e mudanças de status também persistem após recarregar.
- **CA07.3** Se não existe nenhuma tarefa, vejo "Nenhuma tarefa cadastrada.".

## Requisito não funcional (mínimo)

### RNF01 - Segurança básica de conteúdo
- **CA-N01** Dado um título com HTML (ex.: `<b>teste</b>`), então o texto é exibido literalmente e o HTML não é interpretado.
