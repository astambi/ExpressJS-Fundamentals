function getMessage() {
    // alert('New Message!');

    $.get('/data/messages').then(data => {
        console.log(data);
    });
}
