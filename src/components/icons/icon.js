import React from 'react';
import PropTypes from 'prop-types';
import {
  IconAppStore,
  IconBookmark,
  IconChevronLeft,
  IconChevronRight,
  IconCodepen,
  IconExternal,
  IconFolder,
  IconFork,
  IconGitHub,
  IconIEEE,
  IconInstagram,
  IconLinkedin,
  IconLattes,
  IconOrcid,
  IconWhatsapp,
  IconLoader,
  IconLogo,
  IconPlayStore,
  IconStar,
  IconTwitter,
} from '@components/icons';

const Icon = ({ name }) => {
  switch (name) {
    case 'AppStore':
      return <IconAppStore />;
    case 'Bookmark':
      return <IconBookmark />;
    case 'ChevronLeft':
      return <IconChevronLeft />;
    case 'ChevronRight':
      return <IconChevronRight />;
    case 'Codepen':
      return <IconCodepen />;
    case 'External':
      return <IconExternal />;
    case 'Folder':
      return <IconFolder />;
    case 'Fork':
      return <IconFork />;
    case 'GitHub':
      return <IconGitHub />;
    case 'Instagram':
      return <IconInstagram />;
    case 'Linkedin':
      return <IconLinkedin />;
    case 'Lattes':
      return <IconLattes />;
    case 'Orcid':
      return <IconOrcid />;
    case 'IEEE':
      return <IconIEEE />;
    case 'Whatsapp':
      return <IconWhatsapp />;
    case 'Loader':
      return <IconLoader />;
    case 'Logo':
      return <IconLogo />;
    case 'PlayStore':
      return <IconPlayStore />;
    case 'Star':
      return <IconStar />;
    case 'Twitter':
      return <IconTwitter />;
    default:
      return <IconExternal />;
  }
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Icon;
