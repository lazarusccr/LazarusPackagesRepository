var actual_JSON_count;

function loadJSON(file, callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function printPackages(actual_JSON, id) {
    var hasPackages = true;
    var i = 0;
    var text = '';

    while (hasPackages) {
        hasPackages = actual_JSON['PackageFiles' + id].hasOwnProperty(i);
        if (!hasPackages) continue;
        text = text +
            '<p><b>Package:</b> ' + actual_JSON['PackageFiles' + id][i].Name + ' ' + actual_JSON['PackageFiles' + id][i].VersionAsString + '<br/>' +
            '<b>Author:</b> ' + actual_JSON['PackageFiles' + id][i].Author + '<br/>' +
            '<b>License:</b> ' + actual_JSON['PackageFiles' + id][i].License + '<br/>' +
            '<b>Description:</b> ' + actual_JSON['PackageFiles' + id][i].Description + '<br/></p>';
        i++;
    }

    return text;
}

function FillApps() {
    loadJSON("packagelist.json", function (response) {

        var actual_JSON = JSON.parse(response);

        var i = 0;
        var hasItems = true;

        while (hasItems) {

            var hasItems = actual_JSON.hasOwnProperty('PackageData' + i);
            if (!hasItems) continue;

            var div = document.createElement("section");
            div.className = 'section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp';
            div.id = 'section' + i;
            div.innerHTML =
                '<div class="mdl-card mdl-cell mdl-cell--12-col">' +
                '<div class="mdl-card__supporting-text">' +
                '<h4 id="title' + i + '">' + actual_JSON['PackageData' + i].DisplayName + '</h4>' +
                '<p><b>Category:</b> ' + actual_JSON['PackageData' + i].Category + '</p>' +
                printPackages(actual_JSON, i) +
                '</div>' +
                '<div class="mdl-card__actions">' +
                '<a href="' + actual_JSON['PackageData' + i].RepositoryFileName + '" class="mdl-button">Download</a>' +
                '</div>' +
                '</div>';

            document.getElementById('overview').appendChild(div);

            i++;
        }

        actual_JSON_count = i;

        // Empty section for the ending to prevent problems with MDL
        var e = document.createElement('section');
        e.className = "section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp"
        document.getElementById('overview').appendChild(e);
    });
}

function FilterApps() {
    var s = document.getElementById('search').value.toLowerCase().split(" ");
    for (var i = 0; i < actual_JSON_count; i++) {
        if (Search(s, i)) {
            document.getElementById('section' + i).style.display = 'block';
        } else {
            document.getElementById('section' + i).style.display = 'none';
        }
    }
}

function Search(s, index) {
    hasAll = true;
    for (var i = 0; i < s.length; i++) {
        var e = document.getElementById('section' + index).innerText.toLowerCase();
        hasAll = ((e.indexOf(s[i]) != -1));
        if (!hasAll) {
            return false;
        }
    }
    return hasAll;
}

function Categories() {
    var categ = ["Charts and Graphs", "Cryptography", "DataControls", "Date and Time", "Dialogs", "Edit and Memos", "Files and Drives", "GUIContainers", "Graphics", "Grids", "Indicators and Gauges", "Labels", "LazIDEPlugins", "List and Combo Boxes", "ListViews and TreeViews", "Menus", "Multimedia", "Networking", "Panels", "Reporting", "Science", "Security", "Shapes", "Sizers and Scrollers", "System", "Tabbed Components", "Other"];
    for (var i = 0; i < categ.length; i++) {
        var e = document.createElement("span");
        e.className = "mdl-chip";
        e.addEventListener("click", function () { document.getElementById('search').focus(); document.getElementById('search').value = 'Category: ' + this.innerText; document.getElementById('search').oninput.call(); document.getElementById('search-container').classList.add('is-dirty'); }, false);
        e.innerHTML = "<span class='mdl-chip__text'>" + categ[i] + "</span>";
        document.getElementById("categ").appendChild(e);
    }
}