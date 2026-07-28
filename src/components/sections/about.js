import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
// 1. Importar o componente de tradução
import { FormattedMessage } from 'gatsby-plugin-intl';
import Skills from './skills';
import AsciiFlag from '../ascii-flag';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;
const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--accent);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;
const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    background-color: var(--light-navy);
    transition: var(--transition);

    &:before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 12px;
      border: 2px solid var(--accent);
      opacity: 0;
      transform: scale(0.96);
      transition: var(--transition);
      z-index: 2;
      pointer-events: none;
    }

    &:hover,
    &:focus-within {
      outline: 0;
      transform: translateY(-6px);
      box-shadow: 0 30px 40px -20px var(--navy-shadow), 0 0 0 4px var(--accent-tint);

      &:before {
        opacity: 1;
        transform: scale(1);
      }

      .img {
        filter: none;
      }
    }

    .img {
      position: relative;
      display: block;
      border-radius: 12px;
      filter: grayscale(20%) contrast(1.02);
      transition: var(--transition);
    }
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const skills = [
    'Java (Spring Boot)',
    'Node.js & Express',
    'REST APIs',
    'PostgreSQL & Docker',
    'JWT & Spring Security',
    'React (DOM & Native)',
    'Swagger / OpenAPI',
    'Python (Automation)',
  ];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">
        <FormattedMessage id="about_heading" defaultMessage="About Me" />
      </h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              <FormattedMessage id="about_p1" />
            </p>

            <p>
              <FormattedMessage id="about_p2" />{' '}
              <a href="https://etects.cps.sp.gov.br/">
                <FormattedMessage id="about_p2_link" />
              </a>.{' '}
              <FormattedMessage id="about_p2_end" />
            </p>

            <p>
              <FormattedMessage id="about_p3" />
            </p>
          </div>

          <ul className="skills-list">
            {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/me.png"
              width={500}
              quality={95}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Headshot"
            />
          </div>

          <AsciiFlag />
        </StyledPic>
      </div>

      <Skills />
    </StyledAboutSection>
  );
};

export default About;