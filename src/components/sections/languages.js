import React, { useState, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import Globe from '../Globe'; // Verifique se o caminho está correto (Globe.js ou globe.js)
import { FormattedMessage, useIntl } from 'gatsby-plugin-intl';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledLanguagesSection = styled.section`
  max-width: 1000px;
  margin: 0 auto;
  padding: 100px 0;

  h2 {
    text-align: center;
    margin-bottom: 50px;
    color: var(--lightest-slate);
  }
`;

const StyledHeader = styled.h3`
  margin-bottom: 30px;
  text-align: center;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const CarouselContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 500px;
  overflow-y: auto;
  padding: 10px;
  
  /* Scrollbar bonita */
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: var(--navy); }
  &::-webkit-scrollbar-thumb { background: var(--dark-slate); border-radius: 10px; }
`;

const LanguageCard = styled.div`
  ${({ theme }) => theme.mixins.boxShadow};
  background: ${({ isActive }) => (isActive ? 'var(--light-navy)' : 'transparent')};
  border: 1px solid ${({ isActive }) => (isActive ? 'var(--accent)' : 'transparent')};
  padding: 15px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: flex-start; /* Alinha no topo para acomodar o botão */
  gap: 15px;

  &:hover {
    transform: translateY(-3px);
    background: var(--light-navy);
  }

  .flag {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--lightest-navy);
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    margin-top: 5px; /* Ajuste fino para alinhar com o título */
  }

  .info {
    display: flex;
    flex-direction: column;
    width: 100%;

    h3 {
      margin: 0;
      color: ${({ isActive }) => (isActive ? 'var(--accent)' : 'var(--lightest-slate)')};
      font-size: var(--fz-lg);
    }
    p {
      margin: 0 0 8px 0; /* Margem embaixo do nível */
      color: var(--light-slate);
      font-size: var(--fz-xs);
      font-family: var(--font-mono);
    }
  }
`;

// NOVO: Botão estilizado para a certificação
const CertButton = styled.a`
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--accent);
  background-color: transparent;
  border: 1px solid var(--accent);
  border-radius: var(--border-radius);
  padding: 5px 10px;
  text-decoration: none;
  width: fit-content;
  transition: var(--transition);
  margin-top: 2px;

  &:hover {
    background-color: var(--accent-tint);
    transform: translateY(-2px);
  }
`;

const CoursesWrapper = styled.div`
  margin-top: 70px;
`;

const CoursesHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;

  h4 {
    margin: 0;
    font-size: var(--fz-lg);
    color: var(--lightest-slate);
  }
`;

const CarouselNav = styled.div`
  display: flex;
  gap: 10px;
  flex-shrink: 0;
`;

const NavButton = styled.button`
  ${({ theme }) => theme.mixins.flexCenter};
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--lightest-navy);
  background: transparent;
  color: var(--lightest-slate);
  cursor: pointer;
  transition: var(--transition);

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    border-color: var(--accent);
    color: var(--accent);
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
`;

const CoursesTrack = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding: 0 10px;
  padding: 10px 10px 20px 10px;
  scroll-behavior: smooth;

  @media (prefers-reduced-motion: reduce) {
    scroll-behavior: auto;
  }

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: var(--navy);
  }
  &::-webkit-scrollbar-thumb {
    background: var(--dark-slate);
    border-radius: 10px;
  }
`;

