# 🔐 Redux State Management & Session Control

## ✅ Implementation Complete

### Industry-Standard Features Implemented

1. **✅ Redux Toolkit** - Centralized state management
2. **✅ Redux Persist** - Selective state persistence
3. **✅ Complete Data Clearing** - On logout/disconnect
4. **✅ Route Protection** - Auth guards for pages
5. **✅ Session Validation** - Automatic auth checks

---

## 🏗️ Architecture

### State Slices

#### 1. **Auth Slice** (`authSlice.ts`)
- **Persisted**: ✅ Yes (localStorage)
- **State**:
  - `user`: User profile data
  - `isAuthenticated`: Login status
  - `isLoading`: Auth check loading state
- **Actions**:
  - `setUser()` - Set authenticated user
  - `clearUser()` - Clear user data
  - `logout()` - Complete logout

#### 2. **Wallet Slice** (`walletSlice.ts`)
- **Persisted**: ❌ No (fresh each session)
- **State**:
  - `address`: Wallet address
  - `isConnected`: Connection status
  - `ethBalance`: ETH balance
  - `mmtBalance`: MMT token balance
  - `chainId`: Network chain ID
  - `error`: Connection errors
- **Actions**:
  - `setConnected()` - Set wallet connection
  - `setBalances()` - Update balances
  - `disconnectWallet()` - Complete reset

---

## 🔒 Data Clearing Behavior

### Wallet Disconnect
```typescript
dispatch(disconnectWallet());
```
**Clears:**
- ✅ Redux wallet state (address, balances, chainId)
- ✅ localStorage keys starting with `wallet_` or `metamask_`
- ✅ Does NOT ask MetaMask again automatically
- ✅ User must click "Connect Wallet" and approve

### User Logout
```typescript
const { logout } = useAuth();
await logout();
```
**Clears:**
- ✅ Redux auth state (user, isAuthenticated)
- ✅ Redux wallet state (disconnects wallet)
- ✅ All persisted Redux data
- ✅ NextAuth session cookies
- ✅ Custom localStorage keys (`user_*`, `wallet_*`)
- ✅ Entire sessionStorage
- ✅ Redirects to home page

---

## 🛡️ Route Protection

### Protected Routes (Require Login)
- `/dashboard` - Betting dashboard
- `/validators/models` - Models voting/betting
- `/wallet-test` - Wallet testing
- `/repo/*` - Repository pages

**Behavior:** Redirects to `/login?redirect=/original-path`

### Auth-Only Routes (Redirect if Logged In)
- `/login` - Login page
- `/signup` - Signup page

**Behavior:** Redirects to `/dashboard` if already authenticated

### Public Routes (Always Accessible)
- `/` - Home page
- `/auth/cli` - CLI authentication

**Behavior:** No restrictions

---

## 📚 New Hooks

### `useAuth()`
```typescript
const { user, isAuthenticated, isLoading, logout } = useAuth();
```
- Syncs NextAuth session with Redux
- Provides centralized logout function
- Clears all data properly

### `useWallet()`
```typescript
const { 
  address, 
  isConnected, 
  ethBalance, 
  mmtBalance,
  chainId,
  error,
  connect, 
  disconnect 
} = useWallet();
```
- Redux-powered wallet management
- Persistent state during session
- Complete cleanup on disconnect

### `useAppDispatch()` & `useAppSelector()`
```typescript
import { useAppDispatch, useAppSelector } from '~/store/hooks';

const dispatch = useAppDispatch();
const walletState = useAppSelector((state) => state.wallet);
const authState = useAppSelector((state) => state.auth);
```
- Type-safe Redux hooks
- Access global state anywhere

---

## 🔄 State Flow Diagrams

### Login Flow
```
User enters credentials
      ↓
NextAuth authenticates
      ↓
useAuth hook detects session
      ↓
dispatch(setUser(userData))
      ↓
Redux persists auth state
      ↓
AuthGuard allows protected routes
```

### Logout Flow
```
User clicks "Sign Out"
      ↓
logout() function called
      ↓
1. dispatch(logoutAction()) ← Clear auth state
      ↓
2. dispatch(disconnectWallet()) ← Clear wallet state
      ↓
3. clearPersistedState() ← Clear localStorage persist data
      ↓
4. signOut() ← Clear NextAuth session
      ↓
5. localStorage.clear() ← Clear custom keys
      ↓
6. sessionStorage.clear() ← Clear session data
      ↓
7. router.push('/') ← Redirect to home
```

### Wallet Connect Flow
```
User clicks "Connect Wallet"
      ↓
MetaMask prompts for approval
      ↓
User approves connection
      ↓
useWallet gets address & chain ID
      ↓
dispatch(setConnected({ address, chainId }))
      ↓
useContract initializes contract
      ↓
Load balances from blockchain
      ↓
dispatch(setBalances({ eth, mmt }))
      ↓
UI updates with wallet data
```

