let soundEnabled = false;

const eventDate = new Date("2026-11-14T18:00:00-05:00").getTime();

function createMagicParticles() {
    const container = document.getElementById("magicContainer");

    for (let index = 0; index < 42; index += 1) {
        const particle = document.createElement("span");
        particle.className = "magic";
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particle.style.animationDuration = `${6 + Math.random() * 7}s`;
        particle.style.transform = `scale(${0.5 + Math.random()})`;
        container.appendChild(particle);
    }
}

function updateCountdown() {
    const remaining = Math.max(0, eventDate - Date.now());
    const values = {
        days: Math.floor(remaining / 86400000),
        hours: Math.floor((remaining % 86400000) / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000)
    };
    const ringScales = { days: 365, hours: 24, minutes: 60, seconds: 60 };

    Object.entries(values).forEach(([id, value]) => {
        const number = document.getElementById(id);
        const formattedValue = String(value).padStart(2, "0");

        if (number.textContent !== formattedValue) {
            number.textContent = formattedValue;
            number.classList.remove("tick");
            void number.offsetWidth;
            number.classList.add("tick");
        }

        const progress = document.querySelector(`[data-ring="${id}"]`);
        progress.style.strokeDashoffset = String(100 - Math.min(value / ringScales[id], 1) * 100);
    });

    const note = document.getElementById("countdownNote");
    const noteText = remaining === 0
        ? "¡Llegó el gran día! La historia de esta noche comienza ahora."
        : values.days >= 30
            ? "La estrella sigue su viaje por el cielo, acercándonos a esta gran noche..."
            : values.days >= 1
                ? "¡El gran día ya asoma en el horizonte!"
                : "¡Ya casi comienza la magia!";

    if (note.textContent !== noteText) {
        note.textContent = noteText;
    }
}

function setupReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16 });

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

async function startSound() {
    const intro = document.getElementById("introAudio");
    const background = document.getElementById("backgroundAudio");
    background.volume = 0.15;
    soundEnabled = true;
    document.getElementById("soundToggle").setAttribute("aria-label", "Silenciar sonido");
    document.querySelector(".sound-label").textContent = "Sonando";

    try {
        await intro.play();
        intro.addEventListener("ended", () => background.play().catch(() => {}), { once: true });
    } catch (error) {
        background.play().catch(() => {});
    }
}

document.getElementById("openStory").addEventListener("click", async () => {
    const welcome = document.getElementById("welcome");
    const story = document.getElementById("story");
    const opening = document.querySelector(".book-opening");

    await startSound();
    welcome.style.opacity = "0";
    welcome.style.transition = "opacity .7s ease";
    window.setTimeout(() => {
        welcome.style.display = "none";
        story.classList.remove("hidden");
        opening.classList.add("is-closing");
        setupReveal();
    }, 650);
});

document.getElementById("soundToggle").addEventListener("click", () => {
    const background = document.getElementById("backgroundAudio");
    const intro = document.getElementById("introAudio");
    const label = document.querySelector(".sound-label");

    if (soundEnabled) {
        intro.pause();
        background.pause();
        soundEnabled = false;
        label.textContent = "Sonido";
        document.getElementById("soundToggle").setAttribute("aria-label", "Activar sonido");
    } else {
        startSound();
    }
});

const confirmationFrame = document.querySelector(".confirmation-form-frame");
window.addEventListener("message", (event) => {
    if (event.source !== confirmationFrame.contentWindow) {
        return;
    }

    const data = event.data;
    if (
        data &&
        data.type === "rsvp-form-height" &&
        Number.isFinite(data.height) &&
        data.height >= 40 &&
        data.height <= 400
    ) {
        confirmationFrame.style.height = `${data.height}px`;
    }
});

createMagicParticles();
updateCountdown();
window.setInterval(updateCountdown, 1000);
