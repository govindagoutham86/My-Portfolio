/* Govinda Goutham — Portfolio v2 */

/* Mobile navigation */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");

function setMenu(open) {
    navLinks.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", String(open));
}
menuToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("active")));
navItems.forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* Typing animation (shows the first role without animating if reduced motion is on) */
const typingText = document.getElementById("typingText");
const roles = ["Developer", "Problem Solver", "Builder", "Engineering Student", "Tech Enthusiast"];
let roleIndex = 0, characterIndex = 0, isDeleting = false;

function typeRole() {
    const role = roles[roleIndex];
    characterIndex += isDeleting ? -1 : 1;
    typingText.textContent = role.substring(0, characterIndex);

    if (!isDeleting && characterIndex === role.length) {
        isDeleting = true;
        return setTimeout(typeRole, 1600);
    }
    if (isDeleting && characterIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
    }
    setTimeout(typeRole, isDeleting ? 45 : 90);
}
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    typingText.textContent = "";
    typeRole();
}

/* Footer year */
document.getElementById("currentYear").textContent = new Date().getFullYear();

/* Highlight the sidebar link for the section in view */
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navItems.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
    });
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

/* Project links without a real URL yet should not jump to the top */
document.querySelectorAll('.project-link[href="#"]').forEach((link) => {
    link.addEventListener("click", (e) => e.preventDefault());
});

/* Contact form: opens the visitor's email app with the message filled in */
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const { name, email, message } = contactForm.elements;
    const subject = encodeURIComponent("Portfolio message from " + name.value.trim());
    const body = encodeURIComponent(message.value.trim() + "\n\n" + name.value.trim() + "\n" + email.value.trim());
    window.location.href = "mailto:govindagoutham86@gmail.com?subject=" + subject + "&body=" + body;
    formStatus.textContent = "Opening your email app. If nothing happens, use the email address on the left.";
});

/* =========================
   LIGHT / DARK MODE
========================= */

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {

    themeToggle.addEventListener("change", () => {

        if (themeToggle.checked) {
            document.body.classList.add("light-mode");
            localStorage.setItem("theme", "light");
        } else {
            document.body.classList.remove("light-mode");
            localStorage.setItem("theme", "dark");
        }

    });

    // Remember selected theme
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
        themeToggle.checked = true;
    }
}