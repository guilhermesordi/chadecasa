# Chá de casa

Lista de presentes com contribuição parcial via PIX. Sem gateway de pagamento: a pessoa transfere, envia o comprovante e o percentual do item atualiza.

## Local

Copie `.env.example` para `.env`, preencha as chaves do Supabase e rode:

```bash
npm install
npm run db:setup
npm run dev
```

Abra http://localhost:3000. O admin fica em `/admin/login`.

## Produção

Deploy na Vercel com as mesmas variáveis do `.env`. Fotos e comprovantes vão para o Storage do Supabase.
