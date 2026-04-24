# Distopia Design System

A Kotlin Multiplatform design system built on **Material Design 3 baseline**, powering the [Writeopia](https://github.com/Writeopia/Writeopia) note-taking app across Android, iOS, Desktop (JVM), and Web (JS/WASM).

📖 **[Live documentation →](https://muri-mug.github.io/distopia/)**

---

## Table of contents

- [Stack](#stack)
- [Repository structure](#repository-structure)
- [Token pipeline](#token-pipeline)
  - [Setup](#setup)
  - [Editing tokens](#editing-tokens)
  - [Adding a new token](#adding-a-new-token)
  - [Syncing to Writeopia](#syncing-to-writeopia)
- [Foundations](#foundations)
  - [Color](#color)
  - [Semantic tokens](#semantic-tokens)
  - [Typography](#typography)
  - [Shape](#shape)
- [Components](#components)
  - [WButton](#wbutton)
  - [All components](#all-components)
- [Usage in Compose](#usage-in-compose)
- [Updating the docs page](#updating-the-docs-page)
- [Testing](#testing)

---

## Stack

| Layer | Technology |
|---|---|
| UI framework | Compose Multiplatform |
| Design spec | Material Design 3 baseline |
| Platforms | Android · iOS · Desktop (JVM) · Web (JS + WASM) |
| Language | Kotlin 2.x |
| Token pipeline | Style Dictionary v4 |

---

## Repository structure

```
distopia/
├── tokens/
│   ├── colors/
│   │   ├── m3.json          ← 28 M3 baseline color roles (light + dark)
│   │   └── semantic.json    ← WriteopiaColors semantic tokens (light + dark)
│   ├── shape.json           ← corner radius scale (documentation)
│   └── typography.json      ← type scale (documentation)
├── build/
│   ├── DistopiaTokens.kt    ← GENERATED — Kotlin color constants
│   └── tokens.css           ← GENERATED — CSS variables for index.html
├── sd.config.mjs            ← Style Dictionary config + custom formatters
├── sync.mjs                 ← copies DistopiaTokens.kt to Writeopia repo
├── index.html               ← live documentation page (GitHub Pages)
├── package.json
├── CLAUDE.md                ← instructions for Claude Code
└── README.md
```

> **Never edit `build/` files directly.** They are generated from the JSON tokens.

---

## Token pipeline

Distopia uses [Style Dictionary](https://styledictionary.com) as the single source of truth for all design tokens. Editing a JSON file and running one command propagates the change to the Kotlin theme and the CSS documentation page.

```
tokens/colors/*.json
        │
        ▼  npm run build
        │
        ├── build/DistopiaTokens.kt   (Kotlin — color constants)
        └── build/tokens.css          (CSS — variable blocks for index.html)
                │
                ▼  npm run build:sync
                │
                └── Writeopia/application/core/theme/.../DistopiaTokens.kt
```

### Setup

Prerequisites: **Node.js ≥ 18**, **npm ≥ 9**.

```bash
git clone https://github.com/muri-mug/distopia.git
cd distopia
npm install
```

### Editing tokens

#### Change a color

Open `tokens/colors/m3.json` and find the role by name:

```json
"m3": {
  "light": {
    "primary": { "$value": "#6750A4", "$type": "color" }
  },
  "dark": {
    "primary": { "$value": "#D0BCFF", "$type": "color" }
  }
}
```

Change the `$value` hex and run:

```bash
npm run build
```

#### Change a semantic token

Open `tokens/colors/semantic.json`:

```json
"writeopia": {
  "light": {
    "globalBackground": { "$value": "#FFFBFE", "$type": "color" }
  },
  "dark": {
    "globalBackground": { "$value": "#1C1B1F", "$type": "color" }
  }
}
```

Tokens with alpha use 8-digit `AARRGGBB` hex:

```json
"selectedBg": { "$value": "#80EADDFF", "$type": "color", "$description": "primaryContainer at 50% opacity" }
```

Where `80` = `0x80` = 50% alpha, followed by `RRGGBB`.

#### Available M3 color roles

`primary` · `onPrimary` · `primaryContainer` · `onPrimaryContainer`
`secondary` · `onSecondary` · `secondaryContainer` · `onSecondaryContainer`
`tertiary` · `onTertiary` · `tertiaryContainer` · `onTertiaryContainer`
`error` · `onError` · `errorContainer` · `onErrorContainer`
`background` · `onBackground` · `surface` · `onSurface`
`surfaceVariant` · `onSurfaceVariant` · `outline` · `outlineVariant`
`inverseSurface` · `inverseOnSurface` · `inversePrimary` · `scrim`

#### Available semantic tokens (`WriteopiaColors`)

| Token | Usage |
|---|---|
| `globalBackground` | App canvas background |
| `lightBackground` | Sidebar / panel background |
| `textLight` | Primary text |
| `textLighter` | Subdued / secondary text |
| `highlight` | Hover highlight surface |
| `selectedBg` | Selected list item background |
| `dividerColor` | Horizontal / vertical dividers |
| `linkColor` | Hyperlinks and inline actions |
| `defaultButton` | Fallback button color |
| `cardBg` | Note card background (runtime value, not in JSON) |
| `cardShadow` | Card drop shadow |
| `searchBackground` | Search input background |
| `cardPlaceholderBackground` | Card placeholder fill |
| `optionsSelector` | Options overlay tint |

### Adding a new token

**New M3 color** — add it to `tokens/colors/m3.json` under both `light` and `dark`.

**New semantic token** — follow these steps:

1. Add light and dark entries to `tokens/colors/semantic.json`
2. Run `npm run build:sync`
3. Open `Writeopia/application/core/theme/src/commonMain/kotlin/io/writeopia/theme/Theme.kt`
4. Add the new property to the `WriteopiaColors` data class
5. Add `Color.Unspecified` as the default in `LocalWriteopiaColors`
6. Reference the generated `wr_light_<token>` / `wr_dark_<token>` in the two `WriteopiaColors(...)` blocks
7. Add a row to the semantic token table in `index.html`

Example (adding `accentColor`):

```json
// tokens/colors/semantic.json
"writeopia": {
  "light": { "accentColor": { "$value": "#FF5722", "$type": "color" } },
  "dark":  { "accentColor": { "$value": "#FF8A65", "$type": "color" } }
}
```

```kotlin
// Theme.kt — WriteopiaColors data class
data class WriteopiaColors(
    ...
    val accentColor: Color,
)

// Theme.kt — LocalWriteopiaColors default
WriteopiaColors(
    ...
    accentColor = Color.Unspecified,
)

// Theme.kt — light + dark blocks
WriteopiaColors(
    ...
    accentColor = wr_light_accentColor,   // light
    // or
    accentColor = wr_dark_accentColor,    // dark
)
```

### Syncing to Writeopia

After editing tokens, propagate the changes to the Kotlin project:

```bash
# 1. Build + copy DistopiaTokens.kt to the Writeopia repo
npm run build:sync

# 2. Verify the Kotlin project still compiles
cd ../Writeopia
JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home \
  ./gradlew :application:core:theme:compileKotlinJvm

# 3. Commit both repos
cd ../distopia && git add . && git commit -m "chore: update tokens"
cd ../Writeopia && git add application/core/theme && git commit -m "chore: sync DistopiaTokens from distopia"
```

---

## Foundations

### Color

28-token M3 baseline palette exposed via `MaterialTheme.colorScheme`. Use M3 roles for standard UI elements:

```kotlin
val primary       = MaterialTheme.colorScheme.primary
val surface       = MaterialTheme.colorScheme.surface
val errorColor    = MaterialTheme.colorScheme.error
```

### Semantic tokens

`WriteopiaColors` is a custom layer on top of M3 for app-specific usage intent. Access via `WriteopiaTheme.colorScheme`:

```kotlin
val colors = WriteopiaTheme.colorScheme

Box(Modifier.background(colors.globalBackground))
Text("Label", color = colors.textLighter)
Divider(color = colors.dividerColor)
```

### Typography

Full M3 type scale — 15 styles defined in `Type.kt`:

```kotlin
Text("Display",  style = MaterialTheme.typography.displayLarge)
Text("Headline", style = MaterialTheme.typography.headlineMedium)
Text("Title",    style = MaterialTheme.typography.titleMedium)
Text("Body",     style = MaterialTheme.typography.bodyLarge)
Text("Label",    style = MaterialTheme.typography.labelSmall)
```

To change font sizes or weights, edit `Writeopia/application/core/theme/src/commonMain/kotlin/io/writeopia/theme/Type.kt` directly (typography is not part of the token pipeline yet).

### Shape

M3 baseline shape scale defined in `Shape.kt`:

| Token | Value | Used for |
|---|---|---|
| `extraSmall` | 4 dp | Chips, text fields |
| `small` | 8 dp | Small cards, menus |
| `medium` | 12 dp | Cards, modals |
| `large` | 16 dp | Navigation drawers |
| `extraLarge` | 28 dp | FAB |

```kotlin
Card(shape = MaterialTheme.shapes.medium) { … }
```

To change corner radii, edit `Writeopia/application/core/theme/src/commonMain/kotlin/io/writeopia/theme/Shape.kt` directly.

---

## Components

### WButton

The only custom Compose component in Distopia. Wraps all M3 button roles plus a Destructive variant.

```kotlin
WButton(
    text = "Save",
    onClick = { },
    variant = WButtonVariant.Filled,          // required
    leadingIcon = Icons.Default.Save,          // optional
    leadingIconDescription = "Save",           // optional
    enabled = true,                            // optional, default true
)
```

| Variant | M3 equivalent | Use for |
|---|---|---|
| `Filled` | `Button` | Primary actions |
| `Tonal` | `FilledTonalButton` | Secondary actions |
| `Outlined` | `OutlinedButton` | Tertiary actions |
| `Text` | `TextButton` | Inline / low emphasis |
| `Destructive` | `Button` (error colors) | Delete, remove, irreversible actions |

**Adding a new variant:**

1. Add the entry to `WButtonVariant` enum in `WButton.kt`
2. Add the `when` branch calling the appropriate M3 composable
3. Add a demo block in `index.html`

### All components

| Component | Source | Compose API |
|---|---|---|
| `WButton` | `common_ui/buttons/WButton.kt` | `WButton(variant = WButtonVariant.Filled)` |
| FAB | M3 built-in | `FloatingActionButton` / `ExtendedFloatingActionButton` |
| Chips | M3 built-in | `AssistChip` · `FilterChip` · `InputChip` · `SuggestionChip` |
| Text Fields | M3 built-in | `TextField` · `OutlinedTextField` |
| Cards | M3 built-in | `Card` · `ElevatedCard` · `OutlinedCard` |
| List Items | M3 built-in | `ListItem` |
| Switch | M3 built-in | `Switch` |
| Navigation Bar | M3 built-in | `NavigationBar` + `NavigationBarItem` |
| Dialog | M3 built-in | `AlertDialog` |
| Snackbar | M3 built-in | `SnackbarHost` + `SnackbarHostState` |
| Progress | M3 built-in | `LinearProgressIndicator` · `CircularProgressIndicator` |
| Badge | M3 built-in | `BadgedBox` + `Badge` |

---

## Usage in Compose

### 1. Wrap the root composable

```kotlin
@Composable
fun App() {
    WriteopiaTheme {   // injects M3 MaterialTheme + WriteopiaColors
        YourContent()
    }
}
```

### 2. Consume tokens

```kotlin
// M3 color role
Text("Hello", color = MaterialTheme.colorScheme.primary)

// Semantic token
Box(Modifier.background(WriteopiaTheme.colorScheme.globalBackground))

// Typography
Text("Title", style = MaterialTheme.typography.titleMedium)

// Shape
Surface(shape = MaterialTheme.shapes.large) { … }
```

### 3. Use components

```kotlin
// Buttons
WButton(text = "Confirm", onClick = { }, variant = WButtonVariant.Filled)
WButton(text = "Delete",  onClick = { }, variant = WButtonVariant.Destructive)

// FAB
FloatingActionButton(onClick = { }) {
    Icon(Icons.Default.Add, contentDescription = "Add")
}

// Card
ElevatedCard(modifier = Modifier.fillMaxWidth()) {
    Text("Content", modifier = Modifier.padding(16.dp))
}

// Dialog with WButton
AlertDialog(
    onDismissRequest = { },
    title = { Text("Delete note?") },
    text  = { Text("This cannot be undone.") },
    confirmButton = {
        WButton(text = "Delete", onClick = { }, variant = WButtonVariant.Destructive)
    },
    dismissButton = {
        WButton(text = "Cancel", onClick = { }, variant = WButtonVariant.Text)
    }
)
```

---

## Updating the docs page

The live documentation is `index.html` in this repo, published at https://muri-mug.github.io/distopia/

### Sync CSS variables after a color change

After running `npm run build`, copy the generated CSS from `build/tokens.css` into the `[data-theme="light"]` and `[data-theme="dark"]` blocks at the top of `index.html`.

### Add a new component demo

Each component is a `.component-card` block with two children:

```html
<div class="component-card">
  <div class="component-card-header">
    <span class="component-card-title">My Component</span>
    <span class="component-card-tag">MyComponent.kt</span>
  </div>
  <!-- Visual preview -->
  <div class="component-demo">
    <!-- HTML approximation of the component -->
  </div>
  <!-- Kotlin code snippet -->
  <div class="component-code">
    <pre><span class="fn">MyComponent</span>(...)</pre>
  </div>
</div>
```

Syntax highlighting classes: `kw` (keyword/annotation), `fn` (function call), `str` (string literal).

### Deploy

Any push to `main` automatically redeploys GitHub Pages — no action needed.

---

## Testing

Tests live in the Writeopia repo. Run from the `Writeopia/` directory.

### Unit tests (JVM)

```bash
JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home \
  ./gradlew :application:features:search:jvmTest

./gradlew :application:features:note_menu:jvmTest
```

### Compose UI / E2E (Desktop JVM)

```bash
JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home \
  ./gradlew :application:composeApp:jvmTest
```

### Android instrumented

```bash
./gradlew :application:composeApp:connectedAndroidTest
```

### Robot pattern

E2E tests use the Robot pattern from `application/core/common_ui_tests`:

```kotlin
@OptIn(ExperimentalTestApi::class)
class MyFeatureTest {

    @Test
    fun createNote() = runComposeUiTest {
        setContent { /* your composable */ }

        DocumentsMenuRobot.run { goToEditNote() }
        DocumentEditRobot.run { writeTitle("My Note"); goBack() }
        DocumentsMenuRobot.run { assertNoteWithTitle("My Note") }
    }
}
```

Available robots:

| Robot | Actions / Assertions |
|---|---|
| `DocumentsMenuRobot` | `goToEditNote()`, `assertNoteWithTitle(title)`, `syncClick()` |
| `DocumentEditRobot` | `writeTitle(text)`, `writeText(text, index)`, `addLine()`, `goBack()`, `checkWithText(text)` |
| `SidebarRobot` | `toggleSidebar()`, `clickHome()`, `clickSearch()`, `clickFavorites()`, `clickSettings()`, `clickLogout()`, `assertHomeVisible()`, … |

### Sidebar testTags

All sidebar elements are instrumented for testing:

| Tag | Element |
|---|---|
| `sideMenuToggle` | Collapse / expand arrow |
| `sideMenuSearch` | Search bar |
| `sideMenuHome` | Home nav item |
| `sideMenuFavorites` | Favorites nav item |
| `sideMenuSettings` | Settings nav item |
| `sideMenuHelp` | Help action |
| `sideMenuLogout` | Logout action |

---

## License

See the [Writeopia repository](https://github.com/Writeopia/Writeopia) for license information.
