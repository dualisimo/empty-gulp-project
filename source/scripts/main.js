$(document).ready(function(){
    setInterval(movement, 1000);
})

function movement() {
    var positions = getPosition();
    var dimensions = getWiewPort();
    var size = getSize();
    var direction = Math.floor(Math.random() * 4) + 1
    var color = Math.floor(Math.random() * 5) + 1

    switch (direction) {
        case 1:
            if (positions[0] - 100 > 0) {
                moveTop(changingColor(color), 100);
                break;
            }
            moveTop(changingColor(color), positions[0])
            break;
        case 2:
            if (positions[0] + 100 <= dimensions[0] - size) {
                moveRight(changingColor(color));
                break;
            }
        case 3:
            if (positions[1] - 100 > 0) {
                moveTop(changingColor(color));
                break;
            }
        case 4:
            if (positions[1] + 100 <= dimensions[1] - size) {
                moveBottom(changingColor(color));
                break;
            }
        default:
            movement();

    }
}

function changingColor(numberColor) {
    switch (numberColor){
        case 1:
            colorCode = "#000"
            break;
        case 2:
            colorCode = "#a7f442"
            break;
        case 3:
            colorCode = "#a1e9ed"
            break;
        case 4:
            colorCode = "#4c1daf"
            break;
        case 5:
            colorCode = "#f93171"
            break;
    }
    return colorCode;
}

function moveTop(chooseColor, move) {
    const bounce = 100 - move;

    $("#ball").css("border-color", chooseColor).animate( {left: '-=' + move},
        bounce !== 0 ? 250 : 500, 'swing',
        bounce !== 0 ? function() {
            setTimeout(function() {
                $("#ball").animate({left: '+=' + bounce}, 250);
            }, 250)
        } : null
    );
}

function moveRight(chooseColor) {
    $("#ball").css("border-color", chooseColor).animate( {left: "+=100px"}, 500);
}

function moveTop(chooseColor) {
    $("#ball").css("border-color", chooseColor).animate( {top: "-=100px"},500);
}

function moveBottom(chooseColor) {
    $("#ball").css("border-color", chooseColor).animate( {top: "+=100px"}, 500);
}

function getPosition() {
    var elementPosition = $("#ball").position();
    var positions = [];
    positions[0] = elementPosition.left;
    positions[1] = elementPosition.top;

    return positions;
}

function getWiewPort() {
    var dimensions = [];
    dimensions[0] = window.innerWidth;
    dimensions[1] = window.innerHeight;

    return dimensions;
}

function getSize(){
    var size = $("#ball").width();

    return size;
}
