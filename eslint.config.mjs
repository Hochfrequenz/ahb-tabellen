import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default tseslint.config(
  {
    ignores: ['projects/**/*', '**/dist', 'src/app/core/api/**/*'],
  },
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],

      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],

      // angular-eslint's v22 recommended config newly errors on components that don't use
      // OnPush. The Angular 22 upgrade migration explicitly set every existing component to
      // `ChangeDetectionStrategy.Eager` to preserve pre-v22 behavior; switching them to OnPush
      // is a real runtime-behavior change (requires auditing each component for in-place
      // mutation) and is a deliberate follow-up, not a dependency-bump concern.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',

      // InputSearchEnhancedComponent intentionally aliases `searchQueryInput` to the public
      // `searchQuery` binding name to avoid colliding with its internal `searchQuery` signal.
      '@angular-eslint/no-input-rename': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  }
);
