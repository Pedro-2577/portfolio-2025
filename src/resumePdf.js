const W = 595.28;
const H = 841.89;
const M = 44;
const CONTENT_BOTTOM = 795;
const C = { ink: '172033', body: '475467', muted: '667085', line: 'DCE1E8', lime: 'D7F43B', navy: '172033', white: 'FFFFFF', wash: 'F3F5EE', green: '526323' };
const WIN_ANSI = new Map([[0x20ac,128],[0x201a,130],[0x0192,131],[0x201e,132],[0x2026,133],[0x2020,134],[0x2021,135],[0x02c6,136],[0x2030,137],[0x0160,138],[0x2039,139],[0x0152,140],[0x017d,142],[0x2018,145],[0x2019,146],[0x201c,147],[0x201d,148],[0x2022,149],[0x2013,150],[0x2014,151],[0x02dc,152],[0x2122,153],[0x0161,154],[0x203a,155],[0x0153,156],[0x017e,158],[0x0178,159]]);

function hex(value) {
  let out = '';
  for (const char of String(value ?? '')) {
    const point = char.codePointAt(0);
    let byte = point;
    if (point > 255) byte = WIN_ANSI.get(point);
    if (byte === undefined || byte < 32 || (byte >= 128 && byte <= 159 && !WIN_ANSI.has(point))) {
      const fallback = char.normalize('NFKD').replace(/[^\x20-\x7e]/g, '');
      for (const part of fallback) out += part.charCodeAt(0).toString(16).padStart(2, '0');
    } else out += byte.toString(16).padStart(2, '0');
  }
  return out.toUpperCase();
}

function rgb(color, op = 'rg') {
  return color.match(/.{2}/g).map((v) => (parseInt(v, 16) / 255).toFixed(3)).join(' ') + ' ' + op;
}

