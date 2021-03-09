// Creacion de variables DOM globales
var botonsearch = document.getElementById("botonsearch");
var search = document.getElementById("search");
var main = document.getElementById("main");
var nameUser;

// Funcion principal 
async function searchProfile() {
    const checkingSearch = await searchUserByName();
    if (checkingSearch) {
        // Funcion limpiar perfil 
        await removeProfile();
        // Funcion ocultar glide
        await HideGlide();
        // Funcion crear el contenedor de la informacion del usuario
        await CreateCarId();
        // Funcion construir la informacion basica del usuario: nombre, username
        await headerRender();
        // Funcion construir la informacion del usuario: direccion, ciudad, sitio web y nombre de compañia
        await infoContainerRender();
        // Funcion construir la informacion de los posts del usuario
        await postsContainerRender();
    } else {
        await userNotFound();
    }
}

function removeProfile() {
    // Eliminamos el contenedor cardUser del div main
    main.removeChild(cardUser);

}

function HideGlide() {
    // creacion de la variable contentGlide  la cual hace parte de la estructura inicial del HTML y contiene la presentacion inicial de la pagina
    let contentGlide = document.getElementById("contentGlide");
    // se oculta la presentacion inicial para dar paso a la creacion del contenido del usuario
    contentGlide.style.display = "none";
}

function ShowGlide() {
    // creacion de la variable contentGlide dentro de la funcion ShowGlide, la cual devuelve al usuario a la presentacion inicial
    let ContainerGuide = document.getElementById("contentGlide");
    // permite la visualizacion de la presentacion inicial cuando se retorna al home de la pagina
    ContainerGuide.style.display = "flex";
    // creacion de la variable cardUser dentro de la funcion ShowGlide
    let cardUser = document.getElementById("cardUser");
    // se oculta el contenedor de la informacion y posts del usuario cuando se retorna al home de la pagina
    cardUser.style.display = "none";
}

function CreateCarId() {

    let cardUser = document.createElement("div");
    cardUser.setAttribute("id", "cardUser");
    main.appendChild(cardUser);

}

async function headerRender() {
    let infoUser = await searchUserByName();

    let headerUser = document.createElement("div");
    headerUser.setAttribute("id", "headerUser");
    cardUser.appendChild(headerUser);

    let imageContainer = document.createElement("div");
    imageContainer.setAttribute("id", "imageContainer");
    headerUser.appendChild(imageContainer);

    let userNameContainer = document.createElement("div");
    userNameContainer.setAttribute("id", "userName");
    headerUser.appendChild(userNameContainer);

    let url = "https://randomuser.me/api/";
    const res = await fetch(url);
    const image = await res.json();

    let userImage = document.createElement("img");
    userImage.setAttribute("src", image.results['0'].picture.large);
    userImage.setAttribute("id", "userImage");
    imageContainer.appendChild(userImage);

    let textUsername = document.createElement("p");
    textUsername.setAttribute("id", "textUsername");
    userNameContainer.appendChild(textUsername);
    textUsername.appendChild(document.createTextNode(`@${infoUser.username}`));

    let textName = document.createElement("p");
    textName.setAttribute("id", "textName");
    userNameContainer.appendChild(textName);
    textName.appendChild(document.createTextNode(infoUser.name));

}

async function searchUserByName() {
    let encoded = encodeURI(search.value);
    const url = `https://jsonplaceholder.typicode.com/users?name=${encoded}`;
    const res = await fetch(url);
    const resJSON = await res.json();
    return resJSON[0];
}

async function infoContainerRender() {
    let personalData = document.createElement("div");
    personalData.setAttribute("id", "personalData");
    cardUser.appendChild(personalData);
    let infoUser = await searchUserByName();

    const personalDataMaping = [{
        userInfo: `${infoUser.address.street}`,
        src: "img/place.png"
    }, {
        userInfo: `${infoUser.address.city}`,
        src: "img/building.png"
    }, {
        userInfo: `${infoUser.website}`,
        src: "img/www.png"
    }, {
        userInfo: `${infoUser.company.name}`,
        src: "img/company.png"
    }]

    personalDataMaping.forEach(element => {

        let dataElement = document.createElement("p");
        dataElement.setAttribute("id", "dataElement");
        personalData.appendChild(dataElement);
        let iconImage = document.createElement("img");
        iconImage.setAttribute("src", element.src);
        iconImage.setAttribute("id", "iconImage");
        dataElement.appendChild(iconImage);
        dataElement.appendChild(document.createTextNode(`${element.userInfo}`));

    });


}

