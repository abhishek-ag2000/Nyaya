# Nyaya demo QA checklist

Use `/demo` before each replay. The canonical Tier-A case is `NYA-WB-DEMO-04821` (Sharma v. State of West Bengal); all data is synthetic and local.

## A. Navigation
- [ ] Open `/`, `/login`, `/my-nyaya`, `/my-cases`, and the canonical case.
- [ ] Check `/cause-list`, `/today`, `/filing-defects`, `/registry/filing-defects`, `/notifications`.
- [ ] Check Tier-C routes: live court, guide/article, certified copy, references, visit, help, judge, registry, police.
- [ ] Confirm all primary actions lead to a meaningful destination or clearly labelled prototype state.

## B. Shared case state
- [ ] Reschedule hearing in demo controls; verify case header, overview, right rail, My Nyaya, My Cases, Today, cause list, timeline and notification center.
- [ ] Trigger filing attention, then mark filing ready; verify attention, filing defects, dashboard, events and notifications update together.
- [ ] Add one demo document; verify only one document/event/notification is created.

## C. Core journey
- [ ] Login is mock-only and presents a synthetic demo identity.
- [ ] Upload flow reaches review, exposes extraction fields, requires synthetic-content confirmation, and returns to the case.
- [ ] Filing readiness returns safely to filing and case routes.
- [ ] Notification links open their relevant case/document/filing context and mark read.

## D. Responsive and accessibility
- [ ] Test 1440, 1280, 1024, 390, 375 and 360 px widths.
- [ ] Keyboard through header, tabs, filters, forms, notification drawer and reset controls.
- [ ] Confirm focus is visible, status text is not color-only and reduced-motion mode remains understandable.

## E. Reset/replay
- [ ] Use `/demo`, confirm reset, and start the main journey.
- [ ] Repeat upload → attention → ready → reschedule.
- [ ] Reset and repeat; verify no stale documents, duplicate events, duplicate notifications or altered hearing date remain.

## F. Compliance
- [ ] Persistent independent-prototype/synthetic-data disclaimer remains visible.
- [ ] No live government/API calls, official branding, real personal identifiers, payments, Aadhaar/PAN/OTP or real court records.
- [ ] Tier-C pages visibly say Prototype Preview; e-pass says not valid for entry; procedural tools retain their adjacent disclosures.
