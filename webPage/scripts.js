const ounce = document.querySelector("#nav");
const space = document.querySelector('#space');
document.addEventListener("scroll", onscrl);
const toTop = document.createElement('p');
toTop.appendChild(document.createTextNode('['));
toTop.appendChild(document.createElement('a'));
toTop.appendChild(document.createTextNode(']'));
toTop.childNodes[1].href = '#head';
toTop.childNodes[1].textContent = '<<';
function onscrl() {
  if (window.scrollY < 10) {
    space.style.height = '15vh';
    ounce.removeChild(toTop);
    ounce.classList.replace("down", "up");
  } else {
    ounce.insertBefore(toTop, ounce.childNodes[0]);
    ounce.classList.replace("up", "down");
  }
}