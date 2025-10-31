document.addEventListener('DOMContentLoaded', function() {
    const parallaxElements = document.querySelectorAll('.brick-pattern');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const fadeElements = document.querySelectorAll('.fade-in');
    const serviceCards = document.querySelectorAll('.service-card');
    const statNumbers = document.querySelectorAll('.stat-number');

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.3;
            const yPos = -(scrolled * speed);
            const baseTransform = element.dataset.baseTransform || '0px, 0px';
            const [baseX, baseY] = baseTransform.split(', ').map(v => parseInt(v) || 0);
            element.style.transform = `translate(${baseX + yPos}px, ${baseY + yPos}px)`;
        });
    });
    
    parallaxElements.forEach((element, index) => {
        const computedStyle = window.getComputedStyle(element);
        const transform = computedStyle.transform;
        if (transform && transform !== 'none') {
            const matrix = transform.match(/matrix\(([^)]+)\)/);
            if (matrix) {
                const values = matrix[1].split(', ');
                const translateX = parseFloat(values[4]) || 0;
                const translateY = parseFloat(values[5]) || 0;
                element.dataset.baseTransform = `${translateX}, ${translateY}`;
            }
        } else {
            element.dataset.baseTransform = '0, 0';
        }
    });

    mobileMenuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    serviceCards.forEach((card, index) => {
        fadeObserver.observe(card);
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    const floatingElements = document.querySelector('.floating-elements');
    const totalBricks = 20;
    
    function updateFloatingElementsHeight() {
        const footer = document.querySelector('.footer');
        const footerTop = footer ? footer.offsetTop : document.body.scrollHeight;
        floatingElements.style.height = `${footerTop}px`;
    }
    
    setTimeout(() => {
        updateFloatingElementsHeight();
    }, 100);
    
    window.addEventListener('resize', updateFloatingElementsHeight);
    
    const resizeObserver = new ResizeObserver(() => {
        updateFloatingElementsHeight();
    });
    resizeObserver.observe(document.body);
    
    for (let i = 0; i < totalBricks; i++) {
        const brick = document.createElement('div');
        brick.className = 'floating-brick';
        
        const randomX = Math.random() * 100;
        const randomTop = (i / (totalBricks - 1)) * 100;
        const randomDelay = Math.random() * 2;
        const randomDuration = 4 + Math.random() * 4;
        
        brick.style.left = `${randomX}%`;
        brick.style.top = `${randomTop}%`;
        brick.style.animationDelay = `${randomDelay}s`;
        brick.style.animationDuration = `${randomDuration}s`;
        
        floatingElements.appendChild(brick);
    }

    window.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        parallaxElements.forEach((element, index) => {
            const moveX = (mouseX - 0.5) * (index + 1) * 15;
            const moveY = (mouseY - 0.5) * (index + 1) * 15;
            const baseTransform = element.dataset.baseTransform || '0, 0';
            const [baseX, baseY] = baseTransform.split(', ').map(v => parseInt(v) || 0);
            const scrolled = window.pageYOffset;
            const speed = (index + 1) * 0.3;
            const scrollY = -(scrolled * speed);
            element.style.transform = `translate(${baseX + scrollY + moveX}px, ${baseY + scrollY + moveY}px)`;
        });
    });

    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(2deg)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop < lastScrollTop || scrollTop <= 50) {
                    header.style.transform = 'translateY(0)';
                    header.style.transition = 'transform 0.3s ease-out';
                } else if (scrollTop > lastScrollTop && scrollTop > 100) {
                    header.style.transform = 'translateY(-100%)';
                    header.style.transition = 'transform 0.3s ease-out';
                }
                
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
                ticking = false;
            });
            ticking = true;
        }
    });

    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

