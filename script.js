// --- Lógica del Modal (Pop-ups) ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "flex"; 
    document.body.style.overflow = "hidden"; 

    if (modal.classList.contains('skill-modal')) {
        modal.classList.remove('is-open');
        // Fuerza reflow para reiniciar animaciones de apertura.
        void modal.offsetWidth;
        modal.classList.add('is-open');
        animateSkillModalLevels(modal);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "none";
    document.body.style.overflow = "auto"; 
    modal.classList.remove('is-open');

    if (modal.classList.contains('skill-modal')) {
        const fills = modal.querySelectorAll('.skill-level-fill');
        fills.forEach(fill => {
            fill.style.width = '0';
        });
    }
}

function openImageLightbox(src, altText) {
    const lightbox = document.getElementById('imageLightbox');
    const image = document.getElementById('lightboxImage');
    const caption = document.getElementById('lightboxCaption');

    if (!lightbox || !image || !caption) {
        return;
    }

    image.src = src;
    image.alt = altText || 'Vista ampliada del proyecto';
    caption.textContent = altText || 'Vista ampliada del proyecto';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
}

function closeImageLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    const image = document.getElementById('lightboxImage');

    if (!lightbox || !image) {
        return;
    }

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    image.src = '';
}

function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) {
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-title">${title}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    window.setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-6px)';
        window.setTimeout(() => toast.remove(), 240);
    }, 4200);
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        if (event.target.classList.contains('skill-modal')) {
            event.target.classList.remove('is-open');
            const fills = event.target.querySelectorAll('.skill-level-fill');
            fills.forEach(fill => {
                fill.style.width = '0';
            });
        }
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function levelToValue(level) {
    const map = {
        basico: 50,
        intermedio: 70,
        avanzado: 90,
    };

    return map[level] || 0;
}

function levelToLabel(level) {
    const map = {
        basico: 'Basico',
        intermedio: 'Intermedio',
        avanzado: 'Avanzado',
    };

    return map[level] || 'Nivel';
}

function getSkillPercent(fill) {
    const rawPercent = Number(fill.dataset.percent);

    if (!Number.isNaN(rawPercent)) {
        return Math.max(0, Math.min(100, rawPercent));
    }

    return levelToValue(fill.dataset.level);
}

function setupSkillDetailLabels() {
    const skillModals = document.querySelectorAll('.skill-modal');

    skillModals.forEach(modal => {
        const detailItems = modal.querySelectorAll('.skill-detail-item');

        detailItems.forEach((item, index) => {
            const fill = item.querySelector('.skill-level-fill');
            const chip = item.querySelector('.skill-level-chip');

            if (!fill || !chip) {
                return;
            }

            const level = fill.dataset.level;
            const value = getSkillPercent(fill);
            chip.textContent = `${levelToLabel(level)} - ${value} %`;

            item.style.setProperty('--item-order', index + 1);
            fill.style.setProperty('--target-width', `${value}%`);
        });
    });
}

function animateSkillModalLevels(modal) {
    const items = modal.querySelectorAll('.skill-detail-item');

    items.forEach((item, index) => {
        const fill = item.querySelector('.skill-level-fill');
        if (!fill) {
            return;
        }

        const level = fill.dataset.level;
        const target = getSkillPercent(fill);
        fill.style.width = '0';
        fill.style.transitionDelay = `${index * 120}ms`;
        requestAnimationFrame(() => {
            fill.style.width = `${target}%`;
        });
    });
}

function setupSkillAverages() {
    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach(card => {
        const area = card.dataset.skillArea;
        const modal = document.querySelector(`.skill-modal[data-skill-area="${area}"]`);
        if (!modal) {
            return;
        }

        const levelElements = modal.querySelectorAll('.skill-level-fill');
        if (!levelElements.length) {
            return;
        }

        let sum = 0;
        levelElements.forEach(el => {
            sum += getSkillPercent(el);
        });

        const average = Math.round(sum / levelElements.length);
        const averageLabel = card.querySelector('.skill-average-value');
        const averageBar = card.querySelector('.skill-summary-progress');

        if (averageLabel) {
            averageLabel.textContent = `${average}%`;
        }

        if (averageBar) {
            averageBar.dataset.width = `${average}%`;
        }
    });
}

// --- Animaciones al hacer Scroll (Intersection Observer) ---
document.addEventListener('DOMContentLoaded', () => {
    setupSkillDetailLabels();
    setupSkillAverages();
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Se activa cuando el 15% del elemento es visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Añade la clase 'show' para activar la animación en CSS
                entry.target.classList.add('show');
                
                // Si el elemento contiene barras de progreso, anímalas
                const progressBars = entry.target.querySelectorAll('.progress');
                progressBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width');
                    bar.style.width = targetWidth;
                });

                // Deja de observar el elemento una vez que ya apareció
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleccionar todos los elementos ocultos y observarlos
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    const lightbox = document.getElementById('imageLightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (event) => {
            if (event.target.id === 'imageLightbox') {
                closeImageLightbox();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeImageLightbox();
        }
    });

    const contactForm = document.getElementById('contactForm');
    const contactStatus = document.getElementById('contactStatus');

    if (contactForm && contactStatus) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const formData = new FormData(contactForm);
            const payload = {
                nombre: String(formData.get('nombre') || '').trim(),
                email: String(formData.get('email') || '').trim(),
                mensaje: String(formData.get('mensaje') || '').trim(),
            };

            if (!payload.nombre || !payload.email || !payload.mensaje) {
                contactStatus.textContent = 'Completa todos los campos antes de enviar.';
                contactStatus.className = 'contact-status error';
                showToast('error', 'Formulario incompleto', 'Debes completar nombre, correo y mensaje antes de enviar.');
                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
            }

            try {
                const formPayload = new URLSearchParams({
                    name: payload.nombre,
                    email: payload.email,
                    message: payload.mensaje,
                    _subject: 'Nuevo mensaje desde tu portafolio',
                    _captcha: 'false',
                    _template: 'table',
                });

                const response = await fetch('https://formsubmit.co/ajax/kevinalexis01mujica@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        Accept: 'application/json',
                    },
                    body: formPayload.toString(),
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(data.error || 'No se pudo enviar el mensaje.');
                }

                contactStatus.textContent = 'Mensaje enviado correctamente. Te responderé pronto.';
                contactStatus.className = 'contact-status success';
                showToast('success', 'Mensaje enviado', 'Tu mensaje fue enviado correctamente. Revisaré el correo y te responderé pronto.');
                contactForm.reset();
            } catch (error) {
                contactStatus.textContent = 'No fue posible enviar el mensaje en este momento.';
                contactStatus.className = 'contact-status error';
                showToast(
                    'error',
                    'No se pudo enviar',
                    'Si es tu primer envío con FormSubmit, revisa tu correo y confirma la activación del formulario. Luego vuelve a intentarlo.'
                );
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Enviar Mensaje';
                }
            }
        });
    }
});