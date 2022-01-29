const maxKeyCounts = {
    1: 80, // badges
    2: 50, // recipes
    3: 64, // quizmo
    4: 160, // star pieces
};

var currentKeyCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
};

function localStorageGetWithDefault(key, defaultValue) {
    const value = localStorage.getItem(key);
    if (!value) {
        localStorage.setItem(key, defaultValue);
        return defaultValue;
    }
    return value;
}

$(document).ready(function(){
    // disable some basic functionality
    $('img').on('dragstart', function(){return false;});
    $('html').contextmenu(function(){return false;});
    $('img').contextmenu(function(){return false;});

    $('.optional-item').height(40);

    // set text display for the main items
    $('.main-tracker img').on('mouseenter', function() {
        $('.main-tracker h2').text($(this).attr('id'));
    });

    $('.main-tracker img').on('mouseleave', function() {
        $('.main-tracker h2').text("");
    });

    // required chapter items
    $("img[data-chapter]").click(function(){
        var c = parseInt($(this).attr("data-chapter"));
        if ($(this).hasClass("unselected")) {
            $(this).removeClass("unselected");
        } else {
            $(this).addClass("unselected");
        }

        checkIfChapterIsCompletable(c);
    });

    // chapter keys
    $("img[data-chapter-key]").click(function(){
        var c = parseInt($(this).attr("data-chapter-key"));
        $(this).removeClass("unselected");
        if (currentKeyCounts[c] < maxKeyCounts[c]) {
            ++currentKeyCounts[c];
            $(`#chapter-${c}-key-count`).text(`${currentKeyCounts[c]}/${maxKeyCounts[c]}`);
        }
    });

    $("img[data-chapter-key]").contextmenu(function(){
        var c = parseInt($(this).attr("data-chapter-key"));
        if (currentKeyCounts[c] > 0) {
            --currentKeyCounts[c];
            $(`#chapter-${c}-key-count`).text(`${currentKeyCounts[c]}/${maxKeyCounts[c]}`);
        }

        if (currentKeyCounts[c] === 0) {
            $(this).addClass("unselected");
        }
        return false;
    });
});
