import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
import { FormattedMessage } from 'gatsby-plugin-intl';

const StyledCertSection = styled.section`
  max-width: 800px;
  margin: 0 auto;
  padding: 100px 0;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
    margin-bottom: 50px;
    text-align: center;
  }
`;

const StyledCertList = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  display: grid;
  grid-gap: 20px;
`;

const StyledCertItem = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  grid-gap: 20px;
  background-color: var(--light-navy);
  padding: 20px 25px;
  border-radius: var(--border-radius);
  transition: var(--transition);
  border: 1px solid var(--light-navy);

  &:hover {
    transform: translateY(-5px);
    border: 1px solid var(--green);
    box-shadow: 0 10px 30px -15px var(--navy-shadow);

    .cert-icon {
      color: var(--green);
    }
  }

  /* Responsividade: Vira bloco no mobile */
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    grid-gap: 10px;
    text-align: center;
  }

  .cert-icon {
    color: var(--light-slate);
    transition: var(--transition);
    
    svg {
      width: 40px;
      height: 40px;
    }

    @media (max-width: 600px) {
      margin: 0 auto;
    }
  }

  .cert-content {
    display: flex;
    flex-direction: column;

    .title {
      color: var(--lightest-slate);
      font-size: var(--fz-lg);
      font-weight: 600;
      margin-bottom: 5px;
    }

    .code {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      background: rgba(100, 255, 218, 0.1);
      padding: 2px 8px;
      border-radius: 4px;
      width: fit-content;

      @media (max-width: 600px) {
        margin: 0 auto;
      }
    }

    .provider {
      color: var(--slate);
      font-size: var(--fz-sm);
      margin-top: 5px;
    }
  }

  .cert-meta {
    text-align: right;

    @media (max-width: 600px) {
      text-align: center;
      margin-top: 10px;
      border-top: 1px solid var(--lightest-navy);
      padding-top: 10px;
    }

    .year {
      font-family: var(--font-mono);
      font-size: var(--fz-lg);
      color: var(--light-slate);
    }

    .icon-link {
      margin-top: 5px;
      display: block;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  /* Link que cobre todo o card para clique */
  .full-link {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
`;

const AcademicGrid = () => {
  const data = useStaticQuery(graphql`
    query {
      certifications: markdownRemark(
        fileAbsolutePath: { regex: "/content/academic/certifications/index.md/" }
      ) {
        frontmatter {
          certifications {
            name
            code
            year
            provider
            url
          }
        }
      }
    }
  `);

  const { certifications } = data.certifications.frontmatter;
  const revealTitle = useRef(null);
  const revealCerts = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    sr.reveal(revealTitle.current, srConfig());
    revealCerts.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  return (
    <StyledCertSection>
      <h2 ref={revealTitle}><FormattedMessage id="academic_grid_heading" defaultMessage="Professional Certifications" /></h2>

      <StyledCertList>
        {certifications &&
          certifications.map((cert, i) => {
            const { name, code, year, provider, url } = cert;

            return (
              <StyledCertItem key={i} ref={el => (revealCerts.current[i] = el)}>
                {url && <a href={url} className="full-link" aria-label="Certificate Link" target="_blank" rel="noreferrer" />}
                
                <div className="cert-icon">
                  {/* Ícone de Medalha ou Bookmark */}
                  <Icon name="Bookmark" /> 
                </div>

                <div className="cert-content">
                  <span className="title">{name}</span>
                  <div className="provider">{provider}</div>
                  <span className="code">{code}</span>
                </div>

                <div className="cert-meta">
                  <div className="year">{year}</div>
                  {url && (
                    <div className="icon-link">
                      <Icon name="External" />
                    </div>
                  )}
                </div>
              </StyledCertItem>
            );
          })}
      </StyledCertList>
    </StyledCertSection>
  );
};

export default AcademicGrid;