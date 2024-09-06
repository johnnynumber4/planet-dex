'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, CssBaseline, Drawer, IconButton, Backdrop, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Inter } from "next/font/google";
import NavBar from "./NavBar"; // Adjust the path if necessary
import AuthButton from "../components/AuthButton"; // Import AuthButton
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider

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
        <SessionProvider>
          <CssBaseline />
          <Box sx={{ display: 'flex' }}>
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
                <Link href="/" passHref>
                  <Typography variant="h6" noWrap sx={{ textDecoration: 'none', color: 'none' }}>
                    Planet Dex
                  </Typography>
                </Link>
                {/* Add AuthButton for login/logout */}
                <Box sx={{ flexGrow: 1 }} />
                <AuthButton /> {/* Added AuthButton here */}
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
                marginTop: 8,
              }}
            >
              {children}
            </Box>
          </Box>
        </SessionProvider>
      </body>
    </html>
  );
}
