
document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let loginEmail = document.getElementById("loginEmail").value;
    let loginPass = document.getElementById("loginPass").value;

    let userExist = users.some(u => u.email === loginEmail && u.password === loginPass);

    if(!userExist){
        alert("Incorrect Email or password");
        return;
    }

    if(document.getElementById("Remember").checked){
        let rememberedUser = {
            email: loginEmail,
            password: loginPass
        };
        localStorage.setItem("rememberedUser", JSON.stringify(rememberedUser));
    } else {
        localStorage.removeItem("rememberedUser");
    }

    alert("Login successful!");
    window.location.href = "../home.html";
})

window.addEventListener("load", function(){
    let rememberedUser = JSON.parse(localStorage.getItem("rememberedUser"));
    if(rememberedUser){
        document.getElementById("loginEmail").value = rememberedUser.email;
        document.getElementById("loginPass").value = rememberedUser.password;
        document.getElementById("Remember").checked = true;
    }
});