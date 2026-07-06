import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * End-user facing German instructions for connecting the AHB-Tabellen MCP server to an
 * AI assistant. Intentionally links out to each tool's official manual and only documents
 * the specifics of *our* server (the endpoint URL + login note).
 */
@Component({
  selector: 'app-mcp-info',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mcp-info.component.html',
})
export class McpInfoComponent {
  /**
   * The MCP endpoint lives at `/mcp` on the same origin the app is served from, so this
   * is correct for whichever environment (stage/prod) the user is currently on.
   */
  readonly mcpUrl = `${window.location.origin}/mcp`;
}
