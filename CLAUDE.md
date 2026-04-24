# Distopia Design System — Claude Code Instructions

Design system for Writeopia KMP. Public docs: https://muri-mug.github.io/distopia/

All token definitions live in the **Writeopia** repo at:
`application/core/theme/src/commonMain/kotlin/io/writeopia/theme/`

---

## Editing tokens without Figma

### Change a color

Open `Theme.kt` and find the token by its role name:

```
private val md_light_primary = Color(0xFF6750A4)   ← change hex here for light
private val md_dark_primary  = Color(0xFFD0BCFF)   ← change hex here for dark
```

Hex format: `0xFFRRGGBB` (FF = fully opaque alpha).

**All 28 M3 roles:**
`primary` · `onPrimary` · `primaryContainer` · `onPrimaryContainer`
`secondary` · `onSecondary` · `secondaryContainer` · `onSecondaryContainer`
`tertiary` · `onTertiary` · `tertiaryContainer` · `onTertiaryContainer`
`error` · `onError` · `errorContainer` · `onErrorContainer`
`background` · `onBackground` · `surface` · `onSurface`
`surfaceVariant` · `onSurfaceVariant` · `outline` · `outlineVariant`
`inverseSurface` · `inverseOnSurface` · `inversePrimary` · `scrim`

### Change a semantic token

In `Theme.kt`, find the `WriteopiaColors(...)` block inside the `if (darkTheme)` condition.
Semantic tokens map design roles to usage intent:

| Token | Usage |
|---|---|
| `globalBackground` | App canvas background |
| `lightBackground` | Sidebar, panel backgrounds |
| `textLight` | Primary text |
| `textLighter` | Subdued / secondary text |
| `highlight` | Hover highlight surface |
| `selectedBg` | Selected list item background |
| `dividerColor` | Horizontal / vertical dividers |
| `linkColor` | Hyperlinks and inline actions |
| `defaultButton` | Fallback button color |
| `cardBg` | Note card background |
| `searchBackground` | Search input background |

### Change corner radii (shape)

Open `Shape.kt`:

```kotlin
val Shapes = Shapes(
    extraSmall = RoundedCornerShape(4.dp),   // chips, inputs
    small      = RoundedCornerShape(8.dp),   // small cards
    medium     = RoundedCornerShape(12.dp),  // modals, sheets
    large      = RoundedCornerShape(16.dp),  // nav drawers
    extraLarge = RoundedCornerShape(28.dp),  // FAB
)
```

### Change font size / weight / spacing

Open `Type.kt`. Each style follows this structure:

```kotlin
titleMedium = TextStyle(
    fontFamily    = FontFamily.Default,
    fontWeight    = FontWeight.Medium,
    fontSize      = 16.sp,
    lineHeight    = 24.sp,
    letterSpacing = 0.15.sp,
)
```

Available styles: `displayLarge/Medium/Small` · `headlineLarge/Medium/Small`
`titleLarge/Medium/Small` · `bodyLarge/Medium/Small` · `labelLarge/Medium/Small`

---

## Adding a new color token to WriteopiaColors

1. Add the property to the `WriteopiaColors` data class in `Theme.kt`
2. Add `Color.Unspecified` as the default in `LocalWriteopiaColors`
3. Set the light value in the `else` block of `WriteopiaTheme`
4. Set the dark value in the `if (darkTheme)` block
5. Add a row to the semantic token table in `index.html` (this repo)

Example:
```kotlin
// 1. data class
data class WriteopiaColors(
    ...
    val myNewToken: Color,
)

// 2. default
staticCompositionLocalOf {
    WriteopiaColors(
        ...
        myNewToken = Color.Unspecified,
    )
}

// 3 + 4. theme
WriteopiaColors(
    ...
    myNewToken = if (darkTheme) Color(0xFF...) else Color(0xFF...),
)
```

---

## Adding a new WButton variant

File: `application/core/common_ui/src/commonMain/kotlin/io/writeopia/commonui/buttons/WButton.kt`

1. Add entry to `WButtonVariant` enum
2. Add `when` branch pointing to the right M3 composable (`Button`, `TextButton`, etc.)
3. Add a demo + code snippet in `index.html` (this repo)

---

## Updating the documentation page

The docs live in `index.html` (this repo). Structure:

- **CSS variables** at the top mirror `Theme.kt` — update both when changing colors
- **Color pairs section** — add/remove pair blocks
- **Semantic token table** — add rows in `<tbody>` of the token table
- **Component cards** — each card has a `.component-demo` (visual) and `<pre>` (Kotlin code)

To sync colors, find `[data-theme="light"]` and `[data-theme="dark"]` CSS blocks
and update the `--md-*` and `--wr-*` variables to match `Theme.kt`.

---

## Running tests after changes

```bash
cd /path/to/Writeopia

# Unit tests
JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home \
  ./gradlew jvmTest

# Verify desktop compilation
JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home \
  ./gradlew :application:composeApp:compileKotlinJvm
```
