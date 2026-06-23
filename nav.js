/**
 * nav.js — Responsive hamburger menu toggle
 * Handles open/close, aria-expanded state, and keyboard (Escape) dismissal.
 */
(function () {
  'use strict';

  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!toggle || !navLinks) return;

  function openMenu() {
    navLinks.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    navLinks.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });

  // Close when a nav link is clicked (useful on single-page or same-page navigation)
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });
}());
