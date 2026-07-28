import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
import { FormattedMessage, useIntl } from 'gatsby-plugin-intl';
import { palette, alpha } from '@styles/palette';

// --- FUNÇÃO DNA REALISTA (Mesma de antes) ---
const getRealisticDna = (color) => {
  const c = color.replace('#', '%23');
  return `url("data:image/svg+xml,%3Csvg width='40' height='120' viewBox='0 0 40 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cstyle%3E.back%7Bstroke:${c};stroke-width:1.5;opacity:0.3;fill:none%7D.front%7Bstroke:${c};stroke-width:2.5;fill:none%7D.rung%7Bstroke:${c};stroke-width:1;opacity:0.6%7D.dot%7Bfill:${c}%7D%3C/style%3E%3C/defs%3E%3Cpath class='back' d='M30,0 C30,30 10,30 10,60 S30,90 30,120' /%3E%3Cline class='rung' x1='12' y1='10' x2='28' y2='10' /%3E%3Cline class='rung' x1='10' y1='20' x2='30' y2='20' /%3E%3Cline class='rung' x1='10' y1='30' x2='30' y2='30' /%3E%3Cline class='rung' x1='10' y1='40' x2='30' y2='40' /%3E%3Cline class='rung' x1='12' y1='50' x2='28' y2='50' /%3E%3Cline class='rung' x1='12' y1='70' x2='28' y2='70' /%3E%3Cline class='rung' x1='10' y1='80' x2='30' y2='80' /%3E%3Cline class='rung' x1='10' y1='90' x2='30' y2='90' /%3E%3Cline class='rung' x1='10' y1='100' x2='30' y2='100' /%3E%3Cline class='rung' x1='12' y1='110' x2='28' y2='110' /%3E%3Cpath class='front' d='M10,0 C10,30 30,30 30,60 S10,90 10,120' /%3E%3Ccircle class='dot' cx='10' cy='0' r='1.5'/%3E%3Ccircle class='dot' cx='30' cy='60' r='1.5'/%3E%3Ccircle class='dot' cx='10' cy='120' r='1.5'/%3E%3C/svg%3E")`;
};

const StyledAcademicSection = styled.section`
  padding-top: 100px;
  padding-bottom: 100px;
  position: relative;

  h2 {
    margin-bottom: 60px;
    text-align: center;
  }
`;

const TimelineContainer = styled.div`
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
`;

// --- CORREÇÃO AQUI: Posicionamento da Linha ---
const LineBase = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px; 
  z-index: 0;
  
  /* DESKTOP: Centralizado */
  left: 50%;
  transform: translateX(-50%);

  background-image: ${() => getRealisticDna(palette.dark['dark-slate'])};
  background-repeat: repeat-y;
  background-position: center top;
  opacity: 0.4;

  /* MOBILE: Encostado na Esquerda */
  @media (max-width: 768px) {
    left: 10px; /* Pequena margem da borda da tela */
    transform: none; /* <--- IMPORTANTE: Remove a centralização */
  }
`;

const LineProgress = styled.div`
  position: absolute;
  top: 0;
  width: 40px;
  z-index: 1;
  height: 0;
  transition: height 0.1s linear;
  overflow: hidden;

  /* DESKTOP: Centralizado */
  left: 50%;
  transform: translateX(-50%);

  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 10000px; 
    background-image: ${() => getRealisticDna(palette.dark.accent)};
    background-repeat: repeat-y;
    background-position: center top;
    filter: drop-shadow(0 0 2px ${alpha(palette.dark.accent, 0.4)});
  }

  /* MOBILE: Encostado na Esquerda */
  @media (max-width: 768px) {
    left: 10px; /* Mesma posição do Base */
    transform: none;
  }
`;

const StyledDegreeGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  position: relative;
  z-index: 2;
`;

