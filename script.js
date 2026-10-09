document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.querySelector('.search-box .btn-primary');
  const categoryCards = document.querySelectorAll('.category-card');

  if (searchButton) {
    searchButton.addEventListener('click', () => {
      const searchInputs = document.querySelectorAll('.search-box input');
      const service = searchInputs[0]?.value?.trim() || 'સેવા';
      const city = searchInputs[1]?.value?.trim() || 'ગુજરાત';
      window.location.href = `services.html?service=${encodeURIComponent(service)}&city=${encodeURIComponent(city)}`;
    });
  }

  categoryCards.forEach((card) => {
    card.addEventListener('click', () => {
      const label = card.querySelector('h3')?.textContent || 'સેવા';
      window.location.href = `services.html?service=${encodeURIComponent(label)}`;
    });
  });

  const authForm = document.querySelector('#loginForm');
  if (authForm) {
    authForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.querySelector('#email')?.value.trim();
      const password = document.querySelector('#password')?.value.trim();

      if (!email || !password) {
        alert('કૃપા કરીને ઈમેલ અને પાસવર્ડ દાખલ કરો');
        return;
      }

      localStorage.setItem('paasme_user', JSON.stringify({ email, name: email.split('@')[0] }));
      window.location.href = 'dashboard.html';
    });
  }

  const bookingForm = document.querySelector('#bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = {
        name: document.querySelector('#customerName')?.value.trim(),
        phone: document.querySelector('#phone')?.value.trim(),
        service: document.querySelector('#serviceType')?.value,
        city: document.querySelector('#city')?.value,
        date: document.querySelector('#bookingDate')?.value,
        notes: document.querySelector('#notes')?.value.trim(),
        createdAt: new Date().toISOString(),
      };

      if (!formData.name || !formData.phone || !formData.service || !formData.city || !formData.date) {
        alert('કૃપા કરીને બધા જરૂરી ફીલ્ડ્સ ભરો');
        return;
      }

      const bookings = JSON.parse(localStorage.getItem('paasme_bookings') || '[]');
      bookings.unshift(formData);
      localStorage.setItem('paasme_bookings', JSON.stringify(bookings));

      const user = JSON.parse(localStorage.getItem('paasme_user') || 'null');
      const target = user ? 'dashboard.html' : 'login.html';
      alert('બુકિંગ સફળ થઈ.');
      window.location.href = target;
    });
  }

  const dashboard = document.querySelector('#dashboardPanel');
  if (dashboard) {
    const user = JSON.parse(localStorage.getItem('paasme_user') || 'null');
    const bookings = JSON.parse(localStorage.getItem('paasme_bookings') || '[]');

    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    const userGreeting = document.querySelector('#userGreeting');
    if (userGreeting) userGreeting.textContent = `હાઇ ${user.name || user.email}`;

    const bookingsList = document.querySelector('#bookingsList');
    if (bookingsList) {
      if (!bookings.length) {
        bookingsList.innerHTML = '<li>હજી સુધી કોઈ બુકિંગ થઈ નથી.</li>';
      } else {
        bookingsList.innerHTML = bookings
          .slice(0, 5)
          .map((item) => `<li><strong>${item.service}</strong> - ${item.city} - ${item.date}</li>`)
          .join('');
      }
    }

    const bookingCount = document.querySelector('#bookingCount');
    if (bookingCount) bookingCount.textContent = String(bookings.length);
  }

  const logoutBtn = document.querySelector('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('paasme_user');
      window.location.href = 'login.html';
    });
  }

  const varsalBtn = document.querySelector('#varsalSyncBtn');
  if (varsalBtn) {
    varsalBtn.addEventListener('click', () => {
      const endpoint = localStorage.getItem('paasme_varsal_endpoint') || 'https://example.com/varsal-sync';
      alert(`Varsal sync ready: ${endpoint}`);
    });
  }
});
