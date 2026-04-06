my-nextjs-project/
├── app/ # App Router (optional nếu không dùng src)
├── public/ # Static assets (images, fonts…)
├── src/ # Source code (recommended)
│
│ ├── app/ # App Router (routing chính)
│ │ ├── layout.tsx # Root layout
│ │ ├── page.tsx # Homepage (/)
│ │ ├── (features)/ # Route groups (không ảnh hưởng URL)
│ │ └── api/ # API routes
│ │
│ ├── components/ # UI & components
│ │ ├── ui/ # Reusable UI (Button, Input…)
│ │ │ ├── Button/
│ │ │ ├── Input/
│ │ │ └── Card/
│ │ │
│ │ ├── layout/ # Layout components
│ │ │ ├── Header/
│ │ │ ├── Footer/
│ │ │ └── Sidebar/
│ │ │
│ │ └── features/ # Feature/domain-based
│ │ ├── auth/
│ │ │ ├── LoginForm/
│ │ │ └── SignupForm/
│ │ │
│ │ └── blog/
│ │ ├── PostCard/
│ │ └── CommentSection/
│ │
│ ├── lib/ # Business logic + utilities
│ │ ├── api/ # API calls
│ │ ├── helpers/ # Helper functions
│ │ └── constants/ # Constants
│ │
│ ├── hooks/ # Custom React hooks
│ │ ├── useForm.ts
│ │ └── useLocalStorage.ts
│ │
│ ├── styles/ # Global styles
│ │ ├── globals.css
│ │ └── variables.css
│ │
│ ├── types/ # TypeScript types
│ │ ├── api.types.ts
│ │ └── common.types.ts
│ │
│ └── context/ # React Context
│ └── AuthContext.tsx
│
├── .env # Environment variables
├── next.config.js # Next.js config
├── tsconfig.json # TypeScript config
├── package.json # Dependencies
└── .eslintrc.js # ESLint config
