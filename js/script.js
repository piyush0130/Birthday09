document.addEventListener('DOMContentLoaded', () => {
    // 1. Typewriter Effect
    const textElement = document.getElementById('typewriter-text');
    const message = "Wishing you a day as beautiful as you are, filled with love, magic, and unforgettable moments.";
    let i = 0;

    function typeWriter() {
        if (i < message.length && textElement) {
            textElement.innerHTML += message.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }

    // 2. Audio Control & Welcome Screen
    const bgMusic = document.getElementById('bg-music');
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const startBtn = document.getElementById('start-btn');
    
    bgMusic.volume = 0.5;

    // Wait for the user to explicitly tap the start button
    if (startBtn && welcomeOverlay) {
        startBtn.addEventListener('click', () => {
            // 1. Play audio
            bgMusic.play().catch(() => {});
            
            // 2. Hide overlay
            welcomeOverlay.classList.add('hidden');
            
            // 3. Show main site
            document.body.classList.add('site-loaded');
            
            // 4. Trigger animations immediately after entering
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
            setTimeout(fireConfetti, 300);
            setTimeout(typeWriter, 800);

            // 5. Show floating buttons
            const audioControl = document.getElementById('audio-control');
            if (audioControl) audioControl.classList.remove('hidden');

        });
    }

    // 3. Floating Audio Control Toggle
    const audioControl = document.getElementById('audio-control');
    if (audioControl) {
        audioControl.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play();
                audioControl.innerHTML = '<i class="fas fa-music"></i>';
                audioControl.style.background = 'rgba(255,255,255,0.8)';
                audioControl.style.color = 'var(--accent)';
            } else {
                bgMusic.pause();
                audioControl.innerHTML = '<i class="fas fa-pause"></i>';
                audioControl.style.background = 'var(--accent)';
                audioControl.style.color = 'white';
            }
        });
    }
    // Virtual KitKat Logic
    const kitkatBtn = document.getElementById('kitkat');
    const kitkatMsg = document.getElementById('kitkat-msg');
    const kitkatImg = document.getElementById('kitkat-img');
    if (kitkatBtn && kitkatMsg) {
        kitkatBtn.addEventListener('click', () => {
            if (kitkatImg) {
                kitkatImg.src = 'images/kitkat_bar.png';
            }
            kitkatBtn.classList.add('kitkat-unwrapped');
            const unwrapText = kitkatBtn.querySelector('.unwrap-text');
            if (unwrapText) unwrapText.textContent = 'Yumm! 🍫';
            kitkatMsg.classList.remove('hidden');
        }, { once: true });
    }
    // Since we handle revealing via the start button now, we don't automatically trigger them on load
    // The previous SITE INIT block logic is moved inside the click handler above.


    // 4. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Helper to show the hidden gift section from any trigger
    const giftSection = document.getElementById('special-gift');
    function showGiftSection() {
        if (!giftSection) return;
        giftSection.style.display = 'block';
        // Force layout so the opacity transition triggers consistently
        void giftSection.offsetWidth;
        giftSection.style.opacity = '1';
    }

    // Accept / Reject Button Logic
    const acceptBtn = document.getElementById('accept-btn');
    const rejectBtn = document.getElementById('reject-btn');

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            acceptBtn.textContent = '❤️ Take your time, main yahi hoon!';
            acceptBtn.style.background = 'linear-gradient(120deg, #ff6b8a, #ffa0b4)';
            acceptBtn.style.color = 'white';
            if (rejectBtn) rejectBtn.style.display = 'none';
            fireConfetti();
        });
    }

    if (rejectBtn) {
        // Make reject button run away on hover/touch
        const moveButtonRandomly = () => {
            const parent = rejectBtn.parentElement;
            if (parent) parent.style.position = 'relative';
            const parentRect = parent.getBoundingClientRect();
            const btnW = rejectBtn.offsetWidth;
            const btnH = rejectBtn.offsetHeight;

            const maxX = Math.max(0, parentRect.width - btnW);
            const maxY = Math.max(0, parentRect.height - btnH);

            const randomX = Math.floor(Math.random() * maxX);
            const randomY = Math.floor(Math.random() * maxY);

            rejectBtn.style.position = 'absolute';
            rejectBtn.style.left = randomX + 'px';
            rejectBtn.style.top = randomY + 'px';
        };

        // Make reject button run away on hover/touch
        rejectBtn.addEventListener('mouseover', moveButtonRandomly);

        // Also move on touchstart for mobile
        rejectBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveButtonRandomly(); }, { passive: false });
    }

    // ===== THINGS I ADORE CAROUSEL =====
    const adoreCarousel = document.getElementById('adore-carousel');
    const dotsContainer = document.getElementById('carousel-dots');
    const prevBtn = document.getElementById('prev-btn');
    const nextCarouselBtn = document.getElementById('next-carousel-btn');

    if (adoreCarousel) {
        const cards = adoreCarousel.querySelectorAll('.adore-card');
        let currentIndex = 0;

        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });

        function goTo(index) {
            currentIndex = (index + cards.length) % cards.length;
            adoreCarousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            adoreCarousel.style.transition = 'transform 0.5s cubic-bezier(0.25,0.8,0.25,1)';
            document.querySelectorAll('#carousel-dots .dot').forEach((d, i) => {
                d.classList.toggle('active', i === currentIndex);
            });
        }

        if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
        if (nextCarouselBtn) nextCarouselBtn.addEventListener('click', () => goTo(currentIndex + 1));

        let touchStartX = 0;
        adoreCarousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        adoreCarousel.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
        });
    }

    // ===== MAGICAL CAKE INTERACTION =====
    const interactiveCake = document.getElementById('interactive-cake');
    const cakeWrapper = document.getElementById('magical-cake');
    const wishMessage = document.getElementById('wish-message');
    
    if (interactiveCake && cakeWrapper) {
        interactiveCake.addEventListener('click', () => {
            // Prevent multiple clicks
            interactiveCake.style.pointerEvents = 'none';
            
            // Add magical explosion center glow
            const glow = document.createElement('div');
            glow.style.cssText = 'position:absolute; top:50%; left:50%; transform:translate(-50%, -50%) scale(0); width:200px; height:200px; background:#fff; border-radius:50%; box-shadow:0 0 60px 40px #fff, 0 0 120px 80px #ffdf00, 0 0 180px 120px #ff9a9e; opacity:0; transition:all 0.8s ease-out; z-index:20; pointer-events:none;';
            cakeWrapper.appendChild(glow);

            // Execute the vanish animation
            setTimeout(() => {
                // Flash bang!
                glow.style.opacity = '1';
                glow.style.transform = 'translate(-50%, -50%) scale(1.5)';
                
                // shrink and spin the cake magically
                interactiveCake.style.transform = 'scale(0) rotate(180deg)';
                interactiveCake.style.opacity = '0';
                
                // Final celebration
                setTimeout(() => {
                    // Fade out the magic glow
                    glow.style.opacity = '0';
                    glow.style.transform = 'translate(-50%, -50%) scale(3)';
                    
                    fireConfetti();
                    setTimeout(fireConfetti, 200);
                    setTimeout(fireConfetti, 400); // Triple burst
                    
                    if (wishMessage) {
                        wishMessage.innerHTML = 'Wish maan li jayegi! 🌠 Happy Birthday Shubhi! ❤️';
                        wishMessage.style.marginTop = '20px';
                        wishMessage.style.animation = 'gentleRise 1.5s forwards'; 
                        wishMessage.classList.remove('hidden');
                    }
                }, 600);
            }, 50);
        });
    }

    // ===== SCRATCH CARD =====
    const scratchCanvas = document.getElementById('scratch-canvas');
    if (scratchCanvas) {
        const ctx = scratchCanvas.getContext('2d');
        const w = scratchCanvas.width;
        const h = scratchCanvas.height;
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, '#e8a0b4');
        gradient.addColorStop(0.5, '#c879a0');
        gradient.addColorStop(1, '#e8a0b4');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = 'bold 20px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✨ Scratch Here ✨', w / 2, h / 2);
        ctx.globalCompositeOperation = 'destination-out';
        let isDrawing = false;
        function scratch(x, y) { ctx.beginPath(); ctx.arc(x, y, 28, 0, Math.PI * 2); ctx.fill(); }
        function getPos(e, canvas) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            if (e.touches) return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
            return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
        }
        scratchCanvas.addEventListener('mousedown', (e) => { isDrawing = true; const p = getPos(e, scratchCanvas); scratch(p.x, p.y); });
        scratchCanvas.addEventListener('mousemove', (e) => { if (isDrawing) { const p = getPos(e, scratchCanvas); scratch(p.x, p.y); } });
        scratchCanvas.addEventListener('mouseup', () => { isDrawing = false; });
        scratchCanvas.addEventListener('mouseleave', () => { isDrawing = false; });
        scratchCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing = true; const p = getPos(e, scratchCanvas); scratch(p.x, p.y); }, { passive: false });
        scratchCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (isDrawing) { const p = getPos(e, scratchCanvas); scratch(p.x, p.y); } }, { passive: false });
        scratchCanvas.addEventListener('touchend', () => { isDrawing = false; });
    }

    // 5. Smooth scrolling for anchor links + ensure gift section is visible when requested early
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;

            if (target.id === 'special-gift') {
                showGiftSection();
            }

            target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 6. Download button confetti
    const downloadBtn = document.querySelector('a[download]');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // Drop confetti from the button
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#f8b9d4', '#e6e6fa', '#ffffff', '#ff9a9e']
            });
        });
    }

    // 7. Memory Game Logic
    const gameBoard = document.querySelector('.memory-game');
    const gameMessage = document.getElementById('game-message');
    const restartBtn = document.getElementById('restart-btn');
    const nextBtn = document.getElementById('next-btn');
    const gameActions = document.getElementById('game-actions');
    
    if (gameBoard) {
        const emojis = ['🎀', '🎀', '🧸', '🧸', '🌸', '🌸', '💍', '💍', '🍰', '🍰', '💌', '💌'];
        let hasFlippedCard = false;
        let lockBoard = false;
        let firstCard, secondCard;
        let matchedPairs = 0;

        function renderGame() {
            gameBoard.innerHTML = '';
            matchedPairs = 0;
            hasFlippedCard = false;
            lockBoard = false;
            firstCard = null;
            secondCard = null;
            if (gameMessage) gameMessage.classList.add('hidden');
            if (gameActions) gameActions.classList.add('hidden');
            
            // Shuffle
            emojis.sort(() => Math.random() - 0.5);

            emojis.forEach(emoji => {
                const card = document.createElement('div');
                card.classList.add('memory-card');
                card.dataset.emoji = emoji;

                card.innerHTML = `
                    <div class="front-face">${emoji}</div>
                    <div class="back-face"><i class="fas fa-heart"></i></div>
                `;

                card.addEventListener('click', flipCard);
                gameBoard.appendChild(card);
            });
        }

        function flipCard() {
            if (lockBoard) return;
            if (this === firstCard) return;

            this.classList.add('flip');

            if (!hasFlippedCard) {
                // first click
                hasFlippedCard = true;
                firstCard = this;
                return;
            }

            // second click
            secondCard = this;
            checkForMatch();
        }

        function checkForMatch() {
            let isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

            isMatch ? disableCards() : unflipCards();
        }

        function disableCards() {
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);
            matchedPairs++;

            if (matchedPairs === emojis.length / 2) {
                setTimeout(() => {
                    if (gameMessage) gameMessage.classList.remove('hidden');
                    if (gameActions) gameActions.classList.remove('hidden');
                    fireConfetti(); // specific game win confetti
                }, 500);
            }

            resetBoard();
        }

        function unflipCards() {
            lockBoard = true;

            setTimeout(() => {
                firstCard.classList.remove('flip');
                secondCard.classList.remove('flip');

                resetBoard();
            }, 1000);
        }

        function resetBoard() {
            [hasFlippedCard, lockBoard] = [false, false];
            [firstCard, secondCard] = [null, null];
        }

        if (restartBtn) {
            restartBtn.addEventListener('click', renderGame);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const gameSection = document.getElementById('cute-game');
                // Hide the game container so the user focuses fully on the letter
                if (gameSection) {
                    gameSection.style.display = 'none';
                }

                showGiftSection();

                setTimeout(() => {
                    giftSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            });
        }

        // Initialize game
        renderGame();
    }

    // 8. Voice Note Logic - Auto pause & resume background music
    const voiceNote = document.getElementById('voice-note');
    if (voiceNote && bgMusic) {
        let wasBgmPlayingBeforeVoiceNote = false;
        
        voiceNote.addEventListener('play', () => {
            if (!bgMusic.paused) {
                wasBgmPlayingBeforeVoiceNote = true;
                bgMusic.pause();
                if (audioControl) {
                    audioControl.innerHTML = '<i class="fas fa-pause"></i>';
                    audioControl.style.background = 'var(--accent)';
                    audioControl.style.color = 'white';
                }
            } else {
                wasBgmPlayingBeforeVoiceNote = false;
            }
        });

        const resumeBgm = () => {
            if (wasBgmPlayingBeforeVoiceNote && bgMusic.paused) {
                bgMusic.play().catch(e => console.log('Auto-play prevented', e));
                if (audioControl) {
                    audioControl.innerHTML = '<i class="fas fa-music"></i>';
                    audioControl.style.background = 'rgba(255,255,255,0.8)';
                    audioControl.style.color = 'var(--accent)';
                }
            }
        };

        voiceNote.addEventListener('pause', resumeBgm);
        voiceNote.addEventListener('ended', resumeBgm);
    }
});

// Confetti Functions
function fireConfetti() {
    var count = window.innerWidth < 768 ? 150 : 300; // Optimized memory cost for mobile devices
    var defaults = {
        origin: { y: 0.7 },
        colors: ['#f8b9d4', '#e6e6fa', '#ffffff', '#ff9a9e', '#fecfef']
    };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}
