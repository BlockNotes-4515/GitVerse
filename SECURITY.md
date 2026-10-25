# Security Policy

## Our Commitment to Security

GitVerse is committed to providing a secure, reliable, and privacy-conscious experience for developers exploring their GitHub profiles in an interactive 3D universe.

We welcome responsible security research and appreciate anyone who helps us identify and resolve vulnerabilities.

## Supported Versions

Security fixes are prioritized for the latest version of GitVerse.

| Version | Security Support |
|---|---|
| Latest release | Supported |
| Older releases | Not guaranteed |

## Reporting a Vulnerability

**Please do not disclose security vulnerabilities publicly until they have been investigated and addressed.**

If you discover a potential security vulnerability, please report it privately through GitHub's available security reporting features, if enabled for this repository.

When reporting a vulnerability, include:

- A clear description of the issue.
- Steps to reproduce the vulnerability.
- The potential impact.
- Relevant screenshots, logs, or proof-of-concept details, if safe to provide.
- Any suggested mitigation, if known.

Please avoid accessing, modifying, or deleting other people's data while investigating a potential vulnerability.

## Scope

Security issues relevant to GitVerse may include:

- **Authentication and authorization:** Unauthorized access to protected functionality or data.
- **API security:** Improper handling of GitHub API requests, tokens, or credentials.
- **Sensitive information exposure:** Accidental disclosure of secrets, API keys, or private information.
- **Cross-site scripting (XSS):** Injection of malicious scripts into the application.
- **Injection vulnerabilities:** Unsafe handling of user-supplied input.
- **Dependency vulnerabilities:** Security issues in third-party packages used by the project.
- **Server-side vulnerabilities:** If applicable, weaknesses in backend services or API endpoints.

## Out of Scope

The following generally do not qualify as security vulnerabilities on their own:

- Issues affecting only outdated, unsupported versions.
- Reports without a reproducible security impact.
- Automated scanner findings without evidence of an exploitable vulnerability.
- Social engineering or attacks against project contributors.
- Vulnerabilities in third-party services that are unrelated to GitVerse.

## Responsible Disclosure

We ask security researchers to:

1. Report vulnerabilities privately.
2. Allow reasonable time for investigation and remediation.
3. Avoid publicly disclosing the issue before a fix or coordinated disclosure agreement.
4. Avoid disrupting services or accessing data that does not belong to them.
5. Share only the information necessary to demonstrate the vulnerability.

## Security Best Practices

Contributors and maintainers should:

- Never commit API keys, access tokens, passwords, or other secrets.
- Store sensitive configuration in environment variables.
- Use environment files such as `.env` only when appropriate, and exclude secret-bearing files from version control through `.gitignore`.
- Validate and safely handle user input.
- Keep dependencies updated and review security advisories.
- Apply appropriate access controls to any backend services.
- Request only the GitHub API permissions necessary for the feature.
- Avoid logging sensitive data.
- Review changes for security implications before merging.

## Important Notes

GitVerse may use public GitHub profile and repository information to generate visualizations. Users should understand that displaying public repository data does not grant permission to access private repositories or bypass GitHub permissions.

Never enter or share a personal access token unless the application explicitly requires it and provides a secure, documented handling mechanism.

## Acknowledgments

We appreciate responsible security researchers who help improve GitVerse's security.

Thank you for helping make GitVerse safer for everyone.
