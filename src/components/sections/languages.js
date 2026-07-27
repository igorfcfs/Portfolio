import React, { useState } from 'react';
import styled from 'styled-components';
import Globe from '../Globe'; // Verifique se o caminho está correto (Globe.js ou globe.js)
import { FormattedMessage, useIntl } from 'gatsby-plugin-intl';

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
  border: 1px solid ${({ isActive }) => (isActive ? 'var(--green)' : 'transparent')};
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
      color: ${({ isActive }) => (isActive ? 'var(--green)' : 'var(--lightest-slate)')};
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
  color: var(--green);
  background-color: transparent;
  border: 1px solid var(--green);
  border-radius: var(--border-radius);
  padding: 5px 10px;
  text-decoration: none;
  width: fit-content;
  transition: var(--transition);
  margin-top: 2px;

  &:hover {
    background-color: var(--green-tint);
    transform: translateY(-2px);
  }
`;

const Languages = () => {
  const intl = useIntl();
  const [activeId, setActiveId] = useState('pt');
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
    </StyledLanguagesSection>
  );
};

export default Languages;