import React from 'react';
import Link from 'next/link';
import { List, ListItem, ListItemText } from '@mui/material';

const NavBar = ({ toggleMobileMenu }) => {
  return (
    <List>
      <ListItem button component={Link} href="/" onClick={toggleMobileMenu}>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} href="/planets" onClick={toggleMobileMenu}>
        <ListItemText primary="Planets" />
      </ListItem>
      <ListItem button component={Link} href="/projects" onClick={toggleMobileMenu}>
        <ListItemText primary="Projects" />
      </ListItem>
      <ListItem button component={Link} href="/tasks" onClick={toggleMobileMenu}>
        <ListItemText primary="Tasks" />
      </ListItem>
      <ListItem button component={Link} href="/calendar" onClick={toggleMobileMenu}>
        <ListItemText primary="Calendar" />
      </ListItem>
      <ListItem button component={Link} href="/board" onClick={toggleMobileMenu}>
        <ListItemText primary="Mission Control" />
      </ListItem>
    </List>
  );
};

export default NavBar;
