(() => {
  const isLoading = () => document.querySelectorAll('.pt__loading-indicator').length > 0;

  const processIfLoaded = () => {
    if (isLoading()) {
      setTimeout(processIfLoaded, 1000);
      return;
    }

    Array.from(document.querySelectorAll('[data-test-id^=product-tile-]')).forEach(tile => {
      const productId = tile.getAttribute('data-test-id').replace(/product-tile-/g, '');

      if (isNaN(parseInt(productId))) {
        return;
      }

      const createPopup = data => {
        const element = document.createElement('div');
        element.classList.add('unimagined__popup');
        element.onclick = event => {
          event.stopPropagation();
        };
        element.style.zIndex = '1';
        element.style.position = 'absolute';
        element.style.backgroundColor = 'white';
        element.style.transform = 'translateX(12px) translateY(-50%)';
        element.style.borderRadius = '8px';
        element.style.boxShadow = '0 5px 35px 8px rgba(0, 0, 0, 0.15), 0 0 2px 1px rgba(0, 0, 0, 0.1)';
        element.style.left = '100%';
        element.style.width = '240px';
        element.style.padding = '24px';
        element.style.fontSize = '14px';
        element.style.fontFamily = 'Verdana';
        element.style.cursor = 'default';
        element.style.transitionProperty = 'opacity, margin';
        element.style.transitionDuration = '0.15s';
        element.style.marginLeft = '-4px';
        element.style.opacity = '0';
        element.style.pointerEvents = 'none';

        const close = document.createElement('button');
        close.onclick = event => {
          event.stopPropagation();
          element.style.marginLeft = '-4px';
          element.style.opacity = '0';
          element.style.pointerEvents = 'none';
        };
        close.textContent = '✕';
        close.style.position = 'absolute';
        close.style.width = '20px';
        close.style.height = '20px';
        close.style.backgroundColor = 'transparent';
        close.style.color = 'gray';
        close.style.top = '6px';
        close.style.right = '6px';
        element.appendChild(close);

        const name = document.createElement('h1');
        name.textContent = data.name;
        name.style.fontSize = '16px';
        name.style.fontFamily = 'Verdana';
        name.style.fontWeight = 'bold';
        name.style.marginBottom = '8px';
        element.appendChild(name);

        const brand = document.createElement('p');
        brand.textContent = data.brand;
        brand.style.fontSize = '12px';
        brand.style.color = 'gray';
        brand.style.marginBottom = '20px';
        element.appendChild(brand);

        const description = document.createElement('p');
        description.textContent = data.description;
        description.style.marginBottom = '0';
        element.appendChild(description);

        return element;
      };

      const createButton = () => {
        const element = document.createElement('button');
        element.style.position = 'absolute';
        element.style.backgroundImage = `url('${chrome.runtime.getURL('button.png')}'`;
        element.style.backgroundSize = '100%';
        element.style.backgroundColor = 'white';
        element.style.width = '48px';
        element.style.height = '48px';
        element.style.borderRadius = '50%';
        element.style.bottom = '24px';
        element.style.right = '0'
        return element;
      };

      const onProductInformationResponse = response => {
        const ourPopup = createPopup(response);
        const ourButton = createButton();
        ourButton.onclick = event => {
          event.stopPropagation();

          Array.from(document.querySelectorAll('.unimagined__popup')).forEach(element => {
            if (element === ourPopup && ourPopup.style.opacity === '0') {
              element.style.marginLeft = '';
              element.style.opacity = '';
              element.style.pointerEvents = '';
            } else {
              element.style.marginLeft = '-4px';
              element.style.opacity = '0';
              element.style.pointerEvents = 'none';
            }
          });
        };

        const targetNode = tile.querySelector('[data-test-id=pt-image]').parentNode.parentNode;
        targetNode.style.position = 'relative';
        ourButton.appendChild(ourPopup);
        targetNode.appendChild(ourButton);
      };

      const fireProductInformationRequest = () => {
        const request = new XMLHttpRequest();
        request.onload = () => {
          if (request.status === 200) {
            onProductInformationResponse(JSON.parse(request.responseText));
          }
        };
        request.open('POST', 'https://api.dev-euw1.sustained.app/v1/product-information');
        request.send(JSON.stringify({
          domain: 'sainsburys.co.uk',
          entity: 'product',
          features: {
            product_id: productId
          }
        }));
      };

      fireProductInformationRequest();
    });
  };

  setTimeout(processIfLoaded, 1000);
})();
