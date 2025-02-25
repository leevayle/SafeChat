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



    // shortcuts to send and add new line
//Allow user to press shift enter to add a new line in text
document.getElementById('msg').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault(); // Prevent form submission or unintended behavior
        this.value += '\n'; // Add a new line to the message input
    } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Prevent new line behavior
        document.getElementById('send').click(); 
        //clear msg
        document.getElementById('msg').value = '';
        document.getElementById('msg').focus();
    }
}); 

connectWebSocket();

