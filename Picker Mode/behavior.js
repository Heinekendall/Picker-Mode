document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.folderBehaviorReady === 'true') return;
  document.body.dataset.folderBehaviorReady = 'true';

  const fillerAssets = {
    link: 'https://www.figma.com/api/mcp/asset/09d6e0af-21a7-491f-a6f1-0a54176cced3.svg',
    expandFolder: 'https://www.figma.com/api/mcp/asset/5c481f79-00ae-47bc-843f-df385b6c1547.svg',
    expandGroup: 'https://www.figma.com/api/mcp/asset/5d529dd1-31f8-4d00-a5e1-041618ebcc66.svg',
    more: 'https://www.figma.com/api/mcp/asset/29c7a8c9-8ef0-4aeb-902c-0c7fd8b0f3e1.svg',
    assessmentLink: 'https://www.figma.com/api/mcp/asset/73fa6080-901e-4594-84c4-68c996cc6f0f.svg',
    assessment: 'https://www.figma.com/api/mcp/asset/1439cb03-f3b3-43d3-9853-7cc478b77ada.svg',
    presentation: 'https://www.figma.com/api/mcp/asset/1c46e402-a43e-43f9-9a38-2690bee6a787.svg',
    expandMore: 'https://www.figma.com/api/mcp/asset/58e3d699-0e75-491e-b245-22a24309697d.svg',
    visibilityOff: 'https://www.figma.com/api/mcp/asset/de3cfb77-40eb-4cf4-a3a2-8ed9740dd5b5.svg',
    lock: 'https://www.figma.com/api/mcp/asset/47d9578f-1565-4c91-841f-56b05f3783ee.svg'
  };

  // Figma MCP asset URLs are temporary and can fail outside the design session.
  // Keep the picker usable with small local SVG fallbacks instead of showing
  // broken-image placeholders when one of those URLs is unavailable.
  const inlineIcon = (content, viewBox = '0 0 24 24', stroke = '#3b3f46') => (
    `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none" stroke="#3b3f46" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`)}`
  );
  const fallbackIcons = {
    link: inlineIcon('<path d="M8.5 12h7"/><path d="M9.5 7.5h-2a4.5 4.5 0 0 0 0 9h2"/><path d="M14.5 7.5h2a4.5 4.5 0 0 1 0 9h-2"/>'),
    expandFolder: inlineIcon('<path d="m9 6 6 6-6 6"/>'),
    expandGroup: inlineIcon('<path d="m6 14 6-6 6 6"/>'),
    expandMore: inlineIcon('<path d="m6 9 6 6 6-6"/>'),
    more: inlineIcon('<circle cx="12" cy="5" r="1" fill="#3b3f46" stroke="none"/><circle cx="12" cy="12" r="1" fill="#3b3f46" stroke="none"/><circle cx="12" cy="19" r="1" fill="#3b3f46" stroke="none"/>'),
    assessment: inlineIcon('<rect x="5" y="4" width="14" height="16" rx="1.5"/><path d="M8 8h8M8 12h8M8 16h4"/>'),
    presentation: inlineIcon('<rect x="4" y="5" width="16" height="11" rx="1"/><path d="M12 16v4M8 20h8"/>'),
    lock: inlineIcon('<rect x="6" y="10" width="12" height="10" rx="1.5"/><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10"/>'),
    visibilityOff: inlineIcon('<path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M6.3 6.4C4.3 7.8 3 9.6 2.5 12c1.2 4.2 4.9 6.5 9.5 6.5 1.7 0 3.2-.4 4.5-1.1M17.7 15.8c1.9-1.4 3.2-3.2 3.8-3.8-1.2-4.2-4.9-6.5-9.5-6.5-1 0-2 .1-2.9.4"/>'),
    menu: inlineIcon('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    search: inlineIcon('<circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 4.5 4.5"/>'),
    back: inlineIcon('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
    list: inlineIcon('<path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>'),
    calendar: inlineIcon('<rect x="4" y="5" width="16" height="15" rx="1.5"/><path d="M8 3v4M16 3v4M4 9h16M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01"/>'),
    calendarBlue: inlineIcon('<rect x="4" y="5" width="16" height="15" rx="1.5"/><path d="M8 3v4M16 3v4M4 9h16M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01"/>'),
    clock: inlineIcon('<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>'),
    generic: inlineIcon('<rect x="5" y="4" width="14" height="16" rx="1.5"/><path d="M8 8h8M8 12h8M8 16h5"/>')
  };
  const fallbackAssetMap = {
    '09d6e0af-21a7-491f-a6f1-0a54176cced3': 'link',
    '5c481f79-00ae-47bc-843f-df385b6c1547': 'expandFolder',
    '5d529dd1-31f8-4d00-a5e1-041618ebcc66': 'expandGroup',
    '29c7a8c9-8ef0-4aeb-902c-0c7fd8b0f3e1': 'more',
    '73fa6080-901e-4594-84c4-68c996cc6f0f': 'link',
    '1439cb03-f3b3-43d3-9853-7cc478b77ada': 'assessment',
    '1c46e402-a43e-43f9-9a38-2690bee6a787': 'presentation',
    '58e3d699-0e75-491e-b245-22a24309697d': 'expandMore',
    'de3cfb77-40eb-4cf4-a3a2-8ed9740dd5b5': 'visibilityOff',
    '47d9578f-1565-4c91-841f-56b05f3783ee': 'lock',
    '4c183575-89dd-46df-a02f-a46aeda71be9': 'menu',
    'b8d8548b-a23e-4ff8-97c9-3ee6ac2c8fd3': 'expandMore',
    'e6be2225-9b20-4286-8b82-9255bad09748': 'back',
    '29cdc3ae-f445-4ccd-b6b3-9bdf19428fbb': 'search',
    '8fadd0e3-4615-40f3-b0f8-5a058e734928': 'list',
    '1748c002-6bac-4602-a201-7f70b9daf164': 'calendar'
  };
  const fallbackIconFor = (image) => {
    const source = image.getAttribute('src') || '';
    const assetId = Object.keys(fallbackAssetMap).find((id) => source.includes(id));
    if (assetId) return fallbackIcons[fallbackAssetMap[assetId]];
    if (image.classList.contains('kebab') || image.classList.contains('folder-menu-icon') || image.classList.contains('group-menu-icon')) return fallbackIcons.more;
    if (image.classList.contains('expand-icon')) return image.classList.contains('up') ? fallbackIcons.expandGroup : fallbackIcons.expandFolder;
    if (image.classList.contains('row-chevron')) return fallbackIcons.expandMore;
    if (image.classList.contains('folder-link-icon')) return fallbackIcons.link;
    if (image.classList.contains('row-icon')) return fallbackIcons.generic;
    return fallbackIcons.generic;
  };
  const repairPickerIcons = () => {
    document.querySelectorAll('img[src*="figma.com/api/mcp/asset/"]').forEach((image) => {
      if (image.dataset.iconFallbackBound === 'true') return;
      image.dataset.iconFallbackBound = 'true';
      const repair = () => {
        if (image.dataset.iconFallbackApplied === 'true' && image.src.startsWith('data:image/svg+xml')) return;
        image.dataset.iconFallbackApplied = 'true';
        image.src = fallbackIconFor(image);
      };
      image.addEventListener('error', repair);
      if (image.complete && image.naturalWidth === 0) repair();
    });
  };
  repairPickerIcons();
  new MutationObserver(repairPickerIcons).observe(document.body, { childList: true, subtree: true });

  const activityMenuItems = [
    { label: 'Preview activity', icon: 'https://www.figma.com/api/mcp/asset/431a25b8-2b11-49c7-8c5e-b0cadaad53e5.svg', action: 'preview' },
    { label: 'Hide activity from students', icon: 'https://www.figma.com/api/mcp/asset/d2f78328-e305-4948-97ba-346dfb8bf68c.svg', action: 'hide' },
    { label: 'Move activity', icon: 'https://www.figma.com/api/mcp/asset/41d251e6-7a44-4224-8916-125534376220.svg' },
    { label: 'Manage activity settings', icon: 'https://www.figma.com/api/mcp/asset/9ef62e02-b065-43ac-8661-540b3a61ca68.svg', action: 'settings' },
    { label: 'Edit activity title and questions', icon: 'https://www.figma.com/api/mcp/asset/d8ce1a59-f676-441e-aa92-3a6e39deb8ea.svg', action: 'edit' },
    { label: 'Remove activity', icon: 'https://www.figma.com/api/mcp/asset/396939e1-38d7-486c-adf8-b13b9ade1322.svg' }
  ];
  const folderMenuItems = [
    { label: 'Hide folder from students', icon: fillerAssets.visibilityOff, action: 'hide-folder' },
    { label: 'Edit folder details', icon: 'https://www.figma.com/api/mcp/asset/53f95fd2-f5d4-47dd-aae7-88650085e999.svg' },
    { label: 'Add activity to folder', icon: fillerAssets.assessmentLink },
    { label: 'Add folder to folder', icon: fillerAssets.link },
    { label: 'Remove folder', icon: 'https://www.figma.com/api/mcp/asset/55dcf20a-3280-49b7-9815-b0d84bb31a1a.svg' }
  ];

  const fillerMarkup = (chapterNumber) => {
    const chapterDueDate = Number(chapterNumber) === 2
      ? 'Jan 29, 2027 @ 11:59 PM EDT'
      : Number(chapterNumber) === 3
        ? 'Feb 5, 2027 @ 11:59 PM EDT'
        : Number(chapterNumber) === 4
          ? 'Feb 12, 2027 @ 11:59 PM MT'
          : Number(chapterNumber) === 5
            ? 'Feb 19, 2027 @ 11:59 PM MT'
            : Number(chapterNumber) === 6
              ? 'Feb 26, 2027 @ 11:59 PM MT'
              : Number(chapterNumber) === 7
                ? 'Mar 5, 2027 @ 11:59 PM MT'
                : Number(chapterNumber) === 8
                  ? 'Mar 12, 2027 @ 11:59 PM MT'
                  : Number(chapterNumber) === 9
                    ? 'Mar 19, 2027 @ 11:59 PM MT'
                    : 'Oct 29, 2024 @ 11:59 PM EDT';
    const chapterDateSuffix = chapterDueDate.endsWith('MT') ? '@ 11:59 PM MT' : '@ 11:59 PM EDT';

    return `
    <div class="item-row simple chapter-item"><span class="checkbox">□</span><span class="indent"></span><img class="row-icon" src="${fillerAssets.link}" alt="" /><span class="item-title">Read Chapter ${chapterNumber}</span><img class="kebab" src="${fillerAssets.more}" alt="More" /></div>
    <div class="group-row"><span class="checkbox">□</span><img class="folder-link-icon" src="${fillerAssets.link}" alt="" /><img class="expand-icon up" src="${fillerAssets.expandGroup}" alt="" /><b>Learn It</b><img class="group-menu-icon" src="${fillerAssets.more}" alt="More" /></div>
    <div class="item-row nested assessment"><span class="checkbox">□</span><span class="nested-indent"></span><img class="row-icon" src="${fillerAssets.assessmentLink}" alt="" /><div class="item-title"><span>Check Your Understanding #1</span><small>PRACTICE</small></div><div class="metrics"><b>0%</b><small>submitted</small><b>--</b><small>avg score</small><b>8</b><small>points</small></div><img class="kebab" src="${fillerAssets.more}" alt="More" /><img class="row-chevron" src="${fillerAssets.expandMore}" alt="" /><small class="estimated">Estimated time: 10 minutes</small></div>
    <div class="item-row nested assessment"><span class="checkbox">□</span><span class="nested-indent"></span><img class="row-icon" src="${fillerAssets.assessmentLink}" alt="" /><div class="item-title"><span>Check Your Understanding #2</span><small>PRACTICE</small></div><div class="metrics"><b>0%</b><small>submitted</small><b>--</b><small>avg score</small><b>8</b><small>points</small></div><img class="kebab" src="${fillerAssets.more}" alt="More" /><img class="row-chevron" src="${fillerAssets.expandMore}" alt="" /><small class="estimated">Estimated time: 10 minutes</small></div>
    <div class="group-row"><span class="checkbox">□</span><img class="folder-link-icon" src="${fillerAssets.link}" alt="" /><img class="expand-icon up" src="${fillerAssets.expandGroup}" alt="" /><b>Study It</b><img class="group-menu-icon" src="${fillerAssets.more}" alt="More" /></div>
    <div class="item-row nested simple"><span class="checkbox">□</span><span class="nested-indent"></span><img class="row-icon" src="${fillerAssets.presentation}" alt="" /><span class="item-title link-text">PowerPoints</span><img class="kebab" src="${fillerAssets.more}" alt="More" /></div>
    <div class="item-row nested simple"><span class="checkbox">□</span><span class="nested-indent"></span><img class="row-icon" src="${fillerAssets.link}" alt="" /><span class="item-title link-text">Flashcards</span><img class="kebab" src="${fillerAssets.more}" alt="More" /></div>
    <div class="group-row"><span class="checkbox">□</span><img class="folder-link-icon" src="${fillerAssets.link}" alt="" /><img class="expand-icon up" src="${fillerAssets.expandGroup}" alt="" /><b>Apply It</b><img class="group-menu-icon" src="${fillerAssets.more}" alt="More" /></div>
    <div class="item-row nested assessment apply-item dated-assessment"><span class="checkbox">□</span><span class="nested-indent"></span><img class="row-icon" src="${fillerAssets.assessmentLink}" alt="" /><div class="item-title"><span class="link-text">Quiz: Chapter ${chapterNumber}</span><span class="due-date"><span class="inline-date-host" data-date-label="Due date" data-date-placeholder="Add Due Date" data-date-value="${chapterDueDate}" data-date-suffix="${chapterDateSuffix}"></span></span><small class="grade">● &nbsp;COUNTS TOWARDS GRADE</small></div><div class="unlock-meta"><img src="${fillerAssets.lock}" alt="" /><span>Unlocks Feb 5<br /><em>@ 12:00 AM EST</em></span></div><div class="metrics"><b>0%</b><small>submitted</small><b>--</b><small>avg score</small><b>10</b><small>points</small></div><img class="kebab" src="${fillerAssets.more}" alt="More" /><img class="row-chevron" src="${fillerAssets.expandMore}" alt="" /><small class="estimated">Estimated time: 15 minutes</small></div>
    <div class="item-row nested assessment apply-item dated-assessment"><span class="checkbox">□</span><span class="nested-indent"></span><img class="row-icon" src="${fillerAssets.assessment}" alt="" /><div class="item-title"><span class="link-text">Quiz: Chapter ${chapterNumber}</span><span class="due-date"><span class="inline-date-host" data-date-label="Due date" data-date-placeholder="Add Due Date" data-date-value="${chapterDueDate}" data-date-suffix="${chapterDateSuffix}"></span></span><small class="grade">● &nbsp;COUNTS TOWARDS GRADE</small></div><div class="unlock-meta"><img src="${fillerAssets.lock}" alt="" /><span>Unlocks Feb 5<br /><em>@ 12:00 AM EST</em></span></div><div class="metrics"><b>0%</b><small>submitted</small><b>--</b><small>avg score</small><b>10</b><small>points</small></div><img class="kebab" src="${fillerAssets.more}" alt="More" /><img class="row-chevron" src="${fillerAssets.expandMore}" alt="" /><small class="estimated">Estimated time: 15 minutes</small></div>
    <div class="item-row nested assessment apply-item dated-assessment"><span class="checkbox">□</span><span class="nested-indent"></span><img class="row-icon" src="${fillerAssets.assessmentLink}" alt="" /><div class="item-title"><span class="link-text">Quiz: Chapter ${chapterNumber}</span><span class="due-date"><span class="inline-date-host" data-date-label="Due date" data-date-placeholder="Add Due Date" data-date-value="${chapterDueDate}" data-date-suffix="${chapterDateSuffix}"></span></span><small class="grade">● &nbsp;COUNTS TOWARDS GRADE</small></div><div class="unlock-meta"><img src="${fillerAssets.lock}" alt="" /><span>Unlocks Feb 5<br /><em>@ 12:00 AM EST</em></span></div><div class="metrics"><b>0%</b><small>submitted</small><b>--</b><small>avg score</small><b>10</b><small>points</small></div><img class="kebab" src="${fillerAssets.more}" alt="More" /><img class="row-chevron" src="${fillerAssets.expandMore}" alt="" /><small class="estimated">Estimated time: 15 minutes</small></div>
  `;
  };

  const folderRows = [...document.querySelectorAll('.folder-row')];
  document.querySelectorAll('.due-date .inline-date-host').forEach((host) => {
    host.innerHTML = '';
  });
  document.querySelectorAll('.unlock-meta span').forEach((span) => {
    span.classList.add('inline-date-host');
    span.dataset.dateLabel = 'Date Available';
    span.dataset.datePlaceholder = 'Add Date Available';
    span.dataset.dateValue = 'Feb 5, 2025 @ 12:00 AM EST';
    span.dataset.dateSuffix = '@ 12:00 AM EST';
    span.innerHTML = '';
  });
  const groupRows = [...document.querySelectorAll('.group-row')];
  const folderMenus = [];
  const expandAllButton = document.querySelector('.picker-controls button:first-of-type');
  const expandAllLabel = expandAllButton?.querySelector('.control-label');
  const showHiddenButton = [...document.querySelectorAll('.picker-controls button')]
    .find((button) => button.querySelector('.control-label')?.textContent.trim() === 'Show Hidden');
  const showHiddenLabel = showHiddenButton?.querySelector('.control-label');
  const filtersButton = [...document.querySelectorAll('.picker-controls button')]
    .find((button) => button.querySelector('.control-label')?.textContent.trim() === 'Filters');
  const viewToggle = document.querySelector('.picker-controls .view');
  const listView = viewToggle?.querySelector('b');
  const calendarView = viewToggle?.querySelector('span');
  let calendarPanel;
  const calendarWeeks = [
    { range: 'Jan 18–24', day: '22', weekday: 'Friday', chapter: 1, due: 'Jan 22, 2027 @ 11:59 PM MT' },
    { range: 'Jan 25–31', day: '29', weekday: 'Friday', chapter: 2, due: 'Jan 29, 2027 @ 11:59 PM EDT' },
    { range: 'Feb 1–7', day: '5', weekday: 'Friday', chapter: 3, due: 'Feb 5, 2027 @ 11:59 PM EDT' },
    { range: 'Feb 8–14', day: '12', weekday: 'Friday', chapter: 4, due: 'Feb 12, 2027 @ 11:59 PM MT' },
    { range: 'Feb 15–21', day: '19', weekday: 'Friday', chapter: 5, due: 'Feb 19, 2027 @ 11:59 PM MT' },
    { range: 'Feb 22–28', day: '26', weekday: 'Friday', chapter: 6, due: 'Feb 26, 2027 @ 11:59 PM MT' },
    { range: 'Mar 1–7', day: '5', weekday: 'Friday', chapter: 7, due: 'Mar 5, 2027 @ 11:59 PM MT' },
    { range: 'Mar 8–14', day: '12', weekday: 'Friday', chapter: 8, due: 'Mar 12, 2027 @ 11:59 PM MT' },
    { range: 'Mar 15–21', day: '19', weekday: 'Friday', chapter: 9, due: 'Mar 19, 2027 @ 11:59 PM MT' }
  ];
  const renderCalendarView = () => {
    const picker = document.querySelector('.picker');
    if (!picker) return;
    if (!calendarPanel) {
      calendarPanel = document.createElement('div');
      calendarPanel.className = 'picker-calendar-view';
      calendarPanel.innerHTML = '<div class="calendar-week-list"></div>';
      const list = calendarPanel.querySelector('.calendar-week-list');
      calendarWeeks.forEach((weekData, index) => {
        const row = document.createElement('div');
        row.className = 'calendar-week-row';
        const chapterNumber = weekData.chapter;
        const header = document.createElement('button');
        header.type = 'button';
        header.className = 'calendar-week-toggle';
        header.setAttribute('aria-expanded', String(index === 0));
        header.innerHTML = `<span class="calendar-week-label"><img class="calendar-week-icon" src="${index === 0 ? fillerAssets.expandGroup : fillerAssets.expandMore}" alt="" /><span><b>Week ${index + 1}</b><small>${weekData.range}</small></span></span><span class="calendar-week-meta">4 activities</span>`;
        row.append(header);
        const details = document.createElement('div');
        details.className = 'calendar-week-activities';
        details.hidden = index !== 0;
        if (index === 0) row.classList.add('is-open');
        details.innerHTML = `<div class="calendar-day-header"><div><b>${weekData.day}</b><span>${weekData.weekday}</span></div></div><div class="calendar-assessment-list"></div>`;
        const activityList = details.querySelector('.calendar-assessment-list');
        for (let quiz = 1; quiz <= 3; quiz += 1) {
          const activity = document.createElement('div');
          activity.className = 'calendar-assessment';
          activity.innerHTML = `<span class="checkbox" aria-hidden="true">□</span><span class="calendar-assessment-icon"><img class="row-icon" src="${fillerAssets.assessmentLink}" alt="" /></span><div class="calendar-assessment-main"><div class="calendar-assessment-top"><div class="calendar-assessment-content"><span class="calendar-assessment-title">Quiz: Chapter ${chapterNumber}</span><span class="calendar-assessment-due">Due <em>${weekData.due}</em></span><span class="calendar-assessment-grade"><i>●</i> COUNTS TOWARDS GRADE</span></div><div class="calendar-assessment-stats"><span><b>0%</b><small>submitted</small></span><span><b>--</b><small>avg score</small></span><span><b>10</b><small>points</small></span></div><img class="calendar-assessment-more" src="${fillerAssets.more}" alt="More" /></div><div class="calendar-assessment-description"><span>Estimated time: 15 minutes</span><img src="${fillerAssets.expandMore}" alt="" /></div></div>`;
          activityList.append(activity);
          bindActivityMenu(activity.querySelector('.calendar-assessment-more'), activity);
        }
        header.addEventListener('click', () => {
          details.hidden = !details.hidden;
          row.classList.toggle('is-open', !details.hidden);
          header.setAttribute('aria-expanded', String(!details.hidden));
          const icon = header.querySelector('.calendar-week-icon');
          if (icon) icon.src = details.hidden ? fillerAssets.expandMore : fillerAssets.expandGroup;
        });
        row.append(details);
        list.append(row);
      });
      picker.append(calendarPanel);
    }
    calendarPanel.hidden = false;
  };
  const hideCalendarView = () => { if (calendarPanel) calendarPanel.hidden = true; };
  let applySearch = () => {};
  const setView = (view) => {
    viewToggle?.setAttribute('data-view', view);
    listView?.classList.toggle('is-active', view === 'list');
    calendarView?.classList.toggle('is-active', view === 'calendar');
    listView?.setAttribute('aria-pressed', String(view === 'list'));
    calendarView?.setAttribute('aria-pressed', String(view === 'calendar'));
    document.querySelector('.picker')?.classList.toggle('calendar-mode', view === 'calendar');
    document.querySelectorAll('.picker > .folder-row, .picker > .group-row, .picker > .item-row').forEach((row) => {
      if (view === 'calendar') {
        row.classList.add('calendar-view-hidden');
        row.hidden = true;
      } else {
        row.classList.remove('calendar-view-hidden');
        if (row.classList.contains('folder-row')) {
          row.hidden = false;
        } else {
          let parentFolder = row.previousElementSibling;
          while (parentFolder && !parentFolder.classList.contains('folder-row')) parentFolder = parentFolder.previousElementSibling;
          row.hidden = parentFolder?.classList.contains('collapsed') || false;
        }
      }
    });
    if (view === 'calendar') renderCalendarView();
    else hideCalendarView();
    applySearch();
  };
  listView?.setAttribute('role', 'button');
  calendarView?.setAttribute('role', 'button');
  listView?.setAttribute('aria-label', 'List view');
  calendarView?.setAttribute('aria-label', 'Calendar view');
  listView?.addEventListener('click', () => setView('list'));
  calendarView?.addEventListener('click', () => setView('calendar'));
  viewToggle?.addEventListener('click', (event) => {
    if (event.target.closest('span')) setView('calendar');
    if (event.target.closest('b')) setView('list');
  });
  let showHiddenActive = false;

  const picker = document.querySelector('.picker');
  const searchInput = document.querySelector('.search-box input');
  const searchClear = document.querySelector('.search-clear');
  const normalizeSearchText = (value) => String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  const matchesSearch = (element, query) => !query || normalizeSearchText(element?.textContent).includes(query);
  const searchEmptyMessage = document.createElement('p');
  searchEmptyMessage.className = 'search-empty-state';
  searchEmptyMessage.textContent = 'No content matches your search.';
  searchEmptyMessage.hidden = true;

  applySearch = () => {
    const query = normalizeSearchText(searchInput?.value);
    if (searchClear) searchClear.hidden = !query;

    const isCalendarView = picker?.classList.contains('calendar-mode');
    const topLevelRows = [...(picker?.children || [])];
    let listMatches = 0;
    if (!isCalendarView) topLevelRows.forEach((row) => {
      if (row.classList.contains('folder-row')) {
        const folderContent = [];
        let sibling = row.nextElementSibling;
        while (sibling && !sibling.classList.contains('folder-row')) {
          folderContent.push(sibling);
          sibling = sibling.nextElementSibling;
        }
        if (!query) {
          row.hidden = false;
          folderContent.forEach((contentRow) => {
            contentRow.hidden = row.classList.contains('collapsed');
          });
          return;
        }
        const folderMatches = matchesSearch(row, query);
        const contentMatches = folderContent.some((contentRow) => matchesSearch(contentRow, query));
        const isMatch = folderMatches || contentMatches;
        row.hidden = !isMatch;
        folderContent.forEach((contentRow) => {
          contentRow.hidden = !isMatch;
        });
        if (isMatch) listMatches += 1;
        return;
      }
      if (row.classList.contains('course-link-row')) {
        row.hidden = Boolean(query && !matchesSearch(row, query));
        if (!row.hidden) listMatches += 1;
      }
    });
    else topLevelRows.forEach((row) => {
      if (row.classList.contains('course-link-row') || row.classList.contains('folder-row') || row.classList.contains('group-row') || row.classList.contains('item-row')) row.hidden = true;
    });

    let calendarMatches = 0;
    if (calendarPanel) {
      calendarPanel.querySelectorAll('.calendar-week-row').forEach((weekRow) => {
        const activities = [...weekRow.querySelectorAll('.calendar-assessment')];
        const weekMatches = matchesSearch(weekRow, query);
        activities.forEach((activity) => {
          activity.hidden = Boolean(query && !matchesSearch(activity, query));
        });
        const visibleActivities = activities.filter((activity) => !activity.hidden);
        const hasMatch = Boolean(query && (weekMatches || visibleActivities.length));
        weekRow.hidden = Boolean(query && !hasMatch);
        if (query && hasMatch) {
          calendarMatches += visibleActivities.length || activities.length;
          if (visibleActivities.length) {
            const details = weekRow.querySelector('.calendar-week-activities');
            const header = weekRow.querySelector('.calendar-week-toggle');
            if (details) details.hidden = false;
            weekRow.classList.add('is-open');
            header?.setAttribute('aria-expanded', 'true');
          }
        }
        if (!query) {
          activities.forEach((activity) => { activity.hidden = false; });
          const details = weekRow.querySelector('.calendar-week-activities');
          const header = weekRow.querySelector('.calendar-week-toggle');
          const isOpen = header?.getAttribute('aria-expanded') === 'true';
          if (details) details.hidden = !isOpen;
          weekRow.classList.toggle('is-open', isOpen);
        }
      });
    }

    const hasResults = query ? (isCalendarView ? calendarMatches > 0 : listMatches > 0) : true;
    if (isCalendarView && calendarPanel) {
      if (!searchEmptyMessage.parentElement || searchEmptyMessage.parentElement !== calendarPanel) calendarPanel.append(searchEmptyMessage);
    } else if (picker && searchEmptyMessage.parentElement !== picker) {
      picker.append(searchEmptyMessage);
    }
    searchEmptyMessage.hidden = hasResults;
  };
  searchInput?.addEventListener('input', applySearch);
  searchClear?.addEventListener('click', () => {
    if (!searchInput) return;
    searchInput.value = '';
    applySearch();
    searchInput.focus();
  });
  setView('list');
  const filterCheckAsset = 'https://www.figma.com/api/mcp/asset/5a2b064d-4fa5-48a7-b019-a2b9dfa10140.svg';
  const filterCheckedAsset = 'https://www.figma.com/api/mcp/asset/7c622f9d-c863-4d3d-89ef-67ccfd736732.svg';
  let filterPanel = null;

  const closeFilterPanel = () => {
    filterPanel?.remove();
    filterPanel = null;
    filtersButton?.setAttribute('aria-expanded', 'false');
  };

  const openFilterPanel = () => {
    closeFilterPanel();
    filterPanel = document.createElement('aside');
    filterPanel.className = 'filter-panel';
    filterPanel.id = 'picker-filter-panel';
    filterPanel.setAttribute('aria-label', 'Filter course content');
    filterPanel.innerHTML = `
      <div class="filter-panel-header">
        <h2>Filter by:</h2>
        <button type="button" class="filter-panel-close" aria-label="Close filters"><span aria-hidden="true">×</span></button>
      </div>
      <section class="filter-panel-section" aria-labelledby="filter-grade-impact">
        <h3 id="filter-grade-impact">Impact to Grade</h3>
        <div class="filter-panel-options">
          <button type="button" class="filter-panel-option" role="checkbox" aria-checked="false" data-filter-checkbox><img src="${filterCheckAsset}" alt="" /><span>Counts Towards Grade</span></button>
          <button type="button" class="filter-panel-option" role="checkbox" aria-checked="false" data-filter-checkbox><img src="${filterCheckAsset}" alt="" /><span>Practice</span></button>
        </div>
      </section>
      <section class="filter-panel-section" aria-labelledby="filter-grading-type">
        <h3 id="filter-grading-type">Grading Type</h3>
        <div class="filter-panel-options">
          <button type="button" class="filter-panel-option" role="checkbox" aria-checked="false" data-filter-checkbox><img src="${filterCheckAsset}" alt="" /><span>Auto Graded</span></button>
          <button type="button" class="filter-panel-option" role="checkbox" aria-checked="false" data-filter-checkbox><img src="${filterCheckAsset}" alt="" /><span>Manually Graded</span></button>
        </div>
      </section>
      <section class="filter-panel-section" aria-labelledby="filter-due-date">
        <h3 id="filter-due-date">Due Date</h3>
        <div class="filter-panel-options">
          <button type="button" class="filter-panel-option" role="checkbox" aria-checked="false" data-filter-checkbox><img src="${filterCheckAsset}" alt="" /><span>Scheduled</span></button>
          <button type="button" class="filter-panel-option" role="checkbox" aria-checked="false" data-filter-checkbox><img src="${filterCheckAsset}" alt="" /><span>Not Scheduled</span></button>
        </div>
      </section>
    `;
    picker?.append(filterPanel);
    filtersButton?.setAttribute('aria-expanded', 'true');
    filtersButton?.setAttribute('aria-controls', filterPanel.id);
    filterPanel.querySelector('.filter-panel-close')?.addEventListener('click', closeFilterPanel);
    filterPanel.querySelectorAll('[data-filter-checkbox]').forEach((option) => {
      option.addEventListener('click', () => {
        const selected = option.getAttribute('aria-checked') === 'true';
        option.setAttribute('aria-checked', String(!selected));
        option.classList.toggle('is-selected', !selected);
        const icon = option.querySelector('img');
        if (icon) icon.src = selected ? filterCheckAsset : filterCheckedAsset;
      });
      option.addEventListener('keydown', (event) => {
        if (event.key !== ' ') return;
        event.preventDefault();
        option.click();
      });
    });
  };

  filtersButton?.setAttribute('aria-expanded', 'false');
  filtersButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    if (filterPanel) closeFilterPanel();
    else openFilterPanel();
  });

  const bulkActionBar = document.querySelector('.bulk-action-bar');
  const bulkSelectionCount = bulkActionBar?.querySelector('.bulk-selection-count');
  const bulkSelectableRows = () => [...(picker?.querySelectorAll('.course-link-row, .folder-row, .group-row, .item-row, .calendar-assessment') || [])];
  const isVisibleBulkRow = (row) => !row.hidden && !row.closest('[hidden]');
  const bulkSelectedRows = () => bulkSelectableRows().filter((row) => isVisibleBulkRow(row) && row.querySelector(':scope > .checkbox')?.getAttribute('aria-checked') === 'true');
  const getBulkCheckbox = (row) => row?.querySelector(':scope > .checkbox');

  const updateBulkSelectAllState = () => {
    const selectAll = picker?.querySelector('.picker-controls > .checkbox');
    if (!selectAll) return;
    const visibleRows = bulkSelectableRows().filter(isVisibleBulkRow);
    const selectedRows = visibleRows.filter((row) => getBulkCheckbox(row)?.getAttribute('aria-checked') === 'true');
    const allSelected = visibleRows.length > 0 && selectedRows.length === visibleRows.length;
    selectAll.setAttribute('aria-checked', allSelected ? 'true' : selectedRows.length ? 'mixed' : 'false');
    selectAll.setAttribute('aria-label', allSelected ? 'Deselect all content' : 'Select all content');
  };

  const updateBulkActionBar = () => {
    const selectedRows = bulkSelectedRows();
    if (bulkSelectionCount) bulkSelectionCount.textContent = `${selectedRows.length} selected`;
    if (bulkActionBar) bulkActionBar.hidden = selectedRows.length === 0;
    updateBulkSelectAllState();
  };

  const initializeBulkCheckbox = (checkbox, isSelectAll = false) => {
    if (!checkbox || checkbox.dataset.bulkSelectionReady === 'true') return;
    checkbox.dataset.bulkSelectionReady = 'true';
    checkbox.setAttribute('role', 'checkbox');
    checkbox.setAttribute('tabindex', '0');
    checkbox.setAttribute('aria-checked', checkbox.getAttribute('aria-checked') === 'true' ? 'true' : 'false');
    if (isSelectAll) checkbox.removeAttribute('aria-hidden');
  };

  const setBulkSelection = (checkbox, selected) => {
    if (!checkbox) return;
    const row = checkbox.closest('.course-link-row, .folder-row, .group-row, .item-row, .calendar-assessment');
    checkbox.setAttribute('aria-checked', String(selected));
    row?.classList.toggle('selected', selected);
    updateBulkActionBar();
  };

  const toggleAllBulkSelection = () => {
    const visibleRows = bulkSelectableRows().filter(isVisibleBulkRow);
    const shouldSelect = !visibleRows.length || visibleRows.some((row) => getBulkCheckbox(row)?.getAttribute('aria-checked') !== 'true');
    visibleRows.forEach((row) => setBulkSelection(getBulkCheckbox(row), shouldSelect));
    updateBulkActionBar();
  };

  bulkActionBar?.querySelector('[data-bulk-action="clear-selection"]')?.addEventListener('click', () => {
    bulkSelectedRows().forEach((row) => setBulkSelection(getBulkCheckbox(row), false));
  });

  const moreButton = bulkActionBar?.querySelector('.bulk-more-trigger');
  let bulkMoreMenu = null;
  const closeBulkMoreMenu = () => { bulkMoreMenu?.remove(); bulkMoreMenu = null; };
  const openBulkMoreMenu = () => {
    closeBulkMoreMenu();
    bulkMoreMenu = document.createElement('div');
    bulkMoreMenu.className = 'bulk-more-menu';
    bulkMoreMenu.setAttribute('role', 'menu');
    bulkMoreMenu.innerHTML = '<button type="button" role="menuitem" data-more-action="edit-points">Edit Points</button><button type="button" role="menuitem" data-more-action="edit-practice">Edit Practice vs Graded</button><button type="button" role="menuitem" data-more-action="student-accommodation">Student Accommodation</button>';
    document.body.append(bulkMoreMenu);
    const buttonRect = moreButton.getBoundingClientRect();
    const menuRect = bulkMoreMenu.getBoundingClientRect();
    bulkMoreMenu.style.left = `${Math.max(8, buttonRect.right - menuRect.width)}px`;
    bulkMoreMenu.style.top = `${Math.max(8, buttonRect.top - menuRect.height - 8)}px`;
    bulkMoreMenu.querySelectorAll('[data-more-action]').forEach((item) => item.addEventListener('click', () => closeBulkMoreMenu()));
  };
  moreButton?.addEventListener('click', (event) => { event.stopPropagation(); bulkMoreMenu ? closeBulkMoreMenu() : openBulkMoreMenu(); });
  document.addEventListener('click', (event) => { if (bulkMoreMenu && !bulkMoreMenu.contains(event.target) && event.target !== moreButton) closeBulkMoreMenu(); });

  const markRowsLinked = (rows) => {
    rows.forEach((row) => {
      const icon = row.querySelector('.row-icon');
      if (!icon) return;
      icon.src = fillerAssets.link;
      icon.alt = 'Linked activity';
      row.dataset.linked = 'true';
    });
  };

  const openLinkConfirmationModal = (selectedRows) => {
    markRowsLinked(selectedRows);
    openModal({
      className: 'link-confirmation-modal-overlay',
      title: 'Import Completed',
      body: '<div class="link-confirmation-content"></div>',
      footer: '<button type="button" class="modal-button secondary" data-modal-close>Continue Editing</button><button type="button" class="modal-button primary" data-modal-close>Return to Course Setup</button>'
    });
  };

  bulkActionBar?.querySelector('[data-bulk-action="link"]')?.addEventListener('click', () => {
    const selectedRows = bulkSelectedRows();
    if (selectedRows.length) openLinkConfirmationModal(selectedRows);
  });

  picker?.querySelectorAll('.checkbox').forEach((checkbox) => {
    initializeBulkCheckbox(checkbox, checkbox.parentElement?.classList.contains('picker-controls'));
  });
  picker?.addEventListener('click', (event) => {
    const checkbox = event.target.closest('.checkbox');
    if (!checkbox || !picker.contains(checkbox)) return;
    event.preventDefault();
    event.stopPropagation();
    initializeBulkCheckbox(checkbox, checkbox.parentElement?.classList.contains('picker-controls'));
    if (checkbox.parentElement?.classList.contains('picker-controls')) {
      toggleAllBulkSelection();
      return;
    }
    setBulkSelection(checkbox, checkbox.getAttribute('aria-checked') !== 'true');
  });
  picker?.addEventListener('keydown', (event) => {
    if (!['Enter', ' '].includes(event.key)) return;
    const checkbox = event.target.closest('.checkbox');
    if (!checkbox || !picker.contains(checkbox)) return;
    event.preventDefault();
    checkbox.click();
  });
  updateBulkActionBar();

  const hiddenActivityRows = () => [...document.querySelectorAll('.item-row[data-hidden="true"], .calendar-assessment[data-hidden="true"]')];
  const updateHiddenRowsVisibility = () => {
    hiddenActivityRows().forEach((row) => {
      row.hidden = !showHiddenActive;
    });
  };

  const updateShowHiddenControl = () => {
    const hasHiddenActivities = hiddenActivityRows().length > 0;
    if (!hasHiddenActivities) showHiddenActive = false;
    const isActive = showHiddenActive && hasHiddenActivities;
    showHiddenLabel && (showHiddenLabel.textContent = isActive ? 'Hide Hidden' : 'Show Hidden');
    showHiddenButton?.classList.toggle('is-active', isActive);
    showHiddenButton?.setAttribute('aria-pressed', String(isActive));
    updateHiddenRowsVisibility();
  };

  const setActivityHidden = (row, isHidden) => {
    const rowIcon = row.querySelector('.row-icon');
    if (isHidden) {
      if (rowIcon && !row.dataset.visibleIcon) row.dataset.visibleIcon = rowIcon.getAttribute('src') || '';
      row.dataset.hidden = 'true';
      row.classList.add('is-hidden');
      if (rowIcon) {
        rowIcon.src = fillerAssets.visibilityOff;
        rowIcon.alt = 'Hidden activity';
      }
      showHiddenActive = true;
    } else {
      delete row.dataset.hidden;
      row.classList.remove('is-hidden');
      if (rowIcon && row.dataset.visibleIcon) {
        rowIcon.src = row.dataset.visibleIcon;
        rowIcon.alt = '';
      }
      delete row.dataset.visibleIcon;
    }
    updateShowHiddenControl();
  };

  showHiddenButton?.setAttribute('aria-pressed', 'false');
  showHiddenButton?.addEventListener('click', () => {
    if (hiddenActivityRows().length) showHiddenActive = !showHiddenActive;
    updateShowHiddenControl();
  });

  const updateExpandAllControl = () => {
    if (!expandAllButton || !expandAllLabel || !folderRows.length) return;
    const allExpanded = folderRows.every((folder) => folder.getAttribute('aria-expanded') === 'true');
    expandAllLabel.textContent = allExpanded ? 'Collapse All' : 'Expand All';
    expandAllButton.setAttribute('aria-expanded', String(allExpanded));
  };

  folderRows.forEach((folder) => {
    if (folder.dataset.folderToggleBound === 'true') return;
    folder.dataset.folderToggleBound = 'true';

    const chapterNumber = folder.querySelector('b')?.textContent.trim().replace(/^Chapter\s+/i, '') || '';

    if (folder.classList.contains('collapsed')) {
      const filler = document.createElement('div');
      filler.className = 'chapter-filler';
      filler.hidden = true;
      filler.innerHTML = fillerMarkup(chapterNumber);
      folder.after(filler);
    }

    const contentRows = [];
    let sibling = folder.nextElementSibling;
    while (sibling && !sibling.classList.contains('folder-row')) {
      contentRows.push(sibling);
      sibling = sibling.nextElementSibling;
    }

    const initialExpanded = !folder.classList.contains('collapsed');
    const expandIcon = folder.querySelector('.expand-icon');
    folder.setAttribute('role', 'button');
    folder.setAttribute('tabindex', '0');
    folder.setAttribute('aria-expanded', String(initialExpanded));

    const setExpanded = (isExpanded) => {
      folder.classList.toggle('collapsed', !isExpanded);
      folder.setAttribute('aria-expanded', String(isExpanded));
      contentRows.forEach((row) => {
        row.hidden = !isExpanded;
      });
      expandIcon?.classList.toggle('up', isExpanded);
      if (expandIcon) {
        expandIcon.src = isExpanded ? fillerAssets.expandGroup : fillerAssets.expandFolder;
      }
      updateExpandAllControl();
    };

    folder._setExpanded = setExpanded;
    setExpanded(initialExpanded);

    const folderMenuIcon = folder.querySelector('.folder-menu-icon');
    if (folderMenuIcon && folderMenuIcon.dataset.folderMenuBound !== 'true') {
      folderMenuIcon.dataset.folderMenuBound = 'true';
      folderMenuIcon.setAttribute('role', 'button');
      folderMenuIcon.setAttribute('tabindex', '0');
      folderMenuIcon.setAttribute('aria-label', 'More folder options');
      folderMenuIcon.setAttribute('aria-haspopup', 'menu');
      folderMenuIcon.setAttribute('aria-expanded', 'false');

      const folderMenu = document.createElement('div');
      folderMenu.className = 'activity-menu folder-menu';
      folderMenu.hidden = true;
      folderMenu.setAttribute('role', 'menu');
      folderMenu.innerHTML = folderMenuItems.map(({ label, icon, action }) => `
        <button type="button" class="activity-menu-item folder-menu-item" role="menuitem"${action ? ` data-action="${action}"` : ''}>
          <img src="${icon}" alt="" />
          <span>${label}</span>
        </button>
      `).join('');
      folder.append(folderMenu);

      const visibilityMenuItem = folderMenu.querySelector('[data-action="hide-folder"]');
      const updateFolderVisibilityMenuItem = () => {
        if (!visibilityMenuItem) return;
        visibilityMenuItem.querySelector('span').textContent = folder.dataset.hidden === 'true'
          ? 'Show folder to students'
          : 'Hide folder from students';
      };
      updateFolderVisibilityMenuItem();

      const toggleFolderMenu = () => {
        const isOpen = !folderMenu.hidden;
        folderMenus.forEach(({ icon, menu }) => {
          menu.hidden = true;
          icon.setAttribute('aria-expanded', 'false');
          icon.classList.remove('is-open');
        });
        folderMenu.hidden = isOpen;
        folderMenuIcon.setAttribute('aria-expanded', String(!isOpen));
        folderMenuIcon.classList.toggle('is-open', !isOpen);
      };

      folderMenuIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleFolderMenu();
      });
      folderMenuIcon.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        event.stopPropagation();
        toggleFolderMenu();
      });
      folderMenu.addEventListener('click', (event) => {
        event.stopPropagation();
        const action = event.target.closest('[role="menuitem"]')?.dataset.action;
        if (action === 'hide-folder') {
          folder.dataset.hidden = folder.dataset.hidden === 'true' ? 'false' : 'true';
          folder.classList.toggle('is-hidden', folder.dataset.hidden === 'true');
          updateFolderVisibilityMenuItem();
        }
      });
      folderMenus.push({ icon: folderMenuIcon, menu: folderMenu });
    }

    const toggleFolder = (event) => {
      if (event.target.closest('.checkbox, .folder-menu-icon')) return;
      setExpanded(folder.getAttribute('aria-expanded') !== 'true');
    };

    expandIcon?.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleFolder(event);
    });
    folder.addEventListener('click', toggleFolder);
    folder.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleFolder(event);
      }
    });
  });

  groupRows.forEach((group) => {
    if (group.dataset.groupToggleBound === 'true') return;
    group.dataset.groupToggleBound = 'true';
    const contentRows = [];
    let sibling = group.nextElementSibling;
    while (sibling && !sibling.classList.contains('group-row') && !sibling.classList.contains('folder-row')) {
      contentRows.push(sibling);
      sibling = sibling.nextElementSibling;
    }
    const expandIcon = group.querySelector('.expand-icon');
    const setExpanded = (isExpanded) => {
      group.classList.toggle('collapsed', !isExpanded);
      group.setAttribute('aria-expanded', String(isExpanded));
      contentRows.forEach((row) => { row.hidden = !isExpanded; });
      expandIcon?.classList.toggle('up', isExpanded);
      if (expandIcon) expandIcon.src = fillerAssets.expandGroup;
    };
    group.setAttribute('role', 'button');
    group.setAttribute('tabindex', '0');
    setExpanded(!group.classList.contains('collapsed'));
    expandIcon?.addEventListener('click', (event) => {
      event.stopPropagation();
      setExpanded(group.getAttribute('aria-expanded') !== 'true');
    });
    group.addEventListener('click', (event) => {
      if (event.target.closest('.checkbox, .group-menu-icon')) return;
      setExpanded(group.getAttribute('aria-expanded') !== 'true');
    });
    group.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      setExpanded(group.getAttribute('aria-expanded') !== 'true');
    });
  });

  expandAllButton?.addEventListener('click', () => {
    const shouldExpand = !folderRows.every((folder) => folder.getAttribute('aria-expanded') === 'true');
    folderRows.forEach((folder) => folder._setExpanded?.(shouldExpand));
    updateExpandAllControl();
  });

  const activityMenus = [];
  let activeModal = null;

  const getActivityTitle = (row) => {
    const title = row?.querySelector('.item-title, .calendar-assessment-title');
    if (!title) return 'Activity';
    const titleClone = title.cloneNode(true);
    titleClone.querySelectorAll('small').forEach((element) => element.remove());
    titleClone.querySelectorAll('.due-date').forEach((element) => element.remove());
    return titleClone.textContent.trim() || 'Activity';
  };

  const closeActiveModal = () => {
    if (!activeModal) return;
    activeModal.remove();
    activeModal = null;
    document.body.classList.remove('modal-open');
  };

  const openModal = ({ className, title, body, footer }) => {
    closeActiveModal();
    const overlay = document.createElement('div');
    overlay.className = `modal-overlay ${className || ''}`.trim();
    overlay.innerHTML = `
      <div class="activity-modal" role="dialog" aria-modal="true" aria-labelledby="activity-modal-title">
        <div class="activity-modal-heading">
          <h2 id="activity-modal-title"></h2>
          <button type="button" class="activity-modal-close" aria-label="Close modal">×</button>
        </div>
        <div class="activity-modal-body">${body}</div>
        ${footer ? `<div class="activity-modal-footer">${footer}</div>` : ''}
      </div>
    `;
    overlay.querySelector('#activity-modal-title').textContent = title;
    document.body.append(overlay);
    activeModal = overlay;
    document.body.classList.add('modal-open');

    const dialog = overlay.querySelector('.activity-modal');
    overlay.querySelector('.activity-modal-close').addEventListener('click', closeActiveModal);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) closeActiveModal();
    });
    overlay.querySelectorAll('[data-modal-close]').forEach((button) => {
      button.addEventListener('click', closeActiveModal);
    });
    dialog.querySelector('input, textarea, button')?.focus();
    return overlay;
  };

  const parseBulkDateParts = (value) => {
    const match = value?.trim().match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})(?:\s*@\s*(\d{1,2}:\d{2}\s*[AP]M))?/i);
    if (!match) return { date: '', time: '' };
    const month = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
    }[match[1].slice(0, 3).toLowerCase()];
    if (!month) return { date: '', time: '' };
    return {
      date: `${month}/${String(match[2]).padStart(2, '0')}/${match[3]}`,
      time: match[4]?.replace(/\s+/g, ' ').toUpperCase() || ''
    };
  };

  const getSharedBulkDateValue = (rows, selector) => {
    const values = rows.map((row) => row.querySelector(selector)?.dataset.dateValue?.trim() || '');
    if (!values.length || values.some((value) => !value) || !values.every((value) => value === values[0])) return '';
    return values[0];
  };

  const openBulkDatesModal = (selectedRows) => {
    const selectedCount = selectedRows.length;
    const activityLabel = selectedCount === 1 ? 'Activity' : 'Activities';
    const modal = openModal({
      className: 'bulk-dates-modal-overlay',
      title: `Edit Dates for ${selectedCount} ${activityLabel}`,
      body: `
        <div class="bulk-dates-form">
          <div class="bulk-dates-form-title">Edit Dates for ${selectedCount} ${activityLabel}</div>
          <fieldset class="bulk-dates-radio-group">
            <legend class="sr-only" aria-hidden="true"></legend>
            <label class="bulk-dates-radio"><input type="radio" name="bulk-date-mode" value="select" checked /><span>Selected Dates</span></label>
            <label class="bulk-dates-radio"><input type="radio" name="bulk-date-mode" value="shift" /><span>Shift Dates</span></label>
            <label class="bulk-dates-radio"><input type="radio" name="bulk-date-mode" value="remove" /><span>Remove Dates</span></label>
          </fieldset>
          <p class="bulk-dates-note">Extending the due date automatically removes late penalty deductions from existing submissions. This might take a few minutes to reflect in the gradebook.</p>
          <div class="bulk-dates-grid">
            <div class="bulk-dates-row">
              <label class="bulk-date-field"><span>Date Available</span><div class="bulk-date-control"><input type="text" inputmode="numeric" placeholder="mm/dd/yyyy" aria-label="Date Available" /><img class="bulk-date-icon calendar-icon" src="${fallbackIcons.calendarBlue}" alt="" /></div></label>
              <span class="bulk-dates-at" aria-hidden="true">at</span>
              <label class="bulk-date-field"><span>Time Available (MT)</span><div class="bulk-time-control"><img class="bulk-time-icon" src="${fallbackIcons.clock}" alt="" /><input type="text" inputmode="text" placeholder="--:-- AM" aria-label="Time Available (MT)" /></div></label>
            </div>
            <div class="bulk-dates-row">
              <label class="bulk-date-field"><span>Date Due</span><div class="bulk-date-control"><input type="text" inputmode="numeric" placeholder="mm/dd/yyyy" aria-label="Date Due" /><img class="bulk-date-icon calendar-icon" src="${fallbackIcons.calendarBlue}" alt="" /></div></label>
              <span class="bulk-dates-at" aria-hidden="true">at</span>
              <label class="bulk-date-field"><span>Time Due (MT)</span><div class="bulk-time-control"><img class="bulk-time-icon" src="${fallbackIcons.clock}" alt="" /><input type="text" inputmode="text" placeholder="--:-- AM" aria-label="Time Due (MT)" /></div></label>
            </div>
          </div>
        </div>
      `,
      footer: '<button type="button" class="modal-button secondary" data-modal-close>Cancel</button><button type="button" class="modal-button primary" data-modal-close>Save</button>'
    });

    const availableDate = parseBulkDateParts(getSharedBulkDateValue(selectedRows, '.unlock-meta .inline-date-host'));
    const dueDate = parseBulkDateParts(getSharedBulkDateValue(selectedRows, '.due-date .inline-date-host'));
    modal.querySelector('[aria-label="Date Available"]').value = availableDate.date;
    modal.querySelector('[aria-label="Time Available (MT)"]').value = availableDate.time;
    modal.querySelector('[aria-label="Date Due"]').value = dueDate.date;
    modal.querySelector('[aria-label="Time Due (MT)"]').value = dueDate.time;

    const inputs = [...modal.querySelectorAll('.bulk-date-control input')];
    modal.querySelectorAll('input[name="bulk-date-mode"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        const isRemove = radio.value === 'remove' && radio.checked;
        inputs.forEach((input) => { input.disabled = isRemove; });
        modal.classList.toggle('bulk-dates-remove-mode', isRemove);
      });
    });
    return modal;
  };

  bulkActionBar?.querySelector('[data-bulk-action="set-dates"]')?.addEventListener('click', () => {
    const selectedRows = bulkSelectedRows();
    if (selectedRows.length) openBulkDatesModal(selectedRows);
  });

  const openEditPointsModal = (selectedCount) => {
    const activityLabel = selectedCount === 1 ? 'Activity' : 'Activities';
    openModal({
      className: 'edit-points-modal-overlay',
      title: `Edit Points Possible for ${selectedCount} ${activityLabel}`,
      body: `
        <div class="edit-points-form">
          <label class="edit-points-field">
            <span>Total Points Possible (Required)</span>
            <input type="number" min="0" inputmode="decimal" placeholder="Number" aria-label="Total Points Possible (Required)" required />
          </label>
          <p class="edit-points-helper">If points are modified here, individual question points will scale according to their current point ratios.</p>
        </div>
      `,
      footer: '<button type="button" class="modal-button secondary" data-modal-close>Cancel</button><button type="button" class="modal-button primary" data-modal-close>Save</button>'
    });
  };

  bulkActionBar?.querySelector('[data-bulk-action="edit-points"]')?.addEventListener('click', () => {
    const selectedCount = bulkSelectedRows().length;
    if (selectedCount) openEditPointsModal(selectedCount);
  });

  const openActivityPreviewModal = (row) => {
    const title = getActivityTitle(row);
    const previewAssets = {
      instructor: 'https://www.figma.com/api/mcp/asset/4079f8d9-5545-40f0-99ff-168b9b96568a.svg',
      print: 'https://www.figma.com/api/mcp/asset/23e6212e-dfdc-4bda-8008-9346d83c4859.svg',
      edit: 'https://www.figma.com/api/mcp/asset/d55386be-229f-4fbb-896d-1c30ea16faef.svg',
      details: 'https://www.figma.com/api/mcp/asset/84e00047-5282-40bf-8630-3ba530eae8a7.svg',
      radioUnchecked: 'https://www.figma.com/api/mcp/asset/0d0e7b8f-9faa-455a-bfc5-e17cddd224c6.svg',
      radioChecked: 'https://www.figma.com/api/mcp/asset/58bb44c7-4f40-4721-bb6b-e86d68f15b4d.svg',
      complete: 'https://www.figma.com/api/mcp/asset/d3887d94-59b3-4780-b1f5-0af92b471870.svg',
      settings: 'https://www.figma.com/api/mcp/asset/e2f513b0-1e12-4d01-a951-09000e2f166a.svg',
      flag: 'https://www.figma.com/api/mcp/asset/a88e626c-b998-4967-8993-b25d2bb49f1f.svg',
      pause: 'https://www.figma.com/api/mcp/asset/5c2fbb75-6a2c-4c5f-8fcc-c1b13969bcdc.svg',
      previous: 'https://www.figma.com/api/mcp/asset/940541f1-0048-417a-aacc-d76fe36d70a2.svg',
      next: 'https://www.figma.com/api/mcp/asset/94564bd3-6bb8-4dd4-a4ea-23e6c23b0c1f.svg'
    };
    const modal = openModal({
      className: 'content-preview-modal-overlay preview-modal-overlay',
      title: 'Content Preview',
      body: `
        <div class="preview-main-container">
          <div class="preview-content-shell">
            <div class="preview-content-header"><h3 data-preview-title></h3></div>
            <div class="preview-toolbar">
              <div class="preview-toolbar-left">
                <div class="preview-view-toggle" role="group" aria-label="Preview audience">
                  <button type="button" class="preview-toggle active"><img src="${previewAssets.instructor}" alt="" />View as Instructor</button>
                  <button type="button" class="preview-toggle">View as Student</button>
                </div>
                <div class="preview-icon-actions" aria-label="Preview actions">
                  <button type="button" aria-label="Print preview"><img src="${previewAssets.print}" alt="" /></button>
                  <button type="button" aria-label="Edit preview"><img src="${previewAssets.edit}" alt="" /></button>
                </div>
              </div>
              <button type="button" class="preview-details">Activity Details <img src="${previewAssets.details}" alt="" /></button>
            </div>
            <div class="preview-content-layout">
              <div class="preview-question-area">
                <div class="preview-progress"><span>1 of 10</span><div class="preview-progress-track"><span></span></div></div>
                <div class="preview-question-content">
                  <p class="preview-question-prompt">Which statement best describes this activity?</p>
                  <div class="preview-answer-list" role="radiogroup" aria-label="Answer choices">
                    <label><input type="radio" name="preview-answer" value="true" /><img src="${previewAssets.radioUnchecked}" alt="" /><span>True</span></label>
                    <label><input type="radio" name="preview-answer" value="false" checked /><img src="${previewAssets.radioChecked}" alt="" /><span>False</span></label>
                  </div>
                </div>
              </div>
              <aside class="preview-side-rail" aria-label="Preview tools">
                <div class="preview-side-rail-group">
                  <button type="button" aria-label="Mark complete"><img src="${previewAssets.complete}" alt="" /></button>
                  <button type="button" aria-label="Open settings"><img src="${previewAssets.settings}" alt="" /></button>
                  <button type="button" aria-label="Flag question"><img src="${previewAssets.flag}" alt="" /></button>
                </div>
                <button type="button" aria-label="Pause preview"><img src="${previewAssets.pause}" alt="" /></button>
              </aside>
            </div>
            <nav class="preview-pagination" aria-label="Preview questions">
              <button type="button" class="preview-page-arrow" data-preview-page="previous" aria-label="Previous question"><img src="${previewAssets.previous}" alt="" /></button>
              ${Array.from({ length: 10 }, (_, index) => `<button type="button" class="preview-page${index === 0 ? ' active' : ''}" data-preview-page="${index + 1}" aria-label="Question ${index + 1}">${index + 1}</button>`).join('')}
              <button type="button" class="preview-next" data-preview-page="next">Next <span><img src="${previewAssets.next}" alt="" /></span></button>
            </nav>
          </div>
        </div>
      `,
      footer: '<button type="button" class="modal-button secondary" data-modal-close>Close</button>'
    });
    const titleNode = modal.querySelector('[data-preview-title]');
    if (titleNode) titleNode.textContent = title;
    const pageButtons = [...modal.querySelectorAll('.preview-page')];
    const previousButton = modal.querySelector('[data-preview-page="previous"]');
    const nextButton = modal.querySelector('[data-preview-page="next"]');
    const progress = modal.querySelector('.preview-progress>span');
    const progressTrack = modal.querySelector('.preview-progress-track span');
    let currentPage = 1;
    const updatePage = (page) => {
      currentPage = Math.max(1, Math.min(10, page));
      if (progress) progress.textContent = `${currentPage} of 10`;
      if (progressTrack) progressTrack.style.width = `${currentPage * 10}%`;
      pageButtons.forEach((button) => button.classList.toggle('active', Number(button.dataset.previewPage) === currentPage));
      if (previousButton) previousButton.disabled = currentPage === 1;
      if (nextButton) nextButton.disabled = currentPage === 10;
    };
    previousButton?.addEventListener('click', () => updatePage(currentPage - 1));
    nextButton?.addEventListener('click', () => updatePage(currentPage + 1));
    pageButtons.forEach((button) => button.addEventListener('click', () => updatePage(Number(button.dataset.previewPage))));
    modal.querySelectorAll('.preview-toggle').forEach((button) => button.addEventListener('click', () => {
      modal.querySelectorAll('.preview-toggle').forEach((toggle) => toggle.classList.toggle('active', toggle === button));
    }));
    const answerInputs = [...modal.querySelectorAll('.preview-answer-list input')];
    const syncAnswerIcons = () => answerInputs.forEach((input) => {
      const icon = input.closest('label')?.querySelector('img');
      if (icon) icon.src = input.checked ? previewAssets.radioChecked : previewAssets.radioUnchecked;
    });
    answerInputs.forEach((input) => input.addEventListener('change', syncAnswerIcons));
    syncAnswerIcons();
    updatePage(currentPage);
  };

  const openPreviewModal = (row) => {
    const chapterLabel = (() => {
      let previous = row?.previousElementSibling;
      while (previous && !previous.classList.contains('folder-row')) previous = previous.previousElementSibling;
      return previous?.querySelector('b')?.textContent.trim() || 'Chapter 1';
    })();
    const chapterNumber = chapterLabel.match(/\d+/)?.[0] || '1';
    const chapterTitle = chapterNumber === '1'
      ? 'Chapter 1. The Role of Social Media Marketing'
      : `${chapterLabel}. Course reading`;
    const ebookAssets = {
      contents: 'https://www.figma.com/api/mcp/asset/ee822bb6-f290-4673-8954-7e106c8362c0.svg',
      search: 'https://www.figma.com/api/mcp/asset/496c66ed-39b6-4ef7-977c-a4616abf5cd2.svg',
      notebook: 'https://www.figma.com/api/mcp/asset/825e7fbe-9e15-4892-8d5f-6f8c3bd26748.svg',
      readAloud: 'https://www.figma.com/api/mcp/asset/d812f0df-9a34-4e42-a4b7-b79f08e9401a.svg',
      accessibility: 'https://www.figma.com/api/mcp/asset/0a8ca5e0-9711-4902-bc71-0eb394f02ceb.svg',
      more: 'https://www.figma.com/api/mcp/asset/5c38f29f-a3cc-4397-8f15-53c07ec994d8.svg',
      bookmark: 'https://www.figma.com/api/mcp/asset/bec10670-bc2d-45f3-aebd-5b842602bc69.svg',
      media: 'https://www.figma.com/api/mcp/asset/943e4173-b2df-46b4-bdd3-c1512e12c776.svg',
      positive: 'https://www.figma.com/api/mcp/asset/42beba71-0181-4f9f-a470-58e685deaa7f.svg',
      negative: 'https://www.figma.com/api/mcp/asset/43ca6e93-1abd-4dda-a2f2-29a4b7823bb8.svg',
      copy: 'https://www.figma.com/api/mcp/asset/ac88edd4-c2a2-45d2-b0dc-d9ad1d8d92cf.svg'
    };

    openModal({
      className: 'ebook-preview-modal-overlay',
      title: 'Ebook preview',
      body: `
        <div class="ebook-preview-frame">
          <aside class="ebook-reader-tools" aria-label="Reader tools">
            <div class="ebook-reader-tool-group">
              <button type="button" aria-label="Table of contents"><img src="${ebookAssets.contents}" alt="" /></button>
              <button type="button" aria-label="Search"><img src="${ebookAssets.search}" alt="" /></button>
              <button type="button" aria-label="Notebook"><img src="${ebookAssets.notebook}" alt="" /></button>
              <span class="ebook-tool-divider" aria-hidden="true"></span>
              <button type="button" aria-label="Read aloud"><img src="${ebookAssets.readAloud}" alt="" /></button>
              <button type="button" aria-label="Accessibility settings"><img src="${ebookAssets.accessibility}" alt="" /></button>
            </div>
            <button type="button" aria-label="More reader options"><img src="${ebookAssets.more}" alt="" /></button>
          </aside>
          <main class="ebook-reader-main">
            <header class="ebook-reader-header">
              <h3>eTextbook: Essentials of Statistics for Business &amp; Economics</h3>
              <button type="button" aria-label="Bookmark current page"><img src="${ebookAssets.bookmark}" alt="" /></button>
            </header>
            <div class="ebook-reader-scroll">
              <section class="ebook-page-header">
                <h4>${chapterTitle}</h4>
                <p>Social media marketing (SMM) has emerged as a vital business force offering vibrant career options. It offers important benefits to marketers, but some aspects are still not widely understood. SMM has experienced dramatic growth in recent years and is poised for substantial growth and change in years to come.</p>
              </section>
              <section class="ebook-section">
                <h5>What is SMM?</h5>
                <div class="ebook-action-row" aria-label="Section actions">
                  <button type="button">✦ Summarize</button>
                  <button type="button">✦ Quiz me</button>
                  <button type="button">✦ Make Flashcards</button>
                  <button type="button">More <span aria-hidden="true">⌄</span></button>
                </div>
                <p>There are many definitions of SMM. This one from the technology marketing site Mashable is straightforward and covers most of the important issues. Let’s watch this reel to learn more:</p>
                <article class="ebook-media-card">
                  <div class="ebook-media-card-header">
                    <div class="ebook-media-icon"><img src="${ebookAssets.media}" alt="" /></div>
                    <div><h6>The most important system you never see</h6><p>Chapter ${chapterNumber} · Reel · 5 min watch · 38% watched</p></div>
                  </div>
                  <p>A test of independence asks whether two categorical variables are related in a population.</p>
                  <div class="ebook-media-card-footer">
                    <div class="ebook-reactions" aria-label="Reactions">
                      <button type="button" aria-label="Helpful"><img src="${ebookAssets.positive}" alt="" /></button>
                      <button type="button" aria-label="Not helpful"><img src="${ebookAssets.negative}" alt="" /></button>
                      <button type="button" aria-label="Copy"><img src="${ebookAssets.copy}" alt="" /></button>
                    </div>
                    <div class="ebook-card-actions"><button type="button">Go to section</button><button type="button" class="ebook-ask-button">✦ Ask</button></div>
                  </div>
                </article>
              </section>
              <section class="ebook-section">
                <h5>Why social media marketing matters</h5>
                <div class="ebook-action-row" aria-label="Section actions">
                  <button type="button">✦ Summarize</button>
                  <button type="button">✦ Quiz me</button>
                  <button type="button">✦ Make Flashcards</button>
                  <button type="button">More <span aria-hidden="true">⌄</span></button>
                </div>
                <p>Social media gives organizations a direct way to learn what their audiences value. Comments, shares, searches, and viewing patterns reveal which ideas are useful, which questions remain unanswered, and where a message may need to be clearer.</p>
                <p>Unlike one-way advertising, social platforms support an ongoing exchange. A useful post can start a conversation, a thoughtful reply can strengthen trust, and feedback from customers can shape the next product, service, or campaign.</p>
              </section>
            </div>
            <footer class="ebook-reader-footer">
              <button type="button"><span aria-hidden="true">←</span> Exercises</button>
              <label>Page <input type="text" value="573" aria-label="Enter page number" /></label>
              <button type="button">Exercises <span aria-hidden="true">→</span></button>
            </footer>
          </main>
          <button type="button" class="ebook-preview-close" data-modal-close aria-label="Close ebook preview">×</button>
        </div>
      `,
      footer: ''
    });
  };

  const openSettingsModal = (row) => {
    const title = getActivityTitle(row);
    const availableDate = row?.querySelector('.unlock-meta span')?.textContent
      .replace(/^\s*Unlocks\s*/i, '')
      .replace(/\s*@\s*/g, ' @ ')
      .replace(/\s+/g, ' ')
      .trim();
    const dueDate = row?.querySelector('.due-date .inline-date-host')?.dataset.dateValue
      || row?.querySelector('.due-date em, .calendar-assessment-due em')?.textContent
      ?.replace(/\s+/g, ' ')
      ?.trim();
    const availableDateLabel = availableDate || 'Add Date Available';
    const dueDateLabel = dueDate || 'Add Date Due';
    const accommodationStudents = [
      'Alderman, Haiden',
      'Armstrong, Jacob',
      'Burn, Aaron',
      'Cabrera, Lochlan',
      'Cassidy, Shanai',
      'Cervantes, Kain',
      'Christopherson, Christopher',
      'Clark, Julian',
      'Combs, Safia',
      'Compton, Andrea',
      'Cornish, Mikael',
      'Coulson, Ishaq',
      'Curry, Cain',
      'Damon, Aneesa',
      'Espinoza, Gregg',
      'Finley, Abubakar',
      'Finley, Zoha',
      'Gary, Robin',
      'Graves, Elijah',
      'Griffith, Scott',
      'Hoover, Abby'
    ];
    const accommodationRows = accommodationStudents.map((student) => `
      <div class="accommodations-table-row" role="row">
        <div class="accommodations-table-cell accommodations-check-cell" role="cell"><button type="button" class="accommodation-check" aria-label="Select ${student}" aria-pressed="false"></button></div>
        <div class="accommodations-table-cell accommodations-name-cell" role="cell">${student}</div>
        <div class="accommodations-table-cell" role="cell"></div>
        <div class="accommodations-table-cell" role="cell"></div>
        <div class="accommodations-table-cell" role="cell"></div>
        <div class="accommodations-table-cell" role="cell"></div>
      </div>
    `).join('');
    const modal = openModal({
      className: 'settings-modal-overlay',
      title: `Activity Settings: ${title}`,
      body: `
        <div class="settings-tabs" role="tablist" aria-label="Activity settings sections">
          <button type="button" class="settings-tab active" data-settings-tab="assignment" role="tab" aria-selected="true"><img src="https://www.figma.com/api/mcp/asset/fb169dc4-96a8-449c-8267-419e6b8a81c8.svg" alt="" />ASSIGNMENT DETAILS</button>
          <button type="button" class="settings-tab" data-settings-tab="settings" role="tab" aria-selected="false"><img src="https://www.figma.com/api/mcp/asset/7358bdc3-b056-49b5-9456-c3a06d01d434.svg" alt="" />SETTINGS</button>
          <button type="button" class="settings-tab" data-settings-tab="accommodations" role="tab" aria-selected="false"><img src="https://www.figma.com/api/mcp/asset/e76b1aaa-5eb9-4007-b730-13e4423b1786.svg" alt="" />STUDENT ACCOMMODATIONS</button>
        </div>
        <div class="settings-pane" data-settings-pane="assignment">
          <div class="settings-form">
          <label class="settings-field full-width"><span>Title *</span><input name="activity-title" type="text" /></label>
          <label class="settings-field full-width"><span>Description</span><textarea name="activity-description">Text</textarea></label>
          <div class="settings-grid two-column">
            <label class="settings-field"><span>Date Available</span><div class="date-input-host" data-date-label="Date Available" data-date-placeholder="${availableDateLabel}" data-date-value="${availableDate || ''}"></div></label>
            <label class="settings-field"><span>Date Due</span><div class="date-input-host" data-date-label="Date Due" data-date-placeholder="${dueDateLabel}" data-date-value="${dueDate || ''}"></div></label>
          </div>
          <div class="settings-grid three-column">
            <label class="settings-field"><span>Total Points Possible *</span><input type="number" value="25" /></label>
            <label class="settings-field"><span>Password</span><input type="password" placeholder="Enter password" /></label>
            <fieldset class="settings-field radio-field"><legend>Academic Integrity</legend><label><input type="radio" name="integrity" checked /> Enabled</label><label><input type="radio" name="integrity" /> Disabled</label></fieldset>
          </div>
          <p class="settings-helper">If points are modified here, individual question points will scale according to their current point ratios.</p>
          </div>
        </div>
        <div class="settings-pane settings-pane-settings" data-settings-pane="settings" hidden>
          <div class="settings-form settings-form-reference">
            <label class="settings-field settings-template-field"><span>Activity Settings Template *</span><button type="button" class="settings-select"><span>Quiz</span><span aria-hidden="true">⌄</span></button></label>
            <div class="settings-core-grid">
              <div class="settings-settings-column">
                <label class="settings-field"><span>Activity Attempts</span><button type="button" class="settings-select"><span>Unlimited</span><span aria-hidden="true">⌄</span></button></label>
                <label class="settings-field"><span>Grading Policy</span><button type="button" class="settings-select"><span>Best activity attempt</span><span aria-hidden="true">⌄</span></button><span class="settings-help" aria-hidden="true">?</span></label>
                <label class="settings-toggle-row"><button type="button" class="settings-toggle is-on" aria-pressed="true"><span></span></button><span>Shuffle Question Order</span></label>
                <label class="settings-toggle-row"><button type="button" class="settings-toggle" aria-pressed="false"><span></span></button><span class="settings-label-with-help"><span>Enable Student Assist</span><span class="settings-help" aria-hidden="true">?</span></span></label>
              </div>
              <fieldset class="settings-field settings-credit-field"><legend>Credit Type</legend><span class="settings-help" aria-hidden="true">?</span><label><input type="radio" name="credit-type" checked /> <span>Counts Toward Grade</span></label><label><input type="radio" name="credit-type" /> <span>Practice (Doesn’t Count Toward Grade)</span></label><label class="credit-no-credit"><span class="credit-option"><input type="radio" name="credit-type" /> <span>Counts Toward Grade as Credit/No Credit:</span></span><span class="credit-details"><input type="number" min="0" max="100" aria-label="Percent earned score" disabled /><span>% earned score moves from 0 to full credit</span></span></label></fieldset>
            </div>
            <div class="settings-advanced"><button type="button" aria-expanded="false"><span>Advanced Settings</span><span aria-hidden="true">⌄</span></button></div>
          </div>
        </div>
        <div class="settings-pane settings-pane-accommodations" data-settings-pane="accommodations" hidden>
          <div class="accommodations-layout">
            <section class="accommodations-student-list" aria-label="List of students">
              <div class="accommodations-table" role="table" aria-label="Student accommodations">
                <div class="accommodations-table-head" role="row">
                  <div class="accommodations-table-cell accommodations-check-cell" role="columnheader"><button type="button" class="accommodation-check" aria-label="Select all students" aria-pressed="false"></button></div>
                  <div class="accommodations-table-cell" role="columnheader">Name</div>
                  <div class="accommodations-table-cell" role="columnheader">Release Early</div>
                  <div class="accommodations-table-cell" role="columnheader">Extend Due</div>
                  <div class="accommodations-table-cell" role="columnheader">Attempts</div>
                  <div class="accommodations-table-cell" role="columnheader">Extend Time</div>
                </div>
                <div class="accommodations-table-rows">${accommodationRows}</div>
                <div class="accommodations-table-foot">
                  <span class="accommodations-page-summary"># - # of # students</span>
                  <div class="accommodations-pagination" aria-label="Student pages">
                    <button type="button" aria-label="Previous page" disabled>‹</button>
                    <label><select aria-label="Page"><option>1</option></select><span>of 10 pages</span></label>
                    <button type="button" aria-label="Next page">›</button>
                  </div>
                </div>
              </div>
            </section>
            <aside class="accommodations-details" aria-label="Accommodation details">
              <section class="accommodation-detail-section">
                <div class="accommodation-detail-heading"><strong>Date Available</strong><span>Assignment Available: <b>12/2/2024 at 12:00 AM EST</b></span></div>
                <div class="accommodation-number-grid">
                  <label><span>Days to release early</span><input type="number" placeholder="Number" /><small>Calendar days</small></label>
                  <label><span>Hours to release early</span><input type="number" placeholder="Number" /></label>
                </div>
                <label class="accommodation-remove"><input type="checkbox" /> <span>Remove Accommodation</span></label>
              </section>
              <section class="accommodation-detail-section">
                <div class="accommodation-detail-heading"><strong>Date Due</strong><span>Assignment Due: <b>12/5/2024 at 3:30 PM EST</b></span></div>
                <div class="accommodation-number-grid">
                  <label><span>Days to extend due</span><input type="number" placeholder="Number" /><small>Calendar days</small></label>
                  <label><span>Hours to extend due</span><input type="number" placeholder="Number" /></label>
                </div>
                <label class="accommodation-remove"><input type="checkbox" /> <span>Remove Accommodation</span></label>
              </section>
              <section class="accommodation-detail-section">
                <div class="accommodation-detail-heading"><strong>Attempts</strong><span>Assignment Attempts: <b>1</b></span></div>
                <label class="accommodation-select-field"><span>Number of attempts accommodation</span><select><option>Select option</option><option>2</option><option>3</option></select></label>
                <label class="accommodation-remove"><input type="checkbox" /> <span>Remove Accommodation</span></label>
              </section>
              <section class="accommodation-detail-section accommodation-time-limit">
                <div class="accommodation-detail-heading"><strong>Time Limit</strong><span>Assignment Time Limit: <b>1 hour</b></span></div>
                <label class="accommodation-select-field"><span>Time limit accommodation</span><select><option>Select option</option><option>1.5x</option><option>2x</option></select></label>
                <label class="accommodation-remove"><input type="checkbox" /> <span>Remove Accommodation</span></label>
              </section>
              <button type="button" class="accommodations-add-button"><span aria-hidden="true">＋</span>Set and add more accommodations</button>
            </aside>
          </div>
        </div>
      `,
      footer: '<button type="button" class="modal-button secondary" data-modal-close>Cancel</button><button type="button" class="modal-button primary" data-modal-close>Save</button>'
    });
    modal.querySelector('[name="activity-title"]').value = title;
    modal.querySelectorAll('.settings-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.settingsTab || 'assignment';
        modal.querySelectorAll('.settings-tab').forEach((item) => {
          item.classList.toggle('active', item === tab);
          item.setAttribute('aria-selected', String(item === tab));
        });
        modal.querySelectorAll('[data-settings-pane]').forEach((pane) => {
          pane.hidden = pane.dataset.settingsPane !== target;
        });
      });
    });
    modal.querySelectorAll('.settings-toggle').forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const selected = toggle.getAttribute('aria-pressed') === 'true';
        toggle.setAttribute('aria-pressed', String(!selected));
        toggle.classList.toggle('is-on', !selected);
      });
    });
    modal.querySelectorAll('.accommodation-check').forEach((check) => {
      check.addEventListener('click', () => {
        const selected = check.getAttribute('aria-pressed') === 'true';
        check.setAttribute('aria-pressed', String(!selected));
        check.classList.toggle('is-selected', !selected);
      });
    });
  };

  const openEditModal = (row) => {
    const title = getActivityTitle(row);
    openModal({
      className: 'edit-modal-overlay',
      title: 'Open in MindTap?',
      body: `<div class="confirmation-content"><p>To edit <strong>${title}</strong> and its content, open this activity in MindTap.</p><p>Any changes you make there will be reflected in your course content.</p></div>`,
      footer: '<button type="button" class="modal-button secondary" data-modal-close>Cancel</button><button type="button" class="modal-button primary" data-modal-close>Open MindTap</button>'
    });
  };

  const closeAllActivityMenus = () => {
    activityMenus.forEach(({ kebab, menu }) => {
      menu.hidden = true;
      kebab.setAttribute('aria-expanded', 'false');
      kebab.classList.remove('is-open');
    });
  };

  const bindActivityMenu = (kebab, row) => {
    if (!kebab || !row || kebab.dataset.activityMenuBound === 'true') return;
    kebab.dataset.activityMenuBound = 'true';
    kebab.setAttribute('role', 'button');
    kebab.setAttribute('tabindex', '0');
    kebab.setAttribute('aria-label', 'More activity options');
    kebab.setAttribute('aria-haspopup', 'menu');
    kebab.setAttribute('aria-expanded', 'false');

    const menu = document.createElement('div');
    menu.className = 'activity-menu';
    menu.hidden = true;
    menu.setAttribute('role', 'menu');
    menu.innerHTML = activityMenuItems.map(({ label, icon, action }) => `
      <button type="button" class="activity-menu-item" role="menuitem"${action ? ` data-action="${action}"` : ''}>
        <img src="${icon}" alt="" />
        <span>${label}</span>
      </button>
    `).join('');
    row.append(menu);
    const visibilityMenuItem = menu.querySelector('[data-action="hide"]');
    const updateVisibilityMenuItem = () => {
      if (!visibilityMenuItem) return;
      visibilityMenuItem.querySelector('span').textContent = row.dataset.hidden === 'true'
        ? 'Show activity to student'
        : 'Hide activity from students';
    };
    updateVisibilityMenuItem();

    const toggleMenu = () => {
      const isOpen = !menu.hidden;
      closeAllActivityMenus();
      menu.hidden = isOpen;
      kebab.setAttribute('aria-expanded', String(!isOpen));
      kebab.classList.toggle('is-open', !isOpen);
    };

    kebab.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleMenu();
    });
    kebab.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleMenu();
      }
    });
    menu.addEventListener('click', (event) => {
      const menuItem = event.target.closest('[role="menuitem"]');
      if (!menuItem) return;
      const action = menuItem.dataset.action;
      closeAllActivityMenus();
      if (action === 'preview') {
        if (row.classList.contains('chapter-item')) openPreviewModal(row);
        else openActivityPreviewModal(row);
      }
      if (action === 'settings') openSettingsModal(row);
      if (action === 'edit') openEditModal(row);
      if (action === 'hide') {
        setActivityHidden(row, row.dataset.hidden !== 'true');
        updateVisibilityMenuItem();
      }
    });
    activityMenus.push({ kebab, menu });
  };

  const closeAllFolderMenus = () => {
    folderMenus.forEach(({ icon, menu }) => {
      menu.hidden = true;
      icon.setAttribute('aria-expanded', 'false');
      icon.classList.remove('is-open');
    });
  };

  document.querySelectorAll('.item-row .kebab').forEach((kebab) => bindActivityMenu(kebab, kebab.closest('.item-row')));

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.activity-menu, .kebab, .calendar-assessment-more')) closeAllActivityMenus();
    if (!event.target.closest('.folder-menu, .folder-menu-icon')) closeAllFolderMenus();
    if (!event.target.closest('.filter-panel, [aria-controls="picker-filter-panel"]')) closeFilterPanel();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeAllActivityMenus();
      closeAllFolderMenus();
      closeFilterPanel();
      closeActiveModal();
    }
  });

});
