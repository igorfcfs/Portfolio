import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
// 1. IMPORTAR useIntl
import { FormattedMessage, useIntl } from 'gatsby-plugin-intl';

const StyledAcademicSection = styled.section`
  padding-top: 100px;
  padding-bottom: 100px;
  position: relative;

  h2 {
    margin-bottom: 60px;
    text-align: center;
  }
`;

// Container principal que segura a linha e os itens
const TimelineContainer = styled.div`
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
`;

// A Linha Cinza (Fundo)
const LineBase = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background-color: var(--lightest-navy);
  transform: translateX(-50%);
  z-index: 0;

  @media (max-width: 768px) {
    left: 20px;
  }
`;

// A Linha Verde (Preenchimento Dinâmico)
const LineProgress = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  background-color: var(--green);
  transform: translateX(-50%);
  z-index: 1;
  height: 0; 
  transition: height 0.1s linear;
  box-shadow: 0 0 10px var(--green);

  @media (max-width: 768px) {
    left: 20px;
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
  margin-bottom: 100px;

  &:last-child {
    margin-bottom: 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 20px;
    left: 50%;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--navy);
    border: 3px solid var(--green);
    transform: translateX(-50%);
    z-index: 10;
    transition: var(--transition);

    @media (max-width: 768px) {
      left: 20px;
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 28px;
    height: 2px;
    width: 6%;
    background-color: var(--lightest-slate);
    opacity: 0.2;
    z-index: 0;

    @media (max-width: 1080px) {
      width: 4%;
    }
    @media (max-width: 768px) {
      display: none;
    }
  }

  /* --- ÍMPARES (Texto na Direita, Imagem na Esquerda) --- */
  &:nth-of-type(odd) {
    &::before {
      left: 50%;
    }

    .degree-content {
      grid-column: 7 / -1;
      text-align: left;
      padding-left: 40px;

      @media (max-width: 1080px) {
        grid-column: 6 / -1;
      }
      @media (max-width: 768px) {
        grid-column: 1 / -1;
        padding-left: 50px;
      }
    }
    
    .degree-image {
      /* --- CORREÇÃO AQUI --- */
      /* Antes estava 1 / 6 (5 colunas). Agora está 1 / 7 (6 colunas) */
      /* Isso iguala o tamanho com a imagem da direita */
      grid-column: 1 / 7; 
      
      text-align: right;
      padding-right: 20px; /* Pequeno respiro da linha central */

      @media (max-width: 768px) {
        display: none;
      }
    }
    
    .degree-tech-list {
      justify-content: flex-start;
    }
  }

  /* --- PARES (Texto na Esquerda, Imagem na Direita) --- */
  &:nth-of-type(even) {
    &::before {
      right: 50%;
    }

    .degree-content {
      grid-column: 1 / 7;
      text-align: right;
      padding-right: 40px;

      @media (max-width: 1080px) {
        grid-column: 1 / 7;
      }
      @media (max-width: 768px) {
        grid-column: 1 / -1;
        padding-left: 50px;
        text-align: left;
        padding-right: 0;
      }
    }
    
    .degree-image {
      /* Aqui já estava 7 / -1 (6 colunas). Mantemos igual. */
      grid-column: 7 / -1;
      
      text-align: left;
      padding-left: 20px; /* Pequeno respiro da linha central */

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

  /* --- Conteúdo Interno --- */

  .degree-content {
    position: relative;
    grid-row: 1 / -1;
  }

  .degree-overline {
    margin: 10px 0;
    color: var(--green);
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
  
  .degree-end {
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

    a {
      width: 100%;
      background-color: var(--green);
      border-radius: var(--border-radius);
      vertical-align: middle;
      display: block;

      &:hover,
      &:focus {
        background: transparent;
        &:before,
        .img {
          background: transparent;
          filter: none;
        }
      }

      &:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 3;
        transition: var(--transition);
        background-color: var(--navy);
        mix-blend-mode: screen;
      }
    }

    .img {
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1) brightness(90%);
    }
  }
`;

const AcademicFeatured = () => {
  const data = useStaticQuery(graphql`
    {
      degrees: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/academic/degrees/" } }
        sort: { fields: [frontmatter___date], order: ASC }
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

  // 2. USAR O HOOK
  const intl = useIntl();

  // 3. FILTRAR POR LÍNGUA
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