const CourseCard = styled.div`
  ${({ theme }) => theme.mixins.boxShadow};
  position: relative;
  flex: 0 0 auto;
  width: min(80vw, 340px);
  scroll-snap-align: start;
  background: var(--light-navy);
  border: 1px solid var(--lightest-navy);
  border-radius: var(--border-radius);
  overflow: hidden;
  display: block;
  text-decoration: none;
  transition: var(--transition);

  @media (min-width: 600px) {
    width: 380px;
  }

  &:hover,
  &:focus-visible {
    transform: translateY(-6px);
    border-color: var(--accent);
    box-shadow: 0 20px 30px -15px var(--navy-shadow), 0 0 0 1px var(--accent-tint);
  }

  &:hover .course-image img,
  &:focus-visible .course-image img {
    transform: scale(1.06);
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .course-image {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: var(--navy);

    .gatsby-image-wrapper {
      width: 100%;
      height: 100%;
    }

    img {
      transition: transform 0.4s ease;
    }
  }

  .course-image-fallback {
    ${({ theme }) => theme.mixins.flexCenter};
    width: 100%;
    height: 100%;

    svg {
      width: 48px;
      height: 48px;
      color: var(--dark-slate);
    }
  }

  .course-pill {
    position: absolute;
    top: 12px;
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 20px;
    backdrop-filter: blur(6px);
  }

  .course-language-pill {
    left: 12px;
    color: var(--lightest-slate);
    background: rgba(2, 12, 27, 0.55);
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  .course-ongoing-pill {
    right: 12px;
    color: var(--accent);
    background: rgba(2, 12, 27, 0.55);
    border: 1px solid var(--accent);
  }

  .course-body {
    padding: 20px;
  }

  .course-name {
    margin: 0 0 6px;
    color: var(--lightest-slate);
    font-size: var(--fz-xl);
  }

  .course-level {
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--accent);
  }

  .course-dates {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--lightest-navy);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--light-slate);
  }

  .course-external {
    ${({ theme }) => theme.mixins.flexCenter};
    flex-shrink: 0;
    color: var(--light-slate);
    transition: var(--transition);

    svg {
      width: 16px;
      height: 16px;
    }
  }

  &:hover .course-external,
  &:focus-visible .course-external {
    color: var(--accent);
  }
`;

