
// Get user theme for rendering
document.addEventListener('DOMContentLoaded', () => {

    theme.href = `../css/light.css`;

    // function getUserTheme() {
    //     const theme = document.getElementById('theme');

    //     if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //         theme.href = `../css/dark.css`;
    //         console.log('Theme preference: dark');
    //     } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    //         theme.href = `../css/light.css`;
    //         console.log('Theme preference: light');
    //     } else {
    //         theme.href = `../css/light.css`; // Default to light if no preference is set.
    //         console.log('Theme preference: No preference (defaulting to light)');
    //     }
    // }

    // getUserTheme();
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


document.getElementById('themebtn').addEventListener('click', ()=>{
    const theme = document.getElementById('theme'); 

     theme.href = theme.href.includes("dark.css") 
    ? "../css/light.css" 
    : "../css/dark.css";

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
 

function HideMenu (){
    const pop =  document.getElementById('top-menu');
    pop.style.height = '10px';
        
        setTimeout(()=>{
            pop.style.display = 'none';
        },100);
}
document.getElementById('menu').addEventListener('click', () => {
    const pop =  document.getElementById('top-menu');
    
    if(pop.style.display === 'flex'){        
        HideMenu();
       
    }else{

        pop.style.display = 'flex';
       
        setTimeout(()=>{
            pop.style.height = '130px';
        },0.1);

    }
});

document.getElementById('home').addEventListener('click', () => {
    
        HideMenu();    
});


// Allow send aftre one character in the input
    const send = document.getElementById('send');
    const msg = document.getElementById('msg');

    msg.addEventListener('input', ()=>{
        if(msg.value.length >=1){
            send.style.opacity = '1';
            send.style.cursor = 'pointer';
        }else{
            send.style.opacity = '0.5';
            send.style.cursor = 'not-allowed';
        }
    
    });