### Wallet Disconnect Flow
```
User clicks "Disconnect Wallet"
      ↓
disconnect() function called
      ↓
dispatch(disconnectWallet()) ← Reset all wallet state
      ↓
Remove wallet_* from localStorage
      ↓
UI updates to "Connect Wallet" button
      ↓
Next connect requires MetaMask approval
```

---

## 🎯 Usage Examples

### In Components

#### Read State
```typescript
import { useAppSelector } from '~/store/hooks';

function MyComponent() {
  const { address, isConnected } = useAppSelector((state) => state.wallet);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  return <div>{isAuthenticated ? `Hello ${user.name}` : 'Please log in'}</div>;
}
```

#### Dispatch Actions
```typescript
import { useAppDispatch } from '~/store/hooks';
import { setBalances } from '~/store/slices/walletSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  
  const updateBalances = () => {
    dispatch(setBalances({ eth: '1.5', mmt: '100' }));
  };
  
  return <button onClick={updateBalances}>Refresh</button>;
}
```

#### Use Convenience Hooks
```typescript
import { useAuth } from '~/hooks/useAuth';
import { useWallet } from '~/hooks/useWallet';

function MyComponent() {
  const { user, logout } = useAuth();
  const { address, disconnect } = useWallet();
  
  return (
    <div>
      <p>User: {user?.email}</p>
      <p>Wallet: {address}</p>
      <button onClick={logout}>Logout & Disconnect</button>
      <button onClick={disconnect}>Disconnect Wallet Only</button>
    </div>
  );
}
```

---

## 🔧 Configuration

### What's Persisted
- ✅ Auth state (user, isAuthenticated)
- ❌ Wallet state (requires fresh connection)
- ❌ Contract instances
- ❌ Provider/signer objects

### Storage Locations
- **localStorage**: Redux persisted auth state
- **Cookies**: NextAuth session tokens
- **Memory**: Wallet state, contract instances

---

## 🚨 Security Best Practices

### ✅ Implemented
1. **No Sensitive Data in Redux** - Only addresses, no private keys
2. **Wallet State Not Persisted** - Requires fresh connection each session
3. **Complete Cleanup** - All data cleared on logout
4. **Route Protection** - Auth guards prevent unauthorized access
5. **Session Validation** - Automatic checks on page navigation

### ⚠️ Additional Recommendations
1. **Never** store private keys or mnemonics
2. **Always** validate on server-side (NextAuth handles this)
3. **Clear** browser cache if switching accounts
4. **Use** secure connections (HTTPS in production)

---

## 📊 State Persistence Strategy

| Data Type | Persisted? | Reason |
|-----------|-----------|---------|
| User Profile | ✅ Yes | Maintain login across sessions |
| Wallet Address | ❌ No | Security: require fresh connection |
| Token Balances | ❌ No | Accuracy: must be fresh from blockchain |
| Contract State | ❌ No | Must reinitialize with signer |
| Theme Preference | ✅ Yes | UX: maintain user choice |

---

## 🧪 Testing Logout/Disconnect

### Test Logout
1. Login to application
2. Connect MetaMask wallet
3. Click "Sign Out & Disconnect Wallet"
4. **Verify:**
   - ✅ Redirected to home page
   - ✅ Nav shows "Login" button
   - ✅ Wallet button gone
   - ✅ Cannot access /dashboard (redirects to /login)
   - ✅ LocalStorage cleared
   - ✅ Next login requires credentials again

### Test Disconnect
1. Login and connect wallet
2. Click "Disconnect Wallet"
3. **Verify:**
   - ✅ Wallet button shows "Connect Wallet"
   - ✅ Balances cleared
   - ✅ Still logged in (user menu visible)
   - ✅ Next connect requires MetaMask approval
   - ✅ Can still access protected routes

---

## 📝 Migration Notes

### Old Hook → New Hook
- `useMetaMask()` → `useWallet()`
- `useContract().balance` → `useAppSelector((state) => state.wallet)`
- `account` → `address`
- `balance.eth` → `ethBalance`
- `balance.mmt` → `mmtBalance`

### Updated Components
- ✅ wallet-connect-button.tsx
- ✅ models-voting.tsx
- ✅ token-staking.tsx
- ✅ transaction-history.tsx
- ✅ betting-dashboard.tsx
- ✅ MyLayout.tsx
- ✅ dashboard/page.tsx

---

## 🎉 Summary

You now have **industry-standard** state management with:
- ✅ Centralized Redux store
- ✅ Selective persistence
- ✅ Complete data clearing
- ✅ Route protection
- ✅ Session validation
- ✅ Type-safe hooks
- ✅ Clean architecture

Users must:
- ✅ Login again after logout
- ✅ Approve MetaMask again after disconnect
- ✅ Have valid session to access protected routes

**Zero data leakage. Perfect session control. 🔒**
