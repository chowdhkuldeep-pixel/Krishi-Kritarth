document.addEventListener('DOMContentLoaded', () => {
  // 1. User Profile Setup
  const userRole = localStorage.getItem('userRole') || 'Farmer';
  const userName = localStorage.getItem('userName') || 'Ramesh Kumar';

  const userDisplayName = document.getElementById('user-display-name');
  const userDisplayRole = document.getElementById('user-display-role');
  const userAvatar = document.getElementById('user-avatar');
  const btnCreateListing = document.getElementById('btn-create-listing');

  if (userDisplayName) userDisplayName.innerText = userName;
  if (userDisplayRole) userDisplayRole.innerText = `${userRole} Account`;
  
  // Set Initials for Avatar Icon
  if (userAvatar && userName) {
    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    userAvatar.innerText = initials || 'US';
  }

  // Show "Post Harvest" button only for Farmers
  if (userRole.toLowerCase() === 'farmer' && btnCreateListing) {
    btnCreateListing.classList.remove('hidden');
  }

  // 2. Category Filter Switcher Logic
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cropCards = document.querySelectorAll('.dashboard-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button style
      filterButtons.forEach(b => {
        b.className = 'filter-btn px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-200 hover:text-white transition-all';
      });
      btn.className = 'filter-btn active-filter px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 text-emerald-950 transition-all';

      const selectedCategory = btn.getAttribute('data-category');

      // Filter Cards
      cropCards.forEach(card => {
        const cardType = card.getAttribute('data-type');
        if (selectedCategory === 'all' || cardType === selectedCategory) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 3. Logout Handler
  document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
  });

  // 4. Bidding Handler
  document.querySelectorAll('.btn-place-bid').forEach(button => {
    button.addEventListener('click', () => {
      const bidAmount = prompt('Enter your bid amount:');
      if (bidAmount) {
        alert(`Bid of ₹${bidAmount} successfully registered!`);
      }
    });
  });
});