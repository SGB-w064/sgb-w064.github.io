window.addEventListener("DOMContentLoaded", function() {
    // コード中に定義し直すことがないであろう数値を連想配列で宣言
    const data = {
        "github_api_url" : "https://api.github.com/repos",
        "owner" : "SGB-w064",
        "repo" : "sgb-w064.github.io",
        "limit" : 10
    };

    // 変更履歴を表示する場所を取得
    var changelog = document.getElementById("changelog");

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const json_data = JSON.parse(xhr.responseText);

            console.log(json_data);
            for (let commit of json_data) {
                changelog.innerHTML += `<p>${commit["commit"]["author"]["date"]} : ${commit["commit"]["message"]}</p><br>`;
            }
        }
    }

    xhr.open("GET", `${data.github_api_url}/${data.owner}/${data.repo}/commits`, true);
    xhr.send();

});
