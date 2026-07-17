(function () {
  function addPrivacyLink() {
    var footer = document.querySelector('footer');
    if (!footer || footer.querySelector('a[href="/privacy-policy"]')) return true;

    var commitmentLinks = Array.from(footer.querySelectorAll('div.flex.flex-col.gap-2.mt-2')).pop();
    if (!commitmentLinks) return false;

    var link = document.createElement('a');
    link.href = '/privacy-policy';
    link.className = 'text-background-300 text-sm hover:text-accent-400 cursor-pointer transition-colors duration-200';
    link.textContent = 'Privacy Policy';
    commitmentLinks.appendChild(link);
    return true;
  }

  if (addPrivacyLink()) return;

  var observer = new MutationObserver(function () {
    if (addPrivacyLink()) observer.disconnect();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
