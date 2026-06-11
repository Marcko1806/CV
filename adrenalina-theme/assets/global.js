/* Adrenalina — JS del tema */
(function () {
  'use strict';

  var $ = function (selector, context) {
    return (context || document).querySelector(selector);
  };
  var $$ = function (selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  };

  /* ------------------------------------------------------------------------
     Navegación móvil
     ------------------------------------------------------------------------ */
  document.addEventListener('click', function (event) {
    var toggle = event.target.closest('[data-menu-toggle]');
    if (!toggle) return;
    var nav = $('[data-mobile-nav]');
    if (!nav) return;
    var willOpen = nav.hasAttribute('hidden');
    if (willOpen) {
      nav.removeAttribute('hidden');
    } else {
      nav.setAttribute('hidden', '');
    }
    toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    document.body.classList.toggle('nav-open', willOpen);
  });

  /* ------------------------------------------------------------------------
     Selectores de cantidad (+ / -)
     ------------------------------------------------------------------------ */
  document.addEventListener('click', function (event) {
    var minus = event.target.closest('[data-qty-minus]');
    var plus = event.target.closest('[data-qty-plus]');
    if (!minus && !plus) return;
    var wrap = (minus || plus).closest('.qty');
    var input = wrap && wrap.querySelector('.qty__input');
    if (!input) return;
    var min = parseInt(input.min || '0', 10);
    var value = parseInt(input.value || '1', 10);
    if (isNaN(value)) value = min;
    value = minus ? Math.max(min, value - 1) : value + 1;
    input.value = value;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* ------------------------------------------------------------------------
     Carrito: actualizar al cambiar cantidades
     ------------------------------------------------------------------------ */
  document.addEventListener('change', function (event) {
    if (!event.target.matches('[data-cart-qty]')) return;
    var form = event.target.closest('[data-cart-form]');
    if (form) form.submit();
  });

  /* ------------------------------------------------------------------------
     Colección: ordenar
     ------------------------------------------------------------------------ */
  document.addEventListener('change', function (event) {
    if (!event.target.matches('[data-sort-by]')) return;
    var url = new URL(window.location.href);
    url.searchParams.set('sort_by', event.target.value);
    url.searchParams.delete('page');
    window.location.href = url.toString();
  });

  /* ------------------------------------------------------------------------
     Confirmación antes de eliminar (direcciones)
     ------------------------------------------------------------------------ */
  document.addEventListener('submit', function (event) {
    var form = event.target.closest('form[data-confirm]');
    if (form && !window.confirm(form.getAttribute('data-confirm'))) {
      event.preventDefault();
    }
  });

  /* ------------------------------------------------------------------------
     Toast + contador del carrito
     ------------------------------------------------------------------------ */
  var toastTimer;
  function showToast(text) {
    var toast = $('[data-toast]');
    if (!toast) return;
    var label = $('[data-toast-text]', toast);
    if (label) label.textContent = text;
    toast.removeAttribute('hidden');
    requestAnimationFrame(function () {
      toast.classList.add('is-visible');
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
      setTimeout(function () {
        toast.setAttribute('hidden', '');
      }, 250);
    }, 4000);
  }

  function refreshCartCount() {
    fetch('/cart.js')
      .then(function (res) { return res.json(); })
      .then(function (cart) {
        $$('[data-cart-count]').forEach(function (el) {
          el.textContent = cart.item_count;
          el.classList.toggle('cart-bubble--empty', cart.item_count === 0);
        });
      })
      .catch(function () {});
  }

  /* ------------------------------------------------------------------------
     Añadir al carrito por AJAX
     ------------------------------------------------------------------------ */
  document.addEventListener('submit', function (event) {
    var form = event.target.closest('form.product-form');
    if (!form) return;
    event.preventDefault();

    var button = form.querySelector('[data-atc]');
    if (button) button.classList.add('is-loading');

    fetch('/cart/add.js', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (!result.ok) {
          throw new Error(result.data.description || result.data.message || 'Error');
        }
        var strings = window.themeStrings || {};
        showToast(strings.addedToCart || 'Añadido al carrito');
        refreshCartCount();
      })
      .catch(function (error) {
        showToast(error.message);
      })
      .then(function () {
        if (button) button.classList.remove('is-loading');
      });
  });

  /* ------------------------------------------------------------------------
     Página de producto: galería y variantes
     ------------------------------------------------------------------------ */
  function initProduct(root) {
    var galleryItems = $$('.product-gallery__item', root);
    var thumbs = $$('[data-thumb]', root);

    function showMedia(mediaId) {
      if (!galleryItems.length) return;
      var found = false;
      galleryItems.forEach(function (item) {
        var active = String(item.getAttribute('data-media-id')) === String(mediaId);
        if (active) found = true;
        item.classList.toggle('is-active', active);
      });
      if (!found) galleryItems[0].classList.add('is-active');
      thumbs.forEach(function (thumb) {
        thumb.classList.toggle(
          'is-active',
          String(thumb.getAttribute('data-media-id')) === String(mediaId)
        );
      });
    }

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        showMedia(thumb.getAttribute('data-media-id'));
      });
    });

    var jsonEl = $('[data-variant-json]', root);
    var selects = $$('[data-option-select]', root);
    if (!jsonEl || !selects.length) return;

    var variants;
    try {
      variants = JSON.parse(jsonEl.textContent);
    } catch (error) {
      return;
    }

    var idInput = $('[data-variant-id]', root);
    var priceWrap = $('[data-price]', root);
    var priceCurrent = $('[data-price-current]', root);
    var priceCompare = $('[data-price-compare]', root);
    var atcButton = $('[data-atc]', root);
    var atcText = $('[data-atc-text]', root);
    var strings = window.themeStrings || {};

    function currentVariant() {
      var selected = selects.map(function (select) { return select.value; });
      return variants.find(function (variant) {
        return variant.options.every(function (option, index) {
          return option === selected[index];
        });
      });
    }

    function update() {
      var variant = currentVariant();

      if (!variant) {
        if (atcButton) atcButton.disabled = true;
        if (atcText) atcText.textContent = strings.unavailable || 'No disponible';
        return;
      }

      if (idInput) idInput.value = variant.id;
      if (priceCurrent) priceCurrent.textContent = variant.price;
      if (priceCompare) {
        if (variant.compare_at_price) {
          priceCompare.textContent = variant.compare_at_price;
          priceCompare.hidden = false;
        } else {
          priceCompare.textContent = '';
          priceCompare.hidden = true;
        }
      }
      if (priceWrap) priceWrap.classList.toggle('price--sale', !!variant.compare_at_price);
      if (atcButton) atcButton.disabled = !variant.available;
      if (atcText) {
        atcText.textContent = variant.available
          ? (strings.addToCart || 'Añadir al carrito')
          : (strings.soldOut || 'Agotado');
      }
      if (variant.media_id) showMedia(variant.media_id);

      try {
        var url = new URL(window.location.href);
        url.searchParams.set('variant', variant.id);
        window.history.replaceState({}, '', url.toString());
      } catch (error) {
        /* noop */
      }
    }

    selects.forEach(function (select) {
      select.addEventListener('change', update);
    });
  }

  $$('[data-product]').forEach(initProduct);

  /* ------------------------------------------------------------------------
     Productos recomendados (Section Rendering API)
     ------------------------------------------------------------------------ */
  $$('[data-recommendations]').forEach(function (el) {
    var url = el.getAttribute('data-url');
    if (!url) return;
    fetch(url)
      .then(function (res) { return res.text(); })
      .then(function (text) {
        var html = new DOMParser().parseFromString(text, 'text/html');
        var inner = html.querySelector('[data-recommendations]');
        if (inner && inner.innerHTML.trim().length) {
          el.innerHTML = inner.innerHTML;
        }
      })
      .catch(function () {});
  });

  /* ------------------------------------------------------------------------
     País / provincia en formularios de dirección
     ------------------------------------------------------------------------ */
  $$('[data-country-select]').forEach(function (country) {
    var form = country.closest('form');
    if (!form) return;
    var wrapper = $('[data-province-wrapper]', form);
    var province = wrapper && $('[data-province-select]', wrapper);
    var provinceDefault = province ? province.getAttribute('data-default') : '';

    var countryDefault = country.getAttribute('data-default');
    if (countryDefault) {
      $$('option', country).forEach(function (option) {
        if (option.value === countryDefault || option.textContent.trim() === countryDefault) {
          option.selected = true;
        }
      });
    }

    function updateProvinces() {
      if (!province || !wrapper) return;
      var option = country.options[country.selectedIndex];
      var raw = option ? option.getAttribute('data-provinces') : null;
      var provinces = [];
      try {
        provinces = raw ? JSON.parse(raw) : [];
      } catch (error) {
        provinces = [];
      }
      province.innerHTML = '';
      if (!provinces.length) {
        wrapper.hidden = true;
        return;
      }
      wrapper.hidden = false;
      provinces.forEach(function (entry) {
        var opt = document.createElement('option');
        opt.value = entry[0];
        opt.textContent = entry[1];
        if (entry[0] === provinceDefault || entry[1] === provinceDefault) {
          opt.selected = true;
        }
        province.appendChild(opt);
      });
    }

    updateProvinces();
    country.addEventListener('change', updateProvinces);
  });

  /* ------------------------------------------------------------------------
     Login: abrir el panel de recuperación si hay mensaje de éxito
     ------------------------------------------------------------------------ */
  var recoverSuccess = $('[data-recover-success]');
  if (recoverSuccess) {
    var details = recoverSuccess.closest('details');
    if (details) details.open = true;
  }
})();
