import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { FormattedMessage } from 'gatsby-plugin-intl';

// --- STYLES ---

const StyledSection = styled.div`
  max-width: 800px;
  margin: 100px auto 0;
`;

const StyledHeader = styled.h3`
  margin-bottom: 30px;
  text-align: center;
`;

const StyledAccordion = styled.div`
  border-bottom: 1px solid var(--lightest-navy);
`;

const AccordionItem = styled.div`
  border-top: 1px solid var(--lightest-navy);
`;

const AccordionHeader = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: var(--transition);

  &:hover,
  &:focus {
    background-color: var(--light-navy);
    color: var(--accent);
  }

  .year-title {
    font-size: var(--fz-xl);
    font-weight: 600;
    color: var(--lightest-slate);
    font-family: var(--font-mono);
  }

  .icon-container {
    margin-left: 20px;
    color: var(--accent);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    /* Roda 90 graus quando aberto */
    transform: ${({ isOpen }) => (isOpen ? 'rotate(90deg)' : 'rotate(0deg)')};
  }
`;

const AccordionContent = styled.div`
  max-height: ${({ isOpen }) => (isOpen ? '2000px' : '0')}; /* Valor alto para garantir que lista longa caiba */
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: var(--light-navy);
`;

const CourseList = styled.ul`
  ${({ theme }) => theme.mixins.resetList};
  padding: 20px 30px;
`;

const CourseItem = styled.li`
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid var(--navy);
  font-size: var(--fz-sm);
  color: var(--light-slate);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .provider {
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .title {
    color: var(--lightest-slate);
    font-weight: 500;
  }

  .duration {
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    opacity: 0.7;
    text-align: right;
    
    @media (max-width: 600px) {
      text-align: left;
    }
  }
`;

// --- Ícone de Seta (SVG SVG inline para garantir que funcione sem dependências) ---
const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

// --- COMPONENT ---

const AcademicCourses = () => {
  // Query GraphQL lendo o arquivo index.md específico
  const data = useStaticQuery(graphql`
    query {
      coursesData: markdownRemark(fileAbsolutePath: { regex: "/content/academic/courses/index.md/" }) {
        frontmatter {
          courses_list {
            year
            items {
              title
              provider
              duration
            }
          }
        }
      }
    }
  `);

  const { courses_list } = data.coursesData.frontmatter;
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  
  // Estado para controlar qual ano está aberto (Começa com o primeiro aberto = índice 0)
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const toggleAccordion = (index) => {
    // Se clicar no que já está aberto, fecha (null). Se não, abre o novo.
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <StyledSection ref={revealContainer}>
      <StyledHeader><FormattedMessage id="academic_courses_heading" defaultMessage="Relevant Coursework" /></StyledHeader>

      <StyledAccordion>
        {courses_list && courses_list.map((group, i) => {
          const isOpen = openIndex === i;

          return (
            <AccordionItem key={i}>
              <AccordionHeader onClick={() => toggleAccordion(i)} isOpen={isOpen}>
                <span className="year-title">{group.year}</span>
                <div className="icon-container">
                  <ArrowIcon />
                </div>
              </AccordionHeader>

              <AccordionContent isOpen={isOpen}>
                <CourseList>
                  {group.items && group.items.map((course, j) => (
                    <CourseItem key={j}>
                      <span className="provider">{course.provider}</span>
                      <span className="title">{course.title}</span>
                      <span className="duration">{course.duration}</span>
                    </CourseItem>
                  ))}
                </CourseList>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </StyledAccordion>
    </StyledSection>
  );
};

export default AcademicCourses;