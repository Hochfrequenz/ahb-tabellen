import AhbService from '../service/ahb.service';
import AhbDiffService from '../service/ahbDiff.service';
import MetadataService from '../service/metadata.service';

/**
 * The transport-agnostic services the MCP tools delegate to. Bundled so the tool
 * handlers can be constructed and unit-tested with mocked services.
 */
export interface McpServices {
  ahb: AhbService;
  ahbDiff: AhbDiffService;
  metadata: MetadataService;
}

export function createMcpServices(): McpServices {
  return {
    ahb: new AhbService(),
    ahbDiff: new AhbDiffService(),
    metadata: new MetadataService(),
  };
}
