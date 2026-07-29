import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { srConfig } from '@config';
import { KEY_CODES } from '@utils';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { Icon } from '@components/icons';
import { FormattedMessage, useIntl } from 'gatsby-plugin-intl'; // <--- Adicione useIntl

const StyledJobsSection = styled.section`
  position: relative;
  max-width: 1000px;

  // Local overrides — only jobs.js reads these tokens, so widening them here
  // doesn't affect the --tab-height/--tab-width defaults anywhere else.
  --tab-height: 78px;
  --tab-width: 240px;

  .spotlight-glow {
    position: absolute;
    z-index: 0;
    top: -120px;
    left: 50%;
    width: 700px;
    height: 420px;
    transform: translateX(-50%);
    background: radial-gradient(circle, var(--accent-tint-30) 0%, transparent 70%);
    filter: blur(50px);
    pointer-events: none;
  }

  .section-subtitle {
    position: relative;
    z-index: 1;
    max-width: 560px;
    margin: -15px 0 45px;
    color: var(--slate);
    font-size: var(--fz-lg);
    line-height: 1.5;
  }

  .inner {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 20px;
    align-items: flex-start;

    @media (max-width: 700px) {
      display: block;
    }

    // Prevent container from jumping
    @media (min-width: 700px) {
      min-height: 400px;
    }
  }
`;

const StyledTabList = styled.div`
  position: relative;
  z-index: 3;
  width: max-content;
  padding: 0;
  margin: 0;
  list-style: none;

  @media (max-width: 700px) {
    display: flex;
    overflow-x: auto;
    width: calc(100% + 100px);
    padding-left: 50px;
    margin-left: -50px;
    margin-bottom: 30px;
  }
  @media (max-width: 480px) {
    width: calc(100% + 50px);
    padding-left: 25px;
    margin-left: -25px;
  }

  li {
    &:first-of-type {
      @media (max-width: 700px) {
        margin-left: 50px;
      }
      @media (max-width: 480px) {
        margin-left: 25px;
      }
    }
    &:last-of-type {
      @media (max-width: 700px) {
        padding-right: 50px;
      }
      @media (max-width: 480px) {
        padding-right: 25px;
      }
    }
  }
`;

const StyledTabButton = styled.button`
  ${({ theme }) => theme.mixins.link};
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  height: var(--tab-height);
  padding: 0 20px;
  border-left: 2px solid var(--lightest-navy);
  background-color: transparent;
  color: ${({ isActive }) => (isActive ? 'var(--lightest-slate)' : 'var(--slate)')};
  text-align: left;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
  @media (max-width: 700px) {
    ${({ theme }) => theme.mixins.flexCenter};
    flex-direction: column;
    gap: 8px;
    min-width: var(--tab-width);
    padding: 12px 15px;
    border-left: 0;
    border-bottom: 2px solid var(--lightest-navy);
    text-align: center;
  }

  &:hover,
  &:focus {
    background-color: var(--light-navy);
  }

  .tab-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;
  }

  .tab-company {
    overflow: hidden;
    color: ${({ isActive }) => (isActive ? 'var(--accent)' : 'inherit')};
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tab-role {
    overflow: hidden;
    color: var(--slate);
    font-size: var(--fz-xxs);
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (max-width: 700px) {
      max-width: calc(var(--tab-width) - 30px);
    }
  }
`;

const StyledHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 3px;
  height: var(--tab-height);
  border-radius: var(--border-radius);
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent-tint-50);
  transform: translateY(calc(${({ activeTabId }) => activeTabId} * var(--tab-height)));
  transition: transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition-delay: 0.1s;

  @media (max-width: 700px) {
    top: auto;
    bottom: 0;
    left: 0;
    width: var(--tab-width);
    max-width: var(--tab-width);
    height: 3px;
    margin-left: 50px;
    transform: translateX(calc(${({ activeTabId }) => activeTabId} * var(--tab-width)));
  }
  @media (max-width: 480px) {
    margin-left: 25px;
  }
`;

const StyledTabPanels = styled.div`
  position: relative;
  width: 100%;
`;

const StyledTabPanel = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  padding: 35px 40px;
  border: 1px solid var(--lightest-navy);
  border-radius: 12px;
  background-color: var(--light-navy);
  box-shadow: 0 25px 50px -25px var(--navy-shadow);

  @media (max-width: 600px) {
    padding: 25px 20px;
  }

  .panel-header {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 25px;
    padding-bottom: 25px;
    border-bottom: 1px solid var(--lightest-navy);

    @media (max-width: 480px) {
      flex-direction: column;
      gap: 14px;
    }
  }

  .panel-heading {
    flex: 1;
    min-width: 0;
  }

  ul {
    ${({ theme }) => theme.mixins.fancyList};
  }

  h3 {
    margin-bottom: 4px;
    font-size: var(--fz-xxl);
    font-weight: 600;
    line-height: 1.3;

    .company {
      color: var(--accent);
    }
  }

  .range {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 12px;
    margin-bottom: 0;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);

    .dot {
      opacity: 0.5;
    }
  }

  .panel-footer {
    margin-top: 25px;

    a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      svg {
        width: 14px;
        height: 14px;
      }
    }
  }
`;

const LogoBadge = styled.div`
  flex-shrink: 0;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => (size <= 44 ? '8px' : '14px')};
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 0 0 1px var(--lightest-navy);

  .gatsby-image-wrapper {
    width: 100%;
    height: 100%;
  }

  .logo-initials {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--accent-tint-40), var(--accent-tint-20));
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: ${({ size }) => Math.round(size * 0.32)}px;
    font-weight: 700;
  }
`;

