# Instruções do projeto OPES

## Git e fluxo de trabalho

- Nunca modificar diretamente a branch `main`.
- Use branches `FEAT-NÚMERO` para novas funcionalidades e `FIX-NÚMERO` para correções.
- Quando a `dev` existir e estiver atualizada, crie a branch de trabalho a partir dela.
- Nunca execute `merge`, `push` ou crie pull requests sem autorização explícita.
- Exija autorização explícita antes de excluir arquivos, alterar configurações sensíveis ou modificar contratos da API.
- Nunca execute comandos destrutivos sem autorização explícita.
- Preserve alterações locais existentes; não descarte, reverta ou sobrescreva trabalho que não foi solicitado.

## Análise e implementação

- Antes de implementar qualquer mudança, analise a arquitetura, as dependências e os padrões existentes.
- Preserve as funcionalidades existentes e a identidade visual do OPES.
- O OPES é um sistema de controle financeiro, não uma plataforma de pagamentos; não descreva nem implemente fluxos de pagamento sem requisito explícito.
- Utilize Vue 3, Composition API, Pinia e Axios seguindo os padrões já adotados no projeto.
- Não adicione comentários desnecessários ao código.
- Faça alterações precisas e evite mudanças não relacionadas ao objetivo solicitado.

## Validação e comunicação

- Execute os testes aplicáveis e verifique lint e build antes de propor um merge.
- Ao concluir, explique os arquivos alterados, os testes realizados e eventuais problemas ou limitações encontrados.
