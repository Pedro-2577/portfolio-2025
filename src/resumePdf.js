const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const LEFT = 44;
const RIGHT = PAGE_WIDTH - 44;
const WIDTH = RIGHT - LEFT;
const BOTTOM = PAGE_HEIGHT - 48;
const COLORS = {
  ink: '172033',
  body: '475467',
  muted: '667085',
  line: 'DCE1E8',
  accent: 'D7F43B',
  white: 'FFFFFF',
  navy: '172033',
};

const WIN_ANSI = new Map([
  [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84],
  [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87], [0x02c6, 0x88],
  [0x2030, 0x89], [0x0160, 0x8a], [0x2039, 0x8b], [0x0152, 0x8c],
  [0x017d, 0x8e], [0x2018, 0x91], [0x2019, 0x92], [0x201c, 0x93],
  [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
  [0x02dc, 0x98], [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b],
  [0x0153, 0x9c], [0x017e, 0x9e], [0x0178, 0x9f],
]);

function pdfHex(value) {
  let hex = '';
  for (const char of String(value)) {
    const point = char.codePointAt(0);
    let byte = point;
    if (point > 0xff) byte = WIN_ANSI.get(point);
    if (byte === undefined || byte < 0x20 || (byte >= 0x80 && byte <= 0x9f && !WIN_ANSI.has(point))) {
      const ascii = char.normalize('NFKD').replace(/[^\x20-\x7e]/g, '');
      for (const fallback of ascii) hex += fallback.charCodeAt(0).toString(16).padStart(2, '0');
    } else {
      hex += byte.toString(16).padStart(2, '0');
    }
  }
  return hex.toUpperCase();
}

function estimate(text, fontSize, bold = false) {
  const factor = bold ? 1.04 : 1;
  return [...text].reduce((sum, char) => {
    if (/[ilI.,:;!'|]/.test(char)) return sum + fontSize * 0.25 * factor;
    if (char === ' ') return sum + fontSize * 0.27;
    if (/[mwMW@%]/.test(char)) return sum + fontSize * 0.78 * factor;
    if (/[A-ZÁÉÍÓÚÑÜ]/.test(char)) return sum + fontSize * 0.63 * factor;
    return sum + fontSize * 0.51 * factor;
  }, 0);
}

function wrap(text, maxWidth, fontSize, bold = false) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [''];
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? line + ' ' + word : word;
    if (line && estimate(candidate, fontSize, bold) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function textCommand(x, top, value, size = 9, bold = false, color = COLORS.body) {
  const y = PAGE_HEIGHT - top - size;
  const font = bold ? 'F2' : 'F1';
  return 'BT /' + font + ' ' + size + ' Tf ' + color + ' rg 1 0 0 1 ' + x.toFixed(2) + ' ' + y.toFixed(2) + ' Tm <' + pdfHex(value) + '> Tj ET';
}

function rectCommand(x, top, width, height, color) {
  const y = PAGE_HEIGHT - top - height;
  return 'q ' + color + ' rg ' + x + ' ' + y.toFixed(2) + ' ' + width + ' ' + height + ' re f Q';
}

function lineCommand(x1, top, x2, color = COLORS.line, thickness = 0.7) {
  const y = PAGE_HEIGHT - top;
  return 'q ' + color + ' RG ' + thickness + ' w ' + x1 + ' ' + y.toFixed(2) + ' m ' + x2 + ' ' + y.toFixed(2) + ' l S Q';
}

export function downloadResumePdf({ language, profile, text, contact, projects }) {
  const pages = [];
  let page;
  let cursor = 0;

  function addPage(first = false) {
    page = [];
    pages.push(page);
    if (first) {
      page.push(rectCommand(0, 0, PAGE_WIDTH, 168, COLORS.navy));
      page.push(rectCommand(LEFT, 26, 34, 3, COLORS.accent));
      page.push(textCommand(LEFT, 39, 'Pedro Martín Méndez Carabán', 24, true, COLORS.white));
      page.push(textCommand(LEFT, 72, text.role, 11, true, COLORS.accent));
      const summaryLines = wrap(text.resumeSummary, WIDTH, 8.5);
      summaryLines.slice(0, 3).forEach((line, i) => page.push(textCommand(LEFT, 91 + i * 12, line, 8.5, false, COLORS.white)));
      const contacts = [contact.email + ' · ' + contact.phone, 'LinkedIn: ' + contact.linkedin.replace(/^https?:\/\//, ''), 'GitHub: ' + contact.github.replace(/^https?:\/\//, '') + ' · Portfolio: pedro-2577.github.io/portfolio-2025'];
      contacts.forEach((value, i) => page.push(textCommand(LEFT, 127 + i * 10, value, 7, false, COLORS.white)));
      cursor = 184;
    } else {
      page.push(rectCommand(0, 0, PAGE_WIDTH, 45, COLORS.navy));
      page.push(textCommand(LEFT, 15, 'Pedro Martín Méndez Carabán', 13, true, COLORS.white));
      page.push(textCommand(RIGHT - 36, 18, 'CV · ' + language.toUpperCase(), 8, true, COLORS.accent));
      cursor = 63;
    }
  }

  function ensure(height) {
    if (cursor + height > BOTTOM) addPage(false);
  }

  function sectionHeading(title) {
    ensure(30);
    page.push(textCommand(LEFT, cursor, title.toUpperCase(), 10.5, true, COLORS.ink));
    cursor += 16;
    page.push(lineCommand(LEFT, cursor, RIGHT));
    cursor += 7;
  }

  function paragraph(value, options = {}) {
    const size = options.size || 8.2;
    const lineHeight = options.lineHeight || size * 1.45;
    const indent = options.indent || 0;
    const lines = wrap(value, WIDTH - indent, size, options.bold || false);
    for (const line of lines) {
      ensure(lineHeight + 1);
      page.push(textCommand(LEFT + indent, cursor, line, size, options.bold || false, options.color || COLORS.body));
      cursor += lineHeight;
    }
    cursor += options.after === undefined ? 2 : options.after;
  }

  function entryHeading(title, period) {
    const maxTitle = WIDTH - 118;
    const lines = wrap(title, maxTitle, 9.2, true);
    ensure(lines.length * 12 + 15);
    lines.forEach((line, index) => page.push(textCommand(LEFT, cursor + index * 12, line, 9.2, true, COLORS.ink)));
    page.push(textCommand(RIGHT - Math.min(112, estimate(period, 7.4)), cursor + 1, period, 7.4, false, COLORS.muted));
    cursor += lines.length * 12;
  }

  function bullet(value) {
    const lines = wrap(value, WIDTH - 14, 8);
    lines.forEach((line, index) => {
      ensure(11.5);
      if (index === 0) page.push(textCommand(LEFT + 2, cursor, '•', 8, true, COLORS.ink));
      page.push(textCommand(LEFT + 13, cursor, line, 8, false, COLORS.body));
      cursor += 11;
    });
    cursor += 1;
  }

  addPage(true);

  sectionHeading(profile.experienceTitle);
  for (const experience of profile.experience) {
    entryHeading(experience.role, experience.period);
    paragraph(experience.organization, { size: 7.8, color: COLORS.muted, after: 2 });
    for (const item of experience.items) bullet(item);
    cursor += 4;
  }

  sectionHeading(profile.educationTitle);
  for (const education of profile.education) {
    entryHeading(education.title, education.period);
    paragraph(education.institution, { size: 7.8, color: COLORS.muted, after: 1 });
    paragraph(education.status, { size: 8, bold: true, after: 1 });
    paragraph(education.description, { size: 8, after: 4 });
  }

  sectionHeading(profile.skillsTitle);
  for (const area of profile.skills) {
    paragraph(area.title, { size: 8.4, bold: true, color: COLORS.ink, after: 0 });
    paragraph(area.items.join(' · '), { size: 8, after: 3 });
  }

  sectionHeading(text.resumeProjectsTitle);
  for (const project of projects) {
    const title = project.title;
    entryHeading(title, project.startDate);
    const role = language === 'es' ? project.role : (project.roleEn || project.shortDescription);
    if (role) paragraph(role, { size: 8, after: 1 });
    const highlights = language === 'es' ? project.highlights : project.highlightsEn;
    if (highlights) highlights.forEach(bullet);
    const outcome = language === 'es' ? project.outcome : project.outcomeEn;
    if (outcome) paragraph((text.outcomeLabel || 'Outcome') + ': ' + outcome, { size: 8, after: 4 });
  }

  sectionHeading(profile.coursesTitle);
  for (const course of profile.courses) {
    paragraph(course.title, { size: 8.4, bold: true, color: COLORS.ink, after: 0 });
    paragraph(course.text, { size: 8, after: 3 });
  }

  sectionHeading(profile.languagesTitle);
  paragraph(profile.languages, { size: 8 });

  sectionHeading(profile.strengthsTitle);
  paragraph(profile.strengths, { size: 8 });

  pages.forEach((commands, index) => {
    commands.push(lineCommand(LEFT, PAGE_HEIGHT - 34, RIGHT));
    commands.push(textCommand(LEFT, PAGE_HEIGHT - 27, 'pedro-2577.github.io/portfolio-2025', 7, false, COLORS.muted));
    commands.push(textCommand(RIGHT - 58, PAGE_HEIGHT - 27, (index + 1) + ' / ' + pages.length, 7, false, COLORS.muted));
  });

  const objects = [];
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
  const pageRefs = [];

  pages.forEach((commands, index) => {
    const pageId = 5 + index * 2;
    const streamId = pageId + 1;
    const stream = commands.join('\n');
    objects[pageId] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PAGE_WIDTH + ' ' + PAGE_HEIGHT + '] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ' + streamId + ' 0 R >>';
    objects[streamId] = '<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream';
    pageRefs.push(pageId + ' 0 R');
  });

  objects[2] = '<< /Type /Pages /Kids [' + pageRefs.join(' ') + '] /Count ' + pages.length + ' >>';
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (let id = 1; id < objects.length; id++) {
    offsets[id] = pdf.length;
    pdf += id + ' 0 obj\n' + objects[id] + '\nendobj\n';
  }
  const xrefOffset = pdf.length;
  pdf += 'xref\n0 ' + objects.length + '\n0000000000 65535 f \n';
  for (let id = 1; id < objects.length; id++) pdf += String(offsets[id]).padStart(10, '0') + ' 00000 n \n';
  pdf += 'trailer\n<< /Size ' + objects.length + ' /Root 1 0 R >>\nstartxref\n' + xrefOffset + '\n%%EOF';

  const blob = new Blob([new TextEncoder().encode(pdf)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'CV-Pedro-Martin-Mendez-Caraban-' + language.toUpperCase() + '.pdf';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
