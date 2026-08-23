# Django Admin Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Django backend and SimpleUI admin to TraceDev without changing the existing frontend style or static GitHub Pages entry.

**Architecture:** Keep the existing static frontend files and Flask server intact. Add a root-level Django project with a `resources` app, SQLite database, model admin, Django static serving in development, and cookie-based locale synchronization with the existing frontend locale controller.

**Tech Stack:** Python 3.12, Django 5.2 LTS-compatible release, django-simpleui, SQLite, existing HTML/CSS/JS frontend.

**Spec:** `docs/superpowers/specs/2026-08-23-django-admin-backend-design.md`

## Global Constraints

- Preserve `index.html`, `css/`, `js/`, `assets/`, `data/`, `downloads/`, and `uploads/` URLs.
- Keep `server.py` unchanged unless Django integration requires a narrowly scoped compatibility change.
- Support `zh-CN`, `zh-TW`, `en`, `ja`, and `ko` on the frontend and corresponding Django locale codes.
- Never read, print, commit, or embed `token.txt`.
- Never write the administrator password or production secret key into source files.
- Keep `db.sqlite3`, `.venv/`, `.env`, and runtime cache files ignored by Git.

### Task 1: Add failing backend smoke tests

**Files:**
- Create: `tests/test_django_backend.py`

- [ ] **Step 1: Write failing tests** for Django settings, language mapping, root page, admin login, model registration, and admin user expectations.
- [ ] **Step 2: Run the tests** and confirm they fail because the Django project does not exist.

### Task 2: Install dependencies and scaffold Django

**Files:**
- Create: `requirements.txt`
- Create: `manage.py`
- Create: `tracedev_backend/__init__.py`
- Create: `tracedev_backend/settings.py`
- Create: `tracedev_backend/urls.py`
- Create: `tracedev_backend/asgi.py`
- Create: `tracedev_backend/wsgi.py`
- Create: `resources/__init__.py`
- Create: `resources/apps.py`
- Create: `resources/views.py`
- Create: `resources/urls.py`
- Create: `templates/site_index.html`
- Modify: `.gitignore`

- [ ] **Step 1:** Install Django and django-simpleui using the active Python interpreter.
- [ ] **Step 2:** Add settings with SimpleUI before Django admin, SQLite, static paths, templates, middleware, and five languages.
- [ ] **Step 3:** Add the root view that serves the existing frontend template and Django language route.
- [ ] **Step 4:** Copy the existing `index.html` into `templates/site_index.html` without changing frontend styling.
- [ ] **Step 5:** Run `python manage.py check`.

### Task 3: Add resource models and SimpleUI admin

**Files:**
- Create: `resources/models.py`
- Create: `resources/admin.py`
- Create: `resources/migrations/__init__.py`
- Create: `resources/tests.py`

- [ ] **Step 1:** Add model/admin registration tests.
- [ ] **Step 2:** Implement Video, Product, Resource, FAQ, and JournalPost models.
- [ ] **Step 3:** Register all models with list display, search, filters, ordering, and SimpleUI metadata.
- [ ] **Step 4:** Run migrations and verify admin registrations.

### Task 4: Synchronize frontend and Django locale

**Files:**
- Modify: `js/i18n.js`
- Modify: `templates/site_index.html`
- Modify: `index.html`
- Modify: `tracedev_backend/settings.py`

- [ ] **Step 1:** Add a failing mapping test for frontend locale to Django locale and `django_language` cookie.
- [ ] **Step 2:** Implement safe cookie synchronization in the frontend locale controller.
- [ ] **Step 3:** Configure Django `LocaleMiddleware` and five locale codes.
- [ ] **Step 4:** Confirm a language cookie changes the admin language on the next request.

### Task 5: Create administrator and verify server

**Files:**
- Create: `tools/create_django_admin.py`
- Modify: `.gitignore`

- [ ] **Step 1:** Create or update local user `wfw` from an environment-provided password without storing the password in source.
- [ ] **Step 2:** Run migrations, create the admin, and validate staff/superuser/password flags without printing the password.
- [ ] **Step 3:** Start Django on `127.0.0.1:8000 --noreload`.
- [ ] **Step 4:** Check `/`, `/admin/login/`, and static assets with HTTP requests.
- [ ] **Step 5:** Stop the verification server and run the complete test suite plus `git diff --check`.

### Task 6: Update the website repository

**Files:**
- Review all changed files and Git status.

- [ ] **Step 1:** Ensure sensitive files and local database are ignored.
- [ ] **Step 2:** Commit the Django backend changes with a focused message.
- [ ] **Step 3:** Push the requested website update to the configured GitHub remote, without exposing credentials.
- [ ] **Step 4:** Report the deployed commit and local admin URL.
