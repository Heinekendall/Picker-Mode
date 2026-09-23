import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Checkbox, DatePicker, GlobalStyles } from 'react-magma-dom';

const selectableSelector = '.item-row .checkbox, .calendar-assessment .checkbox, .course-link-row .checkbox, .folder-row .checkbox, .group-row .checkbox';
let nextCheckboxId = 0;

const monthNames = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

function parseDateLabel(label) {
  if (!label) return undefined;
  const match = label.trim().match(/^([A-Za-z]+)\s+(\d{1,2})(?:,\s*(\d{4}))?/);
  if (!match) return undefined;

  const month = monthNames.findIndex((name) => name.startsWith(match[1].toLowerCase()));
  const day = Number(match[2]);
  const year = Number(match[3] || 2025);
  if (month < 0 || !Number.isInteger(day) || !Number.isInteger(year)) return undefined;

  const date = new Date(year, month, day);
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day
    ? date
    : undefined;
}

function formatDateLabel(date, suffix = '') {
  if (!date) return '';
  const formatted = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `${formatted}${suffix ? ` ${suffix}` : ''}`;
}

function getCheckboxLabel(host) {
  const row = host.closest('.calendar-assessment, .item-row, .course-link-row, .folder-row, .group-row');
  if (!row) return 'Select all content';
  const title = row.querySelector('.item-title, .course-link-title, b');
  return title?.textContent?.trim() || 'Select content';
}

function MagmaCheckbox({ checked, host, onChange }) {
  const [localChecked, setLocalChecked] = useState(false);
  const isSelectable = host.matches(selectableSelector);
  const isChecked = isSelectable ? checked : localChecked;

  return (
    <Checkbox
      ariaLabel={getCheckboxLabel(host)}
      checked={isChecked}
      containerStyle={{ alignItems: 'center', display: 'flex', height: 24, margin: 0, padding: 0, width: 24 }}
      inputStyle={{ margin: 0 }}
      labelStyle={{ alignItems: 'center', display: 'flex', height: 24, margin: 0, padding: 0, width: 24 }}
      labelText=""
      onChange={(event) => {
        const nextChecked = event.target.checked;
        if (isSelectable) onChange(host, nextChecked);
        else setLocalChecked(nextChecked);
      }}
    />
  );
}

function CheckboxLayer() {
  const [hosts, setHosts] = useState([]);
  const [, setSelectionVersion] = useState(0);

  useEffect(() => {
    const mountHosts = () => {
      const nextHosts = [...document.querySelectorAll('.cleaned-frame .checkbox')];
      nextHosts.forEach((host) => {
        if (!host.dataset.magmaMounted) {
          host.dataset.magmaMounted = 'true';
          host.dataset.magmaId = `magma-checkbox-${nextCheckboxId++}`;
          host.classList.add('magma-checkbox-host');
          host.removeAttribute('aria-hidden');
          host.replaceChildren();
        }
      });
      setHosts((currentHosts) => (
        currentHosts.length === nextHosts.length && currentHosts.every((host, index) => host === nextHosts[index])
          ? currentHosts
          : nextHosts
      ));
    };

    mountHosts();
    const picker = document.querySelector('.picker') || document.body;
    const observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.type === 'childList')) mountHosts();
      if (mutations.some((mutation) => mutation.type === 'attributes' && mutation.attributeName === 'aria-checked')) {
        setSelectionVersion((version) => version + 1);
      }
    });
    observer.observe(picker, { attributes: true, attributeFilter: ['aria-checked'], childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const handleChange = (host, nextChecked) => {
    host.setAttribute('aria-checked', String(nextChecked));
        host.closest('.calendar-assessment, .item-row, .course-link-row, .folder-row, .group-row')?.classList.toggle('selected', nextChecked);
  };

  return (
    <>
      <GlobalStyles />
      {hosts.map((host) => createPortal(
        <MagmaCheckbox checked={host.getAttribute('aria-checked') === 'true'} host={host} onChange={handleChange} />,
        host,
        host.dataset.magmaId,
      ))}
    </>
  );
}

function MagmaDateInput({ host }) {
  const label = host.dataset.dateLabel || 'Date';
  const placeholder = host.dataset.datePlaceholder || `Add ${label}`;
  const [date, setDate] = useState(() => parseDateLabel(host.dataset.dateValue));

  return (
    <DatePicker
      aria-label={label}
      containerStyle={{ margin: 0, width: '100%' }}
      inputStyle={{ width: '100%' }}
      isClearable
      labelStyle={{ display: 'none' }}
      labelText=""
      onDateChange={(nextDate) => setDate(nextDate)}
      placeholder={placeholder}
      value={date}
    />
  );
}

function InlineMagmaDatePicker({ host }) {
  const label = host.dataset.dateLabel || 'Date';
  const [date, setDate] = useState(() => parseDateLabel(host.dataset.dateValue));
  const suffix = host.dataset.dateSuffix || '';
  const datePrefix = label === 'Date Available' ? 'Unlocks' : 'Due';
  const displayDate = date
    ? label === 'Date Available'
      ? `${date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}${suffix ? ` ${suffix}` : ''}`
      : formatDateLabel(date, suffix)
    : host.dataset.datePlaceholder || (label === 'Date Available' ? 'Add Date Available' : 'Add Due Date');

  return (
    <span className="inline-date-text" aria-label={`${datePrefix} ${displayDate}`}>
        <span className="date-prefix">{datePrefix}</span> <em>{displayDate}</em>
    </span>
  );
}

function DateInputLayer() {
  const [hosts, setHosts] = useState([]);

  useEffect(() => {
    const mountHosts = () => {
      const nextHosts = [...document.querySelectorAll('.date-input-host, .inline-date-host')];
      nextHosts.forEach((host, index) => {
        if (!host.dataset.magmaDateId) host.dataset.magmaDateId = `magma-date-${index}`;
      });
      setHosts((currentHosts) => (
        currentHosts.length === nextHosts.length && currentHosts.every((host, index) => host === nextHosts[index])
          ? currentHosts
          : nextHosts
      ));
    };

    mountHosts();
    const observer = new MutationObserver(mountHosts);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return hosts.map((host) => createPortal(
    host.classList.contains('inline-date-host')
      ? <InlineMagmaDatePicker host={host} />
      : <MagmaDateInput host={host} />,
    host,
    host.dataset.magmaDateId,
  ));
}

createRoot(document.getElementById('react-layer')).render(
  <>
    <CheckboxLayer />
    <DateInputLayer />
  </>,
);
