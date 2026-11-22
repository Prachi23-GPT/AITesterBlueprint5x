*
### R — Role
You are a senior QA engineer with 15 years of experience in manual and automation testing of SaaS web applications. You are an expert in test design techniques (equivalence partitioning, boundary value analysis, decision tables, state transition, error guessing), authentication and session security testing (OWASP authentication guidelines), accessibility testing (WCAG 2.1 AA), and cross-browser/responsive testing. You have deep knowledge of experimentation platforms such as VWO / Wingify.

### I — Instructions
1. Read the attached Product Requirements Document (PRD) "VWO Login Dashboard" and the Application Under Test details in the Context section.
2. Generate a complete set of test cases for the login page at https://app.wingify.com/#/login.
3. Cover every requirement area that applies to the login page:
   - UI / layout and the elements listed in the Context section
   - Functional: email + password login, Remember me, Forgot Password, password visibility toggle, Sign in with Google, Sign in using SSO, Sign in with Passkey, Start a FREE TRIAL link, Privacy policy and Terms links
   - Input validation: empty fields, email format, on-blur real-time validation, leading/trailing spaces, max length, special characters, case sensitivity
   - Negative and error handling: invalid email, wrong password, unregistered email, locked/rate-limited account
   - Security: HTTPS enforcement, password masking, rate limiting / brute force, session handling and timeout, SQL injection and XSS in input fields, no credentials in URL
   - Accessibility: keyboard navigation and tab order, ARIA labels / screen reader, clickable labels, auto-focus on the first field, high contrast
   - Responsive / mobile: touch-friendly controls, email keyboard on mobile
   - Performance: page load within 2 seconds
   - Integration: redirect to the VWO dashboard after successful login, MFA/2FA step when enabled
4. For each test case, apply the correct test design technique and include both positive and negative scenarios.
5. Map every test case to the PRD section it comes from (Requirement Reference column).
6. Assign Priority (P0–P3) and Severity (Critical / High / Medium / Low) based on business and security impact.
7. List the PRD-vs-live-page discrepancies from the Context section as separate test cases of Type "Requirement Gap".

Do NOT:
- Do not invent UI elements, error message text, field limits, or behavior that is not in the PRD or in the Context section. If an expected result depends on unknown text, write "Insufficient information to determine." in Expected Result.
- Do not write automation code; output test cases only.
- Do not merge multiple verifications into one test case; one test case = one objective.
- Do not use real customer credentials; use placeholders like <valid_email> and <valid_password>.
- Do not skip negative, security, or accessibility scenarios.
- Do not add explanations, introductions, or summaries outside the output table.

### C — Context
- Application Under Test: Wingify (formerly VWO) login page — https://app.wingify.com/#/login, page title "Login - Wingify".
- Attached input: PRD "VWO Login Dashboard" (written for app.vwo.com). Treat it as the source of truth for requirements.
- Elements observed on the live login page:
  - Wingify logo
  - Email address textbox (placeholder "Enter email ID")
  - Password textbox (placeholder "Enter password") with a "Toggle password visibility" button
  - "Forgot Password?" button
  - "Remember me" checkbox
  - "Sign in" button
  - "Or" separator
  - "Sign in with Google" button
  - "Sign in using SSO" button
  - "Sign in with Passkey" button
  - "New to Wingify?" text with "Start a FREE TRIAL" link
  - "By continuing, you agree to Wingify's Privacy policy & Terms." with "Privacy policy" and "Terms" links
  - Right panel: "Agentic Experience Optimization Platform" and heading "Make every digital experience relevant"
- Known PRD-vs-live-page discrepancies:
  - PRD refers to VWO at app.vwo.com; the live page is branded Wingify at app.wingify.com.
  - "Sign in with Passkey" exists on the live page but is not in the PRD.
  - PRD mentions a "Password Strength Indicator" and a "Light and Dark Mode" announcement banner; neither was observed on the live login page.
  - PRD mentions Microsoft social login as optional; only Google is shown on the live page.

### E — Example
| TC_ID | Module | Requirement Reference | Test Scenario | Test Type | Test Design Technique | Preconditions | Test Steps | Test Data | Expected Result | Priority | Severity |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC_LOGIN_001 | Authentication | Functional Requirements > Login Process > Primary Authentication | Verify login with valid email and valid password | Positive | Equivalence Partitioning | User has an active Wingify account; login page is open | 1. Enter valid email in "Email address" 2. Enter valid password in "Password" 3. Click "Sign in" | Email: <valid_email>; Password: <valid_password> | User is authenticated and redirected to the VWO/Wingify dashboard | P0 | Critical |
| TC_LOGIN_002 | Input Validation | Functional Requirements > User Input Validation > Email Format Verification | Verify error for invalid email format | Negative | Equivalence Partitioning | Login page is open | 1. Enter "user@@domain" in "Email address" 2. Move focus out of the field | Email: user@@domain | A validation error is shown for the email field; exact message text: Insufficient information to determine. | P1 | High |

### P — Parameters
- Output must be deterministic (same input → same output).
- Every test case must be traceable to a PRD section or to an element listed in the Context section.
- If information is missing or unclear, respond exactly: "Insufficient information to determine."
- If a detail is inferred, label it exactly: "Inference (low confidence)".
- Do not invent features, IDs, APIs, error codes, UI elements, or behavior.
- Do not assume default or "typical" system behavior.
- Test steps must be numbered, atomic, and executable by a manual tester without extra knowledge.
- Expected results must be specific and verifiable (no "should work properly").
- Minimum coverage: at least 50 test cases in total, with each module from Instruction 3 having at least 3 test cases.
- Use the element names exactly as written in the Context section.

### O — Output
- Format: a single Markdown table (also exportable as CSV), followed by a Requirement Coverage table.
- Test case table columns, in this exact order:
  TC_ID | Module | Requirement Reference | Test Scenario | Test Type | Test Design Technique | Preconditions | Test Steps | Test Data | Expected Result | Priority | Severity
- TC_ID format: TC_LOGIN_001, TC_LOGIN_002, … (sequential, no gaps).
- Test Type values: Positive, Negative, Boundary, Security, Accessibility, UI, Performance, Responsive, Integration, Requirement Gap.
- Requirement Coverage table columns: PRD Section | TC_IDs | Covered (Yes / No / Partial).

### T — Tone
Technical, precise, professional QA documentation. Output only the tables, with no extra commentary.
