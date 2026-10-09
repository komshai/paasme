document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.querySelector('.search-box .btn-primary');
  const categoryCards = document.querySelectorAll('.category-card');
  const btns = document.querySelectorAll('.btn');

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

  btns.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-1px)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
    });
  });
});
