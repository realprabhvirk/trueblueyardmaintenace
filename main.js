/*
 * True Blue Yard Maintenance site script.
 * No contact form handling, no fetch calls, no backend. Contact is click to call, text, email and socials only.
 */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    /* Current page in nav */
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-nav a').forEach(function (a) {
      if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
    });

    /* Mobile nav */
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (toggle && nav) {
      var setOpen = function (open, returnFocus) {
        nav.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (!open && returnFocus) toggle.focus();
      };
      toggle.addEventListener('click', function () {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false, true);
      });
      document.addEventListener('click', function (e) {
        if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
      });
    }

    /* Smooth scroll for on-page anchors */
    if (!reduce) {
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          var id = a.getAttribute('href').slice(1);
          var t = id && document.getElementById(id);
          if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
        });
      });
    }

    /* Reveal and stripe wipe */
    var reveals = document.querySelectorAll('.reveal');
    var stripes = document.querySelectorAll('.stripes');
    if (reduce || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
      stripes.forEach(function (el) { el.classList.add('is-drawn'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      reveals.forEach(function (el) { io.observe(el); });
      var so = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.stripeEl.classList.add('is-drawn'); so.unobserve(en.target); }
        });
      }, { threshold: 0.05 });
      /* Observe the parent: a clipped element reports zero intersection. */
      stripes.forEach(function (el) { el.parentNode.stripeEl = el; so.observe(el.parentNode); });
    }

    /* Lightbox */
    var links = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
    if (links.length) {
      var box = document.createElement('div');
      box.className = 'lightbox';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.setAttribute('aria-label', 'Photo viewer');
      box.innerHTML = '<button type="button" class="lb-close" aria-label="Close photo">&times;</button>' +
        '<button type="button" class="lb-prev" aria-label="Previous photo">&lsaquo;</button>' +
        '<img alt="">' +
        '<button type="button" class="lb-next" aria-label="Next photo">&rsaquo;</button>';
      document.body.appendChild(box);
      var img = box.querySelector('img');
      var btns = box.querySelectorAll('button');
      var idx = 0, opener = null;
      var show = function (i) {
        idx = (i + links.length) % links.length;
        var thumb = links[idx].querySelector('img');
        img.src = links[idx].getAttribute('href');
        img.alt = thumb ? thumb.alt : '';
      };
      var open = function (i, from) { opener = from; show(i); box.classList.add('is-open'); btns[0].focus(); };
      var close = function () { box.classList.remove('is-open'); if (opener) opener.focus(); };
      links.forEach(function (a, i) {
        a.addEventListener('click', function (e) { e.preventDefault(); open(i, a); });
      });
      btns[0].addEventListener('click', close);
      btns[1].addEventListener('click', function () { show(idx - 1); });
      btns[2].addEventListener('click', function () { show(idx + 1); });
      box.addEventListener('click', function (e) { if (e.target === box) close(); });
      document.addEventListener('keydown', function (e) {
        if (!box.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') show(idx - 1);
        else if (e.key === 'ArrowRight') show(idx + 1);
        else if (e.key === 'Tab') {
          var first = btns[0], last = btns[2];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }
  });
})();
