/* =========================================================
   GOVINDA GOUTHAM — PORTFOLIO
   script.js
   ========================================================= */


/* =========================================================
   CONFIG
   ---------------------------------------------------------
   Contact form modes:
   1) DEFAULT (no setup): opens Gmail in a new tab with the
      To, Subject and Message already filled in. The visitor
      only has to press Send. (Browsers cannot send email
      silently without a mail service.)
   2) AUTO-SEND (free, 5 min setup at emailjs.com): fill in
      the three IDs below. The form then sends the email
      straight to your inbox with no Gmail window, and can
      also send an automatic reply to the visitor.
   ========================================================= */

const CONFIG = {
    ownerEmail: "govindagoutham8790@gmail.com",

    emailjs: {
        publicKey: "s8mAOLxXmXtEyj1zf",            // EmailJS > Account > Public Key
        serviceId: "Goutham_8790",            // EmailJS > Email Services (your Gmail)
        templateId: "template_fjtovpo",           // Template that emails YOU the enquiry
        //autoReplyTemplateId: ""   // Optional: template that thanks the visitor
    }
};


/* =========================================================
   HELPERS
   ========================================================= */

const $ = (id) => document.getElementById(id);

/* localStorage can throw (private mode, blocked cookies) */
function readStorage(key) {
    try { return localStorage.getItem(key); } catch { return null; }
}
function writeStorage(key, value) {
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
}


/* =========================================================
   01. MOBILE NAVIGATION
   ========================================================= */

const menuToggle = $("menuToggle");
const navLinks = $("navLinks");
const navItems = document.querySelectorAll(".nav-link");

function setMenu(open) {
    if (!navLinks || !menuToggle) return;
    navLinks.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", String(open));
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () =>
        setMenu(!navLinks.classList.contains("active"))
    );

    navItems.forEach((link) =>
        link.addEventListener("click", () => setMenu(false))
    );

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setMenu(false);
    });

    /* Close the menu when tapping outside the header */
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".header")) setMenu(false);
    });
}


/* =========================================================
   02. TYPING ANIMATION
   Works with #typingText, or falls back to the highlighted
   word inside the hero subtitle.
   ========================================================= */

const typingText =
    $("typingText") || document.querySelector(".hero h2 span");

const roles = [
    "Developer",
    "Problem Solver",
    "Builder",
    "Engineering Student",
    "Tech Enthusiast"
];

let roleIndex = 0;
let characterIndex = 0;
let isDeleting = false;

function typeRole() {
    const role = roles[roleIndex];

    characterIndex += isDeleting ? -1 : 1;
    typingText.textContent = role.substring(0, characterIndex);

    if (!isDeleting && characterIndex === role.length) {
        isDeleting = true;
        setTimeout(typeRole, 1600);
        return;
    }

    if (isDeleting && characterIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
    }

    setTimeout(typeRole, isDeleting ? 45 : 90);
}

const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typingText && !prefersReducedMotion) {
    typingText.textContent = "";
    typeRole();
}


/* =========================================================
   03. FOOTER YEAR
   ========================================================= */

const currentYear = $("currentYear");
if (currentYear) currentYear.textContent = new Date().getFullYear();


/* =========================================================
   04. ACTIVE NAV LINK ON SCROLL
   ========================================================= */

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navItems.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === "#" + entry.target.id
                );
            });
        });
    },
    { rootMargin: "-40% 0px -55% 0px" }
);

document
    .querySelectorAll("main section[id]")
    .forEach((section) => sectionObserver.observe(section));


/* =========================================================
   05. PLACEHOLDER PROJECT LINKS
   Links that are still "#" should not jump to the top.
   ========================================================= */

document.querySelectorAll('.project-link[href="#"]').forEach((link) => {
    link.addEventListener("click", (e) => e.preventDefault());
});


/* =========================================================
   06. LIGHT / DARK MODE
   ========================================================= */

const themeToggle = $("themeToggle");

function applyTheme(isLight) {
    document.body.classList.toggle("light-mode", isLight);
    if (themeToggle) themeToggle.checked = isLight;
}

if (themeToggle) {
    applyTheme(readStorage("theme") === "light");

    themeToggle.addEventListener("change", () => {
        applyTheme(themeToggle.checked);
        writeStorage("theme", themeToggle.checked ? "light" : "dark");
    });
}


/* =========================================================
   07. CONTACT FORM
   ========================================================= */

const contactForm = $("contactForm");
const formStatus = $("formStatus");

