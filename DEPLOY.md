# 🚀 Vero MVP — Guia de Deploy

## O que você vai ter no final
- App Vero rodando em URL pública (ex: `vero-app.vercel.app`)
- Banco de dados PostgreSQL na nuvem (Supabase)
- Todos os dados persistidos: staff, checklists, tarefas, alertas
- Tempo estimado: **15–20 minutos**

---

## PASSO 1 — Criar conta no Supabase

1. Acesse **https://supabase.com** e clique em **"Start your project"**
2. Faça login com Google ou GitHub
3. Clique em **"New project"**
4. Preencha:
   - **Organization**: seu nome ou empresa
   - **Name**: `vero-app`
   - **Database Password**: crie uma senha forte (guarde ela)
   - **Region**: `South America (São Paulo)`
5. Clique **"Create new project"** e aguarde ~2 minutos

---

## PASSO 2 — Criar as tabelas no Supabase

1. No painel do Supabase, clique em **"SQL Editor"** (menu lateral)
2. Clique em **"New query"**
3. Abra o arquivo `supabase-schema.sql` (incluído no projeto)
4. Cole todo o conteúdo na caixa de texto
5. Clique em **"Run"** (botão verde)
6. Você deve ver: `Success. No rows returned`

✅ As tabelas `staff`, `checklists`, `tasks`, `templates`, `sectors` e `alerts` foram criadas com dados iniciais de exemplo.

---

## PASSO 3 — Pegar as credenciais do Supabase

1. No Supabase, clique em **"Project Settings"** (ícone de engrenagem no menu lateral)
2. Clique em **"API"**
3. Copie:
   - **Project URL** → vai para `REACT_APP_SUPABASE_URL`
   - **anon / public** key → vai para `REACT_APP_SUPABASE_ANON_KEY`

---

## PASSO 4 — Criar conta no Vercel e fazer o deploy

### Opção A — Via GitHub (Recomendado)

1. Suba a pasta `vero-app` para um repositório GitHub:
   ```bash
   cd vero-app
   git init
   git add .
   git commit -m "Vero MVP inicial"
   # Crie um repo no github.com, depois:
   git remote add origin https://github.com/SEU_USUARIO/vero-app.git
   git push -u origin main
   ```

2. Acesse **https://vercel.com** → **"Add New Project"**
3. Conecte sua conta GitHub e selecione o repositório `vero-app`
4. Na tela de configuração, adicione as **variáveis de ambiente**:
   - `REACT_APP_SUPABASE_URL` = sua URL do Supabase
   - `REACT_APP_SUPABASE_ANON_KEY` = sua chave anon do Supabase
5. Clique **"Deploy"**

### Opção B — Via Vercel CLI

```bash
# Instalar a CLI (precisa ter Node.js instalado)
npm i -g vercel

# Na pasta do projeto
cd vero-app
npm install

# Fazer login e deploy
vercel login
vercel --prod
```

Quando solicitado, adicione as variáveis de ambiente no painel do Vercel.

---

## PASSO 5 — Testar o app

1. Acesse a URL gerada pelo Vercel (ex: `https://vero-app-xyz.vercel.app`)
2. Faça login com as credenciais de exemplo:
   - **Admin**: `ana@vero.com` / `admin123`
   - **Equipe**: `bruno@vero.com` / `team123`
3. Crie novos checklists, tarefas e cadastre funcionários

---

## Estrutura dos arquivos entregues

```
vero-app/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx          ← App completo integrado com Supabase
│   ├── supabase.js      ← Cliente Supabase + helpers de banco
│   └── index.js         ← Entry point React
├── supabase-schema.sql  ← Script SQL para criar as tabelas
├── vercel.json          ← Configuração de roteamento Vercel
├── package.json         ← Dependências do projeto
└── .env.example         ← Modelo do arquivo de variáveis de ambiente
```

---

## Segurança — próximos passos (quando quiser evoluir)

O MVP usa políticas abertas no Supabase (qualquer um pode ler/escrever). Para produção segura:

1. **Supabase Auth**: usar autenticação nativa do Supabase em vez de senha em texto
2. **Row Level Security**: restringir cada usuário a ver apenas seus dados
3. **Storage para imagens**: usar Supabase Storage em vez de base64 para as fotos de evidência

---

## Suporte

Se algo der errado:
- Verifique o Console do navegador (F12) para erros
- Certifique-se que as variáveis de ambiente no Vercel estão corretas
- Certifique-se que o SQL rodou sem erros no Supabase
