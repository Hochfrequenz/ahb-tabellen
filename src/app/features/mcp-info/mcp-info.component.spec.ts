import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { McpInfoComponent } from './mcp-info.component';

describe('McpInfoComponent', () => {
  let component: McpInfoComponent;
  let fixture: ComponentFixture<McpInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [McpInfoComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(McpInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('derives the MCP endpoint URL from the current origin', () => {
    expect(component.mcpUrl).toBe(`${window.location.origin}/mcp`);
  });

  it('renders the endpoint URL and links to the tool manuals', () => {
    const html = (fixture.nativeElement as HTMLElement).innerHTML;
    expect(html).toContain(`${window.location.origin}/mcp`);
    expect(html).toContain('modelcontextprotocol.io/docs/tutorials/use-remote-mcp-server');
    expect(html).toContain('code.visualstudio.com/docs/copilot/chat/mcp-servers');
    expect(html).toContain('opencode.ai/docs/mcp-servers');
  });
});
