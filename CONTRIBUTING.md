# Contributing to GitVerse 🌌

First of all, thank you for your interest in contributing to **GitVerse — Your Code. Your Universe.**

GitVerse is an open-source project that aims to transform GitHub profiles and repositories into an immersive, interactive 3D universe. We welcome contributions that improve the experience, performance, accessibility, and reliability of the project.

Whether you're fixing a bug, improving the interface, optimizing 3D rendering, or proposing a new feature, your contributions are welcome!

## 🚀 Getting Started

Before contributing, make sure you have:

- Git installed.
- Node.js and npm installed.
- A GitHub account.
- Basic knowledge of React, TypeScript, JavaScript, or web development, depending on your contribution.

### 1. Fork the Repository

Fork the GitVerse repository to your GitHub account.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/GitVerse.git
cd GitVerse
```

Replace `YOUR-USERNAME` with your GitHub username.

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Use the local URL printed in your terminal to open the application.

**Note:** These commands assume the repository uses a standard npm-based development setup. Check `package.json` and the project README if the commands differ.

## 💡 Ways to Contribute

You can contribute in several ways:

- **Bug Fixes:** Identify and resolve existing issues.
- **New Features:** Propose meaningful improvements to the GitVerse experience.
- **UI/UX Design:** Improve visual consistency, usability, responsiveness, and accessibility.
- **3D Visualization:** Enhance planetary rendering, animations, camera controls, and scene performance.
- **GitHub Integration:** Improve public profile and repository data handling.
- **Performance:** Reduce unnecessary rendering, optimize assets, and improve loading times.
- **Documentation:** Improve setup instructions, technical documentation, and examples.
- **Testing:** Add tests and help identify regressions.

## 🌠 Feature Suggestions

Before implementing a major feature:

1. Check existing issues to avoid duplicate work.
2. Open an issue describing the proposed feature.
3. Explain the problem it solves and how it benefits users.
4. Discuss the approach before beginning substantial implementation.

Small fixes and documentation improvements can generally proceed without prior discussion.

## 🌿 Branching Guidelines

Create a separate branch for each contribution.

Suggested branch naming conventions:

```text
feature/galaxy-visualization
fix/github-api-error
docs/setup-guide
perf/threejs-rendering
```

Keep branches focused on a single feature or fix.

## 🛠️ Code Guidelines

Please follow these principles:

- Write clear, readable, and maintainable code.
- Use TypeScript types where appropriate.
- Follow the existing project structure and conventions.
- Prefer reusable components over duplicated code.
- Keep functions focused and reasonably small.
- Handle loading, empty, and error states.
- Avoid unnecessary dependencies.
- Never commit API keys, access tokens, or other secrets.
- Avoid unrelated changes in a pull request.

For visual changes, maintain GitVerse's immersive cosmic identity while preserving usability and accessibility.

## ⚡ Performance Guidelines

GitVerse uses interactive 3D visualization, so performance matters.

Contributors should:

- Avoid unnecessary React re-renders.
- Dispose of Three.js geometries, materials, and textures when no longer needed.
- Clean up event listeners and animation loops.
- Optimize large textures and other assets.
- Avoid excessive post-processing effects.
- Test interactions on lower-powered devices when possible.
- Preserve accessibility and reduced-motion support.

Performance claims should be supported by measurements whenever practical.

## 🧪 Testing Your Changes

Before submitting a pull request:

1. Run the available linting and type-checking commands.
2. Run relevant automated tests.
3. Build the application if a build script is available.
4. Test the affected functionality manually.
5. Check that existing features still work.

Use the actual scripts defined in `package.json`; not every command will be available in every project version.

## 📦 Submitting a Pull Request

1. Create a branch for your contribution.
2. Make your changes.
3. Test the implementation.
4. Commit your changes with a clear message.
5. Push your branch to your fork.
6. Open a pull request against the original repository.

Example:

```bash
git checkout -b feature/my-improvement

git add .

git commit -m "feat: improve galaxy visualization"

git push origin feature/my-improvement
```

In your pull request, include:

- A clear description of the change.
- The problem it solves.
- Testing performed.
- Screenshots or recordings for significant UI changes.
- Any relevant issues.

Please keep pull requests focused and easy to review.

## 📝 Commit Message Convention

Use clear commit messages.

Recommended prefixes:

- `feat:` — New feature.
- `fix:` — Bug fix.
- `docs:` — Documentation.
- `style:` — Formatting or visual changes.
- `refactor:` — Code restructuring.
- `perf:` — Performance improvements.
- `test:` — Tests.

Examples:

```text
feat: add interactive repository planets
fix: handle GitHub API rate limits
docs: improve installation instructions
perf: optimize galaxy rendering
```

## 🔐 Security

Never commit credentials, private tokens, or sensitive personal information.

If you discover a security vulnerability, avoid publishing exploit details in a public issue. Contact the project maintainer privately through an appropriate channel.

Do not introduce features that expose private GitHub data or perform unauthorized actions.

## 🎨 Design and Accessibility

GitVerse aims to combine immersive 3D visuals with a polished developer experience.

Contributions should preserve:

- Readable typography.
- Consistent visual design.
- Keyboard accessibility.
- Responsive layouts.
- Sufficient colour contrast.
- Respect for reduced-motion preferences.
- Clear feedback for user actions.

## 📜 License

By submitting a contribution, you agree that your contribution may be distributed under the project's MIT License, subject to the applicable license terms.

Ensure that contributed code, images, fonts, and other assets are original or appropriately licensed.

## 🤝 Code of Conduct

Be respectful, constructive, and welcoming.

We expect contributors to:

- Treat everyone with respect.
- Welcome different perspectives and experience levels.
- Give constructive feedback.
- Focus on improving the project.
- Avoid harassment, discrimination, and personal attacks.

## 🌌 Our Vision

GitVerse is an evolving project built around a simple idea:

**Your Code. Your Universe.**

Let's make exploring the world of code more visual, interactive, and inspiring.

Thank you for helping build GitVerse! 🚀
