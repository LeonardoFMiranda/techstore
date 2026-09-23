# TechStore — Loja com Checkout Real

> Projeto de portfólio: loja virtual com Next.js 15, Stripe e painel administrativo.

## 🚀 Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Estilo | Vanilla CSS + shadcn/ui |
| Estado do carrinho | Zustand + localStorage |
| Pagamento | Stripe Checkout + Webhooks |
| Banco de dados | Prisma 5 + PostgreSQL (Neon/Supabase) |
| Autenticação | Clerk |
| Upload de imagem | UploadThing |
| Deploy | Vercel |

## ✨ Funcionalidades

### Loja (cliente)
- 🛍️ Catálogo com filtro por categoria e busca por nome
- 📦 Página de produto com galeria de imagens e seletor de quantidade  
- 🛒 Carrinho com drawer lateral persistido no localStorage
- 💳 Checkout via Stripe (modo teste)
- ✅ Página de confirmação de pedido (dados do banco, não da URL)
- 📋 Histórico de pedidos do cliente

### Painel Admin
- 🔧 CRUD de produtos com upload de imagem
- 📊 Dashboard com métricas de vendas
- 📦 Gestão de pedidos e status
- 🔒 Protegido por role ADMIN via Clerk

### Segurança / Boas práticas
- **Webhook-first**: pedidos só são marcados como PAID via webhook do Stripe (assinatura verificada)
- **Preços no servidor**: preços vêm do banco, nunca do cliente
- **Idempotência**: webhook verifica se pedido já foi processado
- **Role-based auth**: rotas admin protegidas por middleware + server-side check

## ⚙️ Configuração

### 1. Clone e instale
```bash
git clone <repo>
cd loja
npm install
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
# Preencha as chaves no .env.local
```

Crie contas e pegue as chaves em:
- **Stripe**: https://stripe.com (modo teste)
- **Clerk**: https://clerk.com
- **Neon**: https://neon.tech (PostgreSQL grátis)
- **UploadThing**: https://uploadthing.com

### 3. Configure o banco e o seed
```bash
npm run db:push    # Aplica o schema no banco
npm run db:seed    # Popula com 10 produtos de exemplo
```

### 4. Configure um usuário ADMIN
Depois de criar sua conta no app, rode no banco:
```sql
INSERT INTO "UserRole" (id, "userId", role, "createdAt")
VALUES (gen_random_uuid(), 'seu_clerk_user_id', 'ADMIN', NOW());
```

### 5. Inicie o servidor
```bash
npm run dev
```

### 6. Teste webhooks do Stripe localmente
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 💳 Cartões de teste Stripe

| Cartão | Resultado |
|--------|-----------|
| `4242 4242 4242 4242` | ✅ Aprovado |
| `4000 0000 0000 0002` | ❌ Recusado |
| `4000 0025 0000 3155` | 🔐 3D Secure |

## 📁 Estrutura do projeto

```
app/
  (store)/          # Loja pública
    page.tsx         # Catálogo
    produtos/[slug]/ # Página do produto
    carrinho/        # Carrinho
    pedido/          # Confirmação de pedido
    minha-conta/     # Histórico do cliente
  (admin)/admin/     # Painel administrativo
  api/webhooks/stripe/ # Webhook do Stripe
  actions/           # Server Actions
components/
  store/             # Componentes da loja
  admin/             # Componentes do admin
  ui/                # shadcn/ui
lib/
  db.ts              # Prisma singleton
  stripe.ts          # Cliente Stripe
  store/cart.ts      # Zustand store
  utils.ts           # Utilitários
  validations.ts     # Schemas Zod
prisma/
  schema.prisma      # Modelos de dados
  seed.ts            # Dados de exemplo
```

## 🌐 Deploy na Vercel

1. Push para o GitHub
2. Importe no Vercel
3. Configure as variáveis de ambiente (incluindo `STRIPE_WEBHOOK_SECRET` de produção)
4. Configure o endpoint do webhook no Stripe Dashboard: `https://seu-app.vercel.app/api/webhooks/stripe`

---

Projeto de portfólio | Next.js + Stripe + Prisma + Clerk
