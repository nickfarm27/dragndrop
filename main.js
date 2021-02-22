let draggables = null;
let shiftX = 0;
let shiftY = 0;
let originalX = 0;
let originalY = 0;
let currentDroppable = null;
let zIndex = 10;

refreshDraggables();

//* NEW
function refreshDraggables() {
    draggables = document.querySelectorAll(".draggable");

    //? Check if the entire puzzle is solved. If not, refresh the draggables
    if (draggables === [] || draggables.length == 0) {
        document.querySelectorAll(".dropzone").forEach(element => {
            element.classList.add("puzzle-solved");
        });
    } else {
        draggables.forEach(draggable => {
            makeDraggable(draggable);
        });
    }
}

function makeDraggable(draggable) {
    draggable.addEventListener("mousedown", mouseDown);
    
    draggable.addEventListener("touchstart", (e) => {
        console.log(e);
    });
    draggable.ondragstart = function() {
        return false;
    }

    function mouseDown(e) {
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
    
        document.addEventListener("mousemove", mouseMove);
        // document.addEventListener("touchmove", mouseMove);
        draggable.addEventListener("mouseup", mouseUp);
        // draggable.addEventListener("touchend", mouseUp);
    }
    
    function mouseMove(e) {
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
        let append = true;
        draggable.classList.remove("draggable-active");

        //? OPTIONAL TRANSITION EFFECTS
        draggable.style.transitionProperty = "left, top";
        draggable.style.transitionDuration = "0.4s";

        draggable.style.left = 0;
        draggable.style.top = 0;

        if (currentDroppable) {
            if (currentDroppable.childElementCount > 0) {
                // console.log(this.parentElement);        //? parent element of the draggable item
                // console.log(currentDroppable.firstElementChild);

                if (this.parentElement.classList[0] !== "puzzle-piece-box") {
                    
                    this.parentElement.append(currentDroppable.firstElementChild);      //? enable swapping
                    
                    //* NEW - check if the swapped puzzle piece is in the correct position
                    if (this.parentElement.lastElementChild.classList[0] === this.parentElement.classList[0]) {
                        this.parentElement.lastElementChild.classList.remove("draggable");
                        console.log(this.parentElement.lastElementChild.classList);
                    }

                } else {
                    append = false;
                }
            }

            if (append) {
                currentDroppable.append(draggable);
            }
            
            currentDroppable.classList.remove("droppable-hovered");
            
            //* to verify the correct piece and make it unusable
            if (currentDroppable.classList[0] === this.classList[0]) {
                currentDroppable.classList.remove("droppable");
                this.classList.remove("draggable");             //* NEW
            }

            //* NEW
            checkPuzzle(); //? Checks if the puzzle is complete
        }
    
        draggable.removeEventListener("mouseup", mouseUp);      //* Still needed if draggable didn't drop on a droppable
        // draggable.removeEventListener("touchend", mouseUp);
        document.removeEventListener("mousemove", mouseMove);
        // document.removeEventListener("touchmove", mouseMove);

        currentDroppable = null;
    }

    //* NEW -> to remove all event listeners and allow the swap verification to work
    function checkPuzzle() {
        draggables.forEach(draggable => {
            let old_element = draggable;
            let new_element = old_element.cloneNode(true);
            old_element.parentNode.replaceChild(new_element, old_element);
        });
        refreshDraggables();
    }
}

