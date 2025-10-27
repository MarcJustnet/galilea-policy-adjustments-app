import { FlatCompat } from '@eslint/eslintrc'
// Import all necessary plugins
import js from '@eslint/js'
import eslintPluginTanstackQuery from '@tanstack/eslint-plugin-query'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginN from 'eslint-plugin-n'
import eslintPluginPromise from 'eslint-plugin-promise'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh'

const compat = new FlatCompat({
    recommendedConfig: js.configs.recommended
})

export default [
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                console: 'readonly',
                fetch: 'readonly'
            }
        },
        plugins: {
            'n': eslintPluginN,
            'react': eslintPluginReact,
            'react-hooks': eslintPluginReactHooks,
            'react-refresh': eslintPluginReactRefresh,
            'promise': eslintPluginPromise,
            'import': eslintPluginImport,
            '@tanstack/query': eslintPluginTanstackQuery,
        },
        // settings: {
        //     react: {
        //         version: '19.0.0'
        //     },
        //     'import/resolver': {
        //         node: {
        //             extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.d.ts']
        //         }
        //     }
        // }
    },
    ...compat.extends(
        'eslint:recommended',
        'plugin:n/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:promise/recommended',
        'plugin:import/recommended',
    ),
    {
        rules: {
            // eslint
            'no-extend-native': 'off',
            'symbol-description': 'off',
            'semi': ['error', 'never'],
            'no-multi-spaces': ['error', { ignoreEOLComments: true }],
            'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
            'no-trailing-spaces': ['error', { skipBlankLines: true }],
            // n
            'n/exports-style': ['error', 'module.exports'],
            'n/no-unpublished-import': 'off',
            'n/no-missing-import': 'off',
            'n/hashbang': 'off',
            'n/no-unsupported-features/node-builtins': 'off',
            // react
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/no-unknown-property': 'off',
            // react-hooks
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'off',
            // react-refresh
            'react-refresh/only-export-components': 'error',
            // typescript-eslint
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off',
            '@typescript-eslint/indent': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/naming-convention': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/prefer-nullish-coalescing': 'off',
            '@typescript-eslint/no-dynamic-delete': 'off',
            '@typescript-eslint/promise-function-async': 'off',
            '@typescript-eslint/space-before-function-paren': 'off',
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            // promise
            'promise/always-return': 'error',
            'promise/no-return-wrap': 'error',
            'promise/param-names': 'error',
            'promise/catch-or-return': 'error',
            'promise/no-native': 'off',
            'promise/no-nesting': 'warn',
            'promise/no-promise-in-callback': 'warn',
            'promise/no-callback-in-promise': 'warn',
            'promise/avoid-new': 'warn',
            'promise/no-new-statics': 'error',
            'promise/no-return-in-finally': 'warn',
            'promise/valid-params': 'warn',
            'promise/no-multiple-resolved': 'error',
            // import
            'import/no-dynamic-require': 'warn',
            'import/no-nodejs-modules': 'off',
            'import/no-unresolved': 'off',
            'import/order': [
                'error', {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true }
                }
            ],
            // react-query
            '@tanstack/query/exhaustive-deps': 'error'
        }
    }
]
