// forms.js - Newsletter & Contact validation 

const newsletterForm = document.getElementById('newsletter-form');
const contactForm = document.getElementById('contact-form');

// Newsletter Subscription (Node.js Serverless Function)
if(newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('nl-email').value;
        const msgEl = document.getElementById('nl-msg');
        const btn = newsletterForm.querySelector('.submit-btn');
        const spinner = btn.querySelector('.spinner');
        const btnText = btn.querySelector('span');

        if(!validateEmail(email)) {
            msgEl.textContent = 'Please enter a valid email address.';
            msgEl.className = 'form-msg mt-2 error';
            return;
        }

        btnText.style.display = 'none';
        spinner.classList.remove('hide');
        msgEl.textContent = '';

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                msgEl.textContent = 'Welcome aboard! Check your inbox for the prequel novella.';
                msgEl.className = 'form-msg mt-2 success';
                newsletterForm.reset();
                if(typeof showToast === 'function') showToast('Subscribed Successfully!');
            } else {
                throw new Error('Failed to subscribe');
            }
        } catch (error) {
            msgEl.textContent = 'An error occurred. Please try again later.';
            msgEl.className = 'form-msg mt-2 error';
        } finally {
            btnText.style.display = 'block';
            spinner.classList.add('hide');
        }
    });
}

// Contact Form (Still mocked/EmailJS)
if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('c-name').value;
        const email = document.getElementById('c-email').value;
        const subject = document.getElementById('c-subject').value;
        const message = document.getElementById('c-message').value;
        
        const msgEl = document.getElementById('c-msg');
        const btn = contactForm.querySelector('.submit-btn');
        const spinner = btn.querySelector('.spinner');
        const btnText = btn.querySelector('span');

        if(!name || !email || !subject || !message) {
            msgEl.textContent = 'Please fill out all fields.';
            msgEl.className = 'form-msg mt-2 error';
            return;
        }

        btnText.style.display = 'none';
        spinner.classList.remove('hide');
        msgEl.textContent = '';

        setTimeout(() => {
            btnText.style.display = 'block';
            spinner.classList.add('hide');
            msgEl.textContent = 'Your message has been sent. Hope will respond shortly.';
            msgEl.className = 'form-msg mt-2 success';
            contactForm.reset();

            if(typeof showToast === 'function') showToast('Message Sent Successfully!');
        }, 2000);
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
