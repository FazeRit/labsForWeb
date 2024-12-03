document.addEventListener("DOMContentLoaded", () => {
    let block4 = document.getElementById("block4");
    let block5 = document.getElementById("block5");
    
    [block4.innerHTML, block5.innerHTML] = [block5.innerHTML, block4.innerHTML];
});
