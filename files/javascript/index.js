function addChangeLog(){
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

            for (let commit of json_data) {
                changelog.innerHTML += `<p>${commit["commit"]["author"]["date"]} : ${commit["commit"]["message"]}</p><br>`;
            }
        }
    }

    xhr.open("GET", `${data.github_api_url}/${data.owner}/${data.repo}/commits`, true);
    xhr.send();
}

function addRecommendOpening(){
    // おすすめのURLリスト
    const urls = ["https://youtu.be/VM8ZqmwPZ74",
                "https://youtu.be/zSLty7g3w30",
                "https://youtu.be/ze7LofS9bC0",
                "https://youtu.be/V0Y0m3H4TpM",
                "https://youtu.be/5-9sqUZZXaY",
                "https://youtu.be/j-a-p5VoO7k",
                "https://youtu.be/PM2rmGhn3OQ",
                "https://youtu.be/sVuzSwaSTJI",
                "https://youtu.be/nl_fBSYY8e8",
                "https://youtu.be/1vWn-D-cJbY",
                "https://youtu.be/o9GB4FS-hmw",
                "https://youtu.be/PRr26Ox8kPs"];

    // 埋め込み用のURL
    const for_embed_url = "www.youtube-nocookie.com/embed";
    // 上記URLに置換する部分
    const original_url = "youtu.be";
    // 埋め込み時のパラメータ
    const param = "?mute=1&loop=1&playsinline=1&disablekb=1&rel=0";

    // おすすめからランダムに1つ選択する
    const urls_index = new Uint32Array(urls.length)
    self.crypto.getRandomValues(urls_index);
    let recom_url = urls[urls_index.indexOf(Math.max(...urls_index))];
    //パラメータをURLに追加する
    recom_url = recom_url.replace(original_url, for_embed_url) + param;

    // 共有時の埋め込みコード
    var code = `<iframe width="854" height="480" \
                src=${recom_url} \
                title="YouTube video player" frameborder="0" allow="accelerometer; \
                autoplay; clipboard-write; encrypted-media; gyroscope; \
                picture-in-picture" allowfullscreen></iframe>`;
    
    //埋め込みコードを追加する
    const video_area = document.getElementById("recom_op");
    video_area.innerHTML += code;

}

window.addEventListener("DOMContentLoaded", function() {
    addChangeLog();
    addRecommendOpening();
});
