# Umbilicus — Deploy

## Estructura

```
umbilicus-deploy/
├── index.html        ← la app completa
├── api/
│   └── claude.js     ← Edge Function proxy (oculta la API key)
├── vercel.json       ← config de rutas
└── README.md
```

## Deploy en Vercel

### 1. Subir a GitHub
```bash
git init
git add .
git commit -m "umbilicus v1"
gh repo create umbilicus --private
git push -u origin main
```

### 2. Conectar en Vercel
- vercel.com → Add New Project → importar el repo
- Framework: **Other**
- Root directory: `/` (default)

### 3. Variable de entorno
En Vercel → Settings → Environment Variables:
```
ANTHROPIC_API_KEY = sk-ant-...
```

### 4. Deploy
```bash
vercel --prod
```

O simplemente pusheá a `main` y Vercel hace el deploy automático.

---

## Dominio personalizado

En Vercel → Settings → Domains → agregar `umbilicus.app` o `forkyou.quest/umbilicus`.

Si usás subpath (`forkyou.quest/umbilicus`), configurar en el DNS del dominio principal con un rewrite.

---

## Paywall real (próximo paso)

El botón "Desbloquear" y "Regalar" actualmente simulan el pago.
Para conectar Stripe:

1. Crear cuenta en stripe.com
2. Agregar Edge Function `api/checkout.js` que crea un Stripe Checkout Session
3. Redirigir al usuario a la URL de Stripe
4. Webhook `api/webhook.js` que escucha `checkout.session.completed` y devuelve un token
5. El frontend desbloquea con ese token

O MercadoPago si preferís para el mercado local — misma lógica, distinta API.

---

## Costos estimados

| Item | Costo |
|------|-------|
| Análisis free (1 llamada Claude) | ~$0.015 |
| Análisis pro completo (3 llamadas) | ~$0.045 |
| Vercel hosting | $0 (free tier) |
| Margen por venta a $4.99 | ~$4.94 |
