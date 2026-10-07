# Negotiator registration tests

Playwright and TypeScript tests for `https://qa6.negsim.com`, built on the supplied framework

The main test creates a negotiator account, uploads an avatar, finds the confirmation email in MailCatcher, activates the account, and checks the saved profile

## Requirements

- Node.js 20 or newer with npm
- Access to qa6 and the MailCatcher credentials supplied with the assignment

## Installation

Clone the repository and install the dependencies:

```sh
git clone https://github.com/MakesKush/QA_E2E_TASK.git
cd QA_E2E_TASK
npm ci
npx playwright install chromium firefox
```

Install Microsoft Edge locally or use:

```sh
npx playwright install msedge
```

## MailCatcher access

Set the credentials in the terminal where you will run the tests

Replace `your-password` with the password from the assignment

On macOS or Linux:

```sh
export MAILCATCHER_USERNAME=developer
export MAILCATCHER_PASSWORD='your-password'
```

On Windows PowerShell:

```powershell
$env:MAILCATCHER_USERNAME = 'developer'
$env:MAILCATCHER_PASSWORD = 'your-password'
```

Credentials are read from environment variables

Do not add them to source files

## Running tests

Run commands from the project folder

Browsers open with visible windows by default

Chromium:

```sh
npm run test:registration -- --project=chromium
```

Firefox:

```sh
npm run test:registration -- --project=firefox
```

Microsoft Edge:

```sh
npm run test:registration -- --project=msedge
```

Run both the registration test and the login-page smoke test in all three browsers:

```sh
npm test
```

Run five separate registrations in sequence:

```sh
npm run test:registration -- --project=chromium --repeat-each=5 --workers=1
```

Check TypeScript:

```sh
npm run typecheck
```

### Headless mode

On macOS or Linux:

```sh
HEADLESS=true npm test -- --project=chromium
```

On Windows PowerShell:

```powershell
$env:HEADLESS = 'true'
npm test -- --project=chromium
Remove-Item Env:HEADLESS
```

### HTML report

Create an HTML report when running the test, then open it:

```sh
npm run test:registration -- --project=chromium --reporter=html
npm run report
```

Failed runs keep screenshots, video, and traces in `test-results`

Successful registrations also attach a screenshot of the activated profile

## What the test checks

- The login page opens and the registration button leads to the correct form
- Required fields are filled and the avatar is uploaded and applied
- The confirmation page shows the email address used in that run
- MailCatcher contains the registration email with the correct recipient and subject
- The activation link opens the profile and shows the success message
- The profile contains the saved first name, last name, and avatar

The scenario uses the real UI and email flow without mocks

## Implementation

Page objects keep locators and actions in one place, while the test contains the assertions, making the scenario readable and UI changes easier to maintain without duplicating selectors

Each run creates a UUID email address in a separate browser context, so it can find its own message in the shared MailCatcher inbox by recipient and registration subject, with a 45-second wait for delivery

Playwright actions and retrying assertions wait for the required UI state instead of fixed pauses

The password field is clicked before filling because it starts as read-only, and avatar upload includes applying the crop

The activation link is inside an iframe and opens a new tab, so popup waiting starts before the click

The scenario reuses `BasePage`, shared configuration and Winston logging, with `test.step` grouping the main stages in reports

MailCatcher credentials come from environment variables and are restricted to the qa6 origin

Retries are disabled so repeated runs show separate executions rather than automatic recovery from a failed test

## Firefox window

Local Firefox runs with a visible window use a temporary profile with the window mode set to maximized

Chromium and Edge keep their existing launch arguments

Check the Firefox window size:

```sh
npm run check:firefox-window
```

This setup uses Firefox's saved window state

Run the check again after updating Firefox

Headless runs and remote connections use the regular browser setup

Headed browser runs and the window check were verified on macOS; other operating systems may need a separate check

## Limitations

- qa6 and MailCatcher must be reachable, and email delivery must work
- The test covers successful registration; negative cases such as duplicate emails and expired activation links are outside its scope
- Created accounts and avatars remain on qa6 because no supported cleanup flow was supplied
- The shared inbox is never cleared, so messages from other users are left intact
- Diagnostic artifacts should stay local because they may contain credentials, session data or activation links
