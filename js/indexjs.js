
// Get user theme for rendering
document.addEventListener('DOMContentLoaded', () => {

    // theme.href = `../css/light.css`;

    function getUserTheme() {
        const theme = document.getElementById('theme');
        const themePreference = localStorage.getItem('theme');
    
        if (themePreference) {
            // Apply theme based on local storage value
            if (themePreference === '2') {
                theme.href = `../css/dark.css`;
                console.log('Theme preference: dark (from local storage)');
            } else {
                theme.href = `../css/light.css`; // Default to light for '1' or other values
                console.log('Theme preference: light (from local storage)');
            }
        } else {
            // Fallback to fetching from the server
            fetch('/profile.js')
                .then(response => response.json())
                .then(data => {
                    if (data.theme === '2') {
                        theme.href = `../css/dark.css`;
                        console.log('Theme preference: dark (from server)');
                    } else {
                        theme.href = `../css/light.css`; // Default to light for '1' or other values
                        console.log('Theme preference: light (from server)');
                    }
                })
                .catch(error => {
                    console.error('Error fetching user theme from server:', error);
                    // Default to light in case of an error
                    theme.href = `../css/light.css`;
                });
        }
    }
    
    // Call the function to apply the theme
    getUserTheme();
    




  //testing the light colors - temporary
// document.getElementById('l').addEventListener('click', ()=>{
//     const theme = document.getElementById('theme');
//     theme.href = `../css/light.css`; 
//     console.log('Theme -> Light');
// });
// document.getElementById('d').addEventListener('click', ()=>{
//     const theme = document.getElementById('theme');
//     theme.href = `../css/dark.css`; 
//     console.log('Theme -> Dark');
// });


function Theme(){
    const theme = document.getElementById('theme');
    const themePreference = localStorage.getItem('theme');

    if (themePreference === '2') {
        theme.href = '../css/dark.css';
    } else if (themePreference === '1') {
        theme.href = '../css/light.css';
    }

}

Theme();



document.getElementById('themebtn').addEventListener('click', () => {
    theme.href = theme.href.includes('dark.css')
        ? '../css/light.css'
        : '../css/dark.css';

    localStorage.setItem('theme', theme.href.includes('dark.css') ? '2' : '1');
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




});



    // Get the new message modal open
    const newmsg = document.getElementById('newmessage');
    const modal = document.getElementById('newmessagemodal');

    // when button is clicked change from display none to flex
    newmsg.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.getElementById('nminput').focus();
    });

    function NmContinue(){
        document.getElementById('nmcontinue').addEventListener('click', () => {
            modal.style.display = 'none';
            
        });
    }
    NmContinue();
    
    

    // Save number to localstorage when user hits continue
    document.getElementById('nmcontinue').addEventListener('click', () => {
        var to = document.getElementById('nminput').value;
        localStorage.setItem('to',btoa(to));
        document.getElementById('nminput').value = '';

        // for new message append a message child

        var toid = localStorage.getItem('to');

        //Create HTML for client chats
        const messagechatparentDIV = document.querySelector('.history');
        const messagechathtml = `
        <div id="${toid}" class="text">
            <div class="t-profile ">
                <div class="person">
                    <img id="user-profile-url" src="../images/profiles/default.jpg">
                    
                </div>
                <div id="online-status" class="offline-status">

                </div>
            </div>
            <div class="t-text ">
                <div id="user-name" class="t-name ">
                    ${atob(toid)}
                </div>
                <div id="user-message" class="t-message " title="">
                    Draft
                </div>
            </div>
            <div class="t-time ">
                <div id="user-message-time" class="t-time1 ">
                    
                </div>
                <div id="user-message-count" class="t-notification ">
                    
                </div>
            </div>
        </div>
        
        `


        messagechatparentDIV.innerHTML = messagechathtml;
    });

    const Recents = [order,{
        to : '',
        message: '',
        active : true,
        count : '',
        url : '',
        order : ''
    }];
