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
  const wrapper = document.querySelector('.player-carousel-wrapper');
  const track = document.querySelector('.player-cards');
  const cards = document.querySelectorAll('.player-card');
  const prevBtn = document.querySelector('.player-carousel-btn.-prev');
  const nextBtn = document.querySelector('.player-carousel-btn.-next');
  // 【追加】アンカーリンク要素の取得
  const navLinks = document.querySelectorAll('.player-navi__link');

  if (!track || cards.length === 0) return;

  let currentIndex = 0;
  const maxIndex = cards.length - 1;

  // スワイプ/ドラッグ用変数
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationId = 0;

  // 各サイズをリアルタイムに取得する関数（レスポンシブ対応）
  function getSizes() {
    const cardWidth = cards[0].offsetWidth;
    // CSSのgap値を取得（設定されていない場合は0）
    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    return { cardWidth, gap };
  }

  // --- 1. カルーセル移動用のコア関数 ---
  function updateCarousel() {
    const { cardWidth, gap } = getSizes();

    // 1カード分 ＋ 隙間(gap)の合計移動量をピクセル単位で計算
    currentTranslate = currentIndex * -(cardWidth + gap);
    prevTranslate = currentTranslate;

    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    track.style.transform = `translateX(${currentTranslate}px)`; // pxで指定

    // ボタンの非活性コントロール
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === maxIndex;
  }

  // --- 2. ボタンイベント ---
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });
  }

  // --- 3. タッチ＆ドラッグイベントの登録 ---
  track.addEventListener('mousedown', dragStart);
  track.addEventListener('mousemove', dragMove);
  window.addEventListener('mouseup', dragEnd);

  track.addEventListener('touchstart', dragStart, { passive: true });
  track.addEventListener('touchmove', dragMove, { passive: true });
  window.addEventListener('touchend', dragEnd);

  function dragStart(e) {
    isDragging = true;
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;

    track.style.transition = 'none'; // ドラッグ中は追従性を上げるためアニメーションをオフ
    animationId = requestAnimationFrame(animation);

    if (e.type === 'mousedown') e.preventDefault();
  }

  function dragMove(e) {
    if (!isDragging) return;

    const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const diffX = currentX - startX; // 動かした純粋なピクセル量

    // 現在のカード位置（px）に、今回のドラッグ移動量（px）をダイレクトに足す
    currentTranslate = prevTranslate + diffX;

    // 両端での抵抗感（行き過ぎ防止）
    const { cardWidth, gap } = getSizes();
    const minTranslate = 0;
    const maxTranslate = maxIndex * -(cardWidth + gap);

    if (currentTranslate > minTranslate) {
      currentTranslate = minTranslate + (currentTranslate - minTranslate) / 3;
    } else if (currentTranslate < maxTranslate) {
      currentTranslate = maxTranslate + (currentTranslate - maxTranslate) / 3;
    }
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationId);

    // ドラッグ終了時に、1カードの横幅に対して「何％ぶん」動かしたかで判定
    const { cardWidth, gap } = getSizes();
    const movedPx = currentTranslate - prevTranslate;
    const movedPercent = (movedPx / cardWidth) * 100;

    // 15%以上フリックされたらステージを切り替える
    if (movedPercent < -15 && currentIndex < maxIndex) {
      currentIndex++;
    } else if (movedPercent > 15 && currentIndex > 0) {
      currentIndex--;
    }

    updateCarousel();
  }

  function animation() {
    if (isDragging) {
      track.style.transform = `translateX(${currentTranslate}px)`;
      requestAnimationFrame(animation);
    }
  }

  // --- 4. 【新規追加】アンカーナビゲーションクリック時の連動処理 ---
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // 本来のハッシュスクロールを無効化（カルーセルのスライド移動を優先するため）
      e.preventDefault();

      // data-target-index の値（0, 2, 6 など）を取得
      const targetIndex = parseInt(link.getAttribute('data-target-index'), 10);

      // 取得したインデックスが有効な範囲内にあるかチェックしてスライド
      if (!isNaN(targetIndex) && targetIndex >= 0 && targetIndex <= maxIndex) {
        currentIndex = targetIndex;
        updateCarousel();
      }
    });
  });

  // 画面リサイズ時にズレを補正
  window.addEventListener('resize', updateCarousel);

  // 初期化
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