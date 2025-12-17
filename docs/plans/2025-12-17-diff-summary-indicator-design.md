# Diff Summary Indicator Design

## Overview

Enhance the comparison landing page to show which prüfidentifikators have no changes between format versions. A small "=" badge appears after compare links where `added + deleted + modified === 0`.

## Visual Design

```
11001  UTILMD  [Old] [New] [Compare] (=)
11002  UTILMD  [Old] [New] [Compare]
11003  UTILMD  [Old] [New] [Compare] (=)
```

- Small circular badge with "=" symbol after the compare link
- Tooltip on hover: "No differences between versions"
- Only shown when all change counts are zero

## Technical Approach

### New API Endpoint

```
GET /api/ahb-diff-summary?format-version-new=FV2410&format-version-old=FV2404
```

**Response:**
```json
{
  "11001": { "added": 0, "deleted": 0, "modified": 0 },
  "11002": { "added": 5, "deleted": 2, "modified": 12 },
  "11003": { "added": 0, "deleted": 0, "modified": 0 }
}
```

### SQL Query

Single aggregation query on existing `v_ahb_diff` view:

```sql
SELECT
  COALESCE(new_pruefidentifikator, old_pruefidentifikator) as pruefi,
  SUM(CASE WHEN diff_status = 'added' THEN 1 ELSE 0 END) as added,
  SUM(CASE WHEN diff_status = 'deleted' THEN 1 ELSE 0 END) as deleted,
  SUM(CASE WHEN diff_status = 'modified' THEN 1 ELSE 0 END) as modified
FROM v_ahb_diff
WHERE new_format_version = ? AND old_format_version = ?
GROUP BY COALESCE(new_pruefidentifikator, old_pruefidentifikator)
```

## Implementation Steps

### 1. OpenAPI Specification

Update `openapi.yml`:

**New path** (after `/api/ahb-diff/{pruefi}`):

```yaml
/api/ahb-diff-summary:
  get:
    tags:
      - ahb
    summary: Get aggregated diff statistics for all Pruefidentifikators between two format versions
    operationId: getAhbDiffSummary
    parameters:
      - name: format-version-new
        in: query
        description: The newer format version to compare
        required: true
        schema:
          $ref: '#/components/schemas/FormatVersion'
      - name: format-version-old
        in: query
        description: The older format version to compare
        required: true
        schema:
          $ref: '#/components/schemas/FormatVersion'
    responses:
      '200':
        description: successful operation
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AhbDiffSummary'
```

**New schemas** (after `AhbDiffSide`):

```yaml
AhbDiffSummary:
  type: object
  description: Aggregated diff statistics per Pruefidentifikator
  additionalProperties:
    $ref: '#/components/schemas/AhbDiffStats'
  example:
    '11001': { added: 0, deleted: 0, modified: 0 }
    '11002': { added: 5, deleted: 2, modified: 12 }

AhbDiffStats:
  type: object
  description: Count of changes by type for a single Pruefidentifikator
  properties:
    added:
      type: integer
      description: Number of lines added (exist only in new version)
    deleted:
      type: integer
      description: Number of lines deleted (exist only in old version)
    modified:
      type: integer
      description: Number of lines with content changes
  required:
    - added
    - deleted
    - modified
```

### 2. Generate Angular Client

```bash
npm run ng-openapi-gen
```

This generates `getAhbDiffSummary()` in the API client.

### 3. Backend Implementation

**File: `src/server/repository/ahbDiff.ts`**

Add interface and method:

