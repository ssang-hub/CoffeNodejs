let nav_items = document.querySelectorAll(".nav-item>a")
let nav_items_content = document.querySelectorAll(".nav-item__content")
console.log(nav_items_content.length);
for(let i= 0; i< nav_items.length; i++){
    nav_items[i].addEventListener("click", ()=>{
        // console.log(1);
        nav_items[i].classList.add("active")
        nav_items_content[i].classList.add("Sidebar-content-enable")
        for(let j= 0; j<nav_items.length; j++){
            if(j!=i){
                nav_items[j].classList.remove("active")
                nav_items_content[j].classList.remove("Sidebar-content-enable")
                
            }
        }
    })
}

