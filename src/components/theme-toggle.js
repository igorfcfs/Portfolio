import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useIntl } from 'gatsby-plugin-intl';
import { useTheme } from '@hooks';
import { IconMoon, IconSun } from '@components/icons';

const StyledToggle = styled.button`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  color: var(--accent);
  border: 1px solid var(--lightest-navy);
  transition: var(--transition);

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover,
  &:focus-visible {
    outline: 0;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-tint);
  }
`;

const ThemeToggle = ({ className, style }) => {
  const intl = useIntl();
  const [theme, toggleTheme] = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLight = mounted && theme === 'light';
  const label = intl.formatMessage({
    id: isLight ? 'theme_toggle_to_dark' : 'theme_toggle_to_light',
  });

  return (
    <StyledToggle
      className={className}
      style={style}
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}>
      {isLight ? <IconMoon /> : <IconSun />}
    </StyledToggle>
  );
};

ThemeToggle.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ThemeToggle;
