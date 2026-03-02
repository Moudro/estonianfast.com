# Stripe + Accounts + Teams + Analytics Blueprint

## Recommended stack
- Frontend: Next.js (App Router) or your current HTML app with progressive migration.
- Backend: Node.js + Express (or Next.js API routes).
- Database: Postgres.
- Auth: Supabase Auth, Clerk, or Auth0 (email verification + password reset built in).
- Payments: Stripe Checkout + Stripe Webhooks.
- Email: Resend / Postmark / SendGrid.
- Analytics: PostHog + internal admin tables.

## 1) Simple checkout page

### Frontend flow
- Button click calls your backend: `POST /api/checkout/session`.
- Backend returns `{ url }` from Stripe Checkout Session.
- Frontend redirects user to `url`.

```js
async function startCheckout(priceId) {
  const res = await fetch('/api/checkout/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId })
  });
  const data = await res.json();
  if (data.url) window.location.href = data.url;
}
```

### Backend endpoint
```js
app.post('/api/checkout/session', requireAuth, async (req, res) => {
  const { priceId } = req.body;
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: req.user.email,
    success_url: `${APP_URL}/?subscribed=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/billing?canceled=1`,
    metadata: { userId: req.user.id }
  });
  res.json({ url: session.url });
});
```

## 2) Process payments securely

Rules:
- Never trust frontend payment success flags as source of truth.
- Use Stripe webhook signature verification.
- Update subscription status only from webhooks.

```js
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Upsert subscription record for session.metadata.userId
  }

  if (event.type === 'invoice.payment_failed') {
    // Mark account as past_due and notify user
  }

  if (event.type === 'customer.subscription.deleted') {
    // Revoke paid access
  }

  res.json({ received: true });
});
```

## 3) Send confirmation emails

Send from webhook handlers, not from client callback pages.

```js
await emailClient.send({
  to: user.email,
  subject: 'Your Estonian OS subscription is active',
  html: `<p>Thanks. Your plan is active now.</p>`
});
```

Email events to send:
- `checkout.session.completed`: welcome + receipt link.
- `invoice.payment_failed`: card update CTA.
- `customer.subscription.deleted`: access changed notice.
- Trial ending reminder: 48h before day 10 ends.

## 4) Authentication, account management, email verification, password reset

Use managed auth provider features instead of custom crypto.

Core requirements:
- Email verification required before paid checkout.
- Password reset with one-time token links.
- Session invalidation on password change.
- Optional 2FA for admins.

If using Supabase/Auth0/Clerk, enable:
- Email verification on signup.
- Password reset email template.
- Protected routes middleware.

Account pages:
- `/account/profile`
- `/account/security`
- `/account/billing`

## 5) Team / multi-user support

Data model:
```sql
create table teams (
  id uuid primary key,
  name text not null,
  owner_user_id uuid not null,
  created_at timestamptz default now()
);

create table team_members (
  team_id uuid not null,
  user_id uuid not null,
  role text not null check (role in ('owner','admin','member')),
  primary key (team_id, user_id)
);

create table team_resources (
  id uuid primary key,
  team_id uuid not null,
  resource_type text not null,
  payload jsonb not null,
  created_at timestamptz default now()
);
```

Authorization rules:
- Owner/admin can invite and remove members.
- Member can access shared resources only for their team.
- Every API query must scope by `team_id` from membership.

## 6) Usage limits and tiers with 4-digit free code

Define limits table:
```sql
create table plans (
  id text primary key,
  monthly_price_cents int not null,
  daily_task_limit int not null,
  team_member_limit int not null,
  audio_minutes_limit int not null
);
```

4-digit code support:
```sql
create table access_codes (
  code char(4) primary key,
  plan_id text not null,
  max_redemptions int not null,
  redeemed_count int not null default 0,
  expires_at timestamptz
);
```

Redemption flow:
- User enters code in `/redeem`.
- Backend validates code, expiry, and redemption count.
- Assigns temporary free tier (or trial extension).
- Increment redemption count in one DB transaction.

Rate limit + fraud controls:
- Limit attempts per IP/account.
- Lock code attempts after repeated failures.

## 7) Admin analytics dashboard

Track events:
```sql
create table app_events (
  id bigserial primary key,
  user_id uuid,
  team_id uuid,
  event_name text not null,
  event_time timestamptz default now(),
  properties jsonb
);
```

Minimum dashboard views:
- Daily signups.
- Trial start to paid conversion.
- MRR and active subscriptions.
- Churn rate.
- WAU / MAU.
- Task completion by day and cohort.
- Retention risk distribution (high/medium/low).

Recommended admin routes:
- `GET /admin/metrics/overview`
- `GET /admin/metrics/revenue`
- `GET /admin/metrics/conversion`
- `GET /admin/metrics/usage`

Protect admin routes with:
- Auth required
- Role check (`admin`)
- Audit logging for admin actions

## Rollout sequence
1. Stripe Checkout + webhooks + subscription state.
2. Auth hardening (verification + reset).
3. Team membership model.
4. Usage limits + 4-digit code redemption.
5. Admin analytics and cohort retention reports.

## Production checklist
- Webhook signature verification enabled.
- Idempotency keys for payment writes.
- Secrets only from env vars.
- Email domain configured with SPF/DKIM.
- Data retention and deletion policy documented.
- Monitoring + alerting for payment failures.
