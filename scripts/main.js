const maxKeyCounts = {
    1: 80, // badges
    2: 50, // recipes
    3: 64, // quizmo
    4: 96, // star pieces
};

var currentKeyCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
};

var rowf_coins = 1650;

const quizmoAnswers = [
    3, 2, 2, 3, 3, 1, 3, 1, 3, 2,
    1, 3, 2, 2, 1, 3, 1, 3, 2, 1,
    1, 3, 2, 1, 3, 2, 2, 3, 3, 2, 
    2, 2, 1, 3, 3, 3, 3, 1, 2, 2, 
    3, 2, 3, 2, 3, 1, 1, 2, 2, 1, 
    2, 3, 2, 1, 3, 3, 2, 3, 1, 3, 
    3, 2, 2, 2
]

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
    $('.badge').height(40);

    // set text display for the main items
    $('.main-tracker img').on('mouseenter', function() {
        $('.main-tracker h2').text($(this).attr('id'));
    });

    $('.main-tracker img').on('mouseleave', function() {
        $('.main-tracker h2').text("");
    });

    $('.horizontal-tracker img').on('mouseenter', function() {
        $('.horizontal-tracker h2').text($(this).attr('id'));
    });

    $('.horizontal-tracker img').on('mouseleave', function() {
        $('.horizontal-tracker h2').text("");
    });

    // required chapter items
    $(".badge").click(function(){
        var cost = parseInt($(this).attr("data-badge-cost"));
        if ($(this).hasClass("unselected")) {
            $(this).removeClass("unselected");
            rowf_coins -= cost;
        } else {
            $(this).addClass("unselected");
            rowf_coins += cost;
        }

        $(".rowf-badges h2").text(rowf_coins);
    });

    $("img[data-chapter-key]").click(function(){
        var c = parseInt($(this).attr("data-chapter-key"));
        $(this).removeClass("unselected");
        if (currentKeyCounts[c] < maxKeyCounts[c]) {
            ++currentKeyCounts[c];
            $(`.chapter-${c}-key-count`).text(`${currentKeyCounts[c]}/${maxKeyCounts[c]}`);
        }

        if ($(this).attr("id") === "Quizmo") {
            var nextQuizmo = currentKeyCounts[c] + 1;

            if (nextQuizmo >= 65) {
                $(".quizmo-answers h1").text(`Quizmo Is Done!`);
                $(".quizmo-answers h2").text("");
            } else {
                $(".quizmo-answers h1").text(`Quizmo Answer (${nextQuizmo}):`);
                $(".quizmo-answers h2").text(quizmoAnswers[currentKeyCounts[c] - 1]);
            }
        }
    });

    $("img[data-chapter-key]").contextmenu(function(){
        var c = parseInt($(this).attr("data-chapter-key"));
        if (currentKeyCounts[c] > 0) {
            --currentKeyCounts[c];
            $(`.chapter-${c}-key-count`).text(`${currentKeyCounts[c]}/${maxKeyCounts[c]}`);
        }

        if ($(this).attr("id") === "Quizmo") {
            $(".quizmo-answers h1").text(`Quizmo Answer (${currentKeyCounts[c] + 1}):`);
            $(".quizmo-answers h2").text(quizmoAnswers[currentKeyCounts[c] - 1]);
        }
        return false;
    });

    // options menu
    $(document).click(function(e) {
        // if the option menu is open, and the click is outside the options menu, close it
        var container = $("#options-menu");
        if (container.hasClass("options-open") && !container.is(e.target) && container.has(e.target).length === 0) {
            $("#options-menu-toggle").click();
        }
    });

    $("#options-menu-toggle").click(function(e) {
        e.stopPropagation();
        $(this).toggleClass("options-open");
        $("#options-menu").toggleClass("options-open");
    });

    $("#vertical-tracker").click(function() {
        var isChecked = $(this).is(':checked');
        $(".horizontal-tracker").toggle(isChecked);
        $(".main-tracker").toggle(!isChecked);
        localStorage.setItem("vertical-tracker", isChecked);
    });

    $("#background-color").on("input", function() {
        var color = $(this).val();
        $("body, html").css("background-color", color);
        localStorage.setItem("background-color", color);
    });

    // local storage settings
    var vertical_tracker = localStorageGetWithDefault("vertical-tracker", false) == "true";
    if (vertical_tracker) {
        $("#vertical-tracker").click();
    } else {
        $(".horizontal-tracker").toggle();
    }

    var bg_color = localStorageGetWithDefault("background-color", "#a35700");
    $("body, html").css("background-color", bg_color);
    $("#background-color").val(bg_color);
});
