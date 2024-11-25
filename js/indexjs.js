
// Get user theme for rendering
document.addEventListener('DOMContentLoaded', ()=>{
    function getUserTheme() {

        const theme = document.getElementById('theme');
    
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            theme.href = `../css/light.css`;
            console.log('Theme prefrence : dark');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            theme.href = `../css/light.css`;
            console.log('Theme prefrence : light');
        } else {
            theme.href = `../css/light.css`;
            console.log('Theme prefrence : No pref (will set to light)');
        }
      };

      getUserTheme();
});



  //testing the light colors - temporary
document.getElementById('l').addEventListener('click', ()=>{
    const theme = document.getElementById('theme');
    theme.href = `../css/light.css`; 
    console.log('Theme -> Light');
});
document.getElementById('d').addEventListener('click', ()=>{
    const theme = document.getElementById('theme');
    theme.href = `../css/dark.css`; 
    console.log('Theme -> Dark');
});


//this code just refused to work. i have no idea why!
document.getElementById('themebtn').addEventListener('click', ()=>{
    const theme = document.getElementById('theme');
    // theme.href = `../css/dark.css`; 
    // console.log('Theme -> Dark');

    if(theme.href === '../dark.css'){
        theme.href = '../css/light.css';
    }else{
        theme.href = '../css/dark.css';
    }
    // theme.href = "../dark.css" ? "../css/dark.css" : "../css/light.css" ;
});



  //The selector action
  document.getElementById('menu1').addEventListener('click', ()=>{

    document.getElementById('selector').style.left = '14.5%';
});
document.getElementById('menu2').addEventListener('click', ()=>{

    document.getElementById('selector').style.left = '45%';
});
document.getElementById('menu3').addEventListener('click', ()=>{

    document.getElementById('selector').style.left = '76%';
});

 /*
//The filter action
const all = document.getElementById('filter-all');
const unread = document.getElementById('filter-unread');
const newstatus = document.getElementById('filter-new-status');
const favourites = document.getElementById('filter-favourites');


    all.addEventListener('click', ()=>{
        all.classList.add('active-filter');
        unread.classList.remove('active-filter');
        newstatus.classList.remove('active-filter');
        favourites.classList.remove('active-filter');
    });

    unread.addEventListener('click', ()=>{
        unread.classList.add('active-filter');
        all.classList.remove('active-filter');
        newstatus.classList.remove('active-filter');
        favourites.classList.remove('active-filter');
    });

    newstatus.addEventListener('click', ()=>{
        newstatus.classList.add('active-filter');
        all.classList.remove('active-filter');
        unread.classList.remove('active-filter');
        favourites.classList.remove('active-filter');
    });

    favourites.addEventListener('click', ()=>{
        favourites.classList.add('active-filter');
        all.classList.remove('active-filter');
        unread.classList.remove('active-filter');
        newstatus.classList.remove('active-filter');
    }); */

    // The above code is thus surmarrized here :)

    const filters = document.querySelectorAll('.filter'); 
filters.forEach(filter => {
  filter.addEventListener('click', () => {
    filters.forEach(otherFilter => {
      otherFilter.classList.remove('active-filter');
    });
    filter.classList.add('active-filter');
  });
});
 


document.getElementById('menu').addEventListener('click', () => {
    const pop =  document.getElementById('top-menu');
    
    if(pop.style.display === 'flex'){
        pop.style.display = 'none';
        pop.style.opacity = '0.1';
        pop.style.transition = 'all 0.3s ease-in-out';
    }else{
        pop.style.display = 'flex';
        pop.style.opacity = '0.1';
        pop.style.opacity = '1';
        pop.style.transition = 'all 0.3s ease-in-out';

    }
});

document.getElementById('home').addEventListener('click', () => {
    const pop =  document.getElementById('top-menu');
    
        pop.style.display = 'none';
        pop.style.opacity = '0.1';
        pop.style.transition = 'all 0.3s ease-in-out';
    
});


