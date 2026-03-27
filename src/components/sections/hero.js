import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
// 1. Importar o componente de tradução
import { FormattedMessage } from 'gatsby-plugin-intl';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  // 2. Traduções simples
  const one = (
    <h1>
      <FormattedMessage id="hero_greeting" defaultMessage="Hi, my name is" />
    </h1>
  );
  const two = (
    <h2 className="big-heading">
      <FormattedMessage id="hero_name" defaultMessage="Igor Fernando Casita." />
    </h2>
  );
  const three = (
    <h3 className="big-heading">
      <FormattedMessage id="hero_subtitle" defaultMessage="Junior Full-Stack Software Developer." />
    </h3>
  );

  // 3. Tradução complexa com injeção de HTML (Negrito e quebra de linha)
  const four = (
    <>
      <p>
        <FormattedMessage
          id="hero_description"
          values={{
            java: <strong>Java (Spring Boot)</strong>,
            node: <strong>JavaScript/TypeScript (Node.js + Express)</strong>,
            python: <strong>Python (Django)</strong>,
            postgres: <strong>PostgreSQL</strong>,
            docker: <strong>Docker</strong>,
            swagger: <strong>Swagger/OpenAPI</strong>,
            react: <strong>React (DOM & Native)</strong>,
            usp: <strong>USP</strong>,
            br: <><br /></>, // Injeção da quebra de linha
          }}
        />
      </p>
    </>
  );

  const items = [one, two, three, four];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;