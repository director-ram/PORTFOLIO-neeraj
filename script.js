document.addEventListener('DOMContentLoaded', function () {
  // Enhanced scroll performance with throttling
  let scrollTimeoutId = null;
  let isScrolling = false;
  const scrollingClass = 'is-scrolling';
  
  // Throttled scroll handler for better performance
  const handleScroll = () => {
    if (!isScrolling) {
      document.body.classList.add(scrollingClass);
      isScrolling = true;
    }
    
    if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
    scrollTimeoutId = setTimeout(() => {
      document.body.classList.remove(scrollingClass);
      isScrolling = false;
    }, 150);
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Optimize animations with Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.willChange = 'transform, opacity';
      } else {
        entry.target.style.willChange = 'auto';
      }
    });
  }, observerOptions);
  
  // Observe animated elements
  document.querySelectorAll('.card, .project, .skills-list .skill, .photo, .timeline-item').forEach(el => {
    animationObserver.observe(el);
  });

  // Reveal sections and projects
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('section, .project').forEach(el => revealObserver.observe(el));

  // Prepare skill chips animation
  const skillChips = document.querySelectorAll('.skills-list .skill');
  skillChips.forEach(chip => {
    chip.style.opacity = '0.18';
    chip.style.transform = 'translateY(12px) scale(0.98)';
    chip.style.transition = 'transform 480ms cubic-bezier(.2,.9,.2,1), opacity 420ms ease';
    chip.style.display = 'inline-block';
  });

  // Observe the contact card or skills area to animate skill chips
  const skillsArea = document.querySelector('.contact-card') || document.querySelector('.skills-list');
  if (skillsArea) {
    const skillsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillChips.forEach((chip, i) => {
            setTimeout(() => {
              chip.style.opacity = '1';
              chip.style.transform = 'translateY(0) scale(1)';
            }, i * 120);
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    skillsObserver.observe(skillsArea);
  }

  // Animate .skill-fill elements when skills area enters view
  const skillFills = document.querySelectorAll('.skill-fill[data-percent]');
  if (skillFills.length) {
    const skillsNode = document.querySelector('.contact-card');
    if (skillsNode) {
      const sfObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            skillFills.forEach((el, i) => {
              const pct = el.getAttribute('data-percent');
              setTimeout(() => {
                el.style.width = pct;
                el.classList.add('animate');
              }, i * 180);
            });
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.22 });
      sfObserver.observe(skillsNode);
    } else {
      // fallback: animate immediately
      skillFills.forEach(el => el.style.width = el.getAttribute('data-percent'));
    }
  }

  // Back to top button (created dynamically so you don't need to change HTML)
  const backBtn = document.createElement('button');
  backBtn.id = 'backToTop';
  backBtn.setAttribute('aria-label', 'Back to top');
  backBtn.textContent = '↑';
  document.body.appendChild(backBtn);

  // Basic styles for the injected button (keeps inline so CSS changes still apply)
  Object.assign(backBtn.style, {
    position: 'fixed',
    right: '24px',
    bottom: '24px',
    padding: '10px 14px',
    borderRadius: '50%',
    display: 'none',
    background: '#4facfe',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    zIndex: 1200,
    boxShadow: '0 8px 30px rgba(0,0,0,0.35)'
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 320) backBtn.style.display = 'block'; else backBtn.style.display = 'none';
  }, { passive: true });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  backBtn.setAttribute('title', 'Back to top');
  backBtn.setAttribute('aria-hidden', 'false');

  // Optimized skill level hover animations
  const skillItems = document.querySelectorAll('.skill');
  skillItems.forEach(skill => {
    const skillFill = skill.querySelector('.skill-fill');
    const skillLabel = skill.querySelector('.skill-label');
    
    // Only proceed if skillFill exists (for skill level items)
    if (skillFill && skillLabel) {
      // Use requestAnimationFrame for smoother animations
      skill.addEventListener('mouseenter', () => {
        if (!document.body.classList.contains(scrollingClass)) {
          requestAnimationFrame(() => {
            const percent = skillFill.getAttribute('data-percent');
            skillFill.style.width = percent;
            skillFill.style.background = 'linear-gradient(90deg, #ff4444, #ff6666)';
          });
        }
      });
      
      skill.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
          skillFill.style.width = '0%';
          skillFill.style.background = 'linear-gradient(90deg,var(--accent-1),var(--accent-2))';
        });
      });
    }
  });

});
