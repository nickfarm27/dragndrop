let draggables = document.querySelectorAll(".draggable");
let shiftX = 0;
let shiftY = 0;
let originalX = 0;
let originalY = 0;
let currentDroppable = null;
let zIndex = 10;

draggables.forEach(draggable => {
    makeDraggable(draggable);
});

function makeDraggable(draggable) {
    draggable.addEventListener("mousedown", mouseDown);
    draggable.ondragstart = function() {
        return false;
    }

    function mouseDown(e) {
        console.log("down");
        console.log(e);
    
        //? OPTIONAL ANIMATIONS
        draggable.style.transitionProperty = "background-color";
        draggable.style.transitionDuration = "500ms";
    
        zIndex+=1;
        draggable.style.zIndex = zIndex;
    
        draggable.classList.add("draggable-active");
    
        originalX = draggable.getBoundingClientRect().left;
        originalY = draggable.getBoundingClientRect().top;
    
        shiftX = e.clientX - originalX;
        shiftY = e.clientY - originalY;
    
        console.log(originalX);
        console.log(originalY);
    
        document.addEventListener("mousemove", mouseMove);
        draggable.addEventListener("mouseup", mouseUp);
    }
    
    function mouseMove(e) {
        // console.log("move");
        // console.log(e);
    
        draggable.style.left = e.pageX - shiftX - originalX + "px";
        draggable.style.top = e.pageY - shiftY - originalY + "px";
    
        draggable.hidden = true;
        let elemBelow = document.elementFromPoint(e.clientX, e.clientY);  // get the element at that point
        draggable.hidden = false;
        
        let droppableBelow = elemBelow.closest(".droppable");   // get the closest element that has the the class 'droppable'
    
        if (currentDroppable) {
            currentDroppable.classList.remove("droppable-hovered");
        }
    
        currentDroppable = droppableBelow;
    
        if (currentDroppable) {
            currentDroppable.classList.add("droppable-hovered");
        }
    }
    
    function mouseUp(e) {
        console.log("up");
        // console.log(e);
    
        draggable.classList.remove("draggable-active");

        //! Use later for verification of correct piece
        // draggable.removeEventListener("mousedown", mouseDown);
    
        if (currentDroppable) {
            currentDroppable.append(draggable);
            currentDroppable.classList.remove("droppable-hovered");

            //! Use later for verification of correct piece
            // currentDroppable.classList.remove("droppable");
        }

        //? OPTIONAL
        draggable.style.transitionProperty = "left, top";
        draggable.style.transitionDuration = "0.4s";

        draggable.style.left = 0;
        draggable.style.top = 0;
    
        draggable.removeEventListener("mouseup", mouseUp);
        document.removeEventListener("mousemove", mouseMove);
    }
}

