window.onload = function() {
    function adjustPadding() {
      var navHeight = document.querySelector('nav').offsetHeight;
      var mainElement = document.querySelector('main');
      mainElement.style.padding = `${navHeight + 10}px 20px`;
    }
  
    adjustPadding();
    window.addEventListener('resize', adjustPadding);
  }
  