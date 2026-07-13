import Disclosure from "./modules/disclosure";
import NavigationCurrent from "./modules/navigationCurrent";
import FloatingImage from "./modules/floatingImage";
import MicroModal from 'micromodal';

document.addEventListener("DOMContentLoaded", function () {
  MicroModal.init({
    disableScroll: true,
  });

  document.querySelectorAll('.js-disclosure').forEach((element) => {
    const instance = new Disclosure(element);
    instance.init();
  });

  document.querySelectorAll('.js-navigation-current').forEach((element) => {
    const instance = new NavigationCurrent(element);
    instance.init();
  })
});

window.addEventListener('load', function () {
  document.querySelectorAll('.js-floating-image').forEach((element) => {
    const instance = new FloatingImage(element);
    instance.init();
  })
});





document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.player-cards');
  const cards = document.querySelectorAll('.player-card');
  const btnPrev = document.querySelector('.player-carousel-btn.-prev');
  const btnNext = document.querySelector('.player-carousel-btn.-next');
  const naviLinks = document.querySelectorAll('.player-navi__link');

  if (!track || cards.length === 0) return;

  let currentIndex = 0;
  const maxIndex = cards.length - 1;

  // カルーセルを移動させるメイン関数
  function updateCarousel() {
    // カード1枚の幅 ＋ gap（16px）を計算
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 16; 

    // 移動距離を算出
    const translateX = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${translateX}px)`;

    // ボタンの非活性コントロール
    if (btnPrev) btnPrev.disabled = currentIndex === 0;
    if (btnNext) btnNext.disabled = currentIndex === maxIndex;

    // カテゴリナビ（タブ）のアクティブ状態を更新
    updateNaviState();
  }

  // 現在のインデックスに応じて「高校生」「大学生」「社会人」のアクティブクラスを切り替える
  function updateNaviState() {
    naviLinks.forEach(link => link.classList.remove('-active'));

    // 0~1: 高校生, 2~5: 大学生, 6: 社会人
    let activeCategoryIndex = 0;
    if (currentIndex >= 2 && currentIndex <= 5) {
      activeCategoryIndex = 1; // 大学生
    } else if (currentIndex >= 6) {
      activeCategoryIndex = 2; // 社会人
    }

    if (naviLinks[activeCategoryIndex]) {
      naviLinks[activeCategoryIndex].classList.add('-active');
    }
  }

  // 次へボタン・前へボタンのイベント
  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });
  }

  // カテゴリ（タブ）リンクをクリックした時の挙動
  naviLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // 1. 本来のアンカーリンク挙動（#blockへの画面ジャンプ）を完全に殺す
      e.preventDefault();
      e.stopPropagation();

      const targetIndex = parseInt(link.getAttribute('data-target-index'), 10);
      if (!isNaN(targetIndex)) {
        currentIndex = targetIndex;
        updateCarousel();
      }
    });
  });

  // リサイズ時にもズレないように再計算
  window.addEventListener('resize', updateCarousel);

  // 初期化実行
  updateCarousel();
});



document.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('js-fixed-banner');
  const closeBtn = document.getElementById('js-banner-close');

  if (!banner || !closeBtn) return;

  // セッションストレージ内の非表示フラグキー名称
  const storageKey = 'draft_banner_hidden';

  // 1. 初回アクセス or 非表示フラグが立っていないか判定
  const isHidden = sessionStorage.getItem(storageKey);

  if (!isHidden) {
    // フラグがなければバナーを表示用クラスを付与
    banner.classList.add('is-show');
  }

  // 2. 「×」ボタン押下時のイベント
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // バナーを非表示（クラス削除）
    banner.classList.remove('is-show');

    // 次回アクセス時（ブラウザまたはタブを閉じるまで）まで非表示にするフラグを保持
    sessionStorage.setItem(storageKey, 'true');
  });
});