const Languages = () => {
  const data = useStaticQuery(graphql`
    {
      institutesData: markdownRemark(
        fileAbsolutePath: { regex: "/content/academic/institutes/index.md/" }
      ) {
        frontmatter {
          institutes {
            name
            language
            level
            url
            start(formatString: "YYYY-MM-DD")
            end(formatString: "YYYY-MM-DD")
            image {
              childImageSharp {
                gatsbyImageData(
                  layout: FULL_WIDTH
                  aspectRatio: 1.33
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                  quality: 85
                )
              }
            }
          }
        }
      }
    }
  `);

  const intl = useIntl();
  const prefersReducedMotion = usePrefersReducedMotion();
  const trackRef = useRef(null);
  const [activeId, setActiveId] = useState('pt');

  const institutes = data.institutesData?.frontmatter?.institutes || [];
  const dateLocale = intl.locale === 'pt' ? 'pt-BR' : 'en-US';
  const presentLabel = intl.formatMessage({ id: 'academic_languages_present' });

  const formatDate = isoDate => {
    if (!isoDate) return null;
    return new Intl.DateTimeFormat(dateLocale, { month: 'short', year: 'numeric' }).format(
      new Date(isoDate)
    );
  };

  const scrollCourses = direction => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('[data-course-card]');
    const step = card ? card.offsetWidth + 20 : 280;
    track.scrollBy({ left: direction * step, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };
  const portuguese = intl.formatMessage({ id: 'academic_languages_portuguese' });
  const english = intl.formatMessage({ id: 'academic_languages_english' });
  const spanish = intl.formatMessage({ id: 'academic_languages_spanish' });
  // const chinese = intl.formatMessage({ id: 'academic_languages_chinese' });
  // const france = intl.formatMessage({ id: 'academic_languages_france' });

  const portugueseLevel = intl.formatMessage({ id: 'academic_languages_portuguese_level' });
  const englishLevel = intl.formatMessage({ id: 'academic_languages_english_level' });
  const spanishLevel = intl.formatMessage({ id: 'academic_languages_spanish_level' });
  // const chineseLevel = intl.formatMessage({ id: 'academic_languages_chinese_level' });
  // const franceLevel = intl.formatMessage({ id: 'academic_languages_france_level' });
  
  const LANGUAGES = [
    { 
      id: 'pt',
      name: portuguese,
      level: portugueseLevel,
      code: 'br',
      coords: [-46.6, -23.5], // São Paulo
    },
    { 
      id: 'en',
      name: english,
      level: englishLevel,
      code: 'us',
      coords: [-71.0, 42.3], // Boston/Harvard
      certification: 'https://media.licdn.com/dms/image/v2/D4D2DAQFRCxVrfXTt8Q/profile-treasury-document-images_1920/B4DZuQ0ZLRHwAs-/1/1767661213770?e=1771459200&v=beta&t=IaFGbQkI-BS-CcAWLXbr1DQQ6l9ivlhvyEsBsRPdCuU'
    },
    {
      id: 'es',
      name: spanish,
      level: spanishLevel,
      code: 'es',
      coords: [-3.7, 40.4], // Madrid
    },
    // { 
    //   id: 'zh',
    //   name: chinese,
    //   level: chineseLevel,
    //   code: 'cn',
    //   coords: [116.4, 39.9] // Pequim
    // },
    // { 
    //   id: 'fr',
    //   name: france,
    //   level: franceLevel,
    //   code: 'fr',
    //   coords: [2.3, 48.8] // Paris
    // },
  ];

  // Encontra o objeto da língua ativa para passar as coordenadas
  const activeLang = LANGUAGES.find(lang => lang.id === activeId);

  return (
    <StyledLanguagesSection id="languages">
      <StyledHeader>
        <FormattedMessage id="academic_languages_heading" defaultMessage="Languages" />
      </StyledHeader>

      <ContentGrid>
        {/* O Globo fica na esquerda e recebe as coordenadas alvo */}
        <div style={{ width: '100%', minHeight: '500px' }}>
          <Globe targetCoords={activeLang ? activeLang.coords : null} />
        </div>

        {/* Lista de Idiomas na direita */}
        <CarouselContainer>
          {LANGUAGES.map((lang) => (
            <LanguageCard 
              key={lang.id} 
              isActive={activeId === lang.id}
              onClick={() => setActiveId(lang.id)}
            >
              <img 
                className="flag"
                src={`https://flagcdn.com/w80/${lang.code}.png`} 
                alt={lang.name} 
              />
              <div className="info">
                <h3>{lang.name}</h3>
                <p>{lang.level}</p>

                {/* LOGICA DO BOTÃO: Só aparece se certification existir */}
                {lang.certification && (
                  <CertButton 
                    href={lang.certification} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // Evita que clicar no botão ative o card novamente
                  >
                    <FormattedMessage id="academic_languages_certification" defaultMessage="View Certification" />
                  </CertButton>
                )}
              </div>
            </LanguageCard>
          ))}
        </CarouselContainer>
      </ContentGrid>

      {institutes.length > 0 && (
        <CoursesWrapper>
          <CoursesHeaderRow>
            <h4>
              <FormattedMessage
                id="academic_languages_courses_heading"
                defaultMessage="Language Courses"
              />
            </h4>
            <CarouselNav>
              <NavButton
                type="button"
                aria-label={intl.formatMessage({ id: 'academic_languages_carousel_prev' })}
                onClick={() => scrollCourses(-1)}>
                <Icon name="ChevronLeft" />
              </NavButton>
              <NavButton
                type="button"
                aria-label={intl.formatMessage({ id: 'academic_languages_carousel_next' })}
                onClick={() => scrollCourses(1)}>
                <Icon name="ChevronRight" />
              </NavButton>
            </CarouselNav>
          </CoursesHeaderRow>

          <CoursesTrack ref={trackRef}>
            {institutes.map((course, i) => {
              const { name, language, level, url, start, end, image } = course;
              const courseImage = image ? getImage(image) : null;
              const startLabel = formatDate(start);
              const isOngoing = !end;
              const dateRangeLabel = isOngoing
                ? intl.formatMessage({ id: 'academic_languages_since' }, { date: startLabel })
                : `${startLabel} — ${formatDate(end)}`;

              return (
                <CourseCard
                  key={i}
                  data-course-card
                  {...(url ? { as: 'a', href: url, target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <div className="course-image">
                    {courseImage ? (
                      <GatsbyImage image={courseImage} alt={name} />
                    ) : (
                      <div className="course-image-fallback">
                        <Icon name="Bookmark" />
                      </div>
                    )}
                    {language && <span className="course-pill course-language-pill">{language}</span>}
                    {isOngoing && (
                      <span className="course-pill course-ongoing-pill">{presentLabel}</span>
                    )}
                  </div>

                  <div className="course-body">
                    <h3 className="course-name">{name}</h3>
                    {level && <span className="course-level">{level}</span>}

                    <div className="course-dates">
                      <span>{dateRangeLabel}</span>
                      {url && (
                        <span className="course-external" aria-hidden="true">
                          <Icon name="External" />
                        </span>
                      )}
                    </div>
                  </div>
                </CourseCard>
              );
            })}
          </CoursesTrack>
        </CoursesWrapper>
      )}
    </StyledLanguagesSection>
  );
};

export default Languages;