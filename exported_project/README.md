# BT Go - Aplicație de Gestiune Financiară

O aplicație modernă pentru gestionarea tranzacțiilor financiare personale, construită cu Next.js, React și Tailwind CSS.

## Caracteristici

- 💰 Gestionare tranzacții (adăugare, vizualizare, filtrare)
- 📊 Vizualizare sold și statistici
- 🎯 Management buget personal
- 🤖 Asistent virtual pentru sfaturi financiare
- 🎨 Interfață modernă și responsive
- 🚀 Performanță optimizată cu React Query

## Tehnologii Utilizate

- Next.js 14
- React 18
- Tailwind CSS
- Shadcn/UI Components
- React Query
- TypeScript

## Cerințe de Sistem

- Node.js 16.x sau mai recent
- npm sau yarn

## Instalare

1. Clonați repository-ul:
   ```bash
   git clone <repository-url>
   cd bt-go
   ```

2. Instalați dependențele:
   ```bash
   npm install
   # sau
   yarn install
   ```

3. Rulați aplicația în modul development:
   ```bash
   npm run dev
   # sau
   yarn dev
   ```

4. Deschideți [http://localhost:3000](http://localhost:3000) în browser.

## Structura Proiectului

```
src/
  ├── app/                    # Next.js app router
  │   ├── api/               # API routes
  │   ├── layout.tsx         # Root layout
  │   └── page.tsx          # Homepage
  ├── components/            # React components
  │   ├── ui/               # Shadcn UI components
  │   └── ...               # Other components
  ├── hooks/                # Custom React hooks
  ├── lib/                  # Utility functions
  └── providers/            # React context providers
```

## Dezvoltare

- Modificați stilurile în `src/app/globals.css`
- Adăugați noi componente în `src/components/`
- Gestionați state-ul cu React Query în `src/hooks/useApi.ts`

## Licență

MIT
