(function() {
    class Options {
        constructor(url, method) {
            this.url = url;
            this.method = method;
        }
    }
    const API_ROOT = "http://localhost:3000/projects/";
    let tbody = document.querySelector("tbody");
    let modal = document.querySelector(".modal");
    let story = document.querySelectorAll(".story");
    let statistics = {};
    let id = -1;

    // get data
    function getTableData() {
        let options = new Options(API_ROOT, "get");
        options.success = initializationTable;
        options.fail = function() {
            alert("Failed to get data");
        }
        ajax(options);
    }

    function initializationTable(data) {
        if (!Array.isArray(data)) {
            alert("The data must be of array type");
        }

        statistics = getStatisticsData(data);
        updateStoryData(statistics);
        tbody.innerHTML = createProjectList(data);
    }

    tbody.addEventListener('mouseup', function(event) {
        if (event.target.innerHTML === "删除") {
            modal.className = "modal show";
            id = event.target.parentNode.parentNode.id;
        }
    })

    tbody.addEventListener('mouseover', function(event) {
        if (event.target.className === "description") {
            event.target.className = "show";
        }
    })

    tbody.addEventListener('mouseout', function(event) {
        if (event.target.className === "show") {
            event.target.className = "description";
        }
    })

    modal.addEventListener('mouseup', function(event) {
        if (event.target.innerHTML === "确认") {
            deleteItem(id);
        }

        if (event.target.innerHTML === "取消") {
            modal.className = "modal";
        }

        if (event.target.className === "iconfont close-icon") {
            modal.className = "modal";
        }
    })

    function deleteItem(id) {
        let url = API_ROOT + '/' + id;
        let options = new Options(url, "delete");
        options.success = function() {
            let item = tbody.querySelector("#" + id);
            tbody.removeChild(item);
        };
        options.fail = function(error) {
            alert(error);
        }
        ajax(options);
    }

    function getStatisticsData(data) {
        return data.reduce((result, item) => {
            switch (item.status) {
                case "ACTIVE":
                    item.status in result ? result[item.status]++ : result[item.status] = 1;
                    break;
                case "PENDING":
                    item.status in result ? result[item.status]++ : result[item.status] = 1;
                    break;
                case "CLOSED":
                    item.status in result ? result[item.status]++ : result[item.status] = 1;
                    break;
            }
            return result;
        }, {});
    }

    function updateStoryData(statistics) {
        statistics.ACTIVE = statistics.ACTIVE ? statistics.ACTIVE : 0;
        statistics.PENDING = statistics.PENDING ? statistics.PENDING : 0;
        statistics.CLOSED = statistics.CLOSED ? statistics.CLOSED : 0;
        let total = statistics.ACTIVE + statistics.PENDING + statistics.CLOSED;
        story[0].querySelector(".number").innerHTML = total;
        story[1].querySelector(".number").innerHTML = statistics.ACTIVE;
        story[1].querySelector(".percentage").innerHTML = (!total ? 0 : Math.round(statistics.ACTIVE / total * 100)) + '%';
        story[2].querySelector(".number").innerHTML = statistics.PENDING;
        story[2].querySelector(".percentage").innerHTML = (!total ? 0 : Math.round(statistics.PENDING / total * 100)) + '%';
        story[3].querySelector(".number").innerHTML = statistics.CLOSED;
        story[3].querySelector(".percentage").innerHTML = (!total ? 0 : Math.round(statistics.CLOSED / total * 100)) + '%';
    }

    function createProjectList(data) {
        return data.reduce((html, item) => {
            return html += '<tr id=' + item.id + '>' +
                '<td>' + item.name + '</td>' +
                '<td><p class="description">' + item.description + '</p></td>' +
                '<td>' + item.endTime + '</td>' +
                '<td class=' + item.status.toLowerCase() + '>' + item.status + '</td>' +
                "<td><button class='operation'>删除</button></td>" +
                '</tr>'
        }, "");
    }

    getTableData();
})()