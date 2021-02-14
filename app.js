const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search');
const loadingToggler = document.getElementById('loading-toggler');
const sliderBtn = document.getElementById('create-slider');
const notFound = document.getElementById('not-found');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];

//  api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images
const showImages = (images) => {
  notFound.innerHTML="";
  if(images.length == 0){
    imagesArea.style.display = "none";
    let div = document.createElement('div');
    div.innerHTML=`
      <h2 class="mt-5 text-danger text-center">${searchInput.value} search result is not Found </h2>
      <h5 class="text-center text-white">search some valid, relevant keyword</h5>
    `;
    notFound.appendChild(div);
    toggleSpinner(false);
    return;
    
  }
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })
  toggleSpinner(false);

}

// for toggle spinner
const toggleSpinner = (show) =>{
  loadingToggler.innerHTML="";
  div = document.createElement('div');
  div.className = 'spinner-grow text-dark';
  div.setAttribute('role','status');
  div.innerHTML = `<span class="visually-hidden">Loading...</span>`;
  loadingToggler.appendChild(div);
  if (show){
    loadingToggler.classList.add('d-flex');
    loadingToggler.style.display = "block";
  }
  else{
    loadingToggler.classList.remove('d-flex');
    loadingToggler.style.display = "none";
  }
  

}
const getImages = (query) => {
  if(query !== ""){
    toggleSpinner(true);
    fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
  }
  else{
    alert("please enter some keyword in search box");
  }
}

// for using keyboard enter key
searchInput.addEventListener('keyup', (event) => {
  if(event.key === "Enter"){
    searchBtn.click();
  }
})

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added'); //"added" class helps to identify selected image
  let item = sliders.indexOf(img);
  let filteredSliders = [];
  if (item === -1) {
    sliders.push(img);
  } else {
    //filtering unselected images
    filteredSliders = sliders.filter(slide => slide !== img );
    sliders = filteredSliders;
    element.classList.remove('added');
  }
}
var timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.');
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image area
  imagesArea.style.display = 'none';
  let duration = document.getElementById('duration').value || 2000;
  duration = Math.abs(duration);

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  getImages(searchInput.value);
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})
