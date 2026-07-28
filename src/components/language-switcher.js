import React, { useState, useRef } from 'react';
import { useIntl, changeLocale } from 'gatsby-plugin-intl';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { useOnClickOutside, usePrefersReducedMotion } from '@hooks';

// Same authentic flag source used by the Languages/globe section (flagcdn.com).
const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English', flagCode: 'us' },
  { code: 'pt', label: 'PT', name: 'Português', flagCode: 'br' },
  { code: 'es', label: 'ES', name: 'Español', flagCode: 'es' },
  { code: 'zh', label: '中文', name: '中文 (普通话)', flagCode: 'cn' },
];

const flagBaseStyles = css`
  display: block;
  border-radius: 2px;
  object-fit: cover;
  box-shadow: 0 0 0 1px var(--glass-border);
  flex-shrink: 0;
  /* GlobalStyle blurs alt="" images as a missing-alt-text nudge; these flags
     are intentionally decorative (the language name sits right next to
     them), so opt back out of that blur. */
  filter: none !important;
`;

const triggerFlagStyles = css`
  ${flagBaseStyles};
  width: 28px;
  height: 20px;
`;

const optionFlagStyles = css`
  ${flagBaseStyles};
  width: 32px;
  height: 22px;
`;

// flagcdn's vector source (as opposed to its rasterized w*/ PNGs) stays
// crisp at any display size or pixel density — no upscaling blur.
const flagSrc = flagCode => `https://flagcdn.com/${flagCode}.svg`;

const StyledWrapper = styled.div`
  position: relative;
  display: inline-flex;
  justify-content: center;
  margin-left: 20px;

  ${({ variant }) =>
    variant === 'mobile' &&
    css`
      margin-left: 0;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `};
`;

const StyledTrigger = styled.button`
  ${({ theme }) => theme.mixins.flexCenter};
  gap: 8px;
  min-height: 44px;
  padding: 6px 14px;
  border: 1px solid ${({ isOpen }) => (isOpen ? 'var(--accent)' : 'var(--glass-border)')};
  border-radius: 22px;
  background-color: ${({ isOpen }) => (isOpen ? 'var(--accent-tint)' : 'var(--glass-bg)')};
  color: var(--lightest-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-sm);
  font-weight: ${({ isOpen }) => (isOpen ? 600 : 400)};
  cursor: pointer;
  transition: var(--transition);

  img {
    ${triggerFlagStyles};
  }

  &:hover,
  &:focus-visible {
    border-color: var(--accent);
    background-color: var(--accent-tint);
  }

  .chevron {
    color: var(--accent);
    font-size: var(--fz-xxs);
    transition: transform 0.2s ease;
    transform: rotate(${({ isOpen }) => (isOpen ? '180deg' : '0deg')});
  }
`;

const StyledPanel = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-6px)')};
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
  width: max-content;
  min-width: 180px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--glass-border);
  background-color: var(--light-navy);
  box-shadow: 0 10px 30px -10px var(--navy-shadow);
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;

  &:before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 12px;
    height: 12px;
    background-color: var(--light-navy);
    border-left: 1px solid var(--glass-border);
    border-top: 1px solid var(--glass-border);
  }
`;

const StyledOption = styled.button`
  ${({ theme }) => theme.mixins.flexCenter};
  gap: 10px;
  justify-content: flex-start;
  min-height: 44px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background-color: transparent;
  color: var(--light-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-sm);
  text-align: left;
  cursor: pointer;
  transition: var(--transition);

  img {
    ${optionFlagStyles};
  }

  .lang-name {
    white-space: nowrap;
  }

  .lang-code {
    margin-left: auto;
    color: var(--slate);
    font-size: var(--fz-xxs);
  }

  &:hover,
  &:focus-visible {
    background-color: var(--accent-tint);
    color: var(--lightest-slate);
  }
`;

const LanguageSwitcher = ({ variant }) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useOnClickOutside(wrapperRef, () => setIsOpen(false));

  const current = LANGUAGES.find(({ code }) => code === intl.locale) || LANGUAGES[0];
  const others = LANGUAGES.filter(({ code }) => code !== current.code);

  const onKeyDown = e => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectLanguage = code => {
    setIsOpen(false);
    changeLocale(code);
  };

  return (
    <StyledWrapper ref={wrapperRef} variant={variant} onKeyDown={onKeyDown}>
      <StyledTrigger
        type="button"
        isOpen={isOpen}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Current language: ${current.name}. Change language`}
        onClick={() => setIsOpen(prev => !prev)}>
        <img src={flagSrc(current.flagCode)} alt="" />
        <span>{current.label}</span>
        <span className="chevron" aria-hidden="true">
          ▾
        </span>
      </StyledTrigger>

      <StyledPanel
        role="menu"
        isOpen={isOpen}
        aria-hidden={!isOpen}
        style={prefersReducedMotion ? { transition: 'opacity 0.01s' } : undefined}>
        {others.map(({ code, name, label, flagCode }) => (
          <StyledOption
            key={code}
            type="button"
            role="menuitem"
            tabIndex={isOpen ? '0' : '-1'}
            onClick={() => selectLanguage(code)}>
            <img src={flagSrc(flagCode)} alt="" />
            <span className="lang-name">{name}</span>
            <span className="lang-code">{label}</span>
          </StyledOption>
        ))}
      </StyledPanel>
    </StyledWrapper>
  );
};

LanguageSwitcher.propTypes = {
  variant: PropTypes.oneOf(['desktop', 'mobile']),
};

LanguageSwitcher.defaultProps = {
  variant: 'desktop',
};

export default LanguageSwitcher;
