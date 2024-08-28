# art-contest

This is the code for the art contest in the r/JaidenAnimations server.

Please note that just like the code from the first contest, this is **not** production quality code. Due to the timing and templates i used, getting this thing into a proper state was not feasible.

Besides the rework (which was done because heroku no longer offers free tiers), was equally rushed, and code quality really wasn't a thing to think about.

~~The only thing that is at least in a 'presentable' state, is the server process. I put this all in a single file because i didn't think it would be so much code, and i wanted to keep as much of the server itself contained.~~

The server is semi clean code. it uses the nitro engine built into nuxt.

I only need(ed) to keep this code usable until the art contest was finished.

TL;DR Just don't use this code to judge me, and absolutely don't use this code as an example on how to do things yourself!

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
