/* =========================================================
   ANAM TECH ACADEMY — MAIN SCRIPT
   Vanilla JavaScript only. Organized by feature for viva clarity.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. HEADER SCROLL EFFECT ---------- */
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    handleBackToTop();
  });

  /* ---------- 2. MOBILE HAMBURGER MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');

  hamburger.addEventListener('click', function () {
    const isOpen = mainNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu after clicking a nav link (mobile)
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 3. DARK MODE TOGGLE (localStorage) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('ata-theme');

  if (savedTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    themeToggle.setAttribute('aria-pressed', 'true');
  }

  themeToggle.addEventListener('click', function () {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem('ata-theme', 'light');
      themeToggle.setAttribute('aria-pressed', 'false');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('ata-theme', 'dark');
      themeToggle.setAttribute('aria-pressed', 'true');
    }
  });

  /* ---------- 4. ANIMATED STAT COUNTERS ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsSection = document.getElementById('stats');
  let statsAnimated = false;

  function animateStats() {
    statNumbers.forEach(function (el) {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const duration = 1400;
      const stepTime = 16;
      const steps = duration / stepTime;
      const increment = target / steps;

      const timer = setInterval(function () {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
      }, stepTime);
    });
  }

  const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateStats();
      }
    });
  }, { threshold: 0.4 });

  if (statsSection) statsObserver.observe(statsSection);

  /* ---------- 5. SCROLL REVEAL (About + generic) ---------- */
  const revealEls = document.querySelectorAll('.reveal-scroll');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- 6. COURSE SEARCH + FILTER ---------- */
  const courseSearch = document.getElementById('courseSearch');
  const filterPills = document.querySelectorAll('.pill');
  const courseCards = document.querySelectorAll('.course-card');
  const noResults = document.getElementById('noResults');
  let activeFilter = 'all';

  function applyCourseFilter() {
    const query = courseSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    courseCards.forEach(function (card) {
      const name = card.getAttribute('data-name');
      const categories = card.getAttribute('data-category');
      const matchesFilter = activeFilter === 'all' || categories.indexOf(activeFilter) !== -1;
      const matchesSearch = name.indexOf(query) !== -1;

      if (matchesFilter && matchesSearch) {
        card.classList.remove('hide');
        visibleCount++;
      } else {
        card.classList.add('hide');
      }
    });

    noResults.hidden = visibleCount !== 0;
  }

  courseSearch.addEventListener('input', applyCourseFilter);

  filterPills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      filterPills.forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');
      activeFilter = pill.getAttribute('data-filter');
      applyCourseFilter();
    });
  });

  /* ---------- 7. COURSE "LEARN MORE" MODAL ---------- */
  const courseModal = document.getElementById('courseModal');
  const courseModalTitle = document.getElementById('courseModalTitle');
  const courseModalBody = document.getElementById('courseModalBody');
  const courseModalClose = document.getElementById('courseModalClose');

  const courseDetails = {
    'Web Development': 'Learn HTML, CSS, JavaScript and how to build responsive, real-world websites from scratch through guided projects.',
    'Graphic Design': 'Master Canva and core design principles to create social media posts, logos and print-ready graphics.',
    'AI & Emerging Technology': 'Understand core AI concepts and practical tools you can apply immediately in study or work.',
    'Freelancing': 'Learn how to build a client-ready profile, pitch effectively and get your first paid projects online.',
    'Agentic AI & Automation': 'Design AI agents and automated workflows that understand goals, plan, and take action with minimal supervision.',
    'Data Analytics': 'Learn to clean, analyze and visualize data to support real decisions using practical, beginner-friendly tools.',
    'Cybersecurity': 'Build a foundation in protecting systems, accounts and data from common security threats.',
    'Digital Marketing': 'Learn social media, content and basic campaign strategy to grow a brand or business online.'
  };

  function openCourseModal(courseName) {
    courseModalTitle.textContent = courseName;
    courseModalBody.textContent = courseDetails[courseName] || 'More details coming soon.';
    courseModal.hidden = false;
    document.body.style.overflow = 'hidden'; // lock background scroll while modal is open
  }

  function closeCourseModal() {
    courseModal.hidden = true;
    document.body.style.overflow = ''; // restore scrolling so nothing stays blocked
  }

  document.querySelectorAll('[data-course-details]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openCourseModal(btn.getAttribute('data-course-details'));
    });
  });

  // Close on × button click/tap
  courseModalClose.addEventListener('click', closeCourseModal);

  // Close on click/tap outside the modal card
  courseModal.addEventListener('click', function (e) {
    if (e.target === courseModal) closeCourseModal();
  });

  // Close on Escape key (desktop)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !courseModal.hidden) closeCourseModal();
  });

  /* ---------- 8. TOAST NOTIFICATIONS ---------- */
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 3000);
  }

  /* ---------- 9. VALIDATION HELPERS ---------- */
  function setError(inputEl, errorEl, message) {
    if (message) {
      inputEl.classList.add('invalid');
      errorEl.textContent = message;
      return false;
    }
    inputEl.classList.remove('invalid');
    errorEl.textContent = '';
    return true;
  }

  /* ---------- 10. ADMISSION ELIGIBILITY CHECKER ---------- */
  const eligibilityForm = document.getElementById('eligibilityForm');
  const eligibilityResult = document.getElementById('eligibilityResult');

  function checkEligibility(name, marks, course) {
    // Simple, readable eligibility logic for viva explanation
    if (marks >= 70) {
      return { status: 'Direct Admission', type: 'success' };
    } else if (marks >= 50) {
      return { status: 'Eligible — Counselling Recommended', type: 'warning' };
    } else {
      return { status: 'Contact Admission Counsellor', type: 'info' };
    }
  }

  eligibilityForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameEl = document.getElementById('elgName');
    const marksEl = document.getElementById('elgMarks');
    const courseEl = document.getElementById('elgCourse');

    const name = nameEl.value.trim();
    const marks = marksEl.value.trim();
    const course = courseEl.value;

    let valid = true;
    valid = setError(nameEl, document.getElementById('elgNameError'), name === '' ? 'Name is required.' : '') && valid;
    valid = setError(marksEl, document.getElementById('elgMarksError'),
      marks === '' ? 'Marks are required.' : (marks < 0 || marks > 100 ? 'Marks must be between 0 and 100.' : '')) && valid;
    valid = setError(courseEl, document.getElementById('elgCourseError'), course === '' ? 'Please select a course.' : '') && valid;

    if (!valid) return;

    const result = checkEligibility(name, Number(marks), course);

    document.getElementById('resName').textContent = name;
    document.getElementById('resMarks').textContent = marks + '%';
    document.getElementById('resCourse').textContent = course;

    const statusEl = document.getElementById('resStatus');
    statusEl.textContent = result.status;
    statusEl.className = 'result-status status-' + result.type;

    eligibilityResult.hidden = false;
    eligibilityResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast('Eligibility checked successfully');
  });

  document.getElementById('printResultBtn').addEventListener('click', function () {
    window.print();
  });

  /* ---------- 11. ADMISSION APPLICATION FORM ---------- */
  const admissionForm = document.getElementById('admissionForm');
  const admissionResult = document.getElementById('admissionResult');

  admissionForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const fields = [
      { el: document.getElementById('admFullName'), err: document.getElementById('admFullNameError'), msg: 'Full name is required.' },
      { el: document.getElementById('admGuardian'), err: document.getElementById('admGuardianError'), msg: 'Guardian name is required.' },
      { el: document.getElementById('admCity'), err: document.getElementById('admCityError'), msg: 'City is required.' },
      { el: document.getElementById('admEducation'), err: document.getElementById('admEducationError'), msg: 'Please select education level.' },
      { el: document.getElementById('admCourse'), err: document.getElementById('admCourseError'), msg: 'Please select a course.' },
      { el: document.getElementById('admMode'), err: document.getElementById('admModeError'), msg: 'Please select a learning mode.' },
      { el: document.getElementById('admWhy'), err: document.getElementById('admWhyError'), msg: 'Please tell us why you want to join.' }
    ];

    let valid = true;
    fields.forEach(function (f) {
      valid = setError(f.el, f.err, f.el.value.trim() === '' ? f.msg : '') && valid;
    });

    const emailEl = document.getElementById('admEmail');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    valid = setError(emailEl, document.getElementById('admEmailError'),
      emailEl.value.trim() === '' ? 'Email is required.' : (!emailPattern.test(emailEl.value.trim()) ? 'Enter a valid email address.' : '')) && valid;

    const phoneEl = document.getElementById('admPhone');
    valid = setError(phoneEl, document.getElementById('admPhoneError'), phoneEl.value.trim() === '' ? 'Phone number is required.' : '') && valid;

    const ageEl = document.getElementById('admAge');
    valid = setError(ageEl, document.getElementById('admAgeError'),
      ageEl.value === '' ? 'Age is required.' : (ageEl.value < 10 || ageEl.value > 80 ? 'Enter a valid age.' : '')) && valid;

    const marksEl = document.getElementById('admMarks');
    valid = setError(marksEl, document.getElementById('admMarksError'),
      marksEl.value === '' ? 'Marks are required.' : (marksEl.value < 0 || marksEl.value > 100 ? 'Marks must be between 0 and 100.' : '')) && valid;

    const termsEl = document.getElementById('admTerms');
    valid = setError(termsEl, document.getElementById('admTermsError'), !termsEl.checked ? 'You must agree to the Terms & Conditions.' : '') && valid;

    if (!valid) return;

    document.getElementById('admResName').textContent = document.getElementById('admFullName').value.trim();
    document.getElementById('admResCourse').textContent = document.getElementById('admCourse').value;

    admissionResult.hidden = false;
    admissionForm.reset();
    admissionResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast('Application submitted successfully');
  });

  /* ---------- 12. FEE CALCULATOR ---------- */
  const feeForm = document.getElementById('feeForm');
  const feeResult = document.getElementById('feeResult');

  function calculateFee(monthlyFee, months) {
    const originalFee = monthlyFee * months;
    let discountPercent = 0;

    if (months >= 6) {
      discountPercent = 10;
    } else if (months >= 3) {
      discountPercent = 5;
    } else {
      discountPercent = 0;
    }

    const discountAmount = Math.round((originalFee * discountPercent) / 100);
    const finalFee = originalFee - discountAmount;

    return { originalFee, discountPercent, discountAmount, finalFee };
  }

  feeForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const courseEl = document.getElementById('feeCourse');
    const monthsEl = document.getElementById('feeMonths');
    const monthlyFee = Number(courseEl.value);
    const months = Number(monthsEl.value);

    const valid = setError(monthsEl, document.getElementById('feeMonthsError'),
      monthsEl.value === '' ? 'Enter number of months.' : (months < 1 || months > 24 ? 'Enter a value between 1 and 24.' : ''));

    if (!valid) return;

    const result = calculateFee(monthlyFee, months);

    document.getElementById('feeMonthly').textContent = 'Rs. ' + monthlyFee.toLocaleString();
    document.getElementById('feeMonthsOut').textContent = months;
    document.getElementById('feeOriginal').textContent = 'Rs. ' + result.originalFee.toLocaleString();
    document.getElementById('feeDiscountPct').textContent = result.discountPercent + '%';
    document.getElementById('feeDiscountAmt').textContent = 'Rs. ' + result.discountAmount.toLocaleString();
    document.getElementById('feeFinal').textContent = 'Rs. ' + result.finalFee.toLocaleString();

    feeResult.hidden = false;
    feeResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast('Fee calculated successfully');
  });

  /* ---------- 13. SCHOLARSHIP CHECKER ---------- */
  const scholarshipForm = document.getElementById('scholarshipForm');
  const scholarshipResult = document.getElementById('scholarshipResult');

  function checkScholarship(marks, income) {
    if (marks >= 80 && income < 50000) {
      return { text: 'Eligible for Merit + Need-Based Scholarship Review', type: 'success' };
    } else if (marks >= 70) {
      return { text: 'Eligible for Merit Scholarship Review', type: 'warning' };
    } else {
      return { text: 'Scholarship Counselling Recommended', type: 'info' };
    }
  }

  scholarshipForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const marksEl = document.getElementById('schMarks');
    const incomeEl = document.getElementById('schIncome');

    let valid = true;
    valid = setError(marksEl, document.getElementById('schMarksError'),
      marksEl.value === '' ? 'Marks are required.' : (marksEl.value < 0 || marksEl.value > 100 ? 'Marks must be between 0 and 100.' : '')) && valid;
    valid = setError(incomeEl, document.getElementById('schIncomeError'),
      incomeEl.value === '' ? 'Monthly income is required.' : (incomeEl.value < 0 ? 'Income cannot be negative.' : '')) && valid;

    if (!valid) return;

    const result = checkScholarship(Number(marksEl.value), Number(incomeEl.value));
    const statusEl = document.getElementById('schStatus');
    statusEl.textContent = result.text;
    statusEl.className = 'result-status status-' + result.type;

    scholarshipResult.hidden = false;
    scholarshipResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast('Scholarship checked successfully');
  });

  /* ---------- 14. COURSE RECOMMENDATION TOOL ---------- */
  const recommendForm = document.getElementById('recommendForm');
  const recommendResult = document.getElementById('recommendResult');

  const recommendationMap = {
    'Coding': 'Web Development',
    'Design': 'Graphic Design',
    'AI': 'AI & Emerging Technology',
    'Online Earning': 'Freelancing',
    'Data': 'Data Analytics',
    'Digital Marketing': 'Digital Marketing'
  };

  function recommendCourse(interest) {
    return recommendationMap[interest] || 'Web Development';
  }

  recommendForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const interestEl = document.getElementById('interestSelect');
    const interest = interestEl.value;

    if (interest === '') {
      interestEl.focus();
      return;
    }

    const course = recommendCourse(interest);
    document.getElementById('recInterest').textContent = interest;
    document.getElementById('recCourse').textContent = course;

    recommendResult.hidden = false;
    recommendResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast('Recommendation generated');
  });

  /* ---------- 15. FAQ ACCORDION (only one open at a time) ---------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      faqItems.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- 16. CONTACT FORM ---------- */
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameEl = document.getElementById('cName');
    const emailEl = document.getElementById('cEmail');
    const subjectEl = document.getElementById('cSubject');
    const messageEl = document.getElementById('cMessage');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let valid = true;
    valid = setError(nameEl, document.getElementById('cNameError'), nameEl.value.trim() === '' ? 'Name is required.' : '') && valid;
    valid = setError(emailEl, document.getElementById('cEmailError'),
      emailEl.value.trim() === '' ? 'Email is required.' : (!emailPattern.test(emailEl.value.trim()) ? 'Enter a valid email address.' : '')) && valid;
    valid = setError(subjectEl, document.getElementById('cSubjectError'), subjectEl.value.trim() === '' ? 'Subject is required.' : '') && valid;
    valid = setError(messageEl, document.getElementById('cMessageError'), messageEl.value.trim() === '' ? 'Message is required.' : '') && valid;

    if (!valid) return;

    contactForm.reset();
    showToast('Message sent successfully');
  });

  /* ---------- 17. BACK TO TOP ---------- */
  const backToTop = document.getElementById('backToTop');

  function handleBackToTop() {
    if (window.scrollY > 500) {
      backToTop.hidden = false;
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