```typescript
export interface AhbDiffStats {
  added: number;
  deleted: number;
  modified: number;
}

export type AhbDiffSummary = Record<string, AhbDiffStats>;

public async getSummary(
  formatVersionNew: string,
  formatVersionOld: string
): Promise<AhbDiffSummary> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const query = `
    SELECT
      COALESCE(new_pruefidentifikator, old_pruefidentifikator) as pruefi,
      SUM(CASE WHEN diff_status = 'added' THEN 1 ELSE 0 END) as added,
      SUM(CASE WHEN diff_status = 'deleted' THEN 1 ELSE 0 END) as deleted,
      SUM(CASE WHEN diff_status = 'modified' THEN 1 ELSE 0 END) as modified
    FROM v_ahb_diff
    WHERE new_format_version = ? AND old_format_version = ?
    GROUP BY COALESCE(new_pruefidentifikator, old_pruefidentifikator)
  `;

  const rows: { pruefi: string; added: number; deleted: number; modified: number }[] =
    await AppDataSource.query(query, [formatVersionNew, formatVersionOld]);

  const result: AhbDiffSummary = {};
  for (const row of rows) {
    result[row.pruefi] = {
      added: row.added,
      deleted: row.deleted,
      modified: row.modified,
    };
  }
  return result;
}
```

**File: `src/server/controller/ahbDiff.ts`**

Add method:

```typescript
public async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const formatVersionNew = req.query['format-version-new'] as string;
    const formatVersionOld = req.query['format-version-old'] as string;

    if (!formatVersionNew || !/^FV\d{4}$/.test(formatVersionNew)) {
      throw new ValidationError(
        `Invalid format-version-new: ${formatVersionNew}. Expected pattern: FV followed by 4 digits.`
      );
    }

    if (!formatVersionOld || !/^FV\d{4}$/.test(formatVersionOld)) {
      throw new ValidationError(
        `Invalid format-version-old: ${formatVersionOld}. Expected pattern: FV followed by 4 digits.`
      );
    }

    const result = await this.repository.getSummary(formatVersionNew, formatVersionOld);

    res.status(200).setHeader('Content-Type', 'application/json').json(result);
  } catch (error) {
    next(error);
  }
}
```

**File: `src/server/infrastructure/api.routes.ts`**

Add route (before the `/ahb-diff/:pruefi` route):

```typescript
router.get('/ahb-diff-summary', (req, res, next) => {
  ahbDiffController.getSummary(req, res, next);
});
```

### 4. Frontend Implementation

**File: `src/app/features/comparison/components/pruefi-overview/pruefi-overview.component.ts`**

Add:

```typescript
import { AhbService } from '@core/api/services';

// Inject service
private ahbService = inject(AhbService);

// Add signal for summary data
diffSummary = signal<Record<string, { added: number; deleted: number; modified: number }>>({});

// In ngOnInit or where format versions are set, fetch the summary:
private loadDiffSummary(fvOld: string, fvNew: string): void {
  this.ahbService.getAhbDiffSummary({
    'format-version-new': fvNew,
    'format-version-old': fvOld,
  }).subscribe({
    next: (summary) => this.diffSummary.set(summary),
    error: (err) => console.error('Failed to load diff summary', err),
  });
}

// Helper method for template
hasNoChanges(pruefi: string): boolean {
  const stats = this.diffSummary()[pruefi];
  if (!stats) return false;
  return stats.added === 0 && stats.deleted === 0 && stats.modified === 0;
}
```

**File: `src/app/features/comparison/components/pruefi-overview/pruefi-overview.component.html`**

After the compare link, add:

```html
@if (hasNoChanges(pruefi.pruefidentifikator)) {
  <span
    class="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 text-gray-400 text-xs"
    matTooltip="No differences between versions"
  >
    =
  </span>
}
```

## Files Changed

1. `openapi.yml` - New endpoint and schemas
2. `src/server/repository/ahbDiff.ts` - Add `getSummary()` method
3. `src/server/controller/ahbDiff.ts` - Add `getSummary()` handler
4. `src/server/infrastructure/api.routes.ts` - Add route
5. `src/app/features/comparison/components/pruefi-overview/pruefi-overview.component.ts` - Fetch and store summary
6. `src/app/features/comparison/components/pruefi-overview/pruefi-overview.component.html` - Render badge

## Testing

1. Start the server and navigate to comparison landing page
2. Select two format versions
3. Verify API call to `/api/ahb-diff-summary` returns expected data
4. Verify "=" badges appear next to prüfis with zero changes
5. Verify tooltip displays on hover
6. Click a badged compare link to confirm the comparison page shows no differences
