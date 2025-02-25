document.addEventListener('DOMContentLoaded', () => {
    // // update profile picture and phone number
    // const profilePic = document.getElementById('user-profile-url');
    // const phoneNumber = document.getElementById('user-name');

    // //update profile pic if none use default
    // const localprofile = localStorage.getItem('profile');

    // if(localprofile){
    //     profilePic.src = "../images/profiles/"+localStorage.getItem('profile');
    // }else{
    //     profilePic.src = "../images/profiles/default.jpg";
    // }

    // //update own phone number for own chat
    // // phoneNumber.textContent = atob(localStorage.getItem('id_phn'));
    // phoneNumber.textContent = "Miamorr";


    // document.addEventListener('DOMContentLoaded', () => {
    //     const messagesContainer = document.querySelector('.chats'); // Parent of '.text' elements
    //     const chat = document.querySelector('.messages');
    //     const clickable = document.querySelectorAll('.text');
    //     // Chat display
    //      // Messages list display
    
    //     clickable.addEventListener('click', (event) => {
    //         // Check if the clicked element has the 'text' class
    //         if (event.target.classList.contains('text')) {
    //             //messagesContainer.style.display = 'none'; // Hide the messages container
    //             chat.style.display = 'block'; // Show the chat container
    //         }
    //     });
    // });




});   

// document.addEventListener('DOMContentLoaded', () => {
//     const parentContainer = document.querySelector('.history'); // Adjust as needed

//     parentContainer.addEventListener('click', (event) => {
//         const clickedElement = event.target.closest('.text'); // Check if click is within a `.text` element

//         if (clickedElement) {
//             const activeNotification = clickedElement.querySelector('.t-notification');
//             if (activeNotification) {
//                 document.getElementById('messagemenu').style.display = 'none';
//                 document.getElementById('chat').style.display = 'flex';
//                 console.log('messages hidden');
//             }
//         }
//     });
// });