# TC39 Proposal Atlas · TypeSafe AI Semantic Explorer

An interactive web application applying the **TypeSafe AI** System One paradigm (`Jev`) to the live dataset of [ECMAScript / TC39 proposals](https://tc39.es/dataset/proposals.json).

Built with strict frontend design taste (`/taste` / `design-taste-frontend`), featuring a soft, calibrated pastel color palette, deterministic typography, zero emojis, and an asymmetric split-screen architecture.

---

## 🎨 Design & Aesthetic (`/taste` Guidelines)

- **Pastel Color Palette**:
  - `Stage 4` Finished: Pastel Mint (`#DCF0E2` / `#4E8664`)
  - `Stage 3` Candidate: Pastel Sky (`#DBEAFE` / `#2563EB`)
  - `Stage 2.7` Spec Complete: Pastel Periwinkle (`#E0E7FF` / `#4338CA`)
  - `Stage 2` Draft: Pastel Peach (`#FDE4D2` / `#A35C2B`)
  - `Stage 1` Proposal: Pastel Buttercream (`#FDF3CD` / `#8A701A`)
  - `Stage 0` Strawman: Pastel Rose (`#FCE0E8` / `#9C3D5A`)
  - Technical Domains: Soft Lavender, Sage, Peach, Mint, Rose
- **Anti-Emoji Policy**: Strictly uses clean SVG primitives and Lucide icons.
- **Typography**: Clean modern sans-serif (`Plus Jakarta Sans` / `Geist`) paired with high-clarity monospace (`JetBrains Mono`) for probabilities, ratings, and code tokens.
- **Layout & Viewport**: Asymmetric split-screen layout with `min-h-[100dvh]` viewport stability.

---

## 🧠 Multi-Dimensional Semantic Analysis with TypeSafe AI

While `proposals.json` provides standard metadata (`stage`, `name`, `description`, `authors`), it lacks structural and contextual nuance. TypeSafe AI enriches every proposal with a multi-dimensional semantic taxonomy evaluated using System One (`Jev`):

### 1. The 5 Core Dimensions
- **Adoption Path** (`Choice`): Whether a proposal can be polyfilled in userland (`userland_polyfillable`), transpiled during build step (`build_transpilable`), or fundamentally mandates browser engine modifications (`native_engine_required`).
- **Cognitive Overhead** (`Score` 1.0 – 5.0): The cognitive burden and mental model friction imposed on developers learning and reading code using this feature.
- **Primary Motivation** (`Choice`): The core driving impetus: `dev_ergonomics`, `performance_optimization`, `correctness_safety`, or `ecosystem_interop`.
- **Web-Compat Risk** (`Score` 1.0 – 5.0): The probability and severity of breaking existing websites or conflicting with legacy web APIs (e.g., Annex B, prototype pollution, de-facto library naming collisions).
- **Architectural Signals** (`Multi-Noul`):
  - *Mutates Prototype Chain*: Does this modify native object prototypes or standard global constructors?
  - *New Grammar / Syntax*: Does this introduce new reserved keywords, operators, or syntax productions?
  - *Cross-Realm Boundary*: Does this cross or affect execution contexts, sandboxes, or microtask checkpoints?

---

### 2. Foundational Intent Archetypes & Historical Patterns

To uncover why proposals succeed or stall, TypeSafe AI classifies each proposal into one of **7 Foundational Intent Archetypes**:

| Intent Archetype | Historical Thesis | Share | Stage 4 Rate | Examples |
| :--- | :--- | :--- | :--- | :--- |
| **`expressive_composition`** | Syntactic fluency, declarative flow, and eliminating boilerplate. | **44.1%** (143) | 33.6% | *Pipeline Operator*, *Records & Tuples*, *Promise.any* |
| **`standardizing_de_facto`** | Codifying battle-tested ecosystem conventions from npm & browsers. | **15.7%** (51) | 33.3% | *UUID*, *import.meta*, *Structured Clone*, *trimStart/trimEnd* |
| **`correcting_historical_regrets`** | Repairing 1995 Netscape compromises and legacy warts. | **15.1%** (49) | 26.5% | *Temporal* (replaces Date), *Array Equality*, *Builtins.typeOf()* |
| **`framework_enablement`** | First-class runtime primitives and hooks for modern meta-frameworks. | **7.4%** (24) | 16.7% | *Decorators*, *AsyncContext*, *Asset References*, *Module Keys* |
| **`cross_language_parity`** | Adopting proven constructs from Rust, Python, Ruby, C#, Java. | **6.8%** (22) | **36.4%** | *BigInt*, *RegExp Atomic Groups*, *Pattern Matching* |
| **`hardening_integrity`** | Defending against prototype pollution, realm escapes, supply-chain exploits. | **5.9%** (19) | **0.0%** | *ShadowRealm*, *SES*, *Freezing Prototypes*, *Defensible Classes* |
| **`runtime_vitality`** | Low-level binary data, WASM interop, multithreading, zero-copy buffers. | **4.9%** (16) | **37.5%** | *SIMD*, *TypedArray Stride*, *ArrayBuffer transfer* |

#### 🔍 Key Historical Insights:
1. **The Security Paradox (`0.0%` Stage 4)**: Proposals aimed at `hardening_integrity` face near-insurmountable friction reaching Stage 4. JavaScript's dynamic mutability makes locking down prototypes or isolating realms prone to web-compat breakage or severe committee deadlock.
2. **Proven Semantics Travel Well (`36.4% - 37.5%` Stage 4)**: `cross_language_parity` and `runtime_vitality` exhibit the highest consensus completion rates because the mathematical or systems semantics are already hardened in prior art.
3. **The Core Engine of JS is Expressiveness (`44.1%` Share)**: Almost half of all TC39 activity revolves around reducing developer boilerplate and enabling fluent chaining.

---

### 3. Interactive Evaluator Playground
Click any proposal to open the deep state inspector, view its exact immutable `state` JSON, explore full categorical probability breakdowns for its Intent Archetype, and run custom natural language conditions live in real time.

---

## 🚀 Running the App

```bash
cd ~/labs/tc39-typesafe # or cd ~/labs/typesafe-state

# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build

# Synchronize dataset (fetches latest TC39 proposals & enriches new items)
npm run sync
```

Open [http://localhost:5175](http://localhost:5175) in your browser.

---

## 🔄 Automated Monthly Dataset Sync

A GitHub Actions workflow is configured in [`.github/workflows/monthly-sync.yml`](.github/workflows/monthly-sync.yml):

- **Schedule**: Automatically runs on the 1st of every month at `00:00 UTC`.
- **Manual Trigger**: Can be dispatched on-demand via the GitHub Actions UI (`workflow_dispatch`).
- **Pipeline**:
  1. Pulls the latest official TC39 dataset from `https://tc39.es/dataset/proposals.json`.
  2. Runs `npm run enrich:api` to classify any newly submitted proposals or updated stages using TypeSafe AI (`jev-latest`).
  3. Verifies `npm run build` passes.
  4. Automatically commits and pushes updated proposals back to the repository if changes are detected.
- **Repository Secret**: Set `TYPESAFE_API_KEY` in GitHub Repository Settings (`Settings -> Secrets and variables -> Actions`).
