# Instructions for AI Agents

## Context

This template is designed primarily for print-based resources and secondarily for online resources. 
It should be thought of as a PATTERN as teachers will have varying ways of communicating that do not 
all fit within the template.  Flexibility is required.
- **Print functionality** must be complete. Always have a printed book as a primary focus.
- **Online resources** must have working links.
- Use Bootstrap classes for layout and styling.

## Template System

- Templates are stored in the `Template/` (base) and `Block_Templates/` (frag) directories.
- `Template/` contains main section and lesson templates (e.g., `Overview.html`, `day.html`).
- `Block_Templates/` contains reusable content blocks (e.g., `wideYouTube.html`, `nextPage.html`).
- Icon and image URLs are injected via the icon map and context variables.
- When creating or editing templates:
  - Use Bootstrap classes for layout.
  - Follow the naming and layout conventions described below.
  - Ensure all dynamic content is referenced using Jinja2 variables.

## Structure

All content will be compiled into a Moodle Book with the following structure:
0. **Introduction (Optional)**
1. **Overview** (first page)
2. **Engage**
3. **Explore**
4. **Lessons**  
   - Each lesson should be formatted as a sub_chapter in the Moodle Book.
   - Each lesson file name should end with `_sub`. ex: ss1-u1-pt2-lesson9_sub.html
5. **Explain**
6. **Share**

---

## Formatting & Layout

- **Print Optimization:**  
  - Lessons should ideally fit on one printed page.  
  - If a second page is needed, use the class `next-page` and the `next-page` snippet from `Block_Templates/nextPage.html`.
    - `next-page` content only appears when the book is printing, not online. If a lesson will overflow a single printed page, use the `next-page` snippet before the Bootstrap row that will overflow to ensure it prints correctly.

- **Row Layout:**  
  - All rows must be full width.
  - For lessons with three activities:  
    - Place the first two activities in row 1. bsContentBox
    - Place the third activity in its own full-width row. bsContentWide
    - Maintain the activity order as in the Google Doc.

- **Graphics:**  
  - Referenced icons and section heading backgrounds are pre-made.
  - Find these in the Google Sheet titled **Icon URL info**.
  - If a lesson has an image supplied by a teacher it will not be ready to publish.  I may need to optimize it for web using Canva, or recreate the image.  Provide instructions to me on how to proceed, and if the image is available online.

---

## QR Codes

- Before creating the Moodle Book, identify all areas requiring QR codes.
- Generate image names for QR codes using the naming convention below.
- QR codes are created for linked activities, see folder qr/
- output a json file with required QR codes using qr\qr_codes_schema.json

---

## Naming Conventions

- All file and image names must follow this pattern:  
  `pbr-grade#-subject-unit-part or week#day#_activity-name.png,` ex: pbr1-ss-u1-pt3_activity-name.png
- Use **hyphens** to separate file location from activity identifier.
- Use **underscores** between words in titles (e.g., `first_three_words`).
- **No spaces** in file or image names.

---

## Styles

- Styles are controlled by `nsastyle.scss`, compiled by Moodle.
- nsaMixins.css is a shortened and compiled version
  
- All images are served from:  
  `https://images.nsa-images.org/`
- Name new files following this pattern pbr-{{grade#}}-{{subject either ss,math,
- ex: https://images.nsa-images.org/assets/icons/Do-Something.svg
- see the R2/ dir for contents

---

## Citations

- Do **not** add citations unless specifically requested by the teacher.
- If citations are required:
  - Use a footnote.
  - Add an extra chapter at the end of the Moodle Book titled **References**.

---

## Google Doc Parsing

- Ignore all teacher comments and comments addressed to "grant".
- When a teacher includes a note for a student or supervisor:
  - Highlight the note.
  - Use the "note" image from the Icon URL info sheet.

---

## Visual Design

- Content should be visually appealing to both students and teachers.
- **Do not** alter the teacher's content.

---

## Best Practices

- Ask clarifying questions before making changes.
- Encourage best practices for instructional design.

---

## YouTube Videos

- Do **not** display YouTube videos directly in the online course.
- the url will be displayed in a <code>url</code>
- a qr code will be generated and then nested in a clickable link.

---

## Suggestions & Optimizations

- Before creating content, review the Google Doc for any necessary graphics or QR codes, choose appropriate names and provide me a list of the names you will use along with image descriptions and required hyperlinks.  
- I will create those graphics and load them into nsa-images.org using provided names

---

## Example_Unit \

- This gives an idea of basic layout and structure of the content.  Does not need to be followed exactly, but should be used as a guide.

---
