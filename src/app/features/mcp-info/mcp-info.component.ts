import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FooterComponent } from '../../shared/components/footer/footer.component';

/**
 * End-user facing German instructions for connecting the AHB-Tabellen MCP server to an
 * AI assistant. Intentionally links out to each tool's official manual and only documents
 * the specifics of *our* server (the endpoint URL + login note).
 */
@Component({
  selector: 'app-mcp-info',
  standalone: true,
  imports: [RouterLink, FooterComponent],
  templateUrl: './mcp-info.component.html',
})
export class McpInfoComponent implements OnInit {
  /**
   * The MCP endpoint lives at `/mcp` on the same origin the app is served from, so this
   * is correct for whichever environment (stage/prod) the user is currently on.
   */
  readonly mcpUrl = `${window.location.origin}/mcp`;

  /**
   * Ready-to-paste opencode MCP config (see opencode.json). Held as a bound string so the
   * JSON's literal braces don't collide with Angular's `{{ }}` / ICU template syntax.
   */
  readonly opencodeConfig = `{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "ahb-tabellen": {
      "type": "remote",
      "url": "${window.location.origin}/mcp",
      "enabled": true
    }
  }
}`;

  copied = false;

  constructor(private readonly title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('AHB-Tabellen - MCP-Integration');
  }

  async copyUrl(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.mcpUrl);
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. non-secure context) — silently ignore.
    }
  }
}
