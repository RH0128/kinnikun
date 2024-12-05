
$(document).ready(function () {
  fetchWeather(); // ページ読み込み時に自動実行
});


const fetchWeather = async () => {
  await getWeather(); // 1回だけ呼び出す
};

//2つ目のおまじない→データを取得している箇所
const getWeather = async (id) => {
  const url = `https://weather.tsukumijima.net/api/forecast/city/140010`;
  const res = await fetch(url);
  console.log(res, "中身をチェック！resとはレスポンスの意味です🤗");
  const weather =
    await res.json();
  console.log(weather, "中身をチェック");

  //天気情報を元に動画検索を行う
  const weatherCondition = weather.forecasts[1].telop; // 天気情報（晴れ、雨など）

  // ボタンのクリックイベントに天気情報を渡す
  $("#aa").on("click", function () {
    // 天気情報に応じて動画を検索
    if (weatherCondition.includes("晴れ")) {
      searchYouTubeVideos("中山きんにくん ランニング");  // 晴れならランニング動画
    } else if (weatherCondition.includes("雨")) {
      searchYouTubeVideos("中山きんにくん 自宅");     // 雨ならヨガ動画
    } else {
      searchYouTubeVideos("fitness");  // その他の場合はフィットネス動画
    }
  });

//3つめのおまじないに、jsの形に変換した塊を渡してあげる
  createWeather(weather);
};


// 3つ目のおまじない→データの塊とhtmlを組み合わせる、jQueryを使って画面に埋め込む

function createWeather(weather) {
  // htmlと塊を組み合わせるテンプレートリテラル
  const html = `
    <div class="ball space-y-4">
      <p><span class="icon bg-blue-100">📍</span> ${weather.location.city}</p>
      <p><span class="icon bg-blue-100">🗓️</span> ${weather.forecasts[1].dateLabel}</p>
      <p><span class="icon bg-blue-100">☀️</span> ${weather.forecasts[1].telop}</p>
      <div class="flex justify-left">
        <p><span class="icon bg-blue-100">🌡️</span> ${weather.forecasts[1].temperature.max.celsius}℃ / ${weather.forecasts[1].temperature.min.celsius}℃</p>
      </div>
    </div>
  `;

  //jQueryで画面に埋め込む
  $(".list").append(html);
}


const API_KEY = '';

// 動画検索を実行
function searchYouTubeVideos(query) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${API_KEY}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // 動画情報を処理（例: タイトルとサムネイルを表示）
      const videos = data.items.map(item => {
        return {
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        };
      });
      console.log(videos);  // 動画リストを確認

      // 取得した動画リストをHTMLに埋め込む
      displayVideos(videos);
    })
    .catch(error => console.error('Error fetching YouTube data:', error));
}

// 動画情報をHTMLに埋め込む
function displayVideos(videos) {
  const container = $(".video-list");  // ここでHTML要素を指定します

  // 動画のリストをHTMLに追加
  videos.forEach(video => {
    const html = `
      <div class="video-item flex item-start mb-4">
        <a href="${[0].thumbnail}" target="_blank">
          <img src="${video.thumbnail}" alt="${video.title}" class="rounded-md mb-2"/>
          <h3 class="text-sm">${video.title}</h3>
        </a>
      </div>
    `;
    container.append(html);  // 動画情報を追加
  });
}

// ボタンがクリックされたときに video-list を表示
$("#aa").on("click", function () {
  $(".video-list").fadeIn();  // クリック後にフェードインで表示
});