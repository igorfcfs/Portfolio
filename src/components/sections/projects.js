import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
import { FormattedMessage, useIntl } from 'gatsby-plugin-intl';

const StyledProjectsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  .section-header {
    max-width: 600px;
    text-align: center;
    margin-bottom: 10px;
  }

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .section-subtitle {
    margin: 0 auto;
    color: var(--slate);
    font-size: var(--fz-lg);
  }

  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    max-width: 700px;
    margin: 35px 0 10px;
  }

  .no-results {
    margin: 60px 0;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    text-align: center;
  }

  .projects-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 20px;
    position: relative;
    width: 100%;
    margin-top: 45px;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }

  .archive-link {
    ${({ theme }) => theme.mixins.smallButton};
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 40px auto 0;

    svg {
      width: 14px;
      height: 14px;
      transition: var(--transition);
    }

    &:hover svg,
    &:focus-visible svg {
      transform: translateX(3px);
    }
  }
`;

const FilterChip = styled.button`
  ${({ theme }) => theme.mixins.flexCenter};
  min-height: 38px;
  padding: 0 16px;
  border-radius: 30px;
  border: 1px solid ${({ $active }) => ($active ? 'var(--accent)' : 'var(--lightest-navy)')};
  background-color: ${({ $active }) => ($active ? 'var(--accent-tint)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--accent)' : 'var(--light-slate)')};
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  line-height: 1;
  cursor: pointer;
  transition: var(--transition);

  &:hover,
  &:focus-visible {
    border-color: var(--accent);
    color: var(--accent);
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
`;

const StyledProject = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .project-inner {
        transform: translateY(-7px);
        border-color: var(--accent-tint-40);
        box-shadow: 0 20px 30px -15px var(--navy-shadow), 0 0 0 1px var(--accent-tint-30);
      }

      .project-inner:before {
        transform: scaleX(1);
      }

      .folder {
        background-color: var(--accent-tint-20);
        transform: scale(1.05);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .project-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    border: 1px solid transparent;
    background-color: var(--light-navy);
    transition: var(--transition);
    overflow: hidden;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--accent), var(--blue));
      transform: scaleX(0);
      transform-origin: left;
      transition: var(--transition);
    }
  }

  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    width: 100%;
    margin-bottom: 35px;

    .folder {
      ${({ theme }) => theme.mixins.flexCenter};
      width: 48px;
      height: 48px;
      color: var(--accent);
      background-color: var(--accent-tint);
      border-radius: var(--border-radius);
      transition: var(--transition);

      svg {
        width: 24px;
        height: 24px;
      }
    }

    .project-links {
      display: flex;
      align-items: center;
      margin-right: -10px;
      color: var(--light-slate);

      a {
        ${({ theme }) => theme.mixins.flexCenter};
        padding: 5px 7px;
        border-radius: 50%;
        transition: var(--transition);

        &:hover,
        &:focus-visible {
          color: var(--accent);
          background-color: var(--accent-tint);
        }

        &.external {
          svg {
            width: 22px;
            height: 22px;
            margin-top: -4px;
          }
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .project-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);
    transition: var(--transition);

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  &:hover .project-title,
  &:focus-within .project-title {
    color: var(--accent);
  }

  .project-description {
    color: var(--light-slate);
    font-size: 17px;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .project-tech-list {
    display: flex;
    align-items: center;
    flex-grow: 1;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;

    li {
      padding: 4px 10px;
      border-radius: 30px;
      background-color: var(--accent-tint);
      color: var(--accent);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;
      white-space: nowrap;
    }
  }
`;

const Projects = () => {
  const data = useStaticQuery(graphql`
    query {
      projects: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/projects/" }
          frontmatter: { showInProjects: { ne: false } }
        }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              tech
              github
              external
            }
            html
          }
        }
      }
    }
  `);

  const intl = useIntl();
  const [showMore, setShowMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const GRID_LIMIT = 6;
  const projects = data.projects.edges.filter(({ node }) => node);

  const filters = useMemo(() => {
    const counts = new Map();
    projects.forEach(({ node }) => {
      (node.frontmatter.tech || []).forEach(tag => {
        const key = tag.toLowerCase();
        if (!counts.has(key)) {
          counts.set(key, { label: tag, count: 0 });
        }
        counts.get(key).count += 1;
      });
    });

    return Array.from(counts.values())
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
      .slice(0, 10);
  }, [projects]);

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter(({ node }) =>
        (node.frontmatter.tech || []).some(tag => tag.toLowerCase() === activeFilter),
      );

  const isFiltering = activeFilter !== 'all';
  const projectsToShow =
    !isFiltering && !showMore ? filteredProjects.slice(0, GRID_LIMIT) : filteredProjects;
  const hasMore = !isFiltering && filteredProjects.length > GRID_LIMIT;

  const handleFilterClick = key => {
    setActiveFilter(key);
    setShowMore(false);
  };

  const projectInner = node => {
    const { frontmatter, html } = node;
    const { github, external, title, tech } = frontmatter;

    return (
      <div className="project-inner">
        <header>
          <div className="project-top">
            <div className="folder">
              <Icon name="Folder" />
            </div>
            <div className="project-links">
              {github && (
                <a
                  href={github}
                  aria-label={intl.formatMessage({
                    id: 'projects_github_link',
                    defaultMessage: 'GitHub Link',
                  })}
                  target="_blank"
                  rel="noreferrer">
                  <Icon name="GitHub" />
                </a>
              )}
              {external && (
                <a
                  href={external}
                  aria-label={intl.formatMessage({
                    id: 'projects_external_link',
                    defaultMessage: 'External Link',
                  })}
                  className="external"
                  target="_blank"
                  rel="noreferrer">
                  <Icon name="External" />
                </a>
              )}
            </div>
          </div>

          <h3 className="project-title">
            <a href={external} target="_blank" rel="noreferrer">
              {title}
            </a>
          </h3>

          <div className="project-description" dangerouslySetInnerHTML={{ __html: html }} />
        </header>

        <footer>
          {tech && (
            <ul className="project-tech-list">
              {tech.map((tech, i) => (
                <li key={i}>{tech}</li>
              ))}
            </ul>
          )}
        </footer>
      </div>
    );
  };

  return (
    <StyledProjectsSection>
      <div className="section-header">
        <h2 ref={revealTitle}>
          <FormattedMessage id="projects_h2" defaultMessage="Other Noteworthy Projects" />
        </h2>
        <p className="section-subtitle">
          <FormattedMessage
            id="projects_count"
            defaultMessage="{count, plural, one {# project} other {# projects}}"
            values={{ count: projects.length }}
          />
        </p>
      </div>

      {filters.length > 1 && (
        <div className="filter-bar" role="group" aria-label="Filter projects by technology">
          <FilterChip $active={activeFilter === 'all'} onClick={() => handleFilterClick('all')}>
            <FormattedMessage id="projects_filter_all" defaultMessage="All" />
          </FilterChip>
          {filters.map(({ label }) => {
            const key = label.toLowerCase();
            return (
              <FilterChip
                key={key}
                $active={activeFilter === key}
                aria-pressed={activeFilter === key}
                onClick={() => handleFilterClick(key)}>
                {label}
              </FilterChip>
            );
          })}
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <p className="no-results">
          <FormattedMessage
            id="projects_no_results"
            defaultMessage="No projects match this filter."
          />
        </p>
      ) : (
        <ul className="projects-grid">
          {prefersReducedMotion ? (
            <>
              {projectsToShow.map(({ node }) => (
                <StyledProject key={node.frontmatter.title}>{projectInner(node)}</StyledProject>
              ))}
            </>
          ) : (
            <TransitionGroup component={null}>
              {projectsToShow.map(({ node }, i) => (
                <CSSTransition
                  key={node.frontmatter.title}
                  classNames="fadeup"
                  timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                  exit={false}>
                  <StyledProject
                    ref={el => (revealProjects.current[i] = el)}
                    style={{
                      transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                    }}>
                    {projectInner(node)}
                  </StyledProject>
                </CSSTransition>
              ))}
            </TransitionGroup>
          )}
        </ul>
      )}

      {hasMore && (
        <button className="more-button" onClick={() => setShowMore(!showMore)}>
          <FormattedMessage id="projects_show" defaultMessage="Show" />{' '}
          {showMore ? (
            <FormattedMessage id="projects_show_less" defaultMessage="Less" />
          ) : (
            <FormattedMessage id="projects_show_more" defaultMessage="More" />
          )}
        </button>
      )}

      <Link className="archive-link" to="/archive" ref={revealArchiveLink}>
        <FormattedMessage id="projects_archive" defaultMessage="view the archive" />
        <Icon name="External" />
      </Link>
    </StyledProjectsSection>
  );
};

export default Projects;
