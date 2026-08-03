import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Copy, Plug, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TITLE = "Connect an AI Assistant to AgriSense AI";
const DESCRIPTION =
  "Step-by-step instructions to connect ChatGPT, Claude, Claude Code or any MCP client to AgriSense AI, and how to refresh the connection after updates.";
const URL_ = "https://agri-sense-grow-00.lovable.app/connect";

const APP_NAME = "AgriSense AI";
const SERVER_SLUG = "agrisense-ai";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL_ },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL_ }],
  }),
  component: ConnectPage,
});

function useMcpUrl() {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(new URL("/mcp", window.location.origin).toString());
  }, []);
  return url;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={!value}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ol>
  );
}

function ConnectPage() {
  const mcpUrl = useMcpUrl();
  const installCommand = `claude mcp add --scope user --transport http ${SERVER_SLUG} '${mcpUrl}'`;

  const chatgptCreate =
    "https://chatgpt.com/plugins#settings/Connectors?create-connector=true&redirectAfter=%2Fplugins";
  const claudeAdd = mcpUrl
    ? `https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=${encodeURIComponent(
        APP_NAME,
      )}&connectorUrl=${encodeURIComponent(mcpUrl)}`
    : "https://claude.ai/customize/connectors";

  return (
    <div className="min-h-screen bg-background">
      <header className="surface-field">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-8">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-white/15">
            <Plug className="size-6" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold">
              Connect an AI assistant to {APP_NAME}
            </h1>
            <p className="text-sm opacity-85">
              Let ChatGPT, Claude or another assistant look up conditions and recommend crops for you
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-5 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Your server address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Copy this address — every assistant below asks for it. You'll be asked to sign in to{" "}
              {APP_NAME} the first time you connect.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <code className="flex-1 break-all rounded-md border bg-muted px-3 py-2 font-mono text-sm">
                {mcpUrl || "Loading…"}
              </code>
              <CopyButton value={mcpUrl} label="Copy address" />
            </div>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <div>
            <h2 className="font-display text-xl font-semibold">Connect your assistant</h2>
            <p className="text-sm text-muted-foreground">
              Pick the assistant you use and follow the steps.
            </p>
          </div>

          <Tabs defaultValue="chatgpt">
            <TabsList className="flex-wrap">
              <TabsTrigger value="chatgpt">ChatGPT</TabsTrigger>
              <TabsTrigger value="claude">Claude</TabsTrigger>
              <TabsTrigger value="claude-code">Claude Code</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            <TabsContent value="chatgpt" className="pt-4">
              <Steps
                items={[
                  <>
                    Open{" "}
                    <a
                      className="underline underline-offset-4"
                      href="https://chatgpt.com/#settings/Connectors/Advanced"
                      target="_blank"
                      rel="noreferrer"
                    >
                      ChatGPT's Apps settings
                    </a>{" "}
                    and turn on Developer mode, reading the risk notice shown there. If you can't see
                    it, ask a ChatGPT admin to enable it.
                  </>,
                  <>
                    Open the{" "}
                    <a
                      className="underline underline-offset-4"
                      href={chatgptCreate}
                      target="_blank"
                      rel="noreferrer"
                    >
                      New plugin dialog
                    </a>
                    .
                  </>,
                  <>
                    Enter <strong>{APP_NAME}</strong> as the name and paste the address from above
                    into the URL field.
                  </>,
                  <>
                    Review the details, tick “I understand and want to continue” — ChatGPT shows this
                    warning for every custom server — then click <strong>Create</strong>.
                  </>,
                  <>
                    Enable {APP_NAME} from the chat composer, then ask ChatGPT to use it, e.g. “What
                    should I plant near Nashik this month?”
                  </>,
                ]}
              />
            </TabsContent>

            <TabsContent value="claude" className="pt-4">
              <Steps
                items={[
                  <>
                    Open the{" "}
                    <a
                      className="underline underline-offset-4"
                      href={claudeAdd}
                      target="_blank"
                      rel="noreferrer"
                    >
                      custom connector dialog
                    </a>{" "}
                    — the name and address are filled in for you.
                  </>,
                  <>
                    Review the details and click <strong>Add</strong>.
                  </>,
                  <>
                    If the pre-filled form doesn't open, go to Claude's Connectors page, choose{" "}
                    <strong>Add custom connector</strong>, name it {APP_NAME} and paste the address
                    from above.
                  </>,
                  <>
                    Enable the connector from the chat composer, then ask Claude to use {APP_NAME}.
                  </>,
                ]}
              />
            </TabsContent>

            <TabsContent value="claude-code" className="space-y-3 pt-4">
              <Steps
                items={[
                  <>Run this command in a terminal:</>,
                  <>
                    Start Claude Code and run <code className="font-mono">/mcp</code> to confirm{" "}
                    {APP_NAME} is connected — sign in from that menu when prompted.
                  </>,
                  <>Ask Claude Code to use {APP_NAME}.</>,
                ]}
              />
              <div className="flex flex-wrap items-center gap-3">
                <code className="flex-1 break-all rounded-md border bg-muted px-3 py-2 font-mono text-xs">
                  {mcpUrl ? installCommand : "Loading…"}
                </code>
                <CopyButton value={mcpUrl ? installCommand : ""} label="Copy command" />
              </div>
            </TabsContent>

            <TabsContent value="other" className="pt-4">
              <Steps
                items={[
                  <>Open your assistant's MCP server or custom connector settings.</>,
                  <>Create a new remote MCP server connection.</>,
                  <>
                    Name it {APP_NAME} and paste the address from above.
                  </>,
                  <>Finish any sign-in or authorisation prompts.</>,
                  <>Enable the connection, then ask the assistant to use {APP_NAME}.</>,
                ]}
              />
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="font-display text-xl font-semibold">Refresh after we update the app</h2>
            <p className="text-sm text-muted-foreground">
              Assistants remember what {APP_NAME} could do when you connected. After an update,
              refresh the connection so it picks up the latest capabilities.
            </p>
          </div>

          <Tabs defaultValue="chatgpt-r">
            <TabsList className="flex-wrap">
              <TabsTrigger value="chatgpt-r">ChatGPT</TabsTrigger>
              <TabsTrigger value="claude-r">Claude</TabsTrigger>
              <TabsTrigger value="claude-code-r">Claude Code</TabsTrigger>
              <TabsTrigger value="other-r">Other</TabsTrigger>
            </TabsList>

            <TabsContent value="chatgpt-r" className="pt-4">
              <Steps
                items={[
                  <>Open ChatGPT's app preferences and pick {APP_NAME} under “Enabled apps”.</>,
                  <>
                    Next to “Information”, click <strong>Refresh</strong>.
                  </>,
                  <>If the address changed, paste the latest one from above.</>,
                  <>Start a new chat and ask ChatGPT to use {APP_NAME}.</>,
                ]}
              />
            </TabsContent>

            <TabsContent value="claude-r" className="pt-4">
              <Steps
                items={[
                  <>Open the Connectors page and select the {APP_NAME} connector.</>,
                  <>Refresh or update the connector's tools.</>,
                  <>If the address changed, paste the latest one from above.</>,
                  <>Ask Claude to use {APP_NAME}.</>,
                ]}
              />
            </TabsContent>

            <TabsContent value="claude-code-r" className="pt-4">
              <Steps
                items={[
                  <>Start a new Claude Code session — it reloads {APP_NAME} when it connects.</>,
                  <>
                    If the address changed, run{" "}
                    <code className="font-mono">claude mcp remove {SERVER_SLUG}</code>, then run the
                    install command above again.
                  </>,
                  <>Ask Claude Code to use {APP_NAME}.</>,
                ]}
              />
            </TabsContent>

            <TabsContent value="other-r" className="pt-4">
              <Steps
                items={[
                  <>Open your assistant's MCP server or connector settings.</>,
                  <>Select the connection you created for {APP_NAME}.</>,
                  <>Refresh the tool list, reload the server, or reconnect it.</>,
                  <>If the address changed, paste the latest one from above.</>,
                  <>Start a new chat and ask the assistant to use {APP_NAME}.</>,
                ]}
              />
            </TabsContent>
          </Tabs>
        </section>

        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Prefer to work in the app? The{" "}
            <Link to="/" className="underline underline-offset-4">
              crop recommender
            </Link>{" "}
            gives you the same recommendations with full explanations.
          </p>
        </div>
      </main>

      <footer className="border-t px-5 py-6 text-center text-xs text-muted-foreground">
        <Link to="/" className="underline underline-offset-4">
          <Sprout className="mr-1 inline size-3" />
          Back to {APP_NAME}
        </Link>
      </footer>
    </div>
  );
}
