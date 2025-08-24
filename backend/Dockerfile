FROM oven/bun

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install

COPY . .

RUN apt-get update -y && apt-get install -y openssl

RUN bun prisma generate

COPY wait-for-it.sh /wait-for-it.sh

RUN chmod +x /wait-for-it.sh

EXPOSE 3000

CMD /wait-for-it.sh db:5432 -- bunx prisma db push && bun index.ts