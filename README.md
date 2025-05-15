# Sistema de Autenticação e Gerenciamento de Usuários

Este projeto foi desenvolvido por mim como parte do processo seletivo para a vaga de **Desenvolvedor Pleno** na empresa **Conéctar**. Trata-se de um sistema completo de autenticação e gerenciamento de usuários com controle de permissões, exportação de dados e layout responsivo. O foco foi atender todos os requisitos do desafio técnico, prezando por qualidade de código, segurança e boa experiência do usuário.

## 🧩 Tecnologias Utilizadas

### Frontend
- **React** com **TypeScript**
- **Vite** para build e performance
- **Tailwind CSS** para estilização responsiva
- **React Router DOM** para navegação
- **React Toastify** para feedbacks visuais
- **jsPDF** + **autoTable** para exportação em PDF

### Backend
- **NestJS** com TypeScript
- **TypeORM** com **PostgreSQL**
- **JWT** + **Passport** para autenticação
- **Guards e Decorators personalizados** para controle de acesso
- **Multer** para upload de imagem de perfil

## ✨ Funcionalidades

- Login com autenticação via JWT
- Cadastro de usuários
- Diferenciação entre **ADMIN** e **USER**
- **ADMIN** pode:
  - Listar todos os usuários
  - Editar qualquer usuário
  - Excluir qualquer usuário
- **USER** pode:
  - Editar apenas o próprio perfil
- Upload de imagem de perfil com preview
- Exportação da lista de usuários:
  - **CSV**
  - **PDF**
- Filtro de usuários por:
  - Nome
  - Email
  - Papel
- **Paginação**
- Respostas personalizadas para acesso não autorizado

## 📱 Responsividade

A aplicação é **100% responsiva**:
- Em **monitores e TVs**, os filtros e botões se organizam lado a lado de forma otimizada.
- Em **celulares**, os elementos são dispostos em colunas para melhor leitura e usabilidade.
- O layout foi ajustado com breakpoints personalizados para garantir um comportamento fluido em todas as telas.

## 🔒 Segurança e Controle de Acesso

O backend protege todas as rotas com:
- `JwtAuthGuard` para validar o token
- `RolesGuard` e `@Roles()` para limitar ações conforme o papel do usuário
- Validações em todas as edições e exclusões
- Apenas o **ADMIN** pode atualizar ou deletar qualquer usuário; os demais podem editar apenas seus próprios dados.

## 🧱 Estrutura

### Backend
```
src/
├── auth/
├── users/
├── common/
└── uploads/
```

### Frontend
```
src/
├── pages/
├── services/
├── components/
└── assets/
```

# Clone o repositório
git clone https://github.com/MiguelGomesO/conecta-user.git

# Acesse a pasta do projeto
cd conecta-user

## 🛠️ Criando o Primeiro ADMIN

Como o sistema precisa de um administrador inicial e não há cadastro direto via interface para `ADMIN`, o primeiro usuário deve ser inserido diretamente no banco com uma senha **sem hash**. Exemplo de comando SQL:

```sql
INSERT INTO users (name, email, password, role)
VALUES ('Admin Master', 'admin@email.com', '123456', 'ADMIN');
```

Após isso, ao fazer login, a senha será criptografada automaticamente na primeira atualização, pois o sistema aplica hash nos processos de autenticação e edição.

## 🙌 Considerações Finais

Este projeto foi uma excelente oportunidade para aplicar conhecimentos práticos de desenvolvimento fullstack moderno, desde autenticação segura até responsividade e exportação de dados. Estou muito satisfeito com o resultado e aberto a feedbacks e melhorias.

---

Desenvolvido com 💻 por **Miguel Gomes**