"use strict";
(function () {
    const packages_json = 'http://packages.lazarus-ide.org/packagelist.json';
    let app = angular.module('LazarusPackages', []);

    app.controller('PackagesController', ['$http', function ($http) {
        this.packages = [];
        this.categories = [];
        this.selectedCategory = "*"

        // Get packages json
        $http.get(packages_json).then(response => {
            let i = 0, has_packages = true;

            // Create packages array
            while (has_packages) {
                if (response.data.hasOwnProperty('PackageData' + i)) {
                    this.packages.push({
                        data: response.data['PackageData' + i],
                        files: response.data['PackageFiles' + i]
                    });
                    i++;
                } else {
                    has_packages = false;
                }
            }

            // Create categories array from really used categories
            this.categories.push("*");
            for (let i = 0; i < this.packages.length; i++) {
                if (this.packages[i].data.Category) {
                    let categs = this.packages[i].data.Category.split(", ");
                    for (let j = 0; j < categs.length; j++) {
                        if (this.categories.indexOf(categs[j]) == -1) {
                            this.categories.push(categs[j]);
                        }
                    }
                }
            }
            this.categories.sort((a, b) => {
                if (a > b)
                    return 1
                if (a < b)
                    return -1
                return 0
            })

        }).catch(response => {
            // Do something if packages json is not reached
        });

        // Show items depending on search and selected category
        this.show = (index) => {
            var a, b, c = 0, d;

            // Search
            if (this.searchText) {
                let terms = this.searchText.split(" ").map(v => v.toLowerCase());

                for (let j = 0; j < terms.length; j++) {
                    a = this.packages[index].data.DisplayName.toLowerCase().indexOf(terms[j]) != -1;
                    b = false;
                    for (let i = 0; i < this.packages[index].files.length; i++) {
                        if (this.packages[index].files[i].Name.toLowerCase().indexOf(terms[j]) != -1
                            || this.packages[index].files[i].Author.toLowerCase().indexOf(terms[j]) != -1
                            || this.packages[index].files[i].Description.toLowerCase().indexOf(terms[j]) != -1
                            || this.packages[index].files[i].License.toLowerCase().indexOf(terms[j]) != -1) {
                            b = true;
                            break;
                        }
                    }
                    if (!a && !b)
                        break;
                    c++;
                }
                c = c >= terms.length;
            } else {
                c = true;
            }

            // Selected category
            if (this.selectedCategory != "*") {
                d = this.packages[index].data.Category.toLowerCase().indexOf(this.selectedCategory) != -1;
            } else {
                d = true;
            }
            return c && d;
        }
    }]);
})();