async function searchPostsById() {

    let infoUser = await searchUserByName();
    var url = `https://jsonplaceholder.typicode.com/posts?userId=${infoUser.id}`;
    const res = await fetch(url);
    const postsJSON = await res.json();
    return postsJSON;
}

async function postsContainerRender() {

    var postsContainer = document.createElement("div");
    postsContainer.setAttribute("id", "postsContainer");
    cardUser.appendChild(postsContainer);

    let postsJSON = await searchPostsById();
    postsJSON.forEach(infoPost => {

        var textPost = document.createElement("div");
        textPost.setAttribute("class", "textPost");
        textPost.setAttribute("id", infoPost.id);

        var textPostTitle = document.createElement("h1");
        textPostTitle.setAttribute("class", "textPostTitle");
        textPostTitle.setAttribute("id", infoPost.id);

        var textPostDescription = document.createElement("p");
        textPostDescription.setAttribute("class", "textPostDescription");
        textPostDescription.setAttribute("id", infoPost.id);

        var title = document.createTextNode(infoPost.title);
        var contentPost = document.createTextNode(infoPost.body);

        textPostTitle.appendChild(title);
        textPostDescription.appendChild(contentPost);
        textPost.appendChild(textPostTitle);
        textPost.appendChild(textPostDescription);
        postsContainer.appendChild(textPost);

    });

    //identificacion de click en los comentarios
    postsContainer.addEventListener("click", async event => {
        const idPost = event.target.id;
        console.log(event.target.id);
        await comentsContainerRender(idPost);
        comentsContainerModal.style.display = "flex";

    })
}

/**
 * This method search comments by post ID
 * @param {number} idPost - post ID
 */
async function searchComentsById(idPost) {

    let url = `https://jsonplaceholder.typicode.com/comments/?postId=${idPost}`;
    const res = await fetch(url);
    const comentsJSON = await res.json();
    return comentsJSON;
}

/**
 * This method search the data in the comment
 * @param {number} idComent - comment ID
 */
async function comentsContainerRender(idComent) {

    let comentsContainer = document.createElement("div");
    comentsContainer.setAttribute("id", "comentsContainer");

    let imageComent = document.createElement("img");
    imageComent.setAttribute("id", "imageComent");

    let spanComent = document.createElement("spanComent");
    spanComent.setAttribute("id", "spanComent");

    let comentsContainerModal = document.createElement("div");
    comentsContainerModal.setAttribute("id", "comentsContainerModal");

    let spanX = document.createTextNode("\u00d7");

    let ContainerImageComent = document.createElement("div");
    ContainerImageComent.setAttribute("id", "ContainerImageComent");

    let imageComentR = await comentImageR()
    imageComent.setAttribute("src", imageComentR)

    let comentsJSON = await searchComentsById(idComent);

    comentsContainerModal.appendChild(comentsContainer);
    comentsContainerModal.appendChild(ContainerImageComent);
    cardUser.appendChild(comentsContainerModal);
    ContainerImageComent.appendChild(imageComent);
    spanComent.appendChild(spanX);
    comentsContainerModal.appendChild(spanComent);

    comentsJSON.forEach(infoComents => {
        var textComent = document.createElement("div");
        textComent.setAttribute("class", "textComent");
        textComent.setAttribute("id", infoComents.id);
        var textNameComent = document.createElement("p");
        textNameComent.setAttribute("id", "textNameComent");
        var textEmailComent = document.createElement("p");
        textEmailComent.setAttribute("id", "textEmailComent");
        var textBodyComent = document.createElement("p");
        textBodyComent.setAttribute("id", "textBodyComent");
        var nameComent = document.createTextNode(infoComents.name);
        var emailComent = document.createTextNode(infoComents.email);
        var bodyComent = document.createTextNode(infoComents.body);

        textComent.appendChild(textNameComent);
        textComent.appendChild(textEmailComent);
        textComent.appendChild(textBodyComent);
        textNameComent.appendChild(nameComent);
        textEmailComent.appendChild(emailComent);
        textBodyComent.appendChild(bodyComent);
        comentsContainer.appendChild(textComent);
    })

    comentsContainerModal.onclick = function(event) {
        if ((event.target == comentsContainerModal) || (event.target == spanComent)) {
            comentsContainerModal.style.display = "none";
            //funcion borrarcomentarios
            removeComents()
        }
    }
}

async function comentImageR() {

    let randomImage = Math.floor(Math.random() * 671);
    let url = `https://rickandmortyapi.com/api/character/${randomImage}`;
    const res = await fetch(url);
    const imageJSON = await res.json();
    return imageJSON.image;
}

async function removeComents() {

    cardUser.removeChild(comentsContainerModal)

}

function userNotFound() {
    alert("User not found in our database 😭");
}