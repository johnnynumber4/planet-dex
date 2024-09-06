import React from 'react';
import Link from 'next/link';
import { List, ListItem, ListItemText } from '@mui/material';

const NavBar = ({ toggleMobileMenu }) => {
  return (
    <List>
      <ListItem component="div" onClick={toggleMobileMenu}>
        <Link legacyBehavior href="/" passHref>
          <a>
            <ListItemText primary="Home" />
          </a>
        </Link>
      </ListItem>
      <ListItem component="div" onClick={toggleMobileMenu}>
        <Link legacyBehavior href="/planets" passHref>
          <a>
            <ListItemText primary="Planets" />
          </a>
        </Link>
      </ListItem>
      <ListItem component="div" onClick={toggleMobileMenu}>
        <Link legacyBehavior href="/projects" passHref>
          <a>
            <ListItemText primary="Projects" />
          </a>
        </Link>
      </ListItem>
      <ListItem component="div" onClick={toggleMobileMenu}>
        <Link legacyBehavior href="/tasks" passHref>
          <a>
            <ListItemText primary="Tasks" />
          </a>
        </Link>
      </ListItem>
      <ListItem component="div" onClick={toggleMobileMenu}>
        <Link legacyBehavior href="/calendar" passHref>
          <a>
            <ListItemText primary="Calendar" />
          </a>
        </Link>
      </ListItem>
      <ListItem component="div" onClick={toggleMobileMenu}>
        <Link legacyBehavior href="/board" passHref>
          <a>
            <ListItemText primary="Mission Control" />
          </a>
        </Link>
      </ListItem>
    </List>
  );
};

export default NavBar;
