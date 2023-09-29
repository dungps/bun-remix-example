dev:
	bun run dev

start:
	bun run server.ts

prisma-generate:
	bunx prisma generate

prisma-migrate:
	bunx prisma migrate dev

prisma-push:
	bunx prisma db push
	bun run ./prisma/seed.ts
