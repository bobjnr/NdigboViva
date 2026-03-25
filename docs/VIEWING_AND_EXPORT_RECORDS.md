# How users view their submitted records (and Gramps Web export)

This doc describes the **recommended approach** for how people view their records in the browser, and how that works once you export to Gramps Web.

---

## Recommended approach: Ndigbo Viva as the front door

- **Always give users Ndigbo Viva URLs** in emails, confirmations, and share links.
- **After you export a record to Gramps Web**, set its `registryUrl` in your database. The public record page will then show a **“View in official registry”** button that opens the Gramps Web person page in a new tab.

Benefits:

1. **One stable place for links** – Your domain and paths don’t change if you move or rename the Gramps Web instance.
2. **Submissions not yet approved** – They only exist in Ndigbo Viva, so the link is always the submission page here.
3. **Approved records** – Users see the record on your site and can optionally open the same record in the official registry (Gramps Web) when `registryUrl` is set.
4. **Branding and trust** – Users land on your site first; “View in official registry” makes the relationship to Gramps Web clear.

---

## URLs users see

| What they view | URL | Notes |
|----------------|-----|--------|
| **Their submission** (pending / needs clarification / rejected) | `https://your-site.com/search/submission/{submissionId}` | Ndigbo Viva only. |
| **Their record** (one person, approved & published) | `https://your-site.com/search/record/{personId}` | From this page they can open “View family tree” and “View in official registry” (if set). |
| **Their family link** (person + ancestors/descendants) | `https://your-site.com/genealogy/person/{personId}` | Family tree view. Linked from the record page as “View family tree”. |
| **After export to Gramps Web** | Same record URL; page shows “View in official registry” → opens Gramps Web | Button → `https://your-gramps-web.example/person/{handle}` |

Use the **Ndigbo Viva** URLs in:

- Confirmation emails after submit
- “View your submission” / “View your record” links
- Any printed or shared links

Do **not** rely on giving out raw Gramps Web URLs unless you are sure the instance and path will never change; storing them in `registryUrl` and linking from the record page is enough.

---

## Setting the “View in official registry” link

When you export a person to Gramps Web, that person gets a **handle** in Gramps. The person page in Gramps Web is typically:

`https://<your-gramps-web-domain>/person/<handle>`

To show “View in official registry” on the Ndigbo Viva record page:

1. **Update the person in Firestore** (sovereign `persons` collection) with:
   - `registryUrl`: the full URL to that person on Gramps Web, e.g.  
     `https://your-gramps-web.example/person/abc123def456`
2. **Update the public view** so the link appears for visitors:
   - Either **republish** that person (admin: publish again), or
   - Manually update the same person document in the `public_persons` collection and set `registryUrl` there too.

The record page at `/search/record/[personId]` already reads from the public view and will show the button when `registryUrl` is present.

You can set `registryUrl`:

- **Manually** – e.g. in Firebase Console or via a one-off script after export.
- **From an export script** – When your export process creates/updates the person in Gramps Web, it can also update the Ndigbo Viva person (and optionally public) doc with the Gramps Web person URL.

---

## Summary

- **Recommendation:** Use **Ndigbo Viva as the single place for “view your record” links**; add **“View in official registry”** for records that have been exported to Gramps Web by setting `registryUrl`.
- **User flow:** Users open your links → see the record on your site → optionally click “View in official registry” to open the same record in Gramps Web.
- **Implementation:** Optional field `registryUrl` on person records; record page shows the button when it’s set. See `src/lib/person-schema.ts`, `src/lib/public-person-schema.ts`, and `src/app/search/record/[id]/page.tsx`.

---

## Visualizing the Gramps Web family tree on our website

When a record has a `registryUrl` (e.g. Gramps Web person page), we try to **show the registry family tree on our site** so users don't have to leave.

### What we do

1. **Embed (iframe)**  
   On the public record page (`/search/record/[id]`), if `registryUrl` is set, we show a section **"Family tree in official registry"** that embeds the registry URL in an iframe. Many Gramps Web person pages include the tree or charts on that same page, so users can see it without opening a new tab.

2. **Fallback**  
   If the registry server blocks embedding (e.g. `X-Frame-Options: DENY`), the iframe may be blank. We always show an **"Open in new tab"** link in the embed header and a note under the iframe so users can open the tree in the registry in a new tab.

### Making the embed work (Gramps Web)

For the iframe to show the Gramps Web page, the Gramps Web instance must **allow being embedded** (e.g. not send `X-Frame-Options: DENY`, or include your site in `Content-Security-Policy` `frame-ancestors`). If you host Gramps Web yourself, add your Ndigbo Viva domain to the allowed frame ancestors. If you cannot change the server, the "Open in new tab" button still gives full access.

### Alternative: Gramps Web API

For full control over the tree on your site, you can use the [Gramps Web API](https://gramps-project.github.io/gramps-web-api/) to fetch person and family data from your backend (to avoid CORS), then render the tree with your own component. This requires your Gramps Web instance to expose the API and optionally auth (e.g. JWT).
