# Workspace quick start

For application installation and usage, see the [ngx-lift](../libs/ngx-lift/README.md) and
[clr-lift](../libs/clr-lift/README.md) package READMEs. This guide covers workspace development.

## Setup

Use the Node version required by package.json engines and the pnpm version declared in packageManager. Install Git, then
run:

```bash
git clone https://github.com/wghglory/ngx-lift-workspace.git
cd ngx-lift-workspace
pnpm install --frozen-lockfile
pnpm start
```

The demo opens at http://localhost:4200. Library source aliases support local development; production builds create
packages under dist/libs and the demo under dist/apps/demo/browser.

## Workspace

| Location      | Purpose                                                    |
| ------------- | ---------------------------------------------------------- |
| apps/demo     | Interactive examples and locale dictionaries               |
| apps/demo-e2e | Playwright browser tests                                   |
| libs/ngx-lift | Core Angular utilities                                     |
| libs/clr-lift | Clarity components and extensions                          |
| tools         | Consumer, bundle, translation and other verification tools |
| docs          | [Guides, contracts and roadmap](README.md)                 |

Continue with the [command reference](COMMANDS.md), [API specifications](design/README.md) or
[integration guide](guides/demo-and-library-integration.md). Publishing is covered by [DEPLOYMENT](DEPLOYMENT.md).
