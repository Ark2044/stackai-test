# Web Folder Structure

## Overview
The web application has been organized into a clean, scalable folder structure following Next.js and React best practices.

## Directory Structure

```
web/
├── docs/                              # All project documentation
│   ├── FOLDER_STRUCTURE.md           # This file
│   ├── REDUX_STATE_MANAGEMENT.md     # Redux implementation guide
│   ├── IMPLEMENTATION_SUMMARY.md     # Quick reference
│   ├── INTEGRATION_COMPLETE.md       # Integration details
│   ├── QUICK_START.md                # Getting started guide
│   ├── UI_PAGES_GUIDE.md             # UI pages documentation
│   └── WEB3_INTEGRATION.md           # Web3 integration guide
│
├── src/
│   ├── app/                          # Next.js 13+ app directory
│   │   ├── api/                      # API routes
│   │   ├── auth/                     # Auth pages
│   │   ├── dashboard/                # Dashboard page
│   │   ├── login/                    # Login page
│   │   ├── signup/                   # Signup page
│   │   ├── repo/                     # Repository pages
│   │   ├── validators/               # Validator pages
│   │   ├── wallet-test/              # Wallet test page
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   │
│   ├── components/
│   │   ├── auth/                     # Authentication components
│   │   │   ├── AuthComponent.tsx     # Auth provider & hooks
│   │   │   ├── login-form.tsx        # Login form
│   │   │   ├── signup-form.tsx       # Signup form
│   │   │   └── cli-login-form.tsx    # CLI login form
│   │   │
│   │   ├── betting/                  # Betting & Wallet components
│   │   │   ├── wallet-connect-button.tsx  # Wallet connection UI
│   │   │   ├── betting-dashboard.tsx      # Betting overview
│   │   │   ├── models-voting.tsx          # Model voting interface
│   │   │   ├── token-staking.tsx          # Staking modal
│   │   │   └── transaction-history.tsx    # Transaction list
│   │   │
│   │   ├── repository/               # Repository components
│   │   │   ├── repository-dashboard.tsx   # Repo dashboard
│   │   │   ├── repository-list.tsx        # Repo list
│   │   │   ├── repository-view.tsx        # Repo viewer
│   │   │   ├── create-repository-form.tsx # Create repo form
│   │   │   └── file-explorer.tsx          # File explorer
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── MyLayout.tsx          # Main layout with navbar
│   │   │   ├── navigation.tsx        # Navigation component
│   │   │   └── ModeToggle.tsx        # Dark/light mode toggle
│   │   │
│   │   ├── shared/                   # Shared/reusable components
│   │   │   ├── LoadingSpinner.tsx    # Loading spinner
│   │   │   └── animated-modal.tsx    # Animated modal
│   │   │
│   │   ├── providers/                # React providers
│   │   │   ├── StoreProvider.tsx     # Redux store provider
│   │   │   └── AuthGuard.tsx         # Route protection
│   │   │
│   │   ├── ui/                       # shadcn/ui components
│   │   │   └── ...
│   │   │
│   │   ├── Providers.tsx             # Combined providers
│   │   └── theme-provider.tsx        # Theme provider
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts                # Authentication hook
│   │   ├── useWallet.ts              # Wallet connection hook
│   │   └── useContract.ts            # Smart contract hook
│   │
│   ├── store/                        # Redux store
│   │   ├── index.ts                  # Store configuration
│   │   ├── hooks.ts                  # Typed Redux hooks
│   │   └── slices/
│   │       ├── authSlice.ts          # Auth state
│   │       └── walletSlice.ts        # Wallet state
│   │
│   ├── server/                       # Server-side code
│   │   ├── db.ts                     # Database client
│   │   └── auth/                     # Auth configuration
│   │
│   ├── lib/                          # Utility libraries
│   │   └── utils.ts                  # Helper functions
│   │
│   ├── contracts/                    # Smart contract configs
│   │   └── config.ts                 # Contract addresses & ABIs
│   │
│   ├── types/                        # TypeScript type definitions
│   │
│   ├── utils/                        # Utility functions
│   │
│   ├── styles/                       # Global styles
│   │   └── globals.css               # Global CSS
│   │
│   ├── env.js                        # Environment validation
│   └── middleware.ts                 # Next.js middleware
│
├── prisma/                           # Prisma database
│   └── schema.prisma                 # Database schema
│
├── public/                           # Static assets
│
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.js                    # Next.js config
├── postcss.config.js                 # PostCSS config
└── components.json                   # shadcn/ui config
```

## Import Conventions

### Absolute Imports
Use `~` alias for all imports from `src/`:
```typescript
import { useAuth } from "~/hooks/useAuth";
import { Button } from "~/components/ui/button";
import { WalletConnectButton } from "~/components/betting/wallet-connect-button";
```

### Relative Imports
Use relative imports only within the same category:
```typescript
// In components/betting/models-voting.tsx
import { TokenStaking } from "./token-staking";
```

## Component Organization

### Auth Components (`components/auth/`)
- User authentication flows
- Login/signup forms
- Auth providers and context

### Betting Components (`components/betting/`)
- Wallet connection and management
- Betting interface and modals
- Transaction history
- Model voting

### Repository Components (`components/repository/`)
- Git repository management
- File explorer and viewer
- Repository CRUD operations

### Layout Components (`components/layout/`)
- Page layouts and navigation
- Theme toggles
- Global UI elements

### Shared Components (`components/shared/`)
- Reusable UI components
- Generic utilities

## State Management

### Redux Store (`store/`)
- **authSlice**: User authentication state (persisted)
- **walletSlice**: Wallet connection state (persisted)

### Hooks (`hooks/`)
- **useAuth**: Complete authentication with logout
- **useWallet**: Wallet connection management
- **useContract**: Smart contract interactions

## Documentation

All documentation has been moved to the `docs/` folder:
- Technical guides
- Implementation details
- API documentation
- Architecture decisions

## Best Practices

1. **Components**: One component per file, organized by feature
2. **Imports**: Use absolute imports for cross-feature, relative for same-feature
3. **Types**: Keep TypeScript types close to their usage or in `types/`
4. **Hooks**: Custom hooks in `hooks/` directory
5. **State**: Redux for global state, local state for UI-only
6. **Styling**: Tailwind CSS with shadcn/ui components
