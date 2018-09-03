/* 
Activité 3
*/

//ère partie : récupérer le fichier JSON depuis l'API et mise en forme

var contenuElts = document.getElementById("contenu")
var ligneTitreElts = document.createElement("h4");
var ligneAuteur = document.createElement("span");
var listeLiens =[];

function creerElementLien(lien) {


    var divElt = document.createElement("div"); // Création d'une div 
    divElt.className = "lien";

    var spanElt = document.createElement("span"); // Création du span pour coller avec le fichier CSS
    spanElt.textContent = " " + lien.url;

    var lienElt = document.createElement("a"); // Création des liens cliquables
    lienElt.href = lien.url;
    lienElt.textContent = lien.titre;

    var pElt = document.createElement("p"); // Deuxième ligne
    pElt.textContent = "ajouté par " + lien.auteur;
         

    contenuElts.appendChild(divElt); // Insertion des div
    divElt.appendChild(lienElt); //Insertion dans les div de chaque élément
    divElt.appendChild(spanElt);
    divElt.appendChild(pElt);

    return divElt;
};

ajaxGet(" https://oc-jswebsrv.herokuapp.com/api/liens", function(fichier){
    var listeLiens = JSON.parse(fichier);
    listeLiens.forEach(creerElementLien);
});

//Ici je reprends la correction de l'activité 2 pour la création du formulaire d'ajout
function creerForm(placeholder, taille, name) {
    var inputElt = document.createElement("input");
    inputElt.type = "text";
    inputElt.setAttribute("placeholder", placeholder);
    inputElt.setAttribute("size", taille);
    inputElt.setAttribute("required", "true");
    inputElt.setAttribute("name", name);
    inputElt.style.marginRight = "20px";
    return inputElt;
};

// Gestion du formulaire : apparition et disparition
var zoneForm = document.getElementById("ajout");

//création du 1er bouton (celui qui "fait apparaître" le formulaire)
var boutonAjout = document.createElement("button");
boutonAjout.id = "ajoutLien";
boutonAjout.textContent = "Ajouter un fichier";

zoneForm.appendChild(boutonAjout);

//Apparition du formulaire lors du clic sur le bouton

var ajouterLienElt = document.getElementById("ajoutLien");
var formAjoutElt = document.createElement("form");
    // Création des éléments du formulaire
ajouterLienElt.addEventListener("click", function () {
    var auteurElt = creerForm("Entrez votre nom", 20, "auteur");
    var titreElt = creerForm("Entrez le titre du lien", 40, "titre");
    var urlElt = creerForm("Entrez l'URL du lien", 40, "url");
 
    // Création du bouton de validation
    var ajoutElt = document.createElement("input");  
    ajoutElt.type = "submit";
    ajoutElt.id = "envoi";
    ajoutElt.value = "Ajouter";
 
    // Insertion du formulaire dans la page
    
    formAjoutElt.id = "formEnvoi"; 
    formAjoutElt.appendChild(auteurElt);
    formAjoutElt.appendChild(titreElt);
    formAjoutElt.appendChild(urlElt);
    formAjoutElt.appendChild(ajoutElt);
 
     
    // Remplacement du bouton d'ajout par le formulaire crée
    zoneForm.replaceChild(formAjoutElt, ajouterLienElt);
});

document.getElementById("ajout").addEventListener("submit", function(e){
    e.preventDefault();
    var nouveauLien = {
    titre: e.target.elements.titre.value,
    url: e.target.elements.url.value,
    auteur: e.target.elements.auteur.value
    };
    ajaxPost("https://oc-jswebsrv.herokuapp.com/api/lien", nouveauLien, function(){
        var lienAjoute = creerElementLien(nouveauLien);
        //zoneForm.replaceChild(ajouterLienElt, formAjoutElt);
        // Positionnement du nouveau lien en haut de la liste
        contenuElts.insertBefore(lienAjoute, contenuElts.firstChild);  
            // Création du message d'information 
            var infoElt = document.createElement("div");
            infoElt.classList.add("info");
            infoElt.textContent = "Le lien \"" + nouveauLien.titre + "\" a bien été ajouté."; 
            //apparition du message...
            zoneForm.replaceChild(infoElt, formAjoutElt);
            //...et suppresion après 4 secondes avec remplacement immédiat par le bouton d'ajout
            setTimeout(function () {
            zoneForm.replaceChild(ajouterLienElt, infoElt);
            }, 4000);
    }, true);
});
