/**
 * SKANDHAN M U - Premium Portfolio Website Engine
 * Core JS File (Animations, Canvas Particles, UI Interaction)
 */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================================
    // 1. PREMIUM CUSTOM CURSOR
    // ==========================================================================
    const cursor = document.getElementById("custom-cursor");
    const cursorDot = document.getElementById("custom-cursor-dot");

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    // Only enable custom cursor on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && cursor && cursorDot) {
        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Immediate movement for inner dot
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;

            // Fade-in cursors on initial movement
            cursor.style.opacity = "1";
            cursorDot.style.opacity = "1";
        });

        // Smooth cursor follow delay (easing loop)
        const updateCursor = () => {
            const ease = 0.15;
            cursorX += (mouseX - cursorX) * ease;
            cursorY += (mouseY - cursorY) * ease;

            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            requestAnimationFrame(updateCursor);
        };
        updateCursor();

        // Hide cursor when leaving window
        document.addEventListener("mouseleave", () => {
            cursor.style.opacity = "0";
            cursorDot.style.opacity = "0";
        });

        document.addEventListener("mouseenter", () => {
            cursor.style.opacity = "1";
            cursorDot.style.opacity = "1";
        });
    }

    // ==========================================================================
    // 2. HTML5 CANVAS NEURAL NETWORK PARTICLE BACKGROUND
    // ==========================================================================
    const canvas = document.getElementById("neural-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        let animationFrameId;

        // Set canvas bounds
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        // Settings
        const particleCount = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 18000));
        const connectionDistance = 140;
        const mouseRadius = 160;

        let mouseNode = { x: null, y: null };

        window.addEventListener("mousemove", (e) => {
            mouseNode.x = e.clientX;
            mouseNode.y = e.clientY;
        });

        window.addEventListener("mouseout", () => {
            mouseNode.x = null;
            mouseNode.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 2 + 1;
                // Alternate particle colors between Electric Blue and Soft Purple
                this.color = Math.random() > 0.55 ? "rgba(0, 212, 255, " : "rgba(139, 92, 246, ";
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color + "0.6)";
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Boundary bounces
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Mouse interactive force fields
                if (mouseNode.x !== null) {
                    const dx = this.x - mouseNode.x;
                    const dy = this.y - mouseNode.y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < mouseRadius) {
                        // Gentle pull/push behavior based on cursor
                        const force = (mouseRadius - distance) / mouseRadius;
                        const angle = Math.atan2(dy, dx);

                        // Push slightly away
                        this.x += Math.cos(angle) * force * 0.8;
                        this.y += Math.sin(angle) * force * 0.8;
                    }
                }
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < connectionDistance) {
                        // Connection line strength depends on distance proximity
                        const alpha = (connectionDistance - dist) / connectionDistance * 0.18;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);

                        // Draw gradients between points
                        const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        grad.addColorStop(0, particles[i].color + alpha + ")");
                        grad.addColorStop(1, particles[j].color + alpha + ")");

                        ctx.strokeStyle = grad;
                        ctx.lineWidth = 0.85;
                        ctx.stroke();
                    }
                }

                // Connect particle to mouse cursor if close
                if (mouseNode.x !== null) {
                    const dx = particles[i].x - mouseNode.x;
                    const dy = particles[i].y - mouseNode.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < mouseRadius) {
                        const alpha = (mouseRadius - dist) / mouseRadius * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouseNode.x, mouseNode.y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        };

        const animateNeuralNet = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw background glow gradient
            const bgGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height));
            bgGrad.addColorStop(0, "#08090E");
            bgGrad.addColorStop(1, "#020203");
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw & update nodes
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            drawConnections();
            animationFrameId = requestAnimationFrame(animateNeuralNet);
        };

        // Initialize & Run
        window.addEventListener("resize", () => {
            // Debounce resize slightly
            clearTimeout(window.resizeTimer);
            window.resizeTimer = setTimeout(resizeCanvas, 250);
        });

        resizeCanvas();
        animateNeuralNet();
    }

    // ==========================================================================
    // 3. TYPEWRITER EFFECT
    // ==========================================================================
    const typewriterEl = document.getElementById("typewriter");
    if (typewriterEl) {
        const words = [
            "AI & Robotics Engineer",
            "Machine Learning Enthusiast",
            "Python Developer",
            "Innovation Competition Winner"
        ];

        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const typeEffect = () => {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; // Deletes faster
            } else {
                typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100; // Normal writing speed
            }

            // Handling cycle logic
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingSpeed = 2200; // Pause at end of text
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // Pause before typing next word
            }

            setTimeout(typeEffect, typingSpeed);
        };

        // Start typing loop
        setTimeout(typeEffect, 800);
    }

    // ==========================================================================
    // 4. FLOATING STICKY HEADER & ACTIVE LINKS ON SCROLL
    // ==========================================================================
    const header = document.querySelector(".header");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

    window.addEventListener("scroll", () => {
        // Sticky Header scroll classes
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Active Nav links check
        let scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    const href = link.getAttribute("href");
                    if (href === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });

        // Show/hide Back-to-Top Button
        const backToTopBtn = document.getElementById("back-to-top");
        if (backToTopBtn) {
            if (window.scrollY > 600) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        }
    });

    // Back-to-top action click
    const backToTopBtn = document.getElementById("back-to-top");
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ==========================================================================
    // 5. MOBILE HAMBURGER MENU ACTIONS
    // ==========================================================================
    const menuToggle = document.querySelector(".mobile-menu-toggle");
    const mobileNav = document.querySelector(".mobile-nav");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

    if (menuToggle && mobileNav) {
        const toggleMenu = () => {
            menuToggle.classList.toggle("active");
            mobileNav.classList.toggle("active");
            // Disable page scroll when mobile nav is active
            document.body.style.overflow = mobileNav.classList.contains("active") ? "hidden" : "auto";
        };

        menuToggle.addEventListener("click", toggleMenu);

        // Close menu when clicking nav link
        mobileNavLinks.forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                mobileNav.classList.remove("active");
                document.body.style.overflow = "auto";
            });
        });
    }

    // ==========================================================================
    // 6. SCROLL REVEAL OBSERVER
    // ==========================================================================
    const revealElements = document.querySelectorAll(".reveal-fade-in, .reveal-slide-up, .reveal-slide-left, .reveal-slide-right");

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal-active");
                    // Keep layout state once animated (prevent re-triggers)
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ==========================================================================
    // 7. ANIMATED STATISTICS COUNTER INCREMENTS
    // ==========================================================================
    const statsSection = document.querySelector(".hero-stats-grid");
    const statNumbers = document.querySelectorAll(".stat-number");

    if (statsSection && statNumbers.length > 0) {
        let statsStarted = false;

        const countUp = (el) => {
            const target = parseInt(el.getAttribute("data-target"), 10);
            const duration = 2000; // 2 seconds total count time
            const stepTime = Math.max(Math.floor(duration / target), 30);
            let current = 0;

            const timer = setInterval(() => {
                current += 1;
                el.textContent = current;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(timer);
                }
            }, stepTime);
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsStarted) {
                    statsStarted = true;
                    statNumbers.forEach(num => countUp(num));
                }
            });
        }, {
            threshold: 0.3
        });

        statsObserver.observe(statsSection);
    }

    // ==========================================================================
    // 8. 3D CARD HOVER TILT & SHINE EFFECT
    // ==========================================================================
    const tiltCards = document.querySelectorAll("[data-tilt]");

    if (!isTouchDevice && tiltCards.length > 0) {
        tiltCards.forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Calculate percentage margins from center (-0.5 to 0.5)
                const px = x / rect.width;
                const py = y / rect.height;

                const tiltX = (py - 0.5) * -12; // tilt max 12 degrees
                const tiltY = (px - 0.5) * 12;

                // Inject mouse position variables for css custom shine lighting
                card.style.setProperty("--mouse-x", `${px * 100}%`);
                card.style.setProperty("--mouse-y", `${py * 100}%`);

                // Apply rotate transformations
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener("mouseleave", () => {
                // Reset card values on hover exit
                card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
            });
        });
    }

    // ==========================================================================
    // 9. CERTIFICATION CAROUSEL SLIDER ENGINE
    // ==========================================================================
    const track = document.querySelector(".carousel-track");
    const cards = document.querySelectorAll(".certification-card");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const indicatorContainer = document.querySelector(".carousel-indicators");

    if (track && cards.length > 0) {
        let currentIndex = 0;
        let cardWidth = 0;
        let cardsVisible = 3;

        // Evaluate responsive sizes
        const updateCarouselConfig = () => {
            const w = window.innerWidth;
            if (w <= 768) {
                cardsVisible = 1;
            } else if (w <= 1024) {
                cardsVisible = 2;
            } else {
                cardsVisible = 3;
            }

            // Calculate dynamic card sizes
            const gap = 24;
            const totalGaps = cardsVisible - 1;
            const containerWidth = track.parentElement.getBoundingClientRect().width;

            // Adjust card widths
            cardWidth = (containerWidth - (totalGaps * gap)) / cardsVisible;
            cards.forEach(c => {
                c.style.flex = `0 0 ${cardWidth}px`;
            });

            // Create navigation dot indicators
            createIndicators();
            moveToSlide(currentIndex, false);
        };

        const createIndicators = () => {
            if (!indicatorContainer) return;
            indicatorContainer.innerHTML = "";

            const totalIndicators = cards.length - cardsVisible + 1;
            if (totalIndicators <= 1) return;

            for (let i = 0; i < totalIndicators; i++) {
                const dot = document.createElement("button");
                dot.classList.add("indicator-dot");
                dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
                if (i === currentIndex) dot.classList.add("active");

                dot.addEventListener("click", () => {
                    moveToSlide(i);
                });
                indicatorContainer.appendChild(dot);
            }
        };

        const moveToSlide = (index, animate = true) => {
            const totalSteps = cards.length - cardsVisible + 1;
            if (index < 0) index = 0;
            if (index >= totalSteps) index = totalSteps - 1;

            currentIndex = index;
            const gap = 24;
            const moveAmount = currentIndex * (cardWidth + gap);

            track.style.transition = animate ? "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)" : "none";
            track.style.transform = `translateX(-${moveAmount}px)`;

            // Update active states on dots
            const dots = document.querySelectorAll(".indicator-dot");
            dots.forEach((d, idx) => {
                if (idx === currentIndex) {
                    d.classList.add("active");
                } else {
                    d.classList.remove("active");
                }
            });

            // Nav buttons state visibility disables
            if (prevBtn && nextBtn) {
                prevBtn.classList.toggle("disabled-link", currentIndex === 0);
                nextBtn.classList.toggle("disabled-link", currentIndex >= totalSteps - 1);
            }
        };

        // Wire navigational buttons
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener("click", () => moveToSlide(currentIndex - 1));
            nextBtn.addEventListener("click", () => moveToSlide(currentIndex + 1));
        }

        // Touch / Drag swipe gestures support for carousel
        let startX = 0, isDragging = false, currentTranslate = 0, prevTranslate = 0;

        const dragStart = (e) => {
            startX = getPositionX(e);
            isDragging = true;
            track.style.transition = "none";
        };

        const dragMove = (e) => {
            if (!isDragging) return;
            const currentX = getPositionX(e);
            const diff = currentX - startX;

            const gap = 24;
            const currentMoveAmount = currentIndex * (cardWidth + gap);
            track.style.transform = `translateX(-${currentMoveAmount - diff}px)`;
        };

        const dragEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;

            const currentX = getPositionX(e);
            const diff = currentX - startX;

            // Threshold swap logic (more than 70px trigger)
            if (diff < -70) {
                moveToSlide(currentIndex + 1);
            } else if (diff > 70) {
                moveToSlide(currentIndex - 1);
            } else {
                moveToSlide(currentIndex);
            }
        };

        const getPositionX = (e) => {
            return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
        };

        // Add listeners
        track.addEventListener("touchstart", dragStart);
        track.addEventListener("touchmove", dragMove);
        track.addEventListener("touchend", dragEnd);
        track.addEventListener("mousedown", dragStart);
        track.addEventListener("mousemove", dragMove);
        track.addEventListener("mouseup", dragEnd);
        track.addEventListener("mouseleave", () => { if (isDragging) dragEnd(); });

        // Autoplay carousel intervals
        let autoPlayTimer;
        const startAutoplay = () => {
            autoPlayTimer = setInterval(() => {
                const totalSteps = cards.length - cardsVisible + 1;
                if (currentIndex >= totalSteps - 1) {
                    moveToSlide(0);
                } else {
                    moveToSlide(currentIndex + 1);
                }
            }, 6000); // Shift every 6 seconds
        };

        const stopAutoplay = () => {
            clearInterval(autoPlayTimer);
        };

        track.parentElement.addEventListener("mouseenter", stopAutoplay);
        track.parentElement.addEventListener("mouseleave", startAutoplay);

        window.addEventListener("resize", () => {
            clearTimeout(window.carouselResizeTimer);
            window.carouselResizeTimer = setTimeout(updateCarouselConfig, 200);
        });

        updateCarouselConfig();
        startAutoplay();
    }

    // ==========================================================================
    // 10. RESUME PREVIEW MODAL LOGIC
    // ==========================================================================
    const resumeModal = document.getElementById("resume-modal");
    const triggerBtn1 = document.getElementById("open-resume-preview-btn");
    const triggerBtn2 = document.getElementById("trigger-preview-btn");
    const navResumeBtn = document.querySelector('nav .btn-secondary, main .hero-buttons a[href="#resume"]');
    const closeBtn = document.querySelector(".close-modal-btn");

    if (resumeModal && closeBtn) {

        const openModal = (e) => {
            if (e) e.preventDefault();
            resumeModal.classList.add("active");
            document.body.style.overflow = "hidden"; // Freeze scroll background
        };

        const closeModal = () => {
            resumeModal.classList.remove("active");
            document.body.style.overflow = "auto";
        };

        if (triggerBtn1) triggerBtn1.addEventListener("click", openModal);
        if (triggerBtn2) triggerBtn2.addEventListener("click", openModal);

        // Bind resume buttons from Hero/Nav to open preview modal
        const heroResumeBtn = document.querySelector('.hero-buttons a[href="#resume"]');
        if (heroResumeBtn) {
            heroResumeBtn.addEventListener("click", openModal);
        }

        closeBtn.addEventListener("click", closeModal);

        // Close modal when clicking outside content area
        resumeModal.addEventListener("click", (e) => {
            if (e.target === resumeModal) {
                closeModal();
            }
        });

        // Close modal on Escape key press
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && resumeModal.classList.contains("active")) {
                closeModal();
            }
        });
    }

    // ==========================================================================
    // 11. CONTACT FORM VALIDATION & INTERACTIVE RESPONSE
    // ==========================================================================
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    if (contactForm && formStatus) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Standard form fields
            const name = document.getElementById("form-name").value.trim();
            const email = document.getElementById("form-email").value.trim();
            const subject = document.getElementById("form-subject").value.trim();
            const message = document.getElementById("form-message").value.trim();

            // Simple validate verification
            if (!name || !email || !subject || !message) {
                formStatus.textContent = "Please fill in all input requirements.";
                formStatus.className = "form-status-message error";
                return;
            }

            // Submit animation effects
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Encrypting & Dispatching...';

            // Mock API request response wait (1.5 seconds)
            setTimeout(() => {
                // Since this is a static showcase page, we simulate form submission success.
                // It notifies recruiters visually.
                formStatus.textContent = "Secure transmission successful! Thank you, Skandhan will contact you shortly.";
                formStatus.className = "form-status-message success";

                // Reset form fields
                contactForm.reset();

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;

                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = "none";
                }, 5000);
            }, 1500);
        });
    }

    // ==========================================================================
    // 12. SMOOTH ROTATION ACCORDION & SCROLL NAV INTERCEPT
    // ==========================================================================
    // Handle standard smooth scrolls for anchor links in header/body
    const localAnchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    localAnchors.forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            // Only intercept if we're not triggering modal previews
            if (this.getAttribute("href") === "#resume" && resumeModal) {
                return;
            }

            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetEl = document.querySelector(targetId);

            if (targetEl) {
                const offsetPosition = targetEl.offsetTop - 80; // offset header height
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

});