const COLORS = {
    error: "#ff6b6b",
    success: "#3ecf8e",
    info: ""            /* empty = use the stylesheet colour */
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_MESSAGE_IN_URL = 1500;   /* keeps the Gmail link a safe length */


function setStatus(text, type = "info") {
    if (!formStatus) return;
    formStatus.textContent = text;
    formStatus.style.color = COLORS[type];
}

function markInvalid(field, invalid) {
    field.setAttribute("aria-invalid", String(invalid));
    field.style.borderColor = invalid ? COLORS.error : "";
}

/* Returns { field, message } for the first problem, or null if valid */
function validate({ name, email, message }) {
    if (name.value.trim().length < 2) {
        return { field: name, message: "Please enter your name (at least 2 characters)." };
    }
    if (!EMAIL_PATTERN.test(email.value.trim())) {
        return { field: email, message: "Please enter a valid email address, like name@example.com." };
    }
    if (message.value.trim().length < 10) {
        return { field: message, message: "Please write a message of at least 10 characters." };
    }
    return null;
}

/* The automatic email text */
function buildEmail(data) {
    const subject = `Portfolio enquiry from ${data.name}`;

    const body =
`Hi Govinda,

My name is ${data.name}. I found your portfolio and wanted to get in touch.

${data.message}

Best regards,
${data.name}
Reply to: ${data.email}`;

    return { subject, body };
}

function openGmailCompose({ subject, body }) {
    const safeBody =
        body.length > MAX_MESSAGE_IN_URL
            ? body.slice(0, MAX_MESSAGE_IN_URL) + "…"
            : body;

    const params =
        "view=cm&fs=1" +
        "&to=" + encodeURIComponent(CONFIG.ownerEmail) +
        "&su=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(safeBody);

    /* Opened directly inside the submit click so it is not popup-blocked */
    const win = window.open("https://mail.google.com/mail/?" + params, "_blank");

    if (win) {
        win.opener = null;
        return true;
    }

    /* Popup blocked: fall back to the default mail app */
    window.location.href =
        "mailto:" + CONFIG.ownerEmail +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(safeBody);
    return false;
}

/* EmailJS REST call: no SDK needed */
async function sendWithEmailJS(templateId, params) {
    const { publicKey, serviceId } = CONFIG.emailjs;

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: params
        })
    });

    if (!response.ok) {
        throw new Error("EmailJS responded with status " + response.status);
    }
}

function emailJsConfigured() {
    const { publicKey, serviceId, templateId } = CONFIG.emailjs;
    return Boolean(publicKey && serviceId && templateId);
}


if (contactForm) {
    const fields = contactForm.elements;
    const submitButton = contactForm.querySelector('button[type="submit"]');

    /* Clear the red state as soon as the visitor edits a field */
    ["name", "email", "message"].forEach((key) => {
        fields[key].addEventListener("input", () => {
            markInvalid(fields[key], false);
            if (formStatus && formStatus.style.color === COLORS.error) setStatus("");
        });
    });

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        ["name", "email", "message"].forEach((key) => markInvalid(fields[key], false));

        const problem = validate(fields);
        if (problem) {
            markInvalid(problem.field, true);
            setStatus(problem.message, "error");
            problem.field.focus();
            return;
        }

        const data = {
            name: fields.name.value.trim(),
            email: fields.email.value.trim(),
            message: fields.message.value.trim()
        };
        const email = buildEmail(data);

        /* ---- Mode 2: automatic sending through EmailJS ---- */
        if (emailJsConfigured()) {
            const originalLabel = submitButton ? submitButton.innerHTML : "";

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }
            setStatus("Sending your message...");

            try {
                const receivedAt = new Date().toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Kolkata"
                }) + " IST";

                /* Sent under several common names so the template works
                   whichever variables it uses: {{name}}, {{from_name}}, etc. */
                await sendWithEmailJS(CONFIG.emailjs.templateId, {
                    to_email: CONFIG.ownerEmail,
                    name: data.name,
                    from_name: data.name,
                    email: data.email,
                    from_email: data.email,
                    reply_to: data.email,
                    title: email.subject,
                    subject: email.subject,
                    time: receivedAt,
                    message: data.message
                });

                /* Optional automatic reply to the visitor */
                if (CONFIG.emailjs.autoReplyTemplateId) {
                    try {
                        await sendWithEmailJS(CONFIG.emailjs.autoReplyTemplateId, {
                            to_email: data.email,
                            to_name: data.name,
                            from_name: "Govinda Goutham",
                            message: data.message
                        });
                    } catch (replyError) {
                        console.warn("Auto-reply failed:", replyError);
                    }
                }

                contactForm.reset();
                setStatus("Thank you! Your message was sent. I'll get back to you soon.", "success");
            } catch (error) {
                console.error(error);
                setStatus(
                    "Sorry, the message could not be sent. Please email me directly at " +
                    CONFIG.ownerEmail + ".",
                    "error"
                );
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalLabel;
                }
            }
            return;
        }

        /* ---- Mode 1: open Gmail with everything filled in ---- */
        const openedGmail = openGmailCompose(email);

        contactForm.reset();
        setStatus(
            openedGmail
                ? "Gmail has opened with your message ready. Press Send there to deliver it."
                : "Your email app has opened with your message ready. Press Send to deliver it.",
            "success"
        );
    });
}
