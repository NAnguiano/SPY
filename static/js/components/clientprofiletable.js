$(function (event) {
    var status = $('.dot');
    var table = $('#clients tbody');
    var statuses = JSON.parse(window.sessionStorage.statuses); // if getting Uncaught SyntaxError: Unexpected token u in JSON at position 0
    var flags = JSON.parse(window.sessionStorage.flags);        // means value is probably undefined

    // Is there a way we can make data such as statuses globally available
    // without it being affected by asynchronous calls?
    // tried putting an ajax in main.js, but request wasn't fast enough
    // to be avaiable for clientprofiletable.js
    //.done(function (statuses) {
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', localStorage.getItem("authorization"));
            },
            url: "api/clients",
            method: "GET",
            success: function (data) {
                status.removeClass('dot-pending').addClass('dot-success');
                console.log(data);
                table.empty();
                data.result.forEach(function (client) {
                    var dataString = "";
                    for (var property in client) {
                        dataString += 'data-' + property.toLowerCase() + '="' + client[property] + '" ';
                    }
                    table.append('<tr class="profile-drag"><td ' + dataString + '>' +
                        '<span class="dot"></span>' +
                        client.firstName + ' ' +
                        client.lastName + ' ' +
                        '</td></tr>');
                });
                $(table).children('tr').get().forEach(function (clientRow) {
                    var currentStatus = window.getDataById(statuses, $(clientRow).find('td').data("status"));
                    $(clientRow).find('.dot').css('background-color', currentStatus.color);
                });
            },
            error: function (xhr) {
                status.removeClass('dot-pending').addClass('dot-error');
                console.error(xhr);

                if (xhr.status === 401) {
                    localStorage.removeItem("authorization");
                }
            }
        });
    //});

    $('#client-search').keyup(function () {
        var search = $('#client-search');
        var clients = $('#clients td');
        if (search.val() === '') {
            clients.show();
        } else {
            clients.hide().filter(function (i, e) {
                return $(e).text().toLowerCase().indexOf(search.val().toLowerCase()) !== -1;
            }).show();
        }
    });

    /*
    
        can insert and retrieve using jQuery's data function
        
        <td class="submit" data-id="1">John Doe</td>
        var id = $(this).data("id");

        // $.data() knows to grab any attribute with "data-"
        // $.data("id", 1) will insert into the "data-id" attribute
    */
});
