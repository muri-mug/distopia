# Distopia Design System

A Kotlin Multiplatform design system built on **Material Design 3 baseline**, powering the [Writeopia](https://github.com/Writeopia/Writeopia) note-taking app across Android, iOS, Desktop (JVM), and Web (JS/WASM).

📖 **[Live documentation →](https://muri-mug.github.io/distopia/)**

---

## Stack

| Layer | Technology |
|---|---|
| UI Framework | Compose Multiplatform |
| Design spec | Material Design 3 baseline |
| Platforms | Android · iOS · Desktop (JVM) · Web (JS + WASM) |
| Language | Kotlin 2.x |

---

## Foundations

### Color
28-token M3 baseline palette + a custom semantic layer (`WriteopiaColors`) exposed via `WriteopiaTheme.colorScheme`.

```kotlin
// M3 token
val primary = MaterialTheme.colorScheme.primary

// Semantic token
val bg = WriteopiaTheme.colorScheme.globalBackground
```

### Typography
Full M3 type scale — 15 styles (Display L/M/S → Label L/M/S) in `Type.kt`.

```kotlin
Text("Title", style = MaterialTheme.typography.titleMedium)
```

### Shape
M3 baseline shape scale in `Shape.kt`.

```kotlin
// extraSmall=4dp · small=8dp · medium=12dp · large=16dp · extraLarge=28dp
Card(shape = MaterialTheme.shapes.medium) { … }
```

---

## Components

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

### `WButton` variants

```kotlin
enum class WButtonVariant {
    Filled,       // M3 Filled — highest emphasis
    Tonal,        // M3 Filled Tonal — medium-high emphasis
    Outlined,     // M3 Outlined — medium emphasis
    Text,         // M3 Text — lowest emphasis
    Destructive,  // Error color scheme — destructive actions
}
```

---

## Usage

### 1. Wrap your root composable

```kotlin
@Composable
fun App() {
    WriteopiaTheme {           // applies M3 + WriteopiaColors
        YourContent()
    }
}
```

### 2. Use tokens and components

```kotlin
// Button
WButton(
    text = "Save",
    onClick = { },
    variant = WButtonVariant.Filled,
    leadingIcon = Icons.Default.Save,
)

// Semantic color token
Box(Modifier.background(WriteopiaTheme.colorScheme.globalBackground))

// M3 token
Text("Hello", color = MaterialTheme.colorScheme.primary)
```

---

## Testing

The design system ships test infrastructure for Compose UI and unit tests.

### Unit tests
```bash
./gradlew :application:features:search:jvmTest
./gradlew :application:features:note_menu:jvmTest
```

### Compose UI / E2E tests (JVM desktop)
```bash
./gradlew :application:composeApp:jvmTest
```

### Android instrumented tests
```bash
./gradlew :application:composeApp:connectedAndroidTest
```

### Robot pattern
E2E tests use the **Robot pattern** from `application/core/common_ui_tests`:

```kotlin
// Example JVM desktop test
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
- `DocumentsMenuRobot` — note list screen actions/assertions
- `DocumentEditRobot` — editor screen actions/assertions
- `SidebarRobot` — global shell sidebar actions/assertions

---

## License

See the [Writeopia repository](https://github.com/Writeopia/Writeopia) for license information.
