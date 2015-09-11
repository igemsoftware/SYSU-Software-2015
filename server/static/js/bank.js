$(document).ready(function() {
    var attrName = ["id", "name", "description", "contributor", "rate", "used", "comments", "last active"];

    var totalNumber = 0;
    var order= "id";
    var per_page = 7;

    var mode = "public";

    $("#linkPublic").click(function(event) {
        $("#linkPublic").addClass("highlight");
        $("#linkShare").removeClass("highlight");
        $("#btnShare").fadeOut('fast'); // blinking might happen
        //$("#btnShare").stop().fadeTo('fast', 0, function() {$(this).hide();});

        mode = "public";
        $("#search input").val('');
        fillTable(1, true);
    });
    $("#linkShare").click(function(event) {
        $("#linkShare").addClass("highlight");
        $("#linkPublic").removeClass("highlight");
        // $("#btnShare").fadeIn('fast');
        $("#btnShare").stop().fadeTo('fast',1, function() {$(this).show();});

        mode = "share";
        $("#search input").val('');
        fillTable(1, true);
    });

  //$.get('/bank/list?per_page=100000&page=1', function(data) {
  //    setTotalNumber(data["designs"].length);
  //});

    function setTotalNumber(_number) {
        totalNumber = _number;
        $("#totalDesigns").text(_number);

        if (5 * per_page < totalNumber) {
            $("#pageAdd").show();
            $("#pageMinus").show();
        }
        else {
            $("#pageAdd").hide();
            $("#pageMinus").hide();
        }

        var links = $(".number a");
        for (var i = 0; i < 5; ++i) {
            $(links[i]).html(i+1).removeClass("selected");
            if (i*per_page <= totalNumber) 
                $(links[i]).show();
            else
                $(links[i]).hide();
        }
        $(links[0]).addClass("selected"); 
    }

    function fillTable(page, refreshTotalNubmer) {
        var url = "";
        url = "/bank/list?per_page="+per_page+"&page=" + page + "&order=" + order + "&keyword=" + $("#search input").val() + "&mode=" + mode;
        $.get(url, function(data, needToSearch) {
            if (data['error'] == 1) { 
                // alert(data['aux']);
                window.location.href = data['aux'];
            }
            if (refreshTotalNubmer) 
                setTotalNumber(data["count"]);
            designs = data["designs"];

            
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 8; j++) {
                    var cellName = "#dataTable tr:gt(0):eq(" + i + ") td:eq("+ j +")";
                    if (designs[i]) {
                        var attrVal = designs[i][attrName[j]];
                        if (j == per_page) {
                            // attrVal = attrVal.substring(0, 10);
                        };  
                        $(cellName).text(attrVal);
                    } else {
                        $(cellName).text("");
                    }
                    
                };
            };


        });
    }
    
    $("#linkPublic").click();
    // fillTable(1, "id", keyword, true);
    $(".number a").click(function(event) {
        console.log($(this).html());
        fillTable($(this).html(), false);
        $(".number a").each( function() {
                $(this).removeClass("selected");
            });
        $(this).addClass("selected");
    });

    // after switch to page 2, and search for something, error occurs
    $("#pageAdd").click(function(event) {
        var links = $(".number a");
        console.log(links[4]);
        console.log($(links[4]).html());
        if ($(links[4]).html() * per_page < totalNumber) {
            for (var i = 0; i < 5; i++) {
                $(links[i]).html(parseInt($(links[i]).html())+1);
            };
        }
    });

    $("#pageMinus").click(function(event) {
        var links = $(".number a");
        if ($(links[0]).html() > 1) {
            for (var i = 0; i < 5; i++) {
                $(links[i]).html(parseInt($(links[i]).html())-1);
            };
        }
    });

    $("#order").change(function(event) {
        // fillTable($(".number .selected").html(), $("#order").val(), keyword);
        order = $("#order").val();
        fillTable(1, true);
    });

    $("#search input").bind('input propertychange', function() { 
        //keyword = $("#search input").val();
        // fillTable($(".number .selected").html(), $("#order").val(), keyword);
        fillTable(1, true);
    });


    // Share modal
    
    $("#btnShare").click(function(event) {
        $(".ui.modal").modal('show');
    });
//  $("#confirm").click(function(event) {
//      $(".ui.modal").modal('hide');
//  });
    
    $('.ui.form')
        .form({
            fields: {
                gender: {
                    identifier  : 'gender',
                    rules: [
                    {
                        type   : 'empty',
                        prompt : 'Please select a gender'
                    }
                    ]
                },
                brief_description: {
                    identifier : 'brief_description',
                    rules: [
                    {
                        type : 'empty',
                        prompt : 'Please input the brief description.'
                    }
                    ]
                },
                full_description: {
                    identifier : 'full_description',
                    rules: [
                    {
                        type : 'empty',
                        prompt : 'Please input the full description.'
                    }
                    ]
                }
            }
        })
    ;

    $('.ui.selection.dropdown').click(function() {
      $(this).dropdown()
    });
});

