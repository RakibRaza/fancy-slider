const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderMain = document.querySelector(".main");
const sliderContainer = document.getElementById("sliders");
const preloader = document.getElementById("preloader");
const notFound = document.getElementById("not-found");
const backHomeBtn = document.querySelector(".back-home");
const countImage = document.getElementById("image-count");
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "20264168-61ff135e838b9a3600a8d0271&q=";

// show images
const showImages = (images) => {
  imagesArea.style.display = "block";
  gallery.innerHTML = "";
  // show gallery title
  galleryHeader.style.display = "flex";
  images.forEach((image) => {
    let div = document.createElement("div");
    div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
    div.innerHTML = ` <img class="img img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
  });
};

const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}${query}`)
    .then((response) => response.json())
    .then((data) => {
      const images = data.hits;

      preloader.style.display = "none";
      if (images.length === 0) {
        notFound.style.display = "block";
      } else {
        showImages(images);
      }
    })
    .catch((err) => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle("added");

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
    countImage.innerText = parseInt(++countImage.innerText);
  } else {
    for (let i = 0; i < sliders.length; i++) {
      if (sliders[i] === img) {
        sliders.splice(i, 1);
      }
    }
    countImage.innerText = parseInt(--countImage.innerText);
  }
};
var timer;
const createSlider = (duration) => {
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  sliderMain.style.display = "block";
  // hide image aria
  imagesArea.style.display = "none";

  sliders.forEach((slide) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  });
  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  sliderMain.style.display = "none";
  clearInterval(timer);
  const search = document.getElementById("search");

  if (search.value) {
    sliders.length = 0;
    showPreloader();
    getImages(search.value);
  }
  search.value = "";
});

sliderBtn.addEventListener("click", function (e) {
  e.preventDefault();
  clearInterval(timer);
  let duration = document.getElementById("duration").value || 1000;
  if (isNaN(duration)) {
    alert("Please, enter Millieseconds.");
    return;
  }
  if (duration < 1000) {
    duration = 1000;
  }
  if (duration > 5000) {
    duration = 5000;
  }
  createSlider(duration);
  document.getElementById("duration").value = "";
});

const showPreloader = () => {
  preloader.style.display = "block";

  imagesArea.style.display = "none";
  notFound.style.display = "none";
};

backHomeBtn.addEventListener("click", () => {
  sliderMain.style.display = "none";
  imagesArea.style.display = "block";
});
