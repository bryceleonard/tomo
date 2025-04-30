# Library & Subscription Management PRD

## Overview
This document outlines the technical implementation plan for user types (Free/Premium), library management, and subscription handling in the Tomo meditation app.

## Current State (as of April 29, 2024)

### Completed
1. **Basic Infrastructure**
   - Firebase configuration with web support
   - Authentication service setup
   - Basic user types defined
   - Library service structure

2. **Authentication**
   - Email/password signup
   - Login/logout functionality
   - Auth context for state management

3. **Library Service**
   - Basic CRUD operations for meditations
   - Firebase integration
   - Library context for state management

### In Progress
1. **User Type Enforcement**
   - Basic type definitions exist
   - Need to implement enforcement logic
   - Need to add subscription tracking

2. **Library Space Management**
   - Basic structure exists
   - Need to implement space limits
   - Need to add regeneration tracking

## Next Steps (Prioritized)

### Phase 1A: User Type Enforcement (High Priority)
1. **Implement User Type Checks**
   - Add middleware for type verification
   - Create type-specific access rules
   - Add regeneration count tracking

2. **Subscription Management**
   - Implement subscription date tracking
   - Add subscription status checks
   - Create upgrade flow

### Phase 1B: Library Space Management (High Priority)
1. **Space Limits**
   - Implement maxSlots for free users
   - Add checkLibrarySpace() method
   - Create space enforcement logic

2. **Regeneration Tracking**
   - Add regeneration count to user type
   - Implement regeneration limits
   - Create regeneration reset logic

### Phase 2: Premium Features (Medium Priority)
1. **Upgrade Flow**
   - Create premium upgrade UI
   - Implement payment integration
   - Add subscription management

2. **Enhanced Features**
   - Implement premium-only features
   - Add feature access controls
   - Create feature upgrade prompts

## Project Structure
- Backend: Root level (`/src`)
- Frontend: `/tomo` directory
- Firebase: Used for authentication, storage, and database

## Phase 1: User Type & Library Management

### Technical Implementation

#### Backend (`/src`)
1. **User Type Management**
   ```typescript
   // types/user.ts
   export enum UserType {
     FREE = 'FREE',
     PREMIUM = 'PREMIUM'
   }

   export interface User {
     id: string;
     type: UserType;
     subscriptionStartDate?: Date;
     regenerationCount?: number;
   }
   ```

2. **Library Storage Structure**
   ```typescript
   // types/library.ts
   export interface Meditation {
     id: string;
     userId: string;
     title: string;
     audioUrl: string;
     createdAt: Date;
     duration: number;
   }

   export interface Library {
     userId: string;
     meditations: Meditation[];
     maxSlots: number;
   }
   ```

3. **Firebase Rules**
   ```javascript
   // Firebase security rules
   {
     "rules": {
       "users": {
         "$userId": {
           ".read": "auth != null && auth.uid == $userId",
           ".write": "auth != null && auth.uid == $userId"
         }
       },
       "library": {
         "$userId": {
           ".read": "auth != null && auth.uid == $userId",
           ".write": "auth != null && auth.uid == $userId"
         }
       }
     }
   }
   ```

#### Frontend (`/tomo`)
1. **Library Service**
   ```typescript
   // services/libraryService.ts
   export class LibraryService {
     async saveMeditation(meditation: Meditation): Promise<void>;
     async deleteMeditation(meditationId: string): Promise<void>;
     async getLibrary(): Promise<Library>;
     async checkLibrarySpace(): Promise<boolean>;
   }
   ```

2. **User Context**
   ```typescript
   // context/UserContext.tsx
   interface UserContextType {
     userType: UserType;
     library: Library;
     upgradeToPremium: () => Promise<void>;
   }
   ```

## Phase 2: Audio Storage & Playback

### Technical Implementation

#### Backend (`/src`)
1. **Firebase Storage Structure**
   ```
   /audio
     /{userId}
       /{meditationId}.mp3
   ```

2. **Audio Processing Service**
   ```typescript
   // services/audioService.ts
   export class AudioService {
     async uploadAudio(file: File): Promise<string>;
     async getAudioUrl(meditationId: string): Promise<string>;
     async deleteAudio(meditationId: string): Promise<void>;
   }
   ```

#### Frontend (`/tomo`)
1. **Audio Player Component**
   ```typescript
   // components/AudioPlayer.tsx
   interface AudioPlayerProps {
     audioUrl: string;
     onPlay?: () => void;
     onPause?: () => void;
     onEnd?: () => void;
   }
   ```

2. **Library UI Components**
   ```typescript
   // components/LibraryList.tsx
   // components/LibraryItem.tsx
   // components/EmptyLibrary.tsx
   ```

## Phase 3: Subscription Management

### Technical Implementation

#### Backend (`/src`)
1. **Subscription Service**
   ```typescript
   // services/subscriptionService.ts
   export class SubscriptionService {
     async verifyReceipt(receipt: string): Promise<boolean>;
     async updateSubscriptionStatus(userId: string, status: SubscriptionStatus): Promise<void>;
     async checkSubscriptionValidity(userId: string): Promise<boolean>;
   }
   ```

2. **Subscription Types**
   ```typescript
   // types/subscription.ts
   export enum SubscriptionStatus {
     ACTIVE = 'ACTIVE',
     EXPIRED = 'EXPIRED',
     CANCELLED = 'CANCELLED'
   }
   ```

#### Frontend (`/tomo`)
1. **Store Integration**
   ```typescript
   // services/storeService.ts
   export class StoreService {
     async requestSubscription(): Promise<void>;
     async restorePurchases(): Promise<void>;
     async getSubscriptionStatus(): Promise<SubscriptionStatus>;
   }
   ```

2. **Upgrade Flow Components**
   ```typescript
   // components/UpgradeModal.tsx
   // components/SubscriptionBenefits.tsx
   // components/PricingTable.tsx
   ```

## Phase 4: Premium Features

### Technical Implementation

#### Backend (`/src`)
1. **Usage Tracking**
   ```typescript
   // services/usageService.ts
   export class UsageService {
     async trackRegeneration(userId: string): Promise<void>;
     async getRemainingRegenerations(userId: string): Promise<number>;
     async resetRegenerationCount(userId: string): Promise<void>;
   }
   ```

2. **Premium Validation**
   ```typescript
   // middleware/premiumMiddleware.ts
   export const requirePremium = async (req: Request, res: Response, next: NextFunction) => {
     // Validate premium status
   };
   ```

#### Frontend (`/tomo`)
1. **Premium Features UI**
   ```typescript
   // components/PremiumFeatures.tsx
   // components/RegenerationCounter.tsx
   // components/SubscriptionStatus.tsx
   ```

## Implementation Order
1. Phase 1: Basic user types and single-slot library
2. Phase 2: Audio storage and playback
3. Phase 3: Subscription management
4. Phase 4: Premium features

## Testing Strategy
- Unit tests for all services
- Integration tests for Firebase interactions
- E2E tests for critical user flows
- Subscription testing in sandbox environments

## Security Considerations
- Secure Firebase rules
- Receipt validation
- User data protection
- Secure audio file storage

## Monitoring & Analytics
- Subscription conversion rates
- Library usage metrics
- Audio playback statistics
- Error tracking and reporting 

console.log('Auth state:', auth.currentUser); 