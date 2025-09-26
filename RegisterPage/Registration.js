
document.getElementById("fullName").addEventListener("keypress", function(c){
    if(!isNaN(c.key) && c.key != " "){
        c.preventDefault();
    }
})

document.getElementById("form").addEventListener("submit",function(e){
    e.preventDefault();
    
    let fullname = document.getElementById("fullName").value.trim();
    let username = document.getElementById("userName").value.trim();
    let email = document.getElementById("Email").value.trim();
    let password = document.getElementById("PassWord").value;
    let confirmpassword = document.getElementById("ConfirmPassWord").value;
    
    if(fullname.length < 5){
        alert("Full name must be at least 5 characters long.");
        return;
    }
    
    if (username.length < 3) {
        alert("Username must be at least 3 characters long.");
        return;
    }
    
    let emailPattern = /^[a-zA-Z0-9]+@(gmail|yahoo)\.com$/
    if(!emailPattern.test(email)){
        alert("Email must be a valid Gmail or Yahoo address.");
        return;
    }
    
    if(password.length < 6){
        alert("Password must be at least 6 characters long.");
        return;
    }
    
    if(confirmpassword !== password){
        alert("Passwords do not match.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    console.log(users)
    
    let userExists = users.some(u => u.username === username || u.email === email);

    if (userExists){
        alert("This user already exists!");
        return;
    }

    let newUser = {
        fullname : fullname,
        username : username,
        email : email,
        password : password
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful!");
    window.location.href = "../home.html";
})