// Renders the real company logo once one is added to a job's frontmatter
// (`logo: 'logo.png'` next to its index.md). Until then, falls back to a
// generated initials badge so every entry still reads as a distinct, polished
// company card instead of a blank tab.
const CompanyLogo = ({ logo, company, size }) => {
  const image = logo ? getImage(logo) : null;
  const initials = company
    ? company
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(word => word[0].toUpperCase())
      .join('')
    : '';

  return (
    <LogoBadge size={size}>
      {image ? (
        <GatsbyImage image={image} alt={`${company} logo`} />
      ) : (
        <span className="logo-initials" aria-hidden="true">
          {initials}
        </span>
      )}
    </LogoBadge>
  );
};

CompanyLogo.propTypes = {
  logo: PropTypes.object,
  company: PropTypes.string,
  size: PropTypes.number.isRequired,
};

const Jobs = () => {
  const data = useStaticQuery(graphql`
    query {
      jobs: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/jobs/" } }
        sort: { frontmatter: { date: DESC } }
      ) {
        edges {
          node {
            frontmatter {
              title
              company
              location
              range
              url
              lang
              logo {
                childImageSharp {
                  gatsbyImageData(width: 160, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
                }
              }
            }
            html
          }
        }
      }
    }
  `);

  const intl = useIntl(); // <--- Hook de internacionalização

  // <--- LÓGICA DE FILTRAGEM
  const jobsData = data.jobs.edges.filter(({ node }) => {
    const lang = node.frontmatter.lang || 'en';
    return lang === intl.locale;
  });
  // -----------------------

  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const tabs = useRef([]);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const focusTab = () => {
    if (tabs.current[tabFocus]) {
      tabs.current[tabFocus].focus();
      return;
    }
    // If we're at the end, go to the start
    if (tabFocus >= tabs.current.length) {
      setTabFocus(0);
    }
    // If we're at the start, move to the end
    if (tabFocus < 0) {
      setTabFocus(tabs.current.length - 1);
    }
  };

  // Only re-run the effect if tabFocus changes
  useEffect(() => focusTab(), [tabFocus]);

  // Focus on tabs when using up & down arrow keys
  const onKeyDown = e => {
    switch (e.key) {
      case KEY_CODES.ARROW_UP: {
        e.preventDefault();
        setTabFocus(tabFocus - 1);
        break;
      }

      case KEY_CODES.ARROW_DOWN: {
        e.preventDefault();
        setTabFocus(tabFocus + 1);
        break;
      }

      default: {
        break;
      }
    }
  };

  return (
    <StyledJobsSection id="jobs" ref={revealContainer}>
      <div className="spotlight-glow" aria-hidden="true" />

      <h2 className="numbered-heading">
        <FormattedMessage id="experience_heading" defaultMessage="Professional Experience" />
      </h2>

      <p className="section-subtitle">
        <FormattedMessage
          id="experience_subtitle"
          defaultMessage="Companies and teams I've had the opportunity to build real software for."
        />
      </p>

      <div className="inner">
        <StyledTabList role="tablist" aria-label="Job tabs" onKeyDown={e => onKeyDown(e)}>
          {jobsData &&
            jobsData.map(({ node }, i) => {
              const { company, title, logo } = node.frontmatter;
              return (
                <StyledTabButton
                  key={i}
                  isActive={activeTabId === i}
                  onClick={() => setActiveTabId(i)}
                  ref={el => (tabs.current[i] = el)}
                  id={`tab-${i}`}
                  role="tab"
                  tabIndex={activeTabId === i ? '0' : '-1'}
                  aria-selected={activeTabId === i ? true : false}
                  aria-controls={`panel-${i}`}>
                  <CompanyLogo logo={logo} company={company} size={40} />
                  <span className="tab-text">
                    <span className="tab-company">{company}</span>
                    <span className="tab-role">{title}</span>
                  </span>
                </StyledTabButton>
              );
            })}
          <StyledHighlight activeTabId={activeTabId} />
        </StyledTabList>

        <StyledTabPanels>
          {jobsData &&
            jobsData.map(({ node }, i) => {
              const { frontmatter, html } = node;
              const { title, url, company, range, location, logo } = frontmatter;

              return (
                <CSSTransition key={i} in={activeTabId === i} timeout={250} classNames="fade">
                  <StyledTabPanel
                    id={`panel-${i}`}
                    role="tabpanel"
                    tabIndex={activeTabId === i ? '0' : '-1'}
                    aria-labelledby={`tab-${i}`}
                    aria-hidden={activeTabId !== i}
                    hidden={activeTabId !== i}>
                    <div className="panel-header">
                      <CompanyLogo logo={logo} company={company} size={72} />

                      <div className="panel-heading">
                        <h3>
                          <span>{title}</span>
                          <span className="company">
                            &nbsp;@&nbsp;
                            <a href={url} className="inline-link">
                              {company}
                            </a>
                          </span>
                        </h3>

                        <p className="range">
                          <span>{range}</span>
                          {location && (
                            <>
                              <span className="dot">&bull;</span>
                              <span>{location}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div dangerouslySetInnerHTML={{ __html: html }} />

                    {url && (
                      <div className="panel-footer">
                        <a href={url} className="inline-link" aria-label={`${company} website`}>
                          <FormattedMessage id="experience_visit" defaultMessage="Visit website" />
                          &nbsp;
                          <Icon name="External" />
                        </a>
                      </div>
                    )}
                  </StyledTabPanel>
                </CSSTransition>
              );
            })}
        </StyledTabPanels>
      </div>
    </StyledJobsSection>
  );
};

export default Jobs;
