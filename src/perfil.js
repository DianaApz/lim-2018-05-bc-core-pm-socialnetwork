const  btnLogout = document.getElementById('btnLogout');
const perfil=document.getElementById('perfil');
const  logout = document.getElementById('logout');
const post=document.getElementById('post');
const btnSave=document.getElementById('btnSave');
const posted=document.getElementById('posted');
const bd=document.getElementById('bd');


let contenido=document.getElementById('contenido');
var database = firebase.database();
window.onload = ( ) =>{
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            
            console.log('Inicio Logueado');
            
            //console.log(user.uid);

            if(user.displayName!=null){
                var fire=firebase.database().ref().child('users');
                fire.on ('value',function(data){
                
                contenido.innerHTML=
                `<div>
                <img src="${data.val()[user.uid].profile_picture}" alt="perfil" width="70" height="70">
                <h2>Hola  ${data.val()[user.uid].username}</h2>
                <p>${data.val()[user.uid].email}</p>
                </div>`;
               })
               var fire=firebase.database().ref().child('user-posts');
                fire.once ('value',function(data){

                    let dataUserPosts=data;
                    //objObj={keyPost:{body:{{}}}}console.log(data.val()[user.uid]);
                    //objObj={userId:{keyPost:{body}}} console.log(data.val());
                    //arrUserId=console.log(Object.keys(dataUserPosts.val()));
                    // console.log(Object.values(data.val()));
                    let arrkeysPost=Object.keys(dataUserPosts.val()[user.uid]);
                    //console.log(arrkeysPost);
                   //arrkeysPost console.log(arrkeysPost);
                   arrkeysPost.forEach(keyPost=>{
                        // console.log(keyPost)
                        let message=dataUserPosts.val()[user.uid][keyPost].body;
                        // console.log(message);
                        showPublications(message,user.uid,keyPost);
                    });
                    
                    
                
               })

            }else {
                
                var fire=firebase.database().ref().child('users');
                fire.on ('value',function(data){
                
                contenido.innerHTML=
                `<div>
                <img src="${data.val()[user.uid].profile_picture}" alt="perfil" width="70" height="70">
                <h2>Hola  ${data.val()[user.uid].username}</h2>
                <p>${data.val()[user.uid].email}</p>
                </div>`;
               })
               
               var fire=firebase.database().ref().child('user-posts');
                fire.once ('value',function(data){

                    let dataUserPosts=data;
                    //objObj={keyPost:{body:{{}}}}console.log(data.val()[user.uid]);
                    //objObj={userId:{keyPost:{body}}} console.log(data.val());
                    //arrUserId=console.log(Object.keys(dataUserPosts.val()));
                    let arrkeysPost=Object.keys(dataUserPosts.val()[user.uid]);
                    //console.log(arrkeysPost);
                   //arrkeysPost console.log(arrkeysPost);
                   arrkeysPost.forEach(keyPost=>{
                        // console.log(keyPost)
                        let message=dataUserPosts.val()[user.uid][keyPost].body;
                        // console.log(message);
                        showPublications(message,user.uid,keyPost);
                    });
                    
                    
                
               })

            }
            
        } else {
            console.log('No esta logueado');
            
            
            
        }
    });
}
btnLogout.addEventListener('click',()=>{
    firebase.auth().signOut()
    .then(function(){
        console.log('cerro sesion');
        window.location.href='login.html';
        
       
    }).catch(function(error){
        console.log('error al cerrar sesion');
    });
});


btnSave.addEventListener('click',()=>{
    let userId=firebase.auth().currentUser.uid;
    const newPost=writeNewPost(userId,post.value);
    reload_page();
})


function showPublications(postContent,userId,keyPost){
    let publications = document.createElement('div');

    let sectionPost = document.createElement('textarea');
    sectionPost.setAttribute('id', keyPost);
    sectionPost.textContent = postContent;

    let sectionLike = document.createElement('div');
    let pLike=document.createElement('span');
    pLike.setAttribute('id', `likecount${keyPost}`);

    let btnLike= document.createElement('input');
    btnLike.setAttribute('id', `like${keyPost}`);
    //btnLike.setAttribute('class', 'falta clase');
    btnLike.setAttribute('value','Me gusta');
    btnLike.setAttribute('type','button');

    let sectionButtons = document.createElement('div');

    let btnEdit = document.createElement('input');
    btnEdit.setAttribute('id', `edit${keyPost}`);
    btnEdit.setAttribute('value','Editar');
    btnEdit.setAttribute('type','button');
    //btnEdit.setAttribute('class', 'falta clase');
    
    let btnDelete = document.createElement('input');
    btnDelete.setAttribute('id', `delete${keyPost}`);
    btnDelete.setAttribute('value','Eliminar');
    btnDelete.setAttribute('type','button');
    //btnDelete.setAttribute('class', 'falta clase');
    
    sectionLike.appendChild(btnLike);
    sectionLike.appendChild(pLike);

    sectionButtons.appendChild(btnDelete);
    sectionButtons.appendChild(btnEdit);
    
    posted.appendChild(publications);
    publications.appendChild(sectionPost);
    publications.appendChild(sectionLike);
    publications.appendChild(sectionButtons);
    
    
    let edit = document.getElementById(`edit${keyPost}`);
    let delet = document.getElementById(`delete${keyPost}`);
    let likes = document.getElementById(`like${keyPost}`);
    let likePoints = document.getElementById(`likecount${keyPost}`);

    
    
        //let userId = firebase.auth().currentUser.uid;
        //const currentPost = document.getElementById(`like${keyPost}`);
        //const likeButton = likes.querySelector('.like-button');

        //likePoints.textContent=objRefLike.length;
        
        firebase.database().ref('posts/' + keyPost) 
        .once('value', (postRef) =>{
            console.log(postRef);
          const postLike = postRef.val();
        // {body:,}  console.log(postLike);
          const objRefLike = postLike.postWithLikes || [];
        console.log(objRefLike);
        //   postwithlikes:arr[0:uid]console.log(objRefLike.length);

          likePoints.textContent=objRefLike.length;
          

          likes.addEventListener('click', () => {
            

            if (objRefLike.indexOf(userId) === -1) {
               objRefLike.push(userId);
               likePoints.textContent=objRefLike.length;
               likes.disabled = true;
               
               postLike.likeCount = objRefLike.length;
            } else if (objRefLike.indexOf(userId) === 0) {
                likes.disabled = false;
            }
            postLike.postWithLikes = objRefLike;
            toggleStar(postRef, userId)
      
           let updates = {};
           updates['/posts/' + keyPost] = postLike;
           updates['/user-posts/' + userId + '/' + keyPost] = postLike;
           return firebase.database().ref().update(updates);
           
          });
         })
        
      
    
    
    delet.addEventListener('click', () => {
        firebase.database().ref().child('/user-posts/' + userId + '/' + keyPost).remove();
        firebase.database().ref().child('posts/' + keyPost).remove();
   
        while(posted.firstChild) posted.removeChild(posted.firstChild);
        reload_page()
    });
    edit.addEventListener('click', () => {
        const editPost = document.getElementById(keyPost);
      const nuevoPost = {
          body: editPost.value,
        };

       var updatesUser = {};
       var updatesPost = {};

      updatesUser['/user-posts/' + userId + '/' + keyPost] = nuevoPost;
      updatesPost['/posts/' + keyPost ] = nuevoPost;

      firebase.database().ref().update(updatesUser);
      firebase.database().ref().update(updatesPost);
    });
        
    
}
    
function reload_page() {
    window.location.reload();
}; 
    
  
    
  
   
   
   
   
   
   