// The open-source tools listed on /tools/.
//
// Unlike Writing, About and Up Next, this page is NOT sourced from WordPress.
// The content here is structured (install command, repo, npm package, licence)
// rather than prose, and putting shell commands through Gutenberg invites
// smart-quote damage. Adding a tool is a data edit here, which is git-shaped
// anyway since shipping one already involves git.

export interface Tool {
  /** GitHub repo name under github.com/pluginslab */
  repo: string;
  name: string;
  /** One line, sentence case, no trailing period. */
  tagline: string;
  /** Two or three sentences. What problem it solves, and how. */
  body: string;
  /** Shell one-liner. Omitted when there isn't a single sensible command. */
  install?: string;
  /** npm package name, when published. */
  npm?: string;
  license: "MIT" | "GPL-2.0";
}

export interface ToolGroup {
  id: string;
  title: string;
  /** The argument for why these belong together. */
  blurb: string;
  tools: Tool[];
}

export const TOOL_GROUPS: ToolGroup[] = [
  {
    id: "mcp-trio",
    title: "The WordPress MCP trio",
    blurb:
      "Three MCP servers that cover the whole loop: author, validate, test. Language models are confidently wrong about WordPress in very specific ways, inventing hooks that sound right, generating block markup the editor rejects, and never running any of it. Each server replaces a guess with a lookup against real source code.",
    tools: [
      {
        repo: "wp-devdocs-mcp",
        name: "wp-devdocs-mcp",
        tagline: "A verified hook database instead of a confident guess",
        body: "Indexes every action, filter, block registration and JS API call from WordPress, WooCommerce, Gutenberg, or any plugin you point it at, including your own private ones that no model has ever seen. The agent searches the index and validates the name before it writes the line, so `woocommerce_email_after_order_details` never makes it into a file. Exact parameters, docblocks and file locations come back with it.",
        install: "npx wp-devdocs-mcp",
        npm: "wp-devdocs-mcp",
        license: "MIT",
      },
      {
        repo: "wp-blockmarkup-mcp",
        name: "wp-blockmarkup-mcp",
        tagline: "Gutenberg markup that survives the editor",
        body: "Extracts every block's real attribute schema and validates generated markup through two tiers: the official WordPress block parser for structure, then the block's own `save()` function AST for output. That is the difference between `has-vivid-red-background-color` and the plausible-looking string a model would otherwise produce. 121 core blocks indexed, every static markup example passing both tiers.",
        install: "npx wp-blockmarkup-mcp",
        npm: "wp-blockmarkup-mcp",
        license: "MIT",
      },
      {
        repo: "wp-playground-mcp",
        name: "wp-playground-mcp",
        tagline: "A disposable WordPress the agent can actually run code in",
        body: "Wraps WordPress Playground so an assistant can boot a full WordPress in WebAssembly, run WP-CLI against it, read the PHP error log, and tear it down leaving nothing behind. No Docker, no MySQL, no server config. It closes the loop: the agent stops iterating blind and finds out whether the tab it hooked actually appears.",
        install: "npx wp-playground-mcp",
        npm: "wp-playground-mcp",
        license: "MIT",
      },
    ],
  },
  {
    id: "harness",
    title: "The harness",
    blurb:
      "The servers give an agent good information. This is the structure around it: what the agent reads first, who reviews its work, and which gates it cannot talk its way past.",
    tools: [
      {
        repo: "wp-agentic-kit",
        name: "wp-agentic-kit",
        tagline: "The agentic setup I actually use, packaged to install once",
        body: "Annotated `CLAUDE.md` and `AGENTS.md`, two interview-driven skills for scaffolding a plugin and adding a feature, read-only reviewer subagents that audit the plan and the security surface before sign-off, and deterministic hooks including a blocking pre-commit gate. Durable plan files carry context across sessions. Structured around the four D's from the WordCamp Portugal talk: delegation, description, discernment, diligence.",
        install: "npm create wp-ai-plugin my-plugin",
        npm: "create-wp-ai-plugin",
        license: "MIT",
      },
    ],
  },
  {
    id: "also",
    title: "Also",
    blurb:
      "One tool for anyone living in Claude Code all day, and one that is less a developer tool than an argument about where AI should run.",
    tools: [
      {
        repo: "wims",
        name: "wims",
        tagline: "Find and resume any Claude Code session, from any folder",
        body: "`claude --resume` only lists sessions for the directory you happen to be standing in, so a good session from three days and forty folders ago is effectively lost. wims lists every session on the machine, lets you search and preview them, and drops your shell into the right folder with the conversation resumed. Not WordPress-specific, and the one I reach for most.",
        install: "npm install -g @pluginslab/wims",
        npm: "@pluginslab/wims",
        license: "MIT",
      },
      {
        repo: "wp-agentic-admin",
        name: "wp-agentic-admin",
        tagline: "A site reliability engineer that never leaves the browser",
        body: "Describe the problem in plain English inside wp-admin and a local model reads the error log, names the plugin at fault, proposes a fix and applies it with your approval. The model runs in the browser through WebLLM and WebGPU, so no admin data reaches a third party, there are no API costs and no GPU to rent. Built at the CloudFest Hackathon 2026 with 13 contributors, on the WordPress Abilities API.",
        license: "GPL-2.0",
      },
    ],
  },
];

export const ALL_TOOLS: Tool[] = TOOL_GROUPS.flatMap((g) => g.tools);