const StyledDegree = styled.li`
  position: relative;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(12, 1fr);
  align-items: center;
  margin-bottom: 120px;

  &:last-child {
    margin-bottom: 0;
  }

  /* --- PONTO (Bolinha) --- */
  &::after {
    content: '';
    position: absolute;
    top: 20px;
    width: 16px; 
    height: 16px;
    border-radius: 50%;
    background-color: var(--navy); 
    border: 2px solid var(--accent);
    box-shadow: 0 0 0 4px var(--accent-tint), 0 0 10px var(--accent-tint-30);
    z-index: 10;
    transition: var(--transition);
    
    /* DESKTOP: Centralizado */
    left: 50%;
    transform: translateX(-50%);

    /* MOBILE: Alinhado com o DNA na esquerda */
    @media (max-width: 768px) {
      left: 30px; /* 10px (margem) + 20px (metade do DNA) = 30px centro */
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 28px;
    height: 1px;
    width: 8%;
    background-color: var(--accent);
    opacity: 0.3;
    z-index: 0;

    @media (max-width: 1080px) {
      width: 5%;
    }
    @media (max-width: 768px) {
      display: none;
    }
  }

  /* ÍMPARES (Texto esquerda no Desktop) */
  &:nth-of-type(odd) {
    &::before {
      left: 50%;
      margin-left: 10px;
    }

    .degree-content {
      grid-column: 7 / -1;
      text-align: left;
      padding-left: 60px;

      @media (max-width: 1080px) {
        grid-column: 6 / -1;
      }
      
      /* MOBILE ADJUST */
      @media (max-width: 768px) {
        grid-column: 1 / -1;
        padding-left: 70px; /* Empurra o texto para não bater no DNA */
        text-align: left;
      }
    }
    
    .degree-image {
      grid-column: 1 / 7;
      text-align: right;
      padding-right: 40px;

      @media (max-width: 768px) {
        display: none;
      }
    }
    
    .degree-tech-list {
      justify-content: flex-start;
    }
  }

  /* PARES (Texto direita no Desktop) */
  &:nth-of-type(even) {
    &::before {
      right: 50%;
      margin-right: 10px;
    }

    .degree-content {
      grid-column: 1 / 7;
      text-align: right;
      padding-right: 60px;

      @media (max-width: 1080px) {
        grid-column: 1 / 7;
      }
      
      /* MOBILE ADJUST */
      @media (max-width: 768px) {
        grid-column: 1 / -1;
        padding-left: 70px; /* Empurra o texto para não bater no DNA */
        text-align: left;
        padding-right: 0;
      }
    }
    
    .degree-image {
      grid-column: 7 / -1;
      text-align: left;
      padding-left: 40px;

      @media (max-width: 768px) {
        display: none;
      }
    }
    
    .degree-tech-list {
      justify-content: flex-end;
      @media (max-width: 768px) {
        justify-content: flex-start;
      }
    }
  }

  .degree-content {
    position: relative;
    grid-row: 1 / -1;
  }

  .degree-overline {
    margin: 10px 0;
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 400;
  }

  .degree-date {
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--light-slate);
    margin-bottom: 5px;
    display: block;
  }
  
  .degree-title {
    color: var(--lightest-slate);
    font-size: clamp(24px, 5vw, 28px);
    margin: 0 0 20px;
    
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

  .degree-description {
    ${({ theme }) => theme.mixins.boxShadow};
    position: relative;
    z-index: 2;
    padding: 25px;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    color: var(--light-slate);
    font-size: var(--fz-lg);
    text-align: justify;

    @media (max-width: 768px) {
      padding: 20px 0;
      background-color: transparent;
      box-shadow: none;
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .degree-tech-list {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
    margin: 25px 0 10px;
    padding: 0;
    list-style: none;
    text-align: justify;

    li {
      margin: 0 10px 5px 0;
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      white-space: nowrap;
    }
  }

  .degree-links {
    display: flex;
    align-items: center;
    justify-content: inherit;
    position: relative;
    margin-top: 10px;
    margin-left: -10px;
    color: var(--lightest-slate);

    a {
      ${({ theme }) => theme.mixins.flexCenter};
      padding: 10px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  .degree-image {
    ${({ theme }) => theme.mixins.boxShadow};
    grid-row: 1 / -1;
    align-self: center;
    position: relative;
    z-index: 1;
    border-radius: var(--border-radius);

    a {
      width: 100%;
      border-radius: var(--border-radius);
      overflow: hidden;
      vertical-align: middle;
      display: block;
      transition: var(--transition);

      &:hover,
      &:focus {
        outline: 0;
        box-shadow: 0 20px 30px -15px var(--navy-shadow), 0 0 0 3px var(--accent-tint);

        .img {
          filter: none;
        }
      }
    }

    .img {
      border-radius: var(--border-radius);
      filter: grayscale(15%) contrast(1.02);
      transition: var(--transition);
    }
  }
`;

const AcademicFeatured = () => {
  const data = useStaticQuery(graphql`
    {
      degrees: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/academic/degrees/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              school
              date(formatString: "YYYY")
              cover {
                childImageSharp {
                  gatsbyImageData(width: 700, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
                }
              }
              end(formatString: "YYYY")
              tech
              external
              lang
            }
            html
          }
        }
      }
    }
  `);

  const intl = useIntl();

  const featuredDegrees = data.degrees.edges.filter(({ node }) => {
    const lang = node.frontmatter.lang || 'en';
    return lang === intl.locale;
  });

  const revealTitle = useRef(null);
  const revealDegrees = useRef([]);
  const containerRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const start = rect.top;
      const totalHeight = rect.height;
      
      const offset = windowHeight * 0.6;
      let scrolled = offset - start;

      if (scrolled < 0) scrolled = 0;
      if (scrolled > totalHeight) scrolled = totalHeight;

      setLineHeight(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    sr.reveal(revealTitle.current, srConfig());
    revealDegrees.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  return (
    <StyledAcademicSection id="education">
      <h2 className="numbered-heading" ref={revealTitle}>
        <FormattedMessage id="academic_featured_heading" defaultMessage="Academic Journey" />
      </h2>

      <TimelineContainer ref={containerRef}>
        <LineBase />
        <LineProgress style={{ height: `${lineHeight}px` }} />

        <StyledDegreeGrid>
          {featuredDegrees &&
            featuredDegrees.map(({ node }, i) => {
              const { frontmatter, html } = node;
              const { external, title, tech, cover, school, date, end } = frontmatter;
              const image = getImage(cover);

              return (
                <StyledDegree key={i} ref={el => (revealDegrees.current[i] = el)}>
                  <div className="degree-content">
                    <div>
                      <span className="degree-date">{date}-{end}</span>
                      <p className="degree-overline">{school}</p>

                      <h3 className="degree-title">
                        <a href={external}>{title}</a>
                      </h3>

                      <div
                        className="degree-description"
                        dangerouslySetInnerHTML={{ __html: html }}
                      />

                      {tech.length && (
                        <ul className="degree-tech-list">
                          {tech.map((tech, i) => (
                            <li key={i}>{tech}</li>
                          ))}
                        </ul>
                      )}

                      <div className="degree-links">
                        {external && (
                          <a href={external} aria-label="University Link" className="external">
                            <Icon name="External" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="degree-image">
                    <a href={external ? external : '#'}>
                      <GatsbyImage image={image} alt={title} className="img" />
                    </a>
                  </div>
                </StyledDegree>
              );
            })}
        </StyledDegreeGrid>
      </TimelineContainer>
    </StyledAcademicSection>
  );
};

export default AcademicFeatured;