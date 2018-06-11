module.exports = {
    viewAll: (id, url) => `
        <div class="meme">
            <a href="/memes/${id}">
                <img class="memePoster" src="${url}"/> 
            </a>         
        </div>`,
    genreOption: (id, title) => `<option value="${id}">${title}</option>`,
    details: (url, title, description, id) => `
        <div class="content">
            <img src="${url}" alt=""/>
            <h3>Title ${title}</h3>
            <p>${description}</p>
            <a href="${url}" download="${title}.jpg">Download Meme</a>
            <a href="/memes/delete/${id}">Delete Meme</a>            
        </div>`,
    detailsLink: (id, url) => `
        <div class="meme">
            <a href="/memes/${id}">
            <img class="memePoster" src="${url}"/>          
        </div>`
};
