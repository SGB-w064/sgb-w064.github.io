window.addEventListener("DOMContentLoaded", function() {
    // セットアップ時に追加するタグ部の宣言
    var head = document.getElementsByTagName("head")[0];
    var body = document.getElementById("setup");

    // XMLHttpRequestに必要な要素の変数を宣言
    var xhr = new XMLHttpRequest();
    let method = "GET",
        src = "base.html";

    // XMLHttpRequestの実行部
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            var res = xhr.responseXML;
            
            // headタグ内の編集
            var import_head = res.getElementsByTagName("head")[0];
            head.innerHTML += import_head.outerHTML;
            // bodyタグ内の編集
            var import_body = res.getElementsByTagName("body")[0];
            body.innerHTML = import_body.outerHTML;
        }
    }
    
    // レスポンスを返すのがHTML形式だと明示する。
    xhr.responseType = "document";
    xhr.open(method, src, true);

    // ローカルで動かないためsendする
    xhr.send();
});