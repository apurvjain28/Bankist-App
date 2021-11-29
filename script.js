'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////// Smooth button Scrolling

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset);
  console.log(
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

/// Event Delegation/ page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // guard statement
  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// menu fade animation

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
    const logo = e.target.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};

// cant understand: Use of bind here... To do later
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});

// Sticky navigation

// Inefficient Way
// const initcoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initcoords.top) {
//     nav.classList.add('sticky');
//   } else nav.classList.remove('sticky');
// });

// Efficient way using Observing API:

// const ObsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const ObsOptions = {
//   root: null, // from null means top of page
//   threshold: [0, 0.2],
//   // 0 triggers callback even when target is completely out of view and also as soon as it enters the view
//   // 1 would mean callback triggered when whole target element is visible in viewport
// };

// const observer = new IntersectionObserver(ObsCallback, ObsOptions);
// observer.observe(section1);

// We want sticky when header is completely out of view

const navMargin = nav.getBoundingClientRect().height;

const stickyCallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};

const headObserver = new IntersectionObserver(stickyCallback, {
  root: null,
  threshold: 0,
  rootMargin: `-${navMargin}px`,
});
headObserver.observe(header);

// Revealing Element Scroll

const sectionCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(sectionCallback, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// loading lazy images

const imgCallback = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // console.log(entry.target.getAttribute('src'));
  // console.log(entry.target.dataset.src);
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(imgCallback, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

const imgTargets = document.querySelectorAll('img[data-src]');
imgTargets.forEach(function (img) {
  imgObserver.observe(img);
});

// slider

const sliders = function () {
  const slider = document.querySelector('.slider');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const slide = document.querySelectorAll('.slide');
  const dotContainer = document.querySelector('.dots');

  let currSlide = 0;
  const maxSlide = slide.length;
  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';

  // FUnctions

  const createDots = function () {
    slide.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDot = function (curr) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${curr}"]`)
      .classList.add('dots__dot--active');
  };

  slide.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));

  const goToSlide = function (curr) {
    slide.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - curr)}%)`)
    );
  };

  const nextSlide = function () {
    if (currSlide === maxSlide - 1) {
      currSlide = 0;
    } else {
      currSlide += 1;
    }
    goToSlide(currSlide);
    activeDot(currSlide);
  };

  const prevSlide = function () {
    if (currSlide == 0) {
      currSlide = maxSlide - 1;
    } else {
      currSlide -= 1;
    }
    goToSlide(currSlide);
    activeDot(currSlide);
  };

  //  Event initialization

  const init = function () {
    goToSlide(0);
    createDots();
    activeDot(0);
  };

  init();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activeDot(slide);
    }
  });
};

sliders();

////////////////////////////////////////////////////
/*
1. Selecting Elements:
  a. Selecting all the Elements:
    document.documentElement
  b. Selecting body or head:
    document.body, document.head
  c. document.querySelectorAll('.section') >>> returns NodeList- doesnt update itself
    document.querySelector('')
    document.getElementByID('')
    document.getElementByTagName('') >>> returns HTMLCollection updated automatically
    documnet.getElementByClassName('')

2. Creating and inserting Element:
  a. .insertAdjacentHTML

  b. document.createElement('TAGNAME')
  header.prepend(message);
  header.append(message);
  <even we create same elements multiple times, it ll only appear once>
  if we want to create same element multiple times then then USE:
  header.append(message.cloneNode(true));

  c. header.before(message)
  header.after(message)
  <elment is inserted before and after the siblings >

3. Delete Element:
  a. .remove()
  <Earlier we had to select the parent child first to remove the child>
  eg: message.parentElement.removeChild(message); >>>> DOM Traversing


4. Styles, Attribute and CLasses:
  We can set the style and attribute and also return it to console
  1. Style: >> add inline styles
    message.style.width = '120%';
    >> we can return only inline styles in console
    a. getComputedStyle(message) >> gives all the style even in stylesheet
        getComputedStyle(message).height
        Another way: 
        document.documentElement.style.setProperty('--color-primary', 'orangered');
  2. Attributes: 
    a. D/f between 
    logo.alt: 
      only returns defined attributes of element
      gives absolute link
    logo.getAttribute('alt'): 
      returns any specified attribute of element
      gives relative link
    b. '-' in html is used as camel case
    c. data attribute objects>> will be used when we need tio store data >> LATER
  
  3. Classes:
    a. logo.classList.add("");
    b. logo.classList.remove("");
    c. logo.classList.toggle("");
    d. logo.classList.contains("");


5. Smooth Scrolling:
  1. section1.getBoundingClientRect() >> Coordinates of section:
    x and y/top= distance of section1 from border of browser (from element and top of viewport)
    getBoundingClientRect is relative to viewport
  2. window.pageXOffset and window.pageYOffset
    Distance from top of the page to edge of the viewport
  3. Height and width of the viewport: (Excludes any scroll bars)
    document.documentElement.clientHeight
  4. window.scrollTo({
    left:
    top:
    behavior: 'smooth'
  })
  OR new method:
  section1.scrollIntoView({behavior: 'smooth'})

6. Types of events:
  keyboards and mouse events are important ones
  a. To remove Event listener:
    h1.removeEventListener('mouseenter', alertH1);
  b. another way to Remove: By setTimeout(()=> h1.removeEventListener('mouseenter', alertH1),3000)

7. Propagation of elements:
  An event handler is listening to not only target element but also parent elements 
  a. To stop propagation:
  e.stopPropagation() >> In practise not a good idea to use it but can fix issues in complex apps
  The events are captured at bubbling phase rather than capturing phase. Capturing phase is irrelevant.
  Bubbling phase is very imp for event delegation
  b. if we set third parameter as 'true' then propagation happens at capturing phase

8. Event delegation and page navigation:
  ForEach could lead to performance issues if there are 1000s of elements in eventListener so 
  use of event delegation comes into play.
  In event delegation, we use the fact that events bubble up. We do that by putting event eventListener
  on a common parent of all the elements that we are interested in.
  How to use event delegation:
  a. Add eventListener to common parent element
  b. Determine what element originated the event
  Important Use:
  To work on elements which is not yet at page on runtime. coz it maynot be possible to add
  eventhandler to events which do not exist

9. DOM Traversing:
  Walking through the DOM >> Can select one element based on another element
  Sometimes useful when we dont know the DOM structure
  FOR CHILD: Going downward
  a. h1.childNodes >> gives all the nodes of immediate child
  b. h1.children >> given all HTML collection of immediate child
  c. h1.firstElementChild.style.color = 'white'
  d. h1.lastElementChild.style.color = 'orangered'

  FOR PARENT: Going upward
  a. h1.parentNode >> gives immediate parent nodes 
  b. h1.parentElement >> gives immediate element
  c. h1.closest('.header').style.background = 'var(--property-)' >> needs to find parent no matter how far away it is in DOM tree. 
  For ex: if there are multiple header elements in DOM but we want to get parent element header of h1. >> receives string 
  just like querySelector or querySelectorAll but opposite as queryselector finds child and closest finds parents no matter how
  high up in DOM tree >> can be used with custom property of CSS

  FOR SIBLINGS: going sideways
  We can only select immediate siblings in JS
  a. h1.previousElementSibling
  b. h1.nextElementSibling
  OR
  c. h1.parentElement.children >> finds All siblings incl. h1 

10. Building Tabbed component:
  BASICALLY adding and removing classes: 
  a. Using "active" class in one of tabs and moving it on clicking  
  b. Using dataset attribute>>> to change other element attached with it

11. Passing Arguments to event handler:
  Learnt: fading all other element except the one hovered over
  HOw 'moveover' and 'mouseout' events written with each other and could be converted to a function! 
  Use of bind method >>> To do later

12. Sticky Navigation:
  1. inefficient method:
    using window.scrollY and getBoundingClientReact() and window.addEventListener('scroll', function())

13. Better way of sticky navigation: Intersection Observer API
  This API allows code to observe how a target element intersects another element or it intersects the
  viewport.
  const observer = new IntersectionObserver(ObsCallback, ObsOptions); >> would see if observer.observe(section1);
    a. determines intersecting ratio
    b. is intersecting or not >> IsIntersecting becomes true/false in entry callback
  ObsOptions: an object
    root>> element that target(section1) is intersecting >> null means viewport
    threshold>> percentage of intersection at which ObsCallback will be called (can be array)
        // 0 triggers callback even when target is completely out of view and also as soon as it enters the view
        // 1 would mean callback triggered when whole target element is visible in viewport
    rootmargin>> '-90px' >> distance before reaching target when call back should be triggered
  ObsCallback: A callback function
    Will be called each time when target element intersect the root element @ thresold we define
    Arguments: (entries,observer)
    entries- thresold array from obsOption
    observer: API element itself passed >>> lets unobserve the entry.target so that if can stop observing again
    and again on scrolling to and fro

  14. Revealing element scroll: 
  Use of Intersection Observer again

  15. Lazy Loading Images:
  Use of Intersection Observer again
  When image is loaded a 'load' event is created which can be caught by eventListener

  16. Building Sider Component:
  iterating transform = 'translateX()'

  17. Creating Dots:
  a. Create each Dot >> <button class="dots__dot" data-slide="#{i}"></button>
  b. Attach event handler to each dot using event delegation
  c. build an indicator to show change in slide... Even when arrow is used
    remove dots__dot--active from active dot
    put dots__dot--active attribute based on dataset attribute
  
18. LifeCycle of DOM Events:
  a. 'DOMContentLoaded' >> fired by window when HTML is completely parsed
    Means HTML is downloaded and converted to DOM tree
    This event doesnt wait for images and other external resources to load.. just HTML and JS script

  b. 'load' >> fired by window not only when HTML is parsed but also other external resources and images loaded 

  c. 'beforeunload' >> just beofre when user wants to leave the page
  should not be abused too much
  */

/*
// const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
// console.log(header);

///////////////// Creating and inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');

message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button> ';
header.prepend(message);
// header.append(message);

// Delete element
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
    // message.parentElement.removeChild(message)
  });

/////////////////// Styles, Attribute and Classes:

message.style.width = '120%';
console.log(getComputedStyle(message).backgroundColor);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attribute
const logo = document.querySelector('.nav__logo');

console.log(logo.alt);
console.log(logo.designer);
console.log(logo.getAttribute('designer'));

logo.setAttribute('company', 'Bankist');

console.log(logo.src); // Gives absolute link
console.log(logo.getAttribute('src')); // Gives relative link

// data attributes
console.log(logo.dataset.versionNumber);

// Classes
// logo.classList.add('c', 'j');

//////////////////// Types of events

const h1 = document.querySelector('h1');

// h1.onmouseenter = function (e) {
//   alert('No use of reading the headings :D');

const alertH1 = function (e) {
  alert('Great! Boooring headings!');

  h1.removeEventListener('mouseenter', alertH1);
};

h1.addEventListener('mouseenter', alertH1);

////////////////////////// Propagation

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   // Stop propagation
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// });

*/