function widthOf(value, size, bold = false) {
  const factor = bold ? 1.04 : 1;
  return [...String(value)].reduce((sum, ch) => {
    if (/[ilI.,:;!'|]/.test(ch)) return sum + size * .25 * factor;
    if (ch === ' ') return sum + size * .27;
    if (/[mwMW@%]/.test(ch)) return sum + size * .78 * factor;
    if (/[A-ZÁÉÍÓÚÑÜ]/.test(ch)) return sum + size * .63 * factor;
    return sum + size * .51 * factor;
  }, 0);
}

function linesFor(value, max, size, bold = false) {
  const words = String(value ?? '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines = [];
  let row = '';
  for (const word of words) {
    const next = row ? row + ' ' + word : word;
    if (row && widthOf(next, size, bold) > max) {
      lines.push(row);
      row = word;
    } else row = next;
  }
  if (row) lines.push(row);
  return lines;
}

function colorText(page, x, yTop, value, size, bold = false, color = C.body) {
  const y = H - yTop - size;
  const font = bold ? 'F2' : 'F1';
  page.push('BT /' + font + ' ' + size + ' Tf ' + rgb(color) + ' 1 0 0 1 ' + x.toFixed(2) + ' ' + y.toFixed(2) + ' Tm <' + hex(value) + '> Tj ET');
}

function addPdfLink(page, x, yTop, width, size, url) {
  if (!url || width <= 0) return;
  const baseline = H - yTop - size;
  page.links ||= [];
  page.links.push({ rect: [x, baseline - 1, x + width, baseline + size + 1], url });
}

function pdfLiteral(value) {
  const escaped = String(value ?? '').replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)');
  return '(' + escaped + ')';
}

function box(page, x, yTop, width, height, color) {
  page.push('q ' + rgb(color) + ' ' + x + ' ' + (H - yTop - height).toFixed(2) + ' ' + width + ' ' + height + ' re f Q');
}

function rule(page, x1, yTop, x2, color = C.line, weight = .7) {
  const y = H - yTop;
  page.push('q ' + rgb(color, 'RG') + ' ' + weight + ' w ' + x1 + ' ' + y.toFixed(2) + ' m ' + x2 + ' ' + y.toFixed(2) + ' l S Q');
}

function paragraph(page, x, y, width, value, opts = {}) {
  const size = opts.size || 8.1;
  const leading = opts.leading || size * 1.45;
  const rows = linesFor(value, width, size, opts.bold);
  rows.forEach((row, index) => colorText(page, x, y + index * leading, row, size, opts.bold, opts.color || C.body));
  return y + rows.length * leading + (opts.after ?? 2);
}

function heading(page, x, y, width, label) {
  colorText(page, x, y, String(label).toUpperCase(), 10, true, C.ink);
  rule(page, x, y + 15, x + width, C.line, .8);
  box(page, x, y + 14.2, Math.min(30, width), 1.8, C.lime);
  return y + 24;
}

function experienceEntry(page, x, y, width, entry) {
  colorText(page, x, y, entry.period, 7.1, true, C.green);
  y += 11;
  const roleRows = linesFor(entry.role, width, 9, true);
  roleRows.forEach((row, i) => colorText(page, x, y + i * 11, row, 9, true, C.ink));
  y += roleRows.length * 11 + 1;
  y = paragraph(page, x, y, width, entry.organization, { size: 7.5, color: C.muted, after: 3 });
  for (const item of entry.items) {
    const rows = linesFor(item, width - 10, 7.7);
    colorText(page, x + 1, y, '•', 8, true, C.green);
    rows.forEach((row, i) => colorText(page, x + 10, y + i * 10, row, 7.7, false, C.body));
    y += rows.length * 10 + 1;
  }
  return y + 7;
}

function educationEntry(page, x, y, width, entry) {
  colorText(page, x, y, entry.period, 7, true, C.green);
  y += 10;
  const titleRows = linesFor(entry.title, width, 8.8, true);
  titleRows.forEach((row, i) => colorText(page, x, y + i * 10.5, row, 8.8, true, C.ink));
  y += titleRows.length * 10.5;
  y = paragraph(page, x, y + 1, width, entry.institution, { size: 7.5, color: C.muted, after: 1 });
  y = paragraph(page, x, y, width, entry.status, { size: 7.6, bold: true, color: C.body, after: 1 });
  return paragraph(page, x, y, width, entry.description, { size: 7.4, after: 7 });
}

function projectEntry(page, x, y, width, project, language, labels) {
  colorText(page, x, y, project.startDate, 7.1, true, C.green);
  y += 10;
  const titleRows = linesFor(project.title, width, 9, true);
  titleRows.forEach((row, i) => colorText(page, x, y + i * 11, row, 9, true, C.ink));
  y += titleRows.length * 11 + 1;
  const role = language === 'es' ? project.role : (project.roleEn || project.shortDescription);
  if (role) y = paragraph(page, x, y, width, role, { size: 7.7, bold: true, color: C.body, after: 1 });
  const highlights = language === 'es' ? project.highlights : project.highlightsEn;
  if (highlights) {
    for (const item of highlights) {
      const rows = linesFor(item, width - 9, 7.4);
      colorText(page, x + 1, y, '•', 7.5, true, C.green);
      rows.forEach((row, i) => colorText(page, x + 9, y + i * 9.5, row, 7.4));
      y += rows.length * 9.5 + .5;
    }
  }
  const outcome = language === 'es' ? project.outcome : project.outcomeEn;
  if (outcome) y = paragraph(page, x, y + 1, width, labels.outcome + ': ' + outcome, { size: 7.4, color: C.muted, after: 5 });
  return y + 4;
}

function addFooter(page, number, language) {
  rule(page, M, H - 34, W - M, C.line, .7);
  colorText(page, M, H - 27, 'pedro-2577.github.io/portfolio-2025', 7, false, C.muted);
  colorText(page, W - M - 48, H - 27, (language === 'es' ? 'Página ' : 'Page ') + number + ' / 2', 7, false, C.muted);
}

function makePdf(pages) {
  const objects = [];
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
  const kids = [];
  let nextId = 5;
  pages.forEach((page) => {
    const pageId = nextId++;
    const streamId = nextId++;
    const links = (page.links || []).map((link) => ({ ...link, id: nextId++ }));
    const stream = page.join('\n');
    const annotations = links.length ? ' /Annots [' + links.map((link) => link.id + ' 0 R').join(' ') + ']' : '';
    objects[pageId] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + W + ' ' + H + '] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ' + streamId + ' 0 R' + annotations + ' >>';
    objects[streamId] = '<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream';
    for (const link of links) {
      const rect = link.rect.map((value) => value.toFixed(2)).join(' ');
      objects[link.id] = '<< /Type /Annot /Subtype /Link /Rect [' + rect + '] /Border [0 0 0] /A << /S /URI /URI ' + pdfLiteral(link.url) + ' >> >>';
    }
    kids.push(pageId + ' 0 R');
  });
  objects[2] = '<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + pages.length + ' >>';
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (let id = 1; id < objects.length; id++) {
    offsets[id] = pdf.length;
    pdf += id + ' 0 obj\n' + objects[id] + '\nendobj\n';
  }
  const xref = pdf.length;
  pdf += 'xref\n0 ' + objects.length + '\n0000000000 65535 f \n';
  for (let id = 1; id < objects.length; id++) pdf += String(offsets[id]).padStart(10, '0') + ' 00000 n \n';
  pdf += 'trailer\n<< /Size ' + objects.length + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF';
  return new Blob([new TextEncoder().encode(pdf)], { type: 'application/pdf' });
}

export function downloadResumePdf({ language, profile, text, contact, projects }) {
  const first = [];
  const second = [];
  const leftX = M;
  const leftW = 320;
  const rightX = 388;
  const rightW = W - M - rightX;
  const labels = { outcome: text.outcomeLabel || (language === 'es' ? 'Resultado' : 'Outcome') };

  box(first, 0, 0, W, 188, C.navy);
  box(first, M, 18, 34, 3, C.lime);
  colorText(first, M, 27, 'Pedro Martín Méndez Carabán', 21, true, C.white);
  colorText(first, M, 54, text.role, 10, true, C.lime);
  let summaryY = 71;
  for (const row of linesFor(text.resumeSummary, W - 2 * M, 7.8).slice(0, 2)) {
    colorText(first, M, summaryY, row, 7.8, false, C.white);
    summaryY += 10;
  }
  const contactY = 96;
  const contactSize = 7.1;
  const cityLabel = language === 'es' ? 'Ciudad: ' : 'City: ';
  const countryLabel = language === 'es' ? 'País: ' : 'Country: ';
  const phoneLabel = language === 'es' ? 'Teléfono: ' : 'Phone: ';
  const portfolioUrl = 'https://pedro-2577.github.io/portfolio-2025/';
  const lines = [
    { y: contactY, text: cityLabel + 'Buenos Aires  ·  ' + countryLabel + 'Argentina' },
    { y: contactY + 11, text: 'Email: ' + contact.email + '  ·  ' + phoneLabel + contact.phone },
    { y: contactY + 22, label: 'LinkedIn: ', url: contact.linkedin, value: contact.linkedin.replace(/^https?:\/\//, '').replace(/\/$/, '') },
    { y: contactY + 33, label: 'Portfolio: ', url: portfolioUrl, value: portfolioUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') },
    { y: contactY + 44, label: 'GitHub: ', url: contact.github, value: contact.github.replace(/^https?:\/\//, '').replace(/\/$/, '') }
  ];
  for (const line of lines) {
    colorText(first, M, line.y, line.label ? line.label + line.value : line.text, contactSize, false, C.white);
    if (line.url) addPdfLink(first, M + widthOf(line.label, contactSize), line.y, widthOf(line.value, contactSize), contactSize, line.url);
  }

  let leftY = heading(first, leftX, 200, leftW, profile.experienceTitle);
  for (const entry of profile.experience) leftY = experienceEntry(first, leftX, leftY, leftW, entry);

  let rightY = heading(first, rightX, 200, rightW, profile.skillsTitle);
  for (const area of profile.skills) {
    rightY = paragraph(first, rightX, rightY, rightW, area.title, { size: 7.5, bold: true, color: C.ink, after: .5 });
    rightY = paragraph(first, rightX, rightY, rightW, area.items.join(' · '), { size: 7.2, after: 5 });
  }
  rightY = heading(first, rightX, rightY + 1, rightW, profile.languagesTitle);
  rightY = paragraph(first, rightX, rightY, rightW, profile.languages, { size: 7.2, after: 4 });
  rightY = heading(first, rightX, rightY, rightW, profile.strengthsTitle);
  paragraph(first, rightX, rightY, rightW, profile.strengths, { size: 7.2 });

  box(second, 0, 0, W, 57, C.navy);
  box(second, M, 19, 25, 2.5, C.lime);
  colorText(second, M, 28, 'Pedro Martín Méndez Carabán', 13, true, C.white);
  colorText(second, W - M - 65, 31, 'CV · ' + language.toUpperCase(), 8, true, C.lime);

  let projectsY = heading(second, leftX, 78, leftW, text.resumeProjectsTitle);
  for (const project of projects) projectsY = projectEntry(second, leftX, projectsY, leftW, project, language, labels);

  let sideY = heading(second, rightX, 78, rightW, profile.educationTitle);
  for (const entry of profile.education) sideY = educationEntry(second, rightX, sideY, rightW, entry);
  sideY = heading(second, rightX, sideY + 2, rightW, profile.coursesTitle);
  for (const course of profile.courses) {
    sideY = paragraph(second, rightX, sideY, rightW, course.title, { size: 7.5, bold: true, color: C.ink, after: .5 });
    sideY = paragraph(second, rightX, sideY, rightW, course.text, { size: 7.2, after: 4 });
  }

  addFooter(first, 1, language);
  addFooter(second, 2, language);
  const blob = makePdf([first, second]);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'CV-Pedro-Martin-Mendez-Caraban-' + language.toUpperCase() + '.pdf';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}
