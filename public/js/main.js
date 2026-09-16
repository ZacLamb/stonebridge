(function () {
  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Advance estimator: industry rule of thumb ~ 50% to 150% of monthly revenue
  var range = document.getElementById('rev');
  if (range) {
    var revOut = document.getElementById('rev-out');
    var estOut = document.getElementById('est-out');
    var fmt = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
    var update = function () {
      var v = Number(range.value);
      revOut.textContent = fmt(v) + ' / month';
      estOut.textContent = fmt(v * 0.5) + ' – ' + fmt(v * 1.5);
    };
    range.addEventListener('input', update);
    update();
  }

  // Light phone formatting
  document.querySelectorAll('input[type=tel]').forEach(function (el) {
    el.addEventListener('input', function () {
      var d = el.value.replace(/\D/g, '').slice(0, 10);
      var out = d;
      if (d.length > 6) out = '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
      else if (d.length > 3) out = '(' + d.slice(0, 3) + ') ' + d.slice(3);
      el.value = out;
    });
  });
})();
