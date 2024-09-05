'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, CssBaseline, Drawer, IconButton, Backdrop, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Inter } from "next/font/google";
import NavBar from "./NavBar"; // Adjust the path if necessary

const inter = Inter({ subsets: ["latin"] });

const drawerWidth = 250;

export default function RootLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          {/* Top Bar */}
          <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleMobileMenu}
                sx={{ display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Planet Dex
              </Typography>
              {/* Placeholder for user menu */}
              <Box sx={{ flexGrow: 1 }} />
            </Toolbar>
          </AppBar>

          {/* Sidebar */}
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
              display: { xs: 'none', md: 'block' },
            }}
            open
          >
            <Toolbar />
            <NavBar />
          </Drawer>

          {/* Mobile Sidebar */}
          <Drawer
            variant="temporary"
            anchor="left"
            open={isMobileMenuOpen}
            onClose={toggleMobileMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#333', color: 'white' },
            }}
          >
            <IconButton onClick={toggleMobileMenu} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
            <NavBar toggleMobileMenu={toggleMobileMenu} />
          </Drawer>

          {/* Backdrop for mobile */}
          <Backdrop
            open={isMobileMenuOpen}
            onClick={toggleMobileMenu}
            sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}
          />

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              // ml: { md: `${drawerWidth}px` },
              marginTop: 8,
            }}
          >
            {children}
          </Box>
        </Box>
      </body>
    </html>
  );
}
