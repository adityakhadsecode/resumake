# UI Documentation & Design Tokens: Warm Paper-and-Ink

## Theme

An authentic editorial paper-and-ink design inspired by classic letterpress stationery and real printed documents. 

- **Editor Workspace**: Warm stone and linen palette (`#F3F2EF`), clean hairline borders (`#DAD5C9`), subtle cards (`#FCFBF9`), and deep navy typography (`#28344E`).
- **Resume Document Canvas**: Styled as a real printed archival page with crisp serif type (`Georgia`), hairline rules (`#DAD5C9`), high contrast deep charcoal text (`#1C1D21`), and zero card shadows on the resume page itself.

## Color Tokens

```css
:root {
  /* Workspace & Editor Tokens */
  --bg-app: #F3F2EF;          /* Warm linen desk */
  --bg-topbar: #FAFAF8;       /* Subtle off-white header */
  --bg-card: #FCFBF9;         /* Warm ivory form card */
  --bg-preview: #E9E7E1;      /* Deep parchment preview backdrop */
  --border-rule: #DAD5C9;     /* Subtle hairline rule */
  
  /* Ink & Typography Tokens */
  --ink-primary: #1C1D21;     /* Rich charcoal black */
  --ink-navy: #28344E;        /* Deep academic navy for titles & headers */
  --ink-body: #2B2C30;        /* Readable dark neutral for body & bullets */
  --ink-muted: #5B5F6B;       /* Muted slate for labels & meta dates */
  --ink-danger: #9A5142;      /* Warm terracotta/crimson for delete actions */
  
  /* Document Paper */
  --paper-bg: #FAFAF8;        /* Off-white archival paper sheet */
}
```

## Typography

- **App Shell & Editor Inputs**: Clean modern sans-serif:
  `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- **Resume Document (Print & Preview)**: Timeless archival serif:
  `Georgia, "Times New Roman", Times, serif`
  - Name: 26px bold, letter-spacing -0.01em
  - Title: 14.5px, navy (`#28344E`)
  - Contact Line: 11.5px muted (`#5B5F6B`) with middle dot separators (` · `)
  - Section Titles: 12px bold uppercase, 0.06em tracking, deep navy (`#28344E`)
  - Hairline Section Rules: 1px solid `#DAD5C9`
  - Body & Bullets: 12.5px–13px, line-height 1.55, deep charcoal (`#2B2C30`)

## Component Conventions

- **Headers**: 12px uppercase bold navy with a 1px solid `#DAD5C9` bottom rule.
- **Cards**: `#FCFBF9` surface, 1px `#DAD5C9` border, 4px border-radius, 14px padding.
- **Labels**: 11.5px, 500 weight, `#5B5F6B`.
- **Inputs & Textareas**: `#fff` background, 1px `#DAD5C9` border, 3px border-radius, 13.5px text.
- **Action Buttons**:
  - Primary CTA ("Download PDF"): Deep navy ink (`#28344E`) background, `#F3F2EF` text, 3px radius.
  - "+ Add" text buttons: Borderless `#28344E` text, 12.5px bold.
  - "Remove" text buttons: Borderless `#9A5142` text, 12px.

## Print Rules

```css
@page {
  size: letter portrait;
  margin: 0 !important; /* Disables browser-injected header (date/title) and footer (URL/pages) */
}

@media print {
  .no-print { display: none !important; }
  .print-only { 
    display: block !important; 
    margin: 0 !important;
    padding: 0.5in 0.55in !important; /* Moves document margins inside the printable sheet */
    box-sizing: border-box !important;
    background: #ffffff !important;
  }
  
  body, html {
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
  }

  .resume-sheet {
    box-shadow: none !important;
    border: none !important;
    width: 100% !important;
    min-height: 0 !important;
    padding: 0 !important;
  }
}
```
