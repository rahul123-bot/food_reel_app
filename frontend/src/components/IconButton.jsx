import React from 'react';

const icons = {
  heart: (
    <path d="M20.8 4.6c-1.5-1.7-4.1-1.8-5.9-.3L12 6.8 9.1 4.3c-1.8-1.5-4.4-1.4-5.9.3-1.7 1.8-1.6 4.6.1 6.4l8.7 8 8.7-8c1.7-1.8 1.8-4.6.1-6.6z" />
  ),
  bookmark: (
    <path d="M7 3h10a1 1 0 0 1 1 1v17l-6-3.5L6 21V4a1 1 0 0 1 1-1z" />
  ),
  comment: (
    <path d="M21 11c0 4.4-4 8-9 8-1 0-2-.1-2.9-.3L4 20l1.4-3.7C4.5 15 3 13.1 3 11c0-4.4 4-8 9-8s9 3.6 9 8z" />
  ),
  home: (
    <path d="M4 11.5 12 4l8 7.5V20h-5v-6H9v6H4z" />
  ),
};

export default function IconButton({
  icon,
  label,
  count,
  active = false,
  onClick,
  href,
}) {
  const className = `icon-button icon-button--${icon}${active ? ' active' : ''}`;
  const content = (
    <>
      <span className="icon-button__glyph" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="presentation">
          {icons[icon]}
        </svg>
      </span>
      <span className="icon-button__meta">
        <span className="icon-button__label">{label}</span>
        {typeof count !== 'undefined' && (
          <span className="icon-button__count">{count}</span>
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <a className={className} href={href}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  );
}
