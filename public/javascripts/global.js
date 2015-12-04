// playerList data array for filling in info box
var playerListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the player table on initial page load
    populateTable();

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/players/playerlist', function( data ) {

    playerListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowplayer" rel="' + this.mnem + '">' + this.mnem + '</a></td>';
            tableContent += '<td>' + this.given + ' ' + this.family + '</td>';
            tableContent += '<td>' + this.nat + '</td>';
            tableContent += '<td>' + this.dob + '</td>';
            tableContent += '<td>' + this.pob + '</td>';
            tableContent += '<td>' + this.cob + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteplayer" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#playerList table tbody').html(tableContent);

        // Playermnem link click
        $('#playerList table tbody').on('click', 'td a.linkshowplayer', showPlayerInfo);

        // Add Player button click
        $('#btnAddPlayer').on('click', addPlayer);

        // Delete Player link click
        $('#playerList table tbody').on('click', 'td a.linkdeleteplayer', deletePlayer);
    });
};


// Show Player Info
function showPlayerInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve player mnem from link rel attribute
    var thisPlayerMnem = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = playerListData.map(function(arrayItem) { return arrayItem.mnem; }).indexOf(thisPlayerMnem);
    // Get our Player Object
    var thisPlayerObject = playerListData[arrayPosition];

    //Populate Info Box
    $('#playerInfoMnem').text(thisPlayerObject.mnem);
    $('#playerInfoGiven').text(thisPlayerObject.given);
    $('#playerInfoFamily').text(thisPlayerObject.family);
    $('#playerInfoNat').text(thisPlayerObject.nat);
    $('#playerInfoDob').text(thisPlayerObject.dob);
    $('#playerInfoPob').text(thisPlayerObject.pob);
    $('#playerInfoCob').text(thisPlayerObject.cob);

};

// Add Player
function addPlayer(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addPlayer input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all Player info into one object
        var newPlayer = {
            'mnem': '______',
            'given': $('#addPlayer fieldset input#inputPlayerGivenName').val(),
            'family': $('#addPlayer fieldset input#inputPlayerFamilyName').val(),
            'nat': $('#addPlayer fieldset input#inputPlayerNat').val(),
            'dob': $('#addPlayer fieldset input#inputPlayerDob').val(),
            'pob': $('#addPlayer fieldset input#inputPlayerPob').val(),
            'cob': $('#addPlayer fieldset input#inputPlayerCob').val(),
        }

        // Use AJAX to post the object to our addPlayer service
        $.ajax({
            type: 'POST',
            data: newPlayer,
            url: '/players/addplayer',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addPlayer fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete Player
function deletePlayer(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this player?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/players/deleteplayer/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

