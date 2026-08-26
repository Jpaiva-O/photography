const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const form = document.querySelector('#quote-form');
const formSuccess = document.querySelector('#form-success');
const quantityInput = document.querySelector('#quantity');
const eventDateInput = document.querySelector('#event-date');
const daysLeft = document.querySelector('#days-left');
const deadlineText = document.querySelector('.deadline-card strong');

if (menuToggle && header) {
  menuToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  mainNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
    });
  });
}

const eventDate = new Date('2026-09-01T12:00:00');

function getDaysUntil(date) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.ceil((date.getTime() - today.getTime()) / 86400000);
}

function formatEventDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function updateDeadline() {
  if (!daysLeft) return;
  const selectedDate = eventDateInput?.value
    ? new Date(`${eventDateInput.value}T12:00:00`)
    : eventDate;
  const remaining = getDaysUntil(selectedDate);

  daysLeft.textContent = remaining > 0 ? String(remaining).padStart(2, '0') : '—';
  if (deadlineText && eventDateInput?.value) {
    deadlineText.textContent = formatEventDate(eventDateInput.value);
  }
}

eventDateInput?.addEventListener('change', updateDeadline);
updateDeadline();

quantityInput?.addEventListener('input', () => {
  if (Number(quantityInput.value) < 50) {
    quantityInput.setCustomValidity('Informe pelo menos 50 unidades.');
  } else {
    quantityInput.setCustomValidity('');
  }
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  quantityInput?.dispatchEvent(new Event('input'));

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  formSuccess?.classList.add('visible');
  formSuccess?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.innerHTML = 'Briefing enviado <span aria-hidden="true">✓</span>';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';
  }
});
