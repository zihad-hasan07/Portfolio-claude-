## 2026-08-21 - Contact Form Accessibility & Validation
**Learning:** Updating generic `<div>` containers acting as forms to semantic `<form>` tags significantly improves keyboard interaction. In this case, simply updating the container type allowed users to submit the form utilizing the 'Enter' key and unlocked native browser validation features via HTML5 `required` attributes on inputs.
**Action:** Always favor semantic HTML tags (like `<form>` for user inputs) and utilize native browser behaviors where possible instead of recreating them with custom JavaScript events and generic `<div>`